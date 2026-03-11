use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, MintTo, Transfer},
    associated_token::AssociatedToken,
};

use crate::state::*;
use crate::errors::GaiaError;

#[derive(Accounts)]
pub struct MintTokensToUser<'info> {

    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub vft_mint: Account<'info, Mint>,

    /// CHECK: wallet destino
    pub recipient: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = vft_mint,
        associated_token::authority = recipient
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        space = 8 + 64,
        seeds = [b"energy_production", recipient.key().as_ref()],
        bump
    )]
    pub energy_production: Account<'info, EnergyProduction>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferGaiaETokens<'info> {

    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub vft_mint: Account<'info, Mint>,

    /// CHECK
    pub from: UncheckedAccount<'info>,

    /// CHECK
    pub to: UncheckedAccount<'info>,

    #[account(
        mut,
        associated_token::mint = vft_mint,
        associated_token::authority = from
    )]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = vft_mint,
        associated_token::authority = to
    )]
    pub to_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        space = 8 + 128,
        seeds = [b"transfer_record", from.key().as_ref(), to.key().as_ref()],
        bump
    )]
    pub transfer_record: Account<'info, TransferRecord>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn mint_tokens_to_user(
    ctx: Context<MintTokensToUser>,
    amount: u64,
) -> Result<()> {

    let config = &ctx.accounts.config;

    let gaia_e_amount = amount
        .checked_mul(config.kwh_per_token)
        .ok_or(GaiaError::CalculationOverflow)?;

    require!(
        gaia_e_amount <= config.max_gaia_e_per_kwh,
        GaiaError::ConversionLimitExceeded
    );

    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.vft_mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        gaia_e_amount,
    )?;

    let production = &mut ctx.accounts.energy_production;

    production.producer = ctx.accounts.recipient.key();
    production.timestamp = Clock::get()?.unix_timestamp;
    production.kwh_generated = amount;
    production.gaia_e_minted = gaia_e_amount;

    Ok(())
}

pub fn transfer_gaia_e_tokens(
    ctx: Context<TransferGaiaETokens>,
    amount: u64,
) -> Result<()> {

    require!(
        ctx.accounts.from.key() != ctx.accounts.to.key(),
        GaiaError::SelfTransferAttempted
    );

    require!(amount > 0, GaiaError::InvalidAmount);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.to_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;

    let record = &mut ctx.accounts.transfer_record;

    record.from = ctx.accounts.from.key();
    record.to = ctx.accounts.to.key();
    record.amount = amount;
    record.timestamp = Clock::get()?.unix_timestamp;
    record.token_type = "Gaia_E".to_string();

    Ok(())
}