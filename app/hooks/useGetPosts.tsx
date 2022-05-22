import { Idl, Program } from '@project-serum/anchor';
import { getProvider } from '../utils/getProvider';
import idl from '../myepicproject.json';
import { baseAccount, programID } from '../utils/config';
import { useAppContext } from '../contexts/AppContext';

export default function useGetPosts() {
  const { setPosts } = useAppContext();
  const getPosts = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log('Got account: ', account);
      // @ts-ignore
      setPosts(account.posts);
    } catch (error) {
      console.log('error: ', error);
      setPosts(null);
    }
  };
  return { getPosts };
}
