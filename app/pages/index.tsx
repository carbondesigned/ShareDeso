import idl from '../myepicproject.json';
import { Idl, Program } from '@project-serum/anchor';
import { useEffect, useState } from 'react';
import useConnectWallet from '../hooks/useConnectWallet';
import { useAppContext } from '../contexts/AppContext';
import useOnLoad from '../hooks/useOnLoad';
import type { Post } from '../types';
import { programID, baseAccount, SystemProgram } from '../utils/config';
import Welcome from '../components/UI/Welcome';
import { getProvider } from '../utils/getProvider';
import useGetPosts from '../hooks/useGetPosts';
import { charCount } from '../utils/charCount';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/UI/CreatePostModal';

function App() {
  const { walletAddress, posts, setPosts } = useAppContext();
  const { getPosts } = useGetPosts();
  useOnLoad();
  const [content, setContent] = useState<string>('');
  const [attachment, setAttachment] = useState<string>('');

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Posts...');

      getPosts();
    }
  }, [walletAddress]);

  const TWITTER_HANDLE = 'devdylanr';
  const TWITTER_URL = `https://twitter.com/${TWITTER_HANDLE}`;
  const MAX_CHAR_COUNT = 200;

  const sendPost = async () => {
    if (charCount(content) < 0) {
      console.log('Empty content.');
      setContent('');
      setAttachment('');
      return;
    }

    try {
      const provider = getProvider();
      // @ts-ignore
      const program = new Program(idl as Idl, programID, provider);

      await program.methods
        .addPost(attachment, content)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();
      console.log('Post: ', content, attachment);
      setContent('');
      setAttachment('');
      await getPosts();
    } catch (error) {
      console.log('Error sending post: ', error);
    }
  };

  const createPostAccount = async () => {
    const provider = getProvider();
    console.log(provider.wallet.publicKey);
    try {
      const program = new Program(idl as Idl, programID, provider);
      console.log('ping');
      await program.methods
        .startStuffOff()
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc();
      console.log(
        'Created a new BaseAccount w/ address:',
        baseAccount.publicKey.toString()
      );
      await getPosts();
    } catch (error) {
      console.log('Error creating BaseAccount account:', error);
    }
  };

  const likePost = async (postId: number) => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programID, provider);

      await program.methods
        .likePost(postId)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();
      console.log('Liked');
      await getPosts();
    } catch (error) {
      console.log('Error liking post: ', error);
    }
  };
  const dislikePost = async (postId: number) => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programID, provider);

      await program.methods
        .dislikePost(postId)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();
      console.log('Disliked');
      await getPosts();
    } catch (error) {
      console.log('Error disliking post: ', error);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPost();
  };
  return (
    <div className='App'>
      <main className='p-32 xl:px-72'>
        {!walletAddress ? (
          <Welcome />
        ) : posts === null ? (
          <div>
            <button className='btn btn-primary' onClick={createPostAccount}>
              Do One-Time Initialization For Account
            </button>
          </div>
        ) : (
          <div>
            <label
              htmlFor='create-modal'
              className='btn modal-button btn-primary'
            >
              Create
            </label>
            <input type='checkbox' id='create-modal' className='modal-toggle' />
            <CreatePostModal
              MAX_CHAR_COUNT={MAX_CHAR_COUNT}
              attachment={attachment}
              content={content}
              handleSubmit={handleSubmit}
              setAttachment={setAttachment}
              setContent={setContent}
            />
            <div className='grid grid-cols-3 gap-6 mt-12'>
              {posts.map((post: Post, idx: number) => (
                <PostCard
                  post={post}
                  key={idx}
                  id={idx}
                  dislikePost={dislikePost}
                  likePost={likePost}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className='footer footer-center p-4 bg-base-300 text-base-content'>
        <div>
          <p>{TWITTER_URL}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
