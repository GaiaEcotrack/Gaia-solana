use anchor_lang::prelude::*;

/// Códigos de error para el programa Gaia RECs
#[error_code]
pub enum ErrorCode {
    // ============================================================================
    // ERRORES GENÉRICOS (6000-6009)
    // ============================================================================
    
    /// Error genérico del sistema
    #[msg("Error genérico del sistema")]
    GenericError,
    
    /// Desbordamiento aritmético
    #[msg("Desbordamiento aritmético en operación matemática")]
    ArithmeticOverflow,
    
    /// Cuenta no inicializada
    #[msg("La cuenta no ha sido inicializada")]
    AccountNotInitialized,
    
    // ============================================================================
    // ERRORES DE DISPOSITIVO (6010-6029)
    // ============================================================================
    
    /// ID del dispositivo demasiado largo
    #[msg("El ID del dispositivo excede la longitud máxima de 50 caracteres")]
    DeviceIdTooLong,
    
    /// Tipo de dispositivo demasiado largo
    #[msg("El tipo de dispositivo excede la longitud máxima de 20 caracteres")]
    DeviceTypeTooLong,
    
    /// Ubicación demasiado larga
    #[msg("La ubicación excede la longitud máxima de 100 caracteres")]
    LocationTooLong,
    
    /// Capacidad del dispositivo inválida
    #[msg("La capacidad del dispositivo debe ser mayor a 0 y menor a 100,000 kW")]
    InvalidDeviceCapacity,
    
    /// Dispositivo no verificado
    #[msg("El dispositivo no ha sido verificado por una autoridad certificadora")]
    DeviceNotVerified,
    
    /// No es el dueño del dispositivo
    #[msg("Solo el dueño del dispositivo puede realizar esta acción")]
    NotDeviceOwner,
    
    /// Dispositivo ya existe
    #[msg("Ya existe un dispositivo con este ID para este propietario")]
    DeviceAlreadyExists,
    
    /// Dispositivo no encontrado
    #[msg("El dispositivo especificado no existe")]
    DeviceNotFound,
    
    // ============================================================================
    // ERRORES DE REPORTE DE ENERGÍA (6030-6049)
    // ============================================================================
    
    /// ID del reporte demasiado largo
    #[msg("El ID del reporte excede la longitud máxima de 50 caracteres")]
    ReportIdTooLong,
    
    /// Hash de verificación demasiado largo
    #[msg("El hash de verificación excede la longitud máxima de 64 caracteres")]
    VerificationHashTooLong,
    
    /// Período inválido
    #[msg("El período del reporte es inválido (fecha fin debe ser posterior a fecha inicio)")]
    InvalidPeriod,
    
    /// Cantidad de energía inválida
    #[msg("La cantidad de energía debe ser mayor a 0 y menor a 1 GWh")]
    InvalidEnergyAmount,
    
    /// Energía insuficiente para generar REC
    #[msg("El acumulador de energía es insuficiente para generar los RECs solicitados")]
    InsufficientEnergyForREC,
    
    /// Energía insuficiente
    #[msg("Energía acumulada insuficiente para esta operación")]
    InsufficientEnergy,
    
    /// Reporte ya existe
    #[msg("Ya existe un reporte con este ID para este dispositivo")]
    ReportAlreadyExists,
    
    /// Firma del oráculo inválida
    #[msg("La firma del oráculo no es válida")]
    InvalidOracleSignature,
    
    // ============================================================================
    // ERRORES DE CERTIFICADO REC (6050-6079)
    // ============================================================================
    
    /// ID del certificado demasiado largo
    #[msg("El ID del certificado excede la longitud máxima de 50 caracteres")]
    CertificateIdTooLong,
    
    /// Razón de retiro demasiado larga
    #[msg("La razón de retiro excede la longitud máxima de 100 caracteres")]
    RetirementReasonTooLong,
    
    /// No es el dueño del certificado
    #[msg("Solo el dueño del certificado puede realizar esta acción")]
    NotCertificateOwner,
    
    /// Certificado ya retirado
    #[msg("El certificado ya ha sido retirado/consumido")]
    AlreadyRetired,
    
    /// REC expirado
    #[msg("El certificado REC ha expirado")]
    RECExpired,
    
    /// RECs insuficientes
    #[msg("La cantidad de RECs es insuficiente para esta operación")]
    InsufficientRECs,
    
    /// Transferencia parcial no permitida
    #[msg("Las transferencias parciales de certificados no están permitidas en esta versión")]
    PartialTransferNotAllowed,
    
    /// Retiro parcial no permitido
    #[msg("Los retiros parciales de certificados no están permitidos en esta versión")]
    PartialRetirementNotAllowed,
    
    /// Certificado no encontrado
    #[msg("El certificado especificado no existe")]
    CertificateNotFound,
    
    /// Decimales inválidos
    #[msg("Los decimales especificados no coinciden con los del token REC")]
    InvalidDecimals,
    
    // ============================================================================
    // ERRORES DE AUTORIZACIÓN (6080-6099)
    // ============================================================================
    
    /// No es administrador
    #[msg("Solo el administrador puede realizar esta acción")]
    NotAdmin,
    
    /// No es el oráculo autorizado
    #[msg("Solo el oráculo autorizado puede firmar reportes")]
    NotAuthorizedOracle,
    
    /// Acceso no autorizado
    #[msg("No tiene autorización para realizar esta acción")]
    Unauthorized,
    
    // ============================================================================
    // ERRORES DE TOKEN (6100-6119)
    // ============================================================================
    
    /// Error al mintear tokens
    #[msg("Error al mintear tokens REC")]
    MintError,
    
    /// Error al transferir tokens
    #[msg("Error al transferir tokens REC")]
    TransferError,
    
    /// Error al quemar tokens
    #[msg("Error al quemar tokens REC")]
    BurnError,
    
    /// Cuenta de token inválida
    #[msg("La cuenta de token especificada no es válida")]
    InvalidTokenAccount,
    
    /// Mint inválido
    #[msg("El mint especificado no es válido")]
    InvalidMint,
    
    /// Balance insuficiente de tokens
    #[msg("Balance insuficiente de tokens para esta operación")]
    InsufficientTokenBalance,
}
