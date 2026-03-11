use anchor_lang::prelude::*;

// Constantes para validación
pub const MAX_DEVICE_ID_LENGTH: usize = 50;
pub const MAX_DEVICE_TYPE_LENGTH: usize = 20;
pub const MAX_LOCATION_LENGTH: usize = 100;
pub const MAX_CAPACITY_KW: u64 = 100_000; // 100 MW máximo por dispositivo

#[account]
pub struct Device {
    // Identificación
    pub owner: Pubkey,           // Dueño del dispositivo
    pub device_id: String,       // ID único del dispositivo (máx 50 chars)
    
    // Características técnicas
    pub device_type: String,     // Solar, Eólico, Hidro, etc. (máx 20 chars)
    pub capacity_kw: u64,        // Capacidad instalada en kW (1-100,000)
    pub location: String,        // Ubicación/coordenadas (máx 100 chars)
    
    // Estadísticas de energía
    pub total_energy_wh: u64,    // Energía total generada en Wh
    pub energy_accumulator: u64, // Acumulador para conversión a RECs
    pub total_recs_minted: u64,  // RECs totales generados
    
    // Estado y verificación
    pub is_verified: bool,       // Verificado por auditor/autoridad
    pub verification_date: i64,  // Fecha de verificación (timestamp Unix)
    pub registration_date: i64,  // Fecha de registro (timestamp Unix)
    
    // PDA bump
    pub bump: u8,
}

impl Device {
    pub const SPACE: usize = 8 + // discriminator
        32 + // owner: Pubkey
        4 + MAX_DEVICE_ID_LENGTH + // device_id: String
        4 + MAX_DEVICE_TYPE_LENGTH + // device_type: String
        8 + // capacity_kw: u64
        4 + MAX_LOCATION_LENGTH + // location: String
        8 + // total_energy_wh: u64
        8 + // energy_accumulator: u64
        8 + // total_recs_minted: u64
        1 + // is_verified: bool
        8 + // verification_date: i64
        8 + // registration_date: i64
        1; // bump: u8

    // Valida los datos del dispositivo
    pub fn validate(&self) -> Result<()> {
        // Validar longitud de strings
        require!(
            self.device_id.len() <= MAX_DEVICE_ID_LENGTH,
            crate::errors::ErrorCode::DeviceIdTooLong
        );
        
        require!(
            self.device_type.len() <= MAX_DEVICE_TYPE_LENGTH,
            crate::errors::ErrorCode::DeviceTypeTooLong
        );
        
        require!(
            self.location.len() <= MAX_LOCATION_LENGTH,
            crate::errors::ErrorCode::LocationTooLong
        );
        
        // Validar capacidad
        require!(
            self.capacity_kw > 0 && self.capacity_kw <= MAX_CAPACITY_KW,
            crate::errors::ErrorCode::InvalidDeviceCapacity
        );
        
        Ok(())
    }
    
    // Agrega energía al acumulador
    pub fn add_energy(&mut self, energy_wh: u64) -> Result<u64> {
        // Verificar overflow
        let new_total = self.total_energy_wh
            .checked_add(energy_wh)
            .ok_or(crate::errors::ErrorCode::ArithmeticOverflow)?;
        
        let new_accumulator = self.energy_accumulator
            .checked_add(energy_wh)
            .ok_or(crate::errors::ErrorCode::ArithmeticOverflow)?;
        
        self.total_energy_wh = new_total;
        self.energy_accumulator = new_accumulator;
        
        // Calcular RECs listos para mint
        let recs_to_mint = new_accumulator / crate::REC_CONVERSION_FACTOR;
        
        Ok(recs_to_mint)
    }
    
    // Consume energía del acumulador después de mint
    pub fn consume_accumulator(&mut self, recs_minted: u64) -> Result<()> {
        let energy_to_consume = recs_minted
            .checked_mul(crate::REC_CONVERSION_FACTOR)
            .ok_or(crate::errors::ErrorCode::ArithmeticOverflow)?;
        
        require!(
            self.energy_accumulator >= energy_to_consume,
            crate::errors::ErrorCode::InsufficientEnergyForREC
        );
        
        self.energy_accumulator = self.energy_accumulator
            .checked_sub(energy_to_consume)
            .ok_or(crate::errors::ErrorCode::ArithmeticOverflow)?;
        
        self.total_recs_minted = self.total_recs_minted
            .checked_add(recs_minted)
            .ok_or(crate::errors::ErrorCode::ArithmeticOverflow)?;
        
        Ok(())
    }
}