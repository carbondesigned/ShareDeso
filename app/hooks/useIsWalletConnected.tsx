import { useAppContext } from '../contexts/AppContext';

export default function useIsWalletConnected() {
  const { setWalletAddress } = useAppContext();
  const isWalletConnected = async () => {
    try {
      const { solana } = window;
      if (!solana) {
        alert('Solana is not found! Get the Phantom Wallet!');
      }
      if (solana.isPhantom) {
        console.log('Phantom Wallet found!');

        const res = await solana.connect({ onlyIfTrusted: true });
        console.log('Connected with Public Key', res.publicKey.toString());
        setWalletAddress(res.publicKey.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { isWalletConnected };
}
