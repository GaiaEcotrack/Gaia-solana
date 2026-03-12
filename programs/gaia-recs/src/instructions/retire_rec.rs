use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{
        self, 
        Token2022,
    },
    token_interface::{
        Mint as MintInterface,
        TokenAccount as TokenAccountInterface,
        burn,
        Burn,
    },
};

use crate::errors::ErrorCode;
use crate::events::RECsRetired;
use crate::state::RECertificate;

#[derive(Accounts)]
#[instruction(
    certificate_id: String,
    amount: u64,
    retirement_reason: String
)]
pub struct RetireREC<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = owner,
        associated_token::token_program = token_program,
    )]
    pub owner_token_account: Box<InterfaceAccount<'info, TokenAccountInterface>>,
    
    // Token Mint (Token-2022)
    #[account(
        mut,
        mint::token_program = token_program,
    )]
    pub token_mint: Box<InterfaceAccount<'info, MintInterface>>,
    
    // Certificado REC
    #[account(
        mut,
        seeds = [
            b"rec_certificate",
            certificate_id.as_bytes()
        ],
        bump = rec_certificate.bump
    )]
    pub rec_certificate: Account<'info, RECertificate>,
    
    // Programa de tokens
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(
    ctx: Context<RetireREC>,
    certificate_id: String,
    amount: u64,
    retirement_reason: String,
) -> Result<()> {
    // Validar inputs
    require!(
        certificate_id.len() <= crate::state::recertificate::MAX_CERTIFICATE_ID_LENGTH,
        ErrorCode::CertificateIdTooLong
    );
    
    require!(
        retirement_reason.len() <= crate::state::recertificate::MAX_RETIREMENT_REASON_LENGTH,
        ErrorCode::RetirementReasonTooLong
    );
    
    require!(
        amount > 0,
        ErrorCode::InvalidEnergyAmount
    );
    
    // Verificar que el certificado exista y pertenezca al dueño
    let rec_certificate = &mut ctx.accounts.rec_certificate;
    
    require!(
        rec_certificate.owner == ctx.accounts.owner.key(),
        ErrorCode::NotCertificateOwner
    );
    
    require!(
        !rec_certificate.is_retired,
        ErrorCode::AlreadyRetired
    );
    
    // Verificar que el certificado no haya expirado
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    
    require!(
        !rec_certificate.is_expired(current_timestamp),
        ErrorCode::RECExpired
    );
    
    // Verificar que la cantidad a retirar no exceda la cantidad del certificado
    require!(
        amount <= rec_certificate.rec_amount,
        ErrorCode::InsufficientRECs
    );
    
    // Si se retira la cantidad completa, marcar el certificado como retirado
    if amount == rec_certificate.rec_amount {
        rec_certificate.retire(retirement_reason.clone(), current_timestamp)?;
    } else {
        // Para retiros parciales, actualizar la cantidad restante
        rec_certificate.rec_amount = rec_certificate.rec_amount
            .checked_sub(amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;
        
        // También necesitaríamos crear un nuevo certificado para la cantidad retirada
        // Por ahora, solo permitimos retiros completos para simplificar
        return Err(ErrorCode::PartialRetirementNotAllowed.into());
    }
    
    // Quemar los tokens usando CPI al programa Token-2022
    let cpi_accounts = Burn {
        mint: ctx.accounts.token_mint.to_account_info(),
        from: ctx.accounts.owner_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    // Convertir RECs a la cantidad de tokens
    let token_amount = amount
        .checked_mul(10u64.pow(crate::REC_DECIMALS as u32))
        .ok_or(ErrorCode::ArithmeticOverflow)?;
    
    burn(cpi_ctx, token_amount)?;
    
    // Emitir evento
    emit!(RECsRetired {
        certificate_id: certificate_id.clone(),
        owner: rec_certificate.owner,
        amount,
        retirement_reason: retirement_reason.clone(),
        retirement_date: current_timestamp,
    });
    
    msg!(
        "RECs retirados: Certificado={}, Cantidad={}, Razón={}, Fecha={}",
        certificate_id,
        amount,
        retirement_reason,
        current_timestamp
    );
    
    Ok(())
}

// Instrucción para retirar RECs sin quemar tokens (para casos especiales)
#[derive(Accounts)]
#[instruction(certificate_id: String, retirement_reason: String)]
pub struct MarkAsRetired<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        mut,
        seeds = [
            b"rec_certificate",
            certificate_id.as_bytes()
        ],
        bump = rec_certificate.bump
    )]
    pub rec_certificate: Account<'info, RECertificate>,
    
    #[account(address = crate::ADMIN_PUBKEY)]
    pub admin_authority: Signer<'info>,
}

pub fn mark_as_retired_handler(
    ctx: Context<MarkAsRetired>,
    certificate_id: String,
    retirement_reason: String,
) -> Result<()> {
    // Solo el administrador puede marcar certificados como retirados sin quemar tokens
    require!(
        ctx.accounts.admin.key() == ctx.accounts.admin_authority.key(),
        ErrorCode::NotAdmin
    );
    
    // Validar inputs
    require!(
        retirement_reason.len() <= crate::state::recertificate::MAX_RETIREMENT_REASON_LENGTH,
        ErrorCode::RetirementReasonTooLong
    );
    
    // Obtener el certificado
    let rec_certificate = &mut ctx.accounts.rec_certificate;
    
    require!(
        !rec_certificate.is_retired,
        ErrorCode::AlreadyRetired
    );
    
    // Obtener el timestamp actual
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    
    // Marcar como retirado
    rec_certificate.retire(retirement_reason.clone(), current_timestamp)?;
    
    // Emitir evento
    emit!(RECsRetired {
        certificate_id: certificate_id.clone(),
        owner: rec_certificate.owner,
        amount: rec_certificate.rec_amount,
        retirement_reason: retirement_reason.clone(),
        retirement_date: current_timestamp,
    });
    
    msg!(
        "Certificado marcado como retirado por administrador: ID={}, Razón={}",
        certificate_id,
        retirement_reason
    );
    
    Ok(())
}