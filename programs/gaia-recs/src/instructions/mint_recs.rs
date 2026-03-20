use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self, Token2022},
    token_interface::{
        Mint as MintInterface,
        TokenAccount as TokenAccountInterface,
    },
};

use crate::errors::ErrorCode;
use crate::events::RECsMinted;
use crate::state::{Device, RECertificate};

#[derive(Accounts)]
#[instruction(certificate_id: String, rec_amount: u64, device_id: String)]
pub struct MintRecs<'info> {
    #[account(mut)]
    pub device_owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [
            b"device",
            device_owner.key().as_ref(),
            device_id.as_bytes()
        ],
        bump = device.bump
    )]
    pub device: Account<'info, Device>,
    
    #[account(
        init,
        payer = device_owner,
        space = RECertificate::SPACE,
        seeds = [
            b"rec_certificate",
            certificate_id.as_bytes()
        ],
        bump
    )]
    pub rec_certificate: Account<'info, RECertificate>,
    
    // Token Mint (Token-2022)
    #[account(
        mut,
        mint::token_program = token_program,
        mint::authority = mint_authority,
    )]
    pub token_mint: Box<InterfaceAccount<'info, MintInterface>>,
    
    // Autoridad del mint (PDA del programa)
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: SystemAccount<'info>,
    
    // Cuenta de token del destinatario
    #[account(
        init_if_needed,
        payer = device_owner,
        associated_token::mint = token_mint,
        associated_token::authority = device_owner,
        associated_token::token_program = token_program,
    )]
    pub recipient_token_account: Box<InterfaceAccount<'info, TokenAccountInterface>>,
    
    // Cuenta de token asociada al certificado
    #[account(
        init,
        payer = device_owner,
        associated_token::mint = token_mint,
        associated_token::authority = rec_certificate,
        associated_token::token_program = token_program,
    )]
    pub certificate_token_account: Box<InterfaceAccount<'info, TokenAccountInterface>>,
    
    // Programas necesarios
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler(
    ctx: Context<MintRecs>,
    certificate_id: String,
    rec_amount: u64,
    _device_id: String,
) -> Result<()> {
    // Validar inputs
    require!(
        certificate_id.len() <= crate::state::recertificate::MAX_CERTIFICATE_ID_LENGTH,
        ErrorCode::CertificateIdTooLong
    );
    
    require!(
        rec_amount > 0,
        ErrorCode::InvalidEnergyAmount
    );
    
    // Verificar que el dispositivo tenga suficiente energia acumulada
    let device = &mut ctx.accounts.device;
    
    require!(
        device.energy_accumulator >= rec_amount * crate::REC_CONVERSION_FACTOR,
        ErrorCode::InsufficientEnergy
    );
    
    // Verificar que el dueno del dispositivo sea quien firma
    require!(
        ctx.accounts.device_owner.key() == device.owner,
        ErrorCode::NotDeviceOwner
    );
    
    // Obtener el bump de la PDA del certificado
    let bump = ctx.bumps.rec_certificate;
    
    // Obtener el timestamp actual
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    
    // Calcular fecha de expiracion (1 ano desde ahora)
    let expiry_date = current_timestamp + crate::REC_VALIDITY_PERIOD;
    
    // Inicializar el certificado REC
    let rec_certificate = &mut ctx.accounts.rec_certificate;
    
    rec_certificate.owner = ctx.accounts.device_owner.key();
    rec_certificate.certificate_id = certificate_id.clone();
    rec_certificate.device = device.key();
    rec_certificate.energy_report = Pubkey::default();
    rec_certificate.rec_amount = rec_amount;
    rec_certificate.generation_date = current_timestamp;
    rec_certificate.expiry_date = expiry_date;
    rec_certificate.is_retired = false;
    rec_certificate.retirement_reason = String::new();
    rec_certificate.retirement_date = 0;
    rec_certificate.token_account = ctx.accounts.certificate_token_account.key();
    rec_certificate.bump = bump;
    
    // Validar el certificado
    rec_certificate.validate()?;
    
    // Actualizar las estadisticas del dispositivo
    let energy_consumed = rec_amount * crate::REC_CONVERSION_FACTOR;
    device.energy_accumulator = device.energy_accumulator
        .checked_sub(energy_consumed)
        .ok_or(ErrorCode::ArithmeticOverflow)?;
    
    device.total_recs_minted = device.total_recs_minted
        .checked_add(rec_amount)
        .ok_or(ErrorCode::ArithmeticOverflow)?;
    
    // Mint tokens usando CPI al programa Token-2022
    let mint_authority_bump = ctx.bumps.mint_authority;
    let mint_authority_seeds = &[
        b"mint_authority".as_ref(),
        &[mint_authority_bump],
    ];
    let signer_seeds = &[&mint_authority_seeds[..]];
    
    let cpi_accounts = token_2022::MintTo {
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer_seeds,
    );
    
    // Convertir RECs a la cantidad de tokens (considerando decimales)
    let token_amount = rec_amount
        .checked_mul(10u64.pow(crate::REC_DECIMALS as u32))
        .ok_or(ErrorCode::ArithmeticOverflow)?;
    
    token_2022::mint_to(cpi_ctx, token_amount)?;
    
    // Emitir evento
    emit!(RECsMinted {
        device: device.key(),
        certificate_id: certificate_id.clone(),
        owner: rec_certificate.owner,
        rec_amount,
        generation_date: current_timestamp,
        expiry_date,
    });
    
    msg!(
        "RECs minteados: Certificado={}, Cantidad={}, Dueno={}, Dispositivo={}",
        certificate_id,
        rec_amount,
        rec_certificate.owner,
        device.key()
    );
    
    Ok(())
}
