import { useAppContext } from '../contexts/AppContext';
export default function useConnectWallet() {
  const { setWalletAddress } = useAppContext();
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const res = await solana.connect();
      console.log('connect: ', res.publicKey.toString());
      setWalletAddress(res.publicKey.toString());
    }
  };
  return { connectWallet };
}
