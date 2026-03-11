use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::GaiaError;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<Config>(),
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetVftContract<'info> {

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        constraint = config.owner == owner.key() @ GaiaError::OnlyOwner
    )]
    pub config: Account<'info, Config>,

    pub owner: Signer<'info>,

    /// CHECK: solo guardamos dirección
    pub vft_mint: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct AddAdmin<'info> {

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        constraint = config.owner == owner.key() @ GaiaError::OnlyOwner
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<Admin>(),
        seeds = [b"admin", new_admin.key().as_ref()],
        bump
    )]
    pub admin_account: Account<'info, Admin>,

    /// CHECK: dirección del nuevo admin
    pub new_admin: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveAdmin<'info> {

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        constraint = config.owner == owner.key() @ GaiaError::OnlyOwner
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"admin", admin_to_remove.key().as_ref()],
        bump,
        close = owner
    )]
    pub admin_account: Account<'info, Admin>,

    /// CHECK
    pub admin_to_remove: AccountInfo<'info>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {

    let config = &mut ctx.accounts.config;

    config.owner = ctx.accounts.payer.key();

    config.vft_mint = Pubkey::default();
    config.company_mint = Pubkey::default();
    config.carbon_mint = Pubkey::default();

    config.gaia_e_to_gaia_rate = 100;
    config.min_conversion_amount = 1;
    config.max_daily_conversion = 1000;

    config.min_gaia_e_transfer = 1;
    config.max_gaia_e_per_kwh = 100;

    config.conversion_cooldown = 3600;
    config.kwh_per_token = 1;
    config.tokens_per_sol = 100;

    config.conversion_rate_vft_to_company = 5;

    config.total_vft_swapped = 0;
    config.total_company_tokens_sent = 0;

    config.next_token_id = 1;

    config.bump = ctx.bumps.config;

    Ok(())
}

pub fn set_vft_contract(ctx: Context<SetVftContract>, vft_mint: Pubkey) -> Result<()> {

    require!(vft_mint != Pubkey::default(), GaiaError::InvalidContractId);

    ctx.accounts.config.vft_mint = vft_mint;

    Ok(())
}

pub fn add_admin(ctx: Context<AddAdmin>) -> Result<()> {

    ctx.accounts.admin_account.address = ctx.accounts.new_admin.key();

    Ok(())
}

pub fn remove_admin(_ctx: Context<RemoveAdmin>) -> Result<()> {
    Ok(())
}