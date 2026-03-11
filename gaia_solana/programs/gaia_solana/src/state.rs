use anchor_lang::prelude::*;

pub const ONE_SOL: u64 = 1_000_000_000;
pub const COMPANY_DECIMALS: u64 = 1_000_000_000_000_000_000;
pub const VFT_DECIMALS: u64 = 1_000;
pub const PERCENTAGE_BASE: u64 = 100;
pub const MAX_ADMINS: usize = 10;

#[account]
#[derive(Default)]
pub struct Config {
    pub owner: Pubkey,
    pub vft_mint: Pubkey,
    pub company_mint: Pubkey,
    pub carbon_mint: Pubkey,

    pub gaia_e_to_gaia_rate: u64,
    pub min_conversion_amount: u64,
    pub max_daily_conversion: u64,
    pub min_gaia_e_transfer: u64,
    pub max_gaia_e_per_kwh: u64,

    pub conversion_cooldown: i64,
    pub kwh_per_token: u64,
    pub tokens_per_sol: u64,

    pub conversion_rate_vft_to_company: u64,
    pub total_vft_swapped: u64,
    pub total_company_tokens_sent: u64,

    pub next_token_id: u32,
    pub bump: u8,
}

#[account]
#[derive(Default)]
pub struct Device {
    pub owner: Pubkey,
    pub serial_number: String,
    pub location: String,
    pub device_type: String,
    pub device_brand: String,
}

#[account]
#[derive(Default)]
pub struct EnergyProduction {
    pub producer: Pubkey,
    pub timestamp: i64,
    pub kwh_generated: u64,
    pub gaia_e_minted: u64,
}

#[account]
#[derive(Default)]
pub struct CarbonCredit {
    pub token_id: u32,
    pub owner: Pubkey,
    pub project_id: String,
    pub co2_tonnes: u32,
    pub certificate_hash: String,
    pub verifier_name: String,
    pub gps_coords: String,
    pub start_date: i64,
    pub end_date: i64,
}

#[account]
#[derive(Default)]
pub struct TransferRecord {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub token_type: String,
}

#[account]
#[derive(Default)]
pub struct UsedHash {
    pub hash: String,
}

#[account]
pub struct Admin {
    pub address: Pubkey,
}