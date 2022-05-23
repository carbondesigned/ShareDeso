import { createContext, ReactNode, useContext, useState } from 'react';
import { Post } from '../types';

type Props = {
  children: ReactNode;
};

const AppContext = createContext({} as any);

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }: Props) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[] | null>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [postErrors, setPostErrors] = useState<string[]>([]);
  const state = {
    walletAddress,
    setWalletAddress,
    posts,
    setPosts,
    modalOpen,
    setModalOpen,
    postErrors,
    setPostErrors,
  };
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}
