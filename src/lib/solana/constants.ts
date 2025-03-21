// Solana constants for the application

// Fee wallet address - hidden from UI but used in transactions
export const FEE_WALLET_ADDRESS = '7hwrchSPCuBF6yGtFPx3f4g8Y5ymrkCPUoMDao39M4eZ';

// Fee amounts in SOL
export const MINT_FEE = 0.1;
export const AUTHORITY_REMOVAL_FEE = 0.05;

// Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
export const LAMPORTS_PER_SOL = 1000000000;

// Convert fees to lamports
export const MINT_FEE_LAMPORTS = MINT_FEE * LAMPORTS_PER_SOL;
export const AUTHORITY_REMOVAL_FEE_LAMPORTS = AUTHORITY_REMOVAL_FEE * LAMPORTS_PER_SOL;

// Solana network configuration
export const SOLANA_NETWORK = 'mainnet-beta'; // or 'mainnet-beta'
//export const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Use this for devnet
 export const SOLANA_RPC_ENDPOINT = 'https://wandering-bitter-frog.solana-mainnet.quiknode.pro/5e3962e0ed51665ff1b11be64ba6b86c7360a711/'; // Use this for mainnet
