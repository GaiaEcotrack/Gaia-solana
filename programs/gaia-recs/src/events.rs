use anchor_lang::prelude::*;

#[event]
pub struct DeviceRegistered {
    pub device: Pubkey,
    pub owner: Pubkey,
    pub device_id: String,
    pub device_type: String,
    pub capacity_kw: u64,
    pub location: String,
    pub registration_date: i64,
}

#[event]
pub struct DeviceVerified {
    pub device: Pubkey,
    pub verifier: Pubkey,
    pub verification_date: i64,
}

#[event]
pub struct EnergyReportSubmitted {
    pub device: Pubkey,
    pub report_id: String,
    pub period_start: i64,
    pub period_end: i64,
    pub energy_wh: u64,
    pub recs_issued: u64,
    pub submission_date: i64,
}

#[event]
pub struct RECsMinted {
    pub device: Pubkey,
    pub certificate_id: String,
    pub owner: Pubkey,
    pub rec_amount: u64,
    pub generation_date: i64,
    pub expiry_date: i64,
}

#[event]
pub struct RECTransferred {
    pub certificate_id: String,
    pub from_owner: Pubkey,
    pub to_owner: Pubkey,
    pub transfer_date: i64,
}

#[event]
pub struct RECRetired {
    pub certificate_id: String,
    pub owner: Pubkey,
    pub retirement_reason: String,
    pub retirement_date: i64,
}

#[event]
pub struct OracleSignatureVerified {
    pub report_id: String,
    pub oracle: Pubkey,
    pub verification_date: i64,
}