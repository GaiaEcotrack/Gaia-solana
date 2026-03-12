use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{
        Mint as MintInterface,
        TokenAccount as TokenAccountInterface,
        transfer_checked,
        TransferChecked,
    },
};

use crate::errors::ErrorCode;
use crate::events::RECsTransferred;
use crate::state::RECertificate;

#[derive(Accounts)]
#[instruction(
    certificate_id: String,
    amount: u64,
    decimals: u8
)]
pub struct TransferREC<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = from,
        associated_token::token_program = token_program,
    )]
    pub from_token_account: Box<InterfaceAccount<'info, TokenAccountInterface>>,
    
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = to,
        associated_token::token_program = token_program,
    )]
    pub to_token_account: Box<InterfaceAccount<'info, TokenAccountInterface>>,
    
    #[account(mut)]
    /// CHECK: El destinatario puede ser cualquier cuenta
    pub to: UncheckedAccount<'info>,
    
    // Token Mint (Token-2022)
    #[account(
        mut,
        mint::token_program = token_program,
    )]
    pub token_mint: Box<InterfaceAccount<'info, MintInterface>>,
    
    // Certificado REC asociado
    #[account(
        mut,
        seeds = [
            b"rec_certificate",
            certificate_id.as_bytes()
        ],
        bump = rec_certificate.bump
    )]
    pub rec_certificate: Account<'info, RECertificate>,
    
    // Programas necesarios
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(
    ctx: Context<TransferREC>,
    certificate_id: String,
    amount: u64,
    decimals: u8,
) -> Result<()> {
    // Validar inputs
    require!(
        certificate_id.len() <= crate::state::recertificate::MAX_CERTIFICATE_ID_LENGTH,
        ErrorCode::CertificateIdTooLong
    );
    
    require!(
        amount > 0,
        ErrorCode::InvalidEnergyAmount
    );
    
    require!(
        decimals == crate::REC_DECIMALS,
        ErrorCode::InvalidDecimals
    );
    
    // Verificar que el certificado exista y pertenezca al remitente
    let rec_certificate = &mut ctx.accounts.rec_certificate;
    
    require!(
        rec_certificate.owner == ctx.accounts.from.key(),
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
    
    // Verificar que la cantidad a transferir no exceda la cantidad del certificado
    require!(
        amount <= rec_certificate.rec_amount,
        ErrorCode::InsufficientRECs
    );
    
    // Si se transfiere la cantidad completa, actualizar el dueno del certificado
    if amount == rec_certificate.rec_amount {
        rec_certificate.owner = ctx.accounts.to.key();
    } else {
        // Para transferencias parciales, necesitariamos crear un nuevo certificado
        // Por ahora, solo permitimos transferencias completas
        return Err(ErrorCode::PartialTransferNotAllowed.into());
    }
    
    // Realizar la transferencia usando CPI al programa Token-2022
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_token_account.to_account_info(),
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.to_token_account.to_account_info(),
        authority: ctx.accounts.from.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    // Convertir RECs a la cantidad de tokens
    let token_amount = amount
        .checked_mul(10u64.pow(decimals as u32))
        .ok_or(ErrorCode::ArithmeticOverflow)?;
    
    transfer_checked(cpi_ctx, token_amount, decimals)?;
    
    // Emitir evento
    emit!(RECsTransferred {
        certificate_id: certificate_id.clone(),
        from: ctx.accounts.from.key(),
        to: ctx.accounts.to.key(),
        amount,
        transfer_date: current_timestamp,
    });
    
    msg!(
        "RECs transferidos: Certificado={}, Cantidad={}, De={}, Para={}",
        certificate_id,
        amount,
        ctx.accounts.from.key(),
        ctx.accounts.to.key()
    );
    
    Ok(())
}

// Struct para Transfer Hook (simplificado - sin hooks por ahora)
#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(mut)]
    /// CHECK: Cuenta de origen
    pub source: UncheckedAccount<'info>,
    
    #[account(mut)]
    /// CHECK: Cuenta de destino
    pub destination: UncheckedAccount<'info>,
}

// Handler para el transfer hook (simplificado)
pub fn transfer_hook_handler(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
    msg!(
        "Transfer hook ejecutado: Cantidad={}, De={}, Para={}",
        amount,
        ctx.accounts.source.key(),
        ctx.accounts.destination.key()
    );
    
    Ok(())
}
