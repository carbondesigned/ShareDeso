import { AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { network } from './config';

export const getProvider = () => {
  const connection = new Connection(network, 'processed');
  const provider = new AnchorProvider(connection, window.solana, {
    commitment: 'processed',
  });
  return provider;
};
