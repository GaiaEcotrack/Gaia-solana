use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::GaiaError;

#[derive(Accounts)]
#[instruction(serial_number: String)]
pub struct AddDevice<'info> {
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 50 + 100 + 30 + 30,
        seeds = [b"device", owner.key().as_ref(), serial_number.as_bytes()],
        bump
    )]
    pub device: Account<'info, Device>,
    
    /// CHECK: Device owner
    pub owner: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn add_device(
    ctx: Context<AddDevice>,
    owner: Pubkey,
    serial_number: String,
    location: String,
    device_type: String,
    device_brand: String,
) -> Result<()> {
    // Validaciones
    require!(!serial_number.trim().is_empty() && serial_number.len() <= 50, GaiaError::InvalidSerialNumber);
    require!(!location.trim().is_empty() && location.len() <= 100, GaiaError::InvalidLocation);
    require!(!device_type.trim().is_empty() && device_type.len() <= 30, GaiaError::InvalidDeviceType);
    require!(!device_brand.trim().is_empty() && device_brand.len() <= 30, GaiaError::InvalidDeviceBrand);
    
    let device = &mut ctx.accounts.device;
    device.owner = owner;
    device.serial_number = serial_number;
    device.location = location;
    device.device_type = device_type;
    device.device_brand = device_brand;
    
    Ok(())
}