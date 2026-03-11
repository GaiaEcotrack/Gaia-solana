use anchor_lang::prelude::*;

// Constantes para validación
pub const MAX_CERTIFICATE_ID_LENGTH: usize = 50;
pub const MAX_RETIREMENT_REASON_LENGTH: usize = 100;

#[account]
pub struct RECertificate {
    // Identificación
    pub owner: Pubkey,           // Dueño actual del certificado
    pub certificate_id: String,  // ID único del certificado (máx 50 chars)
    
    // Referencias
    pub device: Pubkey,          // Dispositivo que generó la energía
    pub energy_report: Pubkey,   // Reporte de energía asociado (opcional)
    
    // Datos del certificado
    pub rec_amount: u64,         // Cantidad de RECs en este certificado
    pub generation_date: i64,    // Fecha de generación (timestamp Unix)
    pub expiry_date: i64,        // Fecha de expiración (timestamp Unix)
    
    // Estado
    pub is_retired: bool,        // Retirado/consumido
    pub retirement_reason: String, // Razón de retiro (máx 100 chars)
    pub retirement_date: i64,    // Fecha de retiro (timestamp Unix)
    
    // Referencia a token (Token-2022)
    pub token_account: Pubkey,   // Cuenta de token asociada
    
    // PDA bump
    pub bump: u8,
}

impl RECertificate {
    pub const SPACE: usize = 8 + // discriminator
        32 + // owner: Pubkey
        4 + MAX_CERTIFICATE_ID_LENGTH + // certificate_id: String
        32 + // device: Pubkey
        32 + // energy_report: Pubkey
        8 + // rec_amount: u64
        8 + // generation_date: i64
        8 + // expiry_date: i64
        1 + // is_retired: bool
        4 + MAX_RETIREMENT_REASON_LENGTH + // retirement_reason: String
        8 + // retirement_date: i64
        32 + // token_account: Pubkey
        1; // bump: u8

    // Valida los datos del certificado
    pub fn validate(&self) -> Result<()> {
        // Validar longitud de strings
        require!(
            self.certificate_id.len() <= MAX_CERTIFICATE_ID_LENGTH,
            crate::errors::ErrorCode::CertificateIdTooLong
        );
        
        require!(
            self.retirement_reason.len() <= MAX_RETIREMENT_REASON_LENGTH,
            crate::errors::ErrorCode::RetirementReasonTooLong
        );
        
        // Validar fechas
        require!(
            self.expiry_date > self.generation_date,
            crate::errors::ErrorCode::InvalidPeriod
        );
        
        // Validar cantidad de RECs
        require!(
            self.rec_amount > 0,
            crate::errors::ErrorCode::InvalidEnergyAmount
        );
        
        // Si está retirado, debe tener fecha de retiro
        if self.is_retired {
            require!(
                self.retirement_date > 0,
                crate::errors::ErrorCode::AccountNotInitialized
            );
        }
        
        Ok(())
    }
    
    // Verifica si el certificado ha expirado
    pub fn is_expired(&self, current_timestamp: i64) -> bool {
        current_timestamp > self.expiry_date
    }
    
    // Marca el certificado como retirado
    pub fn retire(&mut self, reason: String, current_timestamp: i64) -> Result<()> {
        require!(
            !self.is_retired,
            crate::errors::ErrorCode::RECAlreadyRetired
        );
        
        require!(
            reason.len() <= MAX_RETIREMENT_REASON_LENGTH,
            crate::errors::ErrorCode::RetirementReasonTooLong
        );
        
        self.is_retired = true;
        self.retirement_reason = reason;
        self.retirement_date = current_timestamp;
        
        Ok(())
    }
}