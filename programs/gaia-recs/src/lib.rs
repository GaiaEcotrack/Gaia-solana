use anchor_lang::prelude::*;

pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

// Program ID - Actualizar después del build con el ID real generado
declare_id!("GAiA1111111111111111111111111111111111111111");

// ============================================================================
// CONSTANTES DEL PROGRAMA
// ============================================================================

/// Clave pública del administrador/oráculo del sistema
/// IMPORTANTE: Actualizar con la clave real en producción
pub const ADMIN_PUBKEY: Pubkey = pubkey!("ADm1n11111111111111111111111111111111111111");

/// Factor de conversión de Wh a RECs
/// 1 REC = 1,000,000 Wh = 1 MWh
pub const REC_CONVERSION_FACTOR: u64 = 1_000_000;

/// Decimales para los tokens REC (Token-2022)
pub const REC_DECIMALS: u8 = 6;

/// Máximo de energía por reporte (1 GWh en Wh)
pub const MAX_ENERGY_PER_REPORT: u64 = 1_000_000_000;

/// Duración de validez de un REC en segundos (1 año)
pub const REC_VALIDITY_PERIOD: i64 = 365 * 24 * 60 * 60;

// ============================================================================
// PROGRAMA PRINCIPAL GAIA RECs
// ============================================================================

#[program]
pub mod gaia_recs {
    use super::*;

    // ================= DISPOSITIVOS =================

    /// Registra un nuevo dispositivo generador de energía renovable
    /// 
    /// # Argumentos
    /// * `device_id` - Identificador único del dispositivo
    /// * `device_type` - Tipo de dispositivo (solar, eólico, hidro, etc.)
    /// * `capacity_kw` - Capacidad instalada en kW
    /// * `location` - Ubicación/coordenadas del dispositivo
    pub fn register_device(
        ctx: Context<RegisterDevice>,
        _device_id: String,
        device_type: String,
        capacity_kw: u64,
        location: String,
    ) -> Result<()> {
        instructions::register_device::handler(ctx, device_id, device_type, capacity_kw, location)
    }

    // ================= REPORTES DE ENERGÍA =================

    /// Envía un reporte de energía generada, verificado por el oráculo
    /// 
    /// # Argumentos
    /// * `report_id` - ID único del reporte
    /// * `period_start` - Inicio del período de generación (timestamp Unix)
    /// * `period_end` - Fin del período de generación (timestamp Unix)
    /// * `energy_wh` - Energía generada en Wh
    /// * `verification_hash` - Hash de verificación
    /// * `oracle_signature` - Firma del oráculo (64 bytes)
    pub fn submit_energy_report(
        ctx: Context<SubmitEnergyReport>,
        report_id: String,
        period_start: i64,
        period_end: i64,
        energy_wh: u64,
        verification_hash: String,
        oracle_signature: [u8; 64],
    ) -> Result<()> {
        instructions::submit_report::handler(
            ctx,
            report_id,
            period_start,
            period_end,
            energy_wh,
            verification_hash,
            oracle_signature,
        )
    }

    // ================= MINT DE RECs =================

    /// Mintea tokens REC basados en la energía acumulada del dispositivo
    /// 
    /// # Argumentos
    /// * `certificate_id` - ID único del certificado REC
    /// * `rec_amount` - Cantidad de RECs a mintear
    /// * `device_id` - ID del dispositivo que genera los RECs
    pub fn mint_recs(
        ctx: Context<MintRecs>,
        certificate_id: String,
        rec_amount: u64,
        _device_id: String,
    ) -> Result<()> {
        instructions::mint_recs::handler(ctx, certificate_id, rec_amount, device_id)
    }

    // ================= TRANSFERENCIA DE RECs =================

    /// Transfiere RECs de una cuenta a otra usando Token-2022
    /// 
    /// # Argumentos
    /// * `certificate_id` - ID del certificado asociado
    /// * `amount` - Cantidad de RECs a transferir
    /// * `decimals` - Decimales del token (debe ser REC_DECIMALS)
    pub fn transfer_rec(
        ctx: Context<TransferREC>,
        certificate_id: String,
        amount: u64,
        decimals: u8,
    ) -> Result<()> {
        instructions::transfer_rec::handler(ctx, certificate_id, amount, decimals)
    }

    /// Handler para el Transfer Hook de Token-2022
    /// Se ejecuta automáticamente durante transferencias
    pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
        instructions::transfer_rec::transfer_hook_handler(ctx, amount)
    }

    // ================= RETIRO DE RECs =================

    /// Retira (consume) RECs, quemando los tokens asociados
    /// 
    /// # Argumentos
    /// * `certificate_id` - ID del certificado a retirar
    /// * `amount` - Cantidad de RECs a retirar
    /// * `retirement_reason` - Razón del retiro
    pub fn retire_rec(
        ctx: Context<RetireREC>,
        certificate_id: String,
        amount: u64,
        retirement_reason: String,
    ) -> Result<()> {
        instructions::retire_rec::handler(ctx, certificate_id, amount, retirement_reason)
    }

    /// Marca un certificado como retirado sin quemar tokens (solo admin)
    /// 
    /// # Argumentos
    /// * `certificate_id` - ID del certificado
    /// * `retirement_reason` - Razón del retiro
    pub fn mark_as_retired(
        ctx: Context<MarkAsRetired>,
        certificate_id: String,
        retirement_reason: String,
    ) -> Result<()> {
        instructions::retire_rec::mark_as_retired_handler(ctx, certificate_id, retirement_reason)
    }
}
