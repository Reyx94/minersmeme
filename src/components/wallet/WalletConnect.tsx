import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from './WalletConnect.module.css';

export default function WalletConnect() {
  const { connected } = useWallet();

  return (
    <div className={styles.walletContainer}>
      <div className={styles.walletContent}>
        <h2 className={styles.walletTitle}>Connect Your Wallet</h2>
        <p className={styles.walletDescription}>
          To create your Solana meme token, you'll need to connect a wallet first.
        </p>
        <div className={styles.walletButtonContainer}>
          <WalletMultiButton className={styles.walletButton} />
        </div>
        {connected && (
          <p className={styles.walletConnected}>
            ✅ Wallet connected! You can now create your meme token.
          </p>
        )}
      </div>
    </div>
  );
}
