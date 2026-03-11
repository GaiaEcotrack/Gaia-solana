use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    // Errores de autorización
    #[msg("Unauthorized: Only admin can perform this action")]
    Unauthorized,
    
    #[msg("Invalid oracle signature")]
    InvalidOracleSignature,
    
    #[msg("Not device owner")]
    NotDeviceOwner,
    
    #[msg("Not REC owner")]
    NotRECOwner,
    
    // Errores de validación
    #[msg("Device ID too long")]
    DeviceIdTooLong,
    
    #[msg("Device type too long")]
    DeviceTypeTooLong,
    
    #[msg("Location too long")]
    LocationTooLong,
    
    #[msg("Invalid device capacity")]
    InvalidDeviceCapacity,
    
    #[msg("Invalid energy amount")]
    InvalidEnergyAmount,
    
    #[msg("Report ID too long")]
    ReportIdTooLong,
    
    #[msg("Verification hash too long")]
    VerificationHashTooLong,
    
    #[msg("Certificate ID too long")]
    CertificateIdTooLong,
    
    #[msg("Retirement reason too long")]
    RetirementReasonTooLong,
    
    // Errores de lógica de negocio
    #[msg("Device already registered")]
    DeviceAlreadyRegistered,
    
    #[msg("Device not verified")]
    DeviceNotVerified,
    
    #[msg("Insufficient energy for REC mint")]
    InsufficientEnergyForREC,
    
    #[msg("REC already retired")]
    RECAlreadyRetired,
    
    #[msg("REC expired")]
    RECExpired,
    
    #[msg("Invalid period: end must be after start")]
    InvalidPeriod,
    
    #[msg("Duplicate report ID")]
    DuplicateReportId,
    
    // Errores de cuentas
    #[msg("Account not initialized")]
    AccountNotInitialized,
    
    #[msg("Account already initialized")]
    AccountAlreadyInitialized,
    
    #[msg("Invalid PDA derivation")]
    InvalidPDADerivation,
    
    // Errores de tokens
    #[msg("Token mint mismatch")]
    TokenMintMismatch,
    
    #[msg("Insufficient token balance")]
    InsufficientTokenBalance,
    
    #[msg("Token transfer failed")]
    TokenTransferFailed,
    
    // Errores generales
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    
    #[msg("Invalid UTF-8 string")]
    InvalidUTF8String,
}