use anchor_lang::prelude::*;
use anchor_spl::token_2022;

// Importar módulos
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;
pub mod utils;

// Re-exportar instrucciones públicas
pub use instructions::*;

// Constantes importantes
pub const REC_CONVERSION_FACTOR: u64 = 1_000_000; // 1 REC = 1,000,000 Wh (1 MWh)
pub const REC_DECIMALS: u8 = 6; // 6 decimales para fracciones de RECs
pub const REC_EXPIRY_DAYS: i64 = 365 * 24 * 60 * 60; // 1 año en segundos

// TODO: Actualizar con tu wallet address de administrador
// Obtén tu address con: solana address
pub const ADMIN_PUBKEY: Pubkey = pubkey!("4ojkYoX1uzf12i5qiX4gJs4hYkSBp2oAahCV3rrxy4fS");

// Declarar el ID del programa
declare_id!("GAIA_RECS_PROGRAM_ID");

// Módulo principal del programa
#[program]
pub mod gaia_recs {
    use super::*;

    /// Registra un nuevo dispositivo de energía renovable
    pub fn register_device(
        ctx: Context<RegisterDevice>,
        device_id: String,
        device_type: String,
        capacity_kw: u64,
        location: String,
    ) -> Result<()> {
        instructions::register_device::handler(ctx, device_id, device_type, capacity_kw, location)
    }

    /// Envía un reporte de energía generada (requiere firma de oráculo)
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

    /// Mina RECs basado en energía acumulada
    pub fn mint_recs(
        ctx: Context<MintRECs>,
        certificate_id: String,
        rec_amount: u64,
    ) -> Result<()> {
        instructions::mint_recs::handler(ctx, certificate_id, rec_amount)
    }

    /// Transfiere RECs a otro usuario
    /// Nota: El Transfer Hook de Token-2022 manejará verificación KYC
    pub fn transfer_rec(
        ctx: Context<TransferREC>,
        certificate_id: String,
        new_owner: Pubkey,
    ) -> Result<()> {
        instructions::transfer_rec::handler(ctx, certificate_id, new_owner)
    }

    /// Retira/consume RECs (para cumplimiento o uso)
    pub fn retire_rec(
        ctx: Context<RetireREC>,
        certificate_id: String,
        reason: String,
    ) -> Result<()> {
        instructions::retire_rec::handler(ctx, certificate_id, reason)
    }
}