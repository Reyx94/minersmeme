import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { NFTStorage } from 'nft.storage';
import styles from './TokenMintForm.module.css';
import { createTokenMint, mintTokens } from '../../lib/solana/token';

// NFT.Storage client - you would need to replace with your API key
const NFT_STORAGE_API_KEY = 'e0c687c2.dcd9a0fd629749e6a34002e378a70172';
const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

export default function TokenMintForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(9);
  const [tokenSupply, setTokenSupply] = useState(1000000000);
  const [tokenImage, setTokenImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [metadataUrl, setMetadataUrl] = useState('');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTokenImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadToIPFS = async () => {
    if (!tokenImage) {
      return null;
    }
    
    setStatus('Uploading image to IPFS...');
    
    try {
      // Create metadata including the image
      const metadata = await client.store({
        name: tokenName,
        description: `${tokenName} (${tokenSymbol}) - A Solana meme token`,
        image: tokenImage,
        properties: {
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          supply: tokenSupply
        }
      });
      
      setStatus(`Metadata uploaded to IPFS: ${metadata.url}`);
      return metadata.url;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      setStatus(`Error uploading to IPFS: ${error.message}`);
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicKey || !signTransaction || !sendTransaction) {
      setStatus('Wallet not connected properly');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload image to IPFS first if provided
      let metadataUrl = null;
      if (tokenImage) {
        metadataUrl = await uploadToIPFS();
        if (!metadataUrl) {
          setIsLoading(false);
          return;
        }
        setMetadataUrl(metadataUrl);
      }
      
      setStatus('Creating token mint...');
      
      // Create a wallet adapter object for the connected wallet
      const wallet = {
        publicKey,
        signTransaction,
        sendTransaction,
      };
      
      // Create the token mint
      const mint = await createTokenMint(
        connection,
        wallet,
        tokenDecimals
      );
      
      setStatus(`Token mint created: ${mint.toBase58()}`);
      setMintAddress(mint.toBase58());
      
      // Mint the initial supply to the creator's wallet
      setStatus('Minting initial token supply...');
      const mintAmount = tokenSupply * Math.pow(10, tokenDecimals);
      
      await mintTokens(
        connection,
        wallet,
        mint,
        publicKey,
        mintAmount
      );
      
      setStatus(`Successfully minted ${tokenSupply} ${tokenSymbol} tokens!`);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating token:', error);
      setStatus(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create Your Meme Token</h2>
      <p className={styles.formDescription}>
        Fill out the form below to create your own Solana meme token. A fee of 0.1 SOL will be charged.
      </p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="tokenName" className={styles.label}>Token Name</label>
          <input
            id="tokenName"
            type="text"
            className={styles.input}
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="My Awesome Meme Token"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="tokenSymbol" className={styles.label}>Token Symbol</label>
          <input
            id="tokenSymbol"
            type="text"
            className={styles.input}
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
            placeholder="MEME"
            maxLength={10}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="tokenDecimals" className={styles.label}>Decimals</label>
          <input
            id="tokenDecimals"
            type="number"
            className={styles.input}
            value={tokenDecimals}
            onChange={(e) => setTokenDecimals(parseInt(e.target.value))}
            min={0}
            max={9}
            required
          />
          <p className={styles.hint}>Standard is 9 (like SOL)</p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="tokenSupply" className={styles.label}>Initial Supply</label>
          <input
            id="tokenSupply"
            type="number"
            className={styles.input}
            value={tokenSupply}
            onChange={(e) => setTokenSupply(parseInt(e.target.value))}
            min={1}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="tokenImage" className={styles.label}>Token Image</label>
          <input
            id="tokenImage"
            type="file"
            className={styles.fileInput}
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Token preview" />
            </div>
          )}
          <p className={styles.hint}>Upload an image for your token (optional)</p>
        </div>
        
        <div className={styles.feeInfo}>
          <p>Minting Fee: 0.1 SOL</p>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading || !publicKey}
        >
          {isLoading ? 'Processing...' : 'Create Token'}
        </button>
      </form>
      
      {status && (
        <div className={styles.statusContainer}>
          <h3>Status:</h3>
          <p className={styles.status}>{status}</p>
          
          {mintAddress && (
            <div className={styles.mintInfo}>
              <h4>Token Mint Address:</h4>
              <p className={styles.mintAddress}>{mintAddress}</p>
            </div>
          )}
          
          {metadataUrl && (
            <div className={styles.mintInfo}>
              <h4>Token Metadata:</h4>
              <p className={styles.mintAddress}>
                <a href={metadataUrl} target="_blank" rel="noopener noreferrer">
                  {metadataUrl}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
