use anchor_lang::prelude::*;

pub mod state;
pub mod errors;
pub mod instructions;

use instructions::*;

declare_id!("3h66uneMsNnnByaSTSFBhz6S69ZATHbRhriFq8KaWDwP");

#[program]
pub mod gaia_solana {
    use super::*;

    // ================= ADMIN =================

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::admin::initialize(ctx)
    }

    pub fn set_vft_contract(ctx: Context<SetVftContract>, vft_mint: Pubkey) -> Result<()> {
        instructions::admin::set_vft_contract(ctx, vft_mint)
    }

    pub fn add_admin(ctx: Context<AddAdmin>) -> Result<()> {
        instructions::admin::add_admin(ctx)
    }

    pub fn remove_admin(ctx: Context<RemoveAdmin>) -> Result<()> {
        instructions::admin::remove_admin(ctx)
    }

    // ================= DEVICES =================

    pub fn add_device(
        ctx: Context<AddDevice>,
        owner: Pubkey,
        serial_number: String,
        location: String,
        device_type: String,
        device_brand: String,
    ) -> Result<()> {
        instructions::devices::add_device(
            ctx,
            owner,
            serial_number,
            location,
            device_type,
            device_brand,
        )
    }

    // ================= TOKENS =================

    pub fn mint_tokens_to_user(ctx: Context<MintTokensToUser>, amount: u64) -> Result<()> {
        instructions::tokens::mint_tokens_to_user(ctx, amount)
    }

    pub fn transfer_gaia_e_tokens(ctx: Context<TransferGaiaETokens>, amount: u64) -> Result<()> {
        instructions::tokens::transfer_gaia_e_tokens(ctx, amount)
    }

    // ================= CARBON =================

    pub fn tokenize_carbon_credit(
        ctx: Context<TokenizeCarbonCredit>,
        project_id: String,
        co2_tonnes: u32,
        certificate_hash: String,
        verifier_name: String,
        gps_coords: String,
        recipient: Pubkey,
        start_date: i64,
        end_date: i64,
    ) -> Result<()> {
        instructions::carbon::tokenize_carbon_credit(
            ctx,
            project_id,
            co2_tonnes,
            certificate_hash,
            verifier_name,
            gps_coords,
            recipient,
            start_date,
            end_date,
        )
    }
}