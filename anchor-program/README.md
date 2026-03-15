# Gaia RECs - Solana Program

Este programa gestiona el registro de dispositivos de energía renovable, reportes de energía y minteo de RECs en la red Solana.

## Información del Programa

- **Program ID**: `DMqC61YxtCRF2ixUrRcqahVEN3TcGDWV212xy1prGbTw`
- **Red**: Solana Devnet
- **Estándar**: Token-2022

## Despliegue

Para futuros despliegues o actualizaciones del programa, utiliza la siguiente ruta del binario generado:

```bash
./target/sbpf-solana-solana/release/gaia_recs.so
```

## Estructura del Proyecto

El proyecto sigue una estructura de "flat root" para Solana Anchor:
- `src/`: Código fuente en Rust (`lib.rs`).
- `Cargo.toml`: Dependencias de Rust.
- `Anchor.toml`: Configuración del framework Anchor.

## Mejoras de Seguridad y Auditoría

1. **PDAs Deterministas**: Todas las cuentas se derivan usando semillas (`seeds`), eliminando la necesidad de gestionar múltiples keypairs locales.
2. **Validación de Propiedad**: Solo el dueño de un dispositivo puede enviar reportes de energía para el mismo (`has_one = owner`).
3. **Gestión de Espacio (Rent)**: Se calcula el espacio exacto y se limitan los campos de texto (`MAX_STR_LEN = 50`) para optimizar costos de almacenamiento.
4. **Token-2022**: Integración completa para transferencias seguras de certificados energéticos.
