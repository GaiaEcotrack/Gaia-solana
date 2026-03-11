pub mod register_device;
pub mod submit_report;
pub mod mint_recs;
pub mod transfer_rec;
pub mod retire_rec;

// Re-exportar los structs de contexto
pub use register_device::*;
pub use submit_report::*;
pub use mint_recs::*;
pub use transfer_rec::*;
pub use retire_rec::*;