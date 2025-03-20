import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  setAuthority, 
  AuthorityType 
} from '@solana/spl-token';
import { FEE_WALLET_ADDRESS, MINT_FEE_LAMPORTS, AUTHORITY_REMOVAL_FEE_LAMPORTS } from './constants';

// Create a connection to the Solana network
export const createConnection = (endpoint: string) => {
  return new Connection(endpoint);
};

// Create a new token mint
export const createTokenMint = async (
  connection: Connection,
  payer: any, // Wallet adapter
  decimals: number
) => {
  try {
    // First send the mint fee to the fee wallet
    const feeWalletPublicKey = new PublicKey(FEE_WALLET_ADDRESS);
    
    // Create a transaction to send the mint fee
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: feeWalletPublicKey,
        lamports: MINT_FEE_LAMPORTS,
      })
    );
    
    // Send the transaction
    const signature = await payer.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    
    // Create the token mint
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // Mint authority
      payer.publicKey, // Freeze authority
      decimals
    );
    
    return mint;
  } catch (error) {
    console.error('Error creating token mint:', error);
    throw error;
  }
};

// Mint tokens to a wallet
export const mintTokens = async (
  connection: Connection,
  payer: any, // Wallet adapter
  mint: PublicKey,
  destination: PublicKey,
  amount: number
) => {
  try {
    // Get or create the associated token account for the destination
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );
    
    // Mint tokens to the destination
    const signature = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer.publicKey, // Mint authority
      amount
    );
    
    return signature;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

// Remove mint and freeze authority
export const removeAuthorities = async (
  connection: Connection,
  payer: any, // Wallet adapter
  mint: PublicKey
) => {
  try {
    // First send the authority removal fee to the fee wallet
    const feeWalletPublicKey = new PublicKey(FEE_WALLET_ADDRESS);
    
    // Create a transaction to send the authority removal fee
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: feeWalletPublicKey,
        lamports: AUTHORITY_REMOVAL_FEE_LAMPORTS,
      })
    );
    
    // Send the transaction
    const signature = await payer.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    
    // Remove mint authority
    await setAuthority(
      connection,
      payer,
      mint,
      payer.publicKey, // Current authority
      AuthorityType.MintTokens,
      null // New authority (null means no authority)
    );
    
    // Remove freeze authority
    await setAuthority(
      connection,
      payer,
      mint,
      payer.publicKey, // Current authority
      AuthorityType.FreezeAccount,
      null // New authority (null means no authority)
    );
    
    return true;
  } catch (error) {
    console.error('Error removing authorities:', error);
    throw error;
  }
};
