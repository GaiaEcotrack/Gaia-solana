use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

use crate::errors::ErrorCode;
use crate::events::DeviceRegistered;
use crate::state::Device;

#[derive(Accounts)]
#[instruction(device_id: String, device_type: String, capacity_kw: u64, location: String)]
pub struct RegisterDevice<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        init,
        payer = owner,
        space = Device::SPACE,
        seeds = [
            b"device",
            owner.key().as_ref(),
            device_id.as_bytes()
        ],
        bump
    )]
    pub device: Account<'info, Device>,
    
    #[account(address = crate::ADMIN_PUBKEY)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(
    ctx: Context<RegisterDevice>,
    device_id: String,
    device_type: String,
    capacity_kw: u64,
    location: String,
) -> Result<()> {
    // Validar inputs
    require!(
        device_id.len() <= crate::state::device::MAX_DEVICE_ID_LENGTH,
        ErrorCode::DeviceIdTooLong
    );
    
    require!(
        device_type.len() <= crate::state::device::MAX_DEVICE_TYPE_LENGTH,
        ErrorCode::DeviceTypeTooLong
    );
    
    require!(
        location.len() <= crate::state::device::MAX_LOCATION_LENGTH,
        ErrorCode::LocationTooLong
    );
    
    require!(
        capacity_kw > 0 && capacity_kw <= crate::state::device::MAX_CAPACITY_KW,
        ErrorCode::InvalidDeviceCapacity
    );
    
    // Obtener el bump de la PDA
    let bump = ctx.bumps.device;
    
    // Obtener el timestamp actual
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    
    // Inicializar el dispositivo
    let device = &mut ctx.accounts.device;
    
    device.owner = ctx.accounts.owner.key();
    device.device_id = device_id;
    device.device_type = device_type;
    device.capacity_kw = capacity_kw;
    device.location = location;
    
    // Inicializar estadísticas
    device.total_energy_wh = 0;
    device.energy_accumulator = 0;
    device.total_recs_minted = 0;
    
    // Estado inicial
    device.is_verified = false;
    device.verification_date = 0; // No verificado aún
    device.registration_date = current_timestamp;
    
    // Guardar el bump
    device.bump = bump;
    
    // Validar el dispositivo
    device.validate()?;
    
    // Emitir evento
    emit!(DeviceRegistered {
        device: device.key(),
        owner: device.owner,
        device_id: device.device_id.clone(),
        device_type: device.device_type.clone(),
        capacity_kw: device.capacity_kw,
        location: device.location.clone(),
        registration_date: current_timestamp,
    });
    
    msg!(
        "Dispositivo registrado: ID={}, Tipo={}, Capacidad={}kW, Dueño={}",
        device.device_id,
        device.device_type,
        device.capacity_kw,
        device.owner
    );
    
    Ok(())
}