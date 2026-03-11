use anchor_lang::prelude::*;

// Constantes para validación
pub const MAX_REPORT_ID_LENGTH: usize = 50;
pub const MAX_VERIFICATION_HASH_LENGTH: usize = 64;

#[account]
pub struct EnergyReport {
    // Referencias
    pub device: Pubkey,          // Dispositivo asociado
    pub report_id: String,       // ID único del reporte (máx 50 chars)
    
    // Período del reporte
    pub period_start: i64,       // Inicio del período (timestamp Unix)
    pub period_end: i64,         // Fin del período (timestamp Unix)
    
    // Datos de energía
    pub energy_wh: u64,          // Energía generada en Wh
    pub recs_issued: u64,        // RECs generados por este reporte
    
    // Verificación
    pub verification_hash: String, // Hash de verificación (máx 64 chars)
    pub oracle_signature: [u8; 64], // Firma del oráculo/autoridad
    
    // Estado
    pub is_certified: bool,      // Certificado por estándar
    pub submission_date: i64,    // Fecha de envío (timestamp Unix)
    
    // PDA bump
    pub bump: u8,
}

impl EnergyReport {
    pub const SPACE: usize = 8 + // discriminator
        32 + // device: Pubkey
        4 + MAX_REPORT_ID_LENGTH + // report_id: String
        8 + // period_start: i64
        8 + // period_end: i64
        8 + // energy_wh: u64
        8 + // recs_issued: u64
        4 + MAX_VERIFICATION_HASH_LENGTH + // verification_hash: String
        64 + // oracle_signature: [u8; 64]
        1 + // is_certified: bool
        8 + // submission_date: i64
        1; // bump: u8

    // Valida los datos del reporte
    pub fn validate(&self) -> Result<()> {
        // Validar longitud de strings
        require!(
            self.report_id.len() <= MAX_REPORT_ID_LENGTH,
            crate::errors::ErrorCode::ReportIdTooLong
        );
        
        require!(
            self.verification_hash.len() <= MAX_VERIFICATION_HASH_LENGTH,
            crate::errors::ErrorCode::VerificationHashTooLong
        );
        
        // Validar período
        require!(
            self.period_end > self.period_start,
            crate::errors::ErrorCode::InvalidPeriod
        );
        
        // Validar energía (máximo 1 GWh por reporte = 1,000,000,000 Wh)
        require!(
            self.energy_wh > 0 && self.energy_wh <= 1_000_000_000,
            crate::errors::ErrorCode::InvalidEnergyAmount
        );
        
        Ok(())
    }
    
    // Calcula RECs basados en energía
    pub fn calculate_recs(&self) -> u64 {
        self.energy_wh / crate::REC_CONVERSION_FACTOR
    }
}