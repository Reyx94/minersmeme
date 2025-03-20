import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { NFTStorage } from 'nft.storage';
import styles from './AuthorityRemovalForm.module.css';
import { removeAuthorities } from '../../lib/solana/token';

export default function AuthorityRemovalForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  
  const [mintAddress, setMintAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicKey || !signTransaction || !sendTransaction) {
      setStatus('Wallet not connected properly');
      return;
    }
    
    try {
      setIsLoading(true);
      setStatus('Validating mint address...');
      
      // Validate mint address
      let mintPublicKey;
      try {
        mintPublicKey = new PublicKey(mintAddress);
      } catch (error) {
        setStatus('Invalid mint address format');
        setIsLoading(false);
        return;
      }
      
      setStatus('Removing mint and freeze authorities...');
      
      // Create a wallet adapter object for the connected wallet
      const wallet = {
        publicKey,
        signTransaction,
        sendTransaction,
      };
      
      // Remove authorities
      const result = await removeAuthorities(
        connection,
        wallet,
        mintPublicKey
      );
      
      if (result) {
        setStatus('Successfully removed mint and freeze authorities!');
        setSuccess(true);
      } else {
        setStatus('Failed to remove authorities');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error removing authorities:', error);
      setStatus(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Remove Mint & Freeze Authority</h2>
      <p className={styles.formDescription}>
        Remove mint and freeze authorities from your token to make it immutable.
        A fee of 0.05 SOL will be charged.
      </p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="mintAddress" className={styles.label}>Token Mint Address</label>
          <input
            id="mintAddress"
            type="text"
            className={styles.input}
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter token mint address"
            required
          />
        </div>
        
        <div className={styles.feeInfo}>
          <p>Authority Removal Fee: 0.05 SOL</p>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading || !publicKey || !mintAddress}
        >
          {isLoading ? 'Processing...' : 'Remove Authorities'}
        </button>
      </form>
      
      {status && (
        <div className={`${styles.statusContainer} ${success ? styles.success : ''}`}>
          <h3>Status:</h3>
          <p className={styles.status}>{status}</p>
        </div>
      )}
    </div>
  );
}
