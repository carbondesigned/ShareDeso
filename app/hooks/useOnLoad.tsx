import { useEffect } from 'react';
import useIsWalletConnected from './useIsWalletConnected';

export default function useOnLoad() {
  const { isWalletConnected } = useIsWalletConnected();
  return useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
}
