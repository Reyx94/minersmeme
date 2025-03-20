import Head from 'next/head';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnect from '../components/wallet/WalletConnect';
import TokenMintForm from '../components/token/TokenMintForm';
import AuthorityRemovalForm from '../components/token/AuthorityRemovalForm';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('mint');

  return (
    <div className={styles.container}>
      <Head>
        <title>Solana Meme Token Minter</title>
        <meta name="description" content="Create your own Solana meme token" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Solana Meme Token Minter
        </h1>

        <p className={styles.description}>
          Create your own Solana meme token in minutes
        </p>

        <div className={styles.heroSection}>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <span className={styles.checkmark}>✓</span>
              <span>Mint fee: 0.1 SOL</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.checkmark}>✓</span>
              <span>Remove mint & freeze authority: 0.05 SOL</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.checkmark}>✓</span>
              <span>Fast deployment</span>
            </div>
          </div>
        </div>

        {!connected ? (
          <WalletConnect />
        ) : (
          <>
            <div className={styles.tabContainer}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'mint' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('mint')}
              >
                Create Token
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'authority' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('authority')}
              >
                Remove Authority
              </button>
            </div>
            
            {activeTab === 'mint' ? (
              <TokenMintForm />
            ) : (
              <AuthorityRemovalForm />
            )}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Solana Meme Token Minter © 2025</p>
      </footer>
    </div>
  );
}
