use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

use crate::errors::ErrorCode;
use crate::events::{EnergyReportSubmitted, OracleSignatureVerified};
use crate::state::{Device, EnergyReport};

#[derive(Accounts)]
#[instruction(
    report_id: String, 
    period_start: i64, 
    period_end: i64, 
    energy_wh: u64,
    verification_hash: String,
    oracle_signature: [u8; 64]
)]
pub struct SubmitEnergyReport<'info> {
    #[account(mut)]
    pub device_owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [
            b"device",
            device_owner.key().as_ref(),
            device.device_id.as_bytes()
        ],
        bump = device.bump
    )]
    pub device: Account<'info, Device>,
    
    #[account(
        init,
        payer = device_owner,
        space = EnergyReport::SPACE,
        seeds = [
            b"energy_report",
            device.key().as_ref(),
            report_id.as_bytes()
        ],
        bump
    )]
    pub energy_report: Account<'info, EnergyReport>,
    
    #[account(address = crate::ADMIN_PUBKEY)]
    pub oracle: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(
    ctx: Context<SubmitEnergyReport>,
    report_id: String,
    period_start: i64,
    period_end: i64,
    energy_wh: u64,
    verification_hash: String,
    oracle_signature: [u8; 64],
) -> Result<()> {
    // Validar inputs básicos
    require!(
        report_id.len() <= crate::state::energy_report::MAX_REPORT_ID_LENGTH,
        ErrorCode::ReportIdTooLong
    );
    
    require!(
        verification_hash.len() <= crate::state::energy_report::MAX_VERIFICATION_HASH_LENGTH,
        ErrorCode::VerificationHashTooLong
    );
    
    require!(
        period_end > period_start,
        ErrorCode::InvalidPeriod
    );
    
    require!(
        energy_wh > 0 && energy_wh <= 1_000_000_000, // Máximo 1 GWh por reporte
        ErrorCode::InvalidEnergyAmount
    );
    
    // Verificar que el dispositivo esté verificado
    require!(
        ctx.accounts.device.is_verified,
        ErrorCode::DeviceNotVerified
    );
    
    // Verificar que el dueño del dispositivo sea quien firma
    require!(
        ctx.accounts.device_owner.key() == ctx.accounts.device.owner,
        ErrorCode::NotDeviceOwner
    );
    
    // TODO: Implementar verificación de firma del oráculo
    // Por ahora solo verificamos que el oráculo sea el admin
    // En producción, necesitaríamos verificar la firma criptográficamente
    
    // Obtener el bump de la PDA
    let bump = ctx.bumps.energy_report;
    
    // Obtener el timestamp actual
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    
    // Calcular RECs generados por este reporte
    let recs_issued = energy_wh / crate::REC_CONVERSION_FACTOR;
    
    // Inicializar el reporte de energía
    let energy_report = &mut ctx.accounts.energy_report;
    
    energy_report.device = ctx.accounts.device.key();
    energy_report.report_id = report_id.clone();
    energy_report.period_start = period_start;
    energy_report.period_end = period_end;
    energy_report.energy_wh = energy_wh;
    energy_report.recs_issued = recs_issued;
    energy_report.verification_hash = verification_hash;
    energy_report.oracle_signature = oracle_signature;
    energy_report.is_certified = true; // Asumimos certificado por ahora
    energy_report.submission_date = current_timestamp;
    energy_report.bump = bump;
    
    // Validar el reporte
    energy_report.validate()?;
    
    // Actualizar las estadísticas del dispositivo
    let device = &mut ctx.accounts.device;
    
    // Agregar energía al acumulador del dispositivo
    let recs_ready = device.add_energy(energy_wh)?;
    
    msg!(
        "Reporte de energía enviado: ID={}, Energía={}Wh, RECs listos={}, Acumulador={}Wh",
        report_id,
        energy_wh,
        recs_ready,
        device.energy_accumulator
    );
    
    // Emitir eventos
    emit!(EnergyReportSubmitted {
        device: device.key(),
        report_id: report_id.clone(),
        period_start,
        period_end,
        energy_wh,
        recs_issued,
        submission_date: current_timestamp,
    });
    
    emit!(OracleSignatureVerified {
        report_id,
        oracle: ctx.accounts.oracle.key(),
        verification_date: current_timestamp,
    });
    
    Ok(())
}