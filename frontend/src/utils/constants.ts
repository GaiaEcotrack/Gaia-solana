import { PublicKey } from '@solana/web3.js';
import idl from '../../anchor-program/target/idl/gaia_recs.json';

export const PROGRAM_ID = new PublicKey('DMqC61YxtCRF2ixUrRcqahVEN3TcGDWV212xy1prGbTw');
export const IDL = idl;

export const RPC_URL = process.env.REACT_APP_RPC_URL || 'https://api.devnet.solana.com';
