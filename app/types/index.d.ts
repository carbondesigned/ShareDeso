export {};
declare global {
  interface Window {
    solana: any;
  }
}

export type Post = {
  content: string;
  userAddress: string;
  attachment?: string;
  likes: number;
  liked: boolean;
};
