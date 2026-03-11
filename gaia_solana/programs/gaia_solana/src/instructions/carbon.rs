use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, MintTo},
    associated_token::AssociatedToken,
};
use crate::state::*;
use crate::errors::GaiaError;

#[derive(Accounts)]
#[instruction(certificate_hash: String)]
pub struct TokenizeCarbonCredit<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub carbon_mint: Account<'info, Mint>,
    
    /// CHECK: Recipient address
    pub recipient: AccountInfo<'info>,
    
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = carbon_mint,
        associated_token::authority = recipient
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 4 + 32 + 50 + 4 + 64 + 50 + 50 + 16 + 16,
        seeds = [b"carbon_credit", config.next_token_id.to_le_bytes().as_ref()],
        bump
    )]
    pub carbon_credit: Account<'info, CarbonCredit>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 64,
        seeds = [b"used_hash", certificate_hash.as_bytes()],
        bump
    )]
    pub used_hash: Account<'info, UsedHash>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

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
    require!(start_date < end_date, GaiaError::InvalidDates);
    require!(co2_tonnes > 0, GaiaError::InvalidAmount);
    
    let config = &mut ctx.accounts.config;
    let token_id = config.next_token_id;
    config.next_token_id = config.next_token_id.checked_add(1).unwrap();
    
    // Mint Gaia-C token (1 token per credit)
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.carbon_mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        1,
    )?;
    
    // Store carbon credit data
    let credit = &mut ctx.accounts.carbon_credit;
    credit.token_id = token_id;
    credit.owner = recipient;
    credit.project_id = project_id;
    credit.co2_tonnes = co2_tonnes;
    credit.certificate_hash = certificate_hash.clone();
    credit.verifier_name = verifier_name;
    credit.gps_coords = gps_coords;
    credit.start_date = start_date;
    credit.end_date = end_date;
    
    // Mark hash as used
    ctx.accounts.used_hash.hash = certificate_hash;
    
    Ok(())
}