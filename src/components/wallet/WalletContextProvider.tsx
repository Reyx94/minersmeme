import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ReactNode, useMemo } from 'react';

// Import the wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Import constants
import { SOLANA_RPC_ENDPOINT } from '../../lib/solana/constants';

interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
}

export function WalletContextProvider({
  children,
  network = WalletAdapterNetwork.Mainnet,
}: WalletContextProviderProps) {
  // Use the custom RPC endpoint from constants instead of clusterApiUrl
  const endpoint = useMemo(() => SOLANA_RPC_ENDPOINT, []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  // so only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
