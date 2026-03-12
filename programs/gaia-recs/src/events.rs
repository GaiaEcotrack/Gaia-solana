use anchor_lang::prelude::*;

// ============================================================================
// EVENTOS DE DISPOSITIVOS
// ============================================================================

/// Emitido cuando se registra un nuevo dispositivo
#[event]
pub struct DeviceRegistered {
    pub device: Pubkey,
    pub owner: Pubkey,
    pub device_id: String,
    pub device_type: String,
    pub capacity_kw: u64,
    pub location: String,
    pub registration_date: i64,
}

/// Emitido cuando un dispositivo es verificado por una autoridad
#[event]
pub struct DeviceVerified {
    pub device: Pubkey,
    pub verifier: Pubkey,
    pub verification_date: i64,
}

// ============================================================================
// EVENTOS DE REPORTES DE ENERGIA
// ============================================================================

/// Emitido cuando se envia un reporte de energia
#[event]
pub struct EnergyReportSubmitted {
    pub device: Pubkey,
    pub report_id: String,
    pub period_start: i64,
    pub period_end: i64,
    pub energy_wh: u64,
    pub recs_issued: u64,
    pub submission_date: i64,
}

/// Emitido cuando el oraculo verifica un reporte
#[event]
pub struct OracleSignatureVerified {
    pub report_id: String,
    pub oracle: Pubkey,
    pub verification_date: i64,
}

// ============================================================================
// EVENTOS DE RECs (CERTIFICADOS DE ENERGIA RENOVABLE)
// ============================================================================

/// Emitido cuando se mintean nuevos RECs
#[event]
pub struct RECsMinted {
    pub device: Pubkey,
    pub certificate_id: String,
    pub owner: Pubkey,
    pub rec_amount: u64,
    pub generation_date: i64,
    pub expiry_date: i64,
}

/// Emitido cuando se transfieren RECs entre cuentas
#[event]
pub struct RECsTransferred {
    pub certificate_id: String,
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub transfer_date: i64,
}

/// Emitido cuando se retiran (consumen) RECs
#[event]
pub struct RECsRetired {
    pub certificate_id: String,
    pub owner: Pubkey,
    pub amount: u64,
    pub retirement_reason: String,
    pub retirement_date: i64,
}
