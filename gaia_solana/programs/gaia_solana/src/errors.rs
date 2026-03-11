use anchor_lang::prelude::*;

#[error_code]
pub enum GaiaError {
    #[msg("Only owner can perform this action")]
    OnlyOwner,
    
    #[msg("Only owner or admin can perform this action")]
    OnlyOwnerOrAdmin,
    
    #[msg("Admin already exists")]
    AdminExists,
    
    #[msg("Admin not found")]
    AdminNotFound,
    
    #[msg("Admin list exceeded")]
    AdminListExceeded,
    
    #[msg("VFT contract ID not set")]
    VftContractNotSet,
    
    #[msg("Company token contract ID not set")]
    CompanyTokenNotSet,
    
    #[msg("Carbon token contract ID not set")]
    CarbonTokenNotSet,
    
    #[msg("Invalid amount")]
    InvalidAmount,
    
    #[msg("Invalid serial number")]
    InvalidSerialNumber,
    
    #[msg("Invalid location")]
    InvalidLocation,
    
    #[msg("Invalid device type")]
    InvalidDeviceType,
    
    #[msg("Invalid device brand")]
    InvalidDeviceBrand,
    
    #[msg("Device already exists")]
    DeviceAlreadyExists,
    
    #[msg("Certificate already exists")]
    CertificateAlreadyExists,
    
    #[msg("Invalid certificate ID")]
    InvalidCertificateId,
    
    #[msg("Invalid dates")]
    InvalidDates,
    
    #[msg("Insufficient balance")]
    InsufficientBalance,
    
    #[msg("Calculation overflow")]
    CalculationOverflow,
    
    #[msg("Invalid time range")]
    InvalidTimeRange,
    
    #[msg("Cooldown period active")]
    CooldownPeriodActive,
    
    #[msg("Conversion limit exceeded")]
    ConversionLimitExceeded,
    
    #[msg("Invalid conversion cooldown")]
    InvalidConversionCooldown,
    
    #[msg("Invalid property value")]
    InvalidPropertyValue,
    
    #[msg("Invalid mint amount")]
    InvalidMintAmount,
    
    #[msg("Time range too large")]
    TimeRangeTooLarge,
    
    #[msg("Too many entries processed")]
    TooManyEntriesProcessed,
    
    #[msg("Invalid contract ID")]
    InvalidContractId,
    
    #[msg("Amount exceeds limit")]
    AmountExceedsLimit,
    
    #[msg("Self transfer attempted")]
    SelfTransferAttempted,
    
    #[msg("Exceeded transfer limit")]
    ExceededTransferLimit,
    
    #[msg("Transfer cooldown active")]
    TransferCooldownActive,
    
    #[msg("Exceeded minting limit")]
    ExceededMintingLimit,
    
    #[msg("Transfer failed")]
    TransferFailed,
    
    #[msg("Balance check failed")]
    BalanceCheckFailed,
    
    #[msg("Approval failed")]
    ApprovalFailed,
    
    #[msg("Certificate hash already used")]
    CertificateHashAlreadyUsed,
    
    #[msg("Carbon credit not found")]
    CarbonCreditNotFound,
    
    #[msg("Invalid token amount")]
    InvalidTokenAmount,
}