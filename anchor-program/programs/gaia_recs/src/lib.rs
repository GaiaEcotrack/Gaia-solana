use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, TransferChecked};
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

declare_id!("DMqC61YxtCRF2ixUrRcqahVEN3TcGDWV212xy1prGbTw");

pub const MAX_STR_LEN: usize = 50;
pub const REC_DECIMALS: u8 = 6;
pub const MAX_ENERGY_PER_REPORT: u64 = 1_000_000_000;

#[program]
pub mod gaia_recs {
    use super::*;

    pub fn register_device(
        ctx: Context<RegisterDevice>,
        device_id: String,
        device_type: String,
        capacity_kw: u64,
        location: String,
    ) -> Result<()> {
        require!(device_id.len() <= MAX_STR_LEN, GaiaError::StringTooLong);
        let device = &mut ctx.accounts.device;
        device.owner = ctx.accounts.owner.key();
        device.device_id = device_id;
        device.device_type = device_type;
        device.capacity_kw = capacity_kw;
        device.location = location;
        device.registration_date = Clock::get()?.unix_timestamp;
        device.bump = ctx.bumps.device;
        Ok(())
    }

    pub fn submit_energy_report(
        ctx: Context<SubmitEnergyReport>,
        report_id: String,
        period_start: i64,
        period_end: i64,
        energy_wh: u64,
    ) -> Result<()> {
        require!(report_id.len() <= MAX_STR_LEN, GaiaError::StringTooLong);
        require!(energy_wh <= MAX_ENERGY_PER_REPORT, GaiaError::EnergyExceedsLimit);
        let report = &mut ctx.accounts.energy_report;
        report.report_id = report_id;
        report.period_start = period_start;
        report.period_end = period_end;
        report.energy_wh = energy_wh;
        report.submission_date = Clock::get()?.unix_timestamp;
        report.bump = ctx.bumps.energy_report;
        Ok(())
    }

    pub fn issue_rec(
        ctx: Context<IssueREC>,
        certificate_id: String,
        rec_amount: u64,
        device_id: String,
    ) -> Result<()> {
        require!(certificate_id.len() <= MAX_STR_LEN, GaiaError::StringTooLong);
        let certificate = &mut ctx.accounts.rec_certificate;
        certificate.certificate_id = certificate_id;
        certificate.rec_amount = rec_amount;
        certificate.device_id = device_id;
        certificate.creation_date = Clock::get()?.unix_timestamp;
        certificate.bump = ctx.bumps.rec_certificate;
        Ok(())
    }

    pub fn transfer_rec(
        ctx: Context<TransferREC>,
        _certificate_id: String,
        amount: u64,
    ) -> Result<()> {
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        token_2022::transfer_checked(CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts), amount, REC_DECIMALS)?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(device_id: String)]
pub struct RegisterDevice<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 + Device::LEN,
        seeds = [b"device", owner.key().as_ref(), device_id.as_bytes()],
        bump
    )]
    pub device: Account<'info, Device>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(report_id: String)]
pub struct SubmitEnergyReport<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        has_one = owner,
        seeds = [b"device", owner.key().as_ref(), device.device_id.as_bytes()],
        bump = device.bump
    )]
    pub device: Account<'info, Device>,
    #[account(
        init,
        payer = owner,
        space = 8 + EnergyReport::LEN,
        seeds = [b"report", device.key().as_ref(), report_id.as_bytes()],
        bump
    )]
    pub energy_report: Account<'info, EnergyReport>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(certificate_id: String)]
pub struct IssueREC<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 + RECertificate::LEN,
        seeds = [b"certificate", certificate_id.as_bytes()],
        bump
    )]
    pub rec_certificate: Account<'info, RECertificate>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferREC<'info> {
    pub authority: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub from_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub to_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[account]
pub struct Device {
    pub owner: Pubkey,
    pub device_id: String,
    pub device_type: String,
    pub capacity_kw: u64,
    pub location: String,
    pub registration_date: i64,
    pub bump: u8,
}

impl Device {
    pub const LEN: usize = 32 + (4 + MAX_STR_LEN) * 3 + 8 + 8 + 1;
}

#[account]
pub struct EnergyReport {
    pub report_id: String,
    pub period_start: i64,
    pub period_end: i64,
    pub energy_wh: u64,
    pub submission_date: i64,
    pub bump: u8,
}

impl EnergyReport {
    pub const LEN: usize = (4 + MAX_STR_LEN) + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct RECertificate {
    pub certificate_id: String,
    pub rec_amount: u64,
    pub device_id: String,
    pub creation_date: i64,
    pub bump: u8,
}

impl RECertificate {
    pub const LEN: usize = (4 + MAX_STR_LEN) + 8 + (4 + MAX_STR_LEN) + 8 + 1;
}

#[error_code]
pub enum GaiaError {
    #[msg("La cadena de texto excede el límite permitido.")]
    StringTooLong,
    #[msg("La energía reportada excede el límite máximo por transacción.")]
    EnergyExceedsLimit,
    #[msg("No tiene permisos para realizar esta operación.")]
    Unauthorized,
}
