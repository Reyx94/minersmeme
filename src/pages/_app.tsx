import { AppProps } from 'next/app';
import { WalletContextProvider } from '../components/wallet/WalletContextProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;
