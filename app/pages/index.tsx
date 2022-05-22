import idl from '../myepicproject.json';
import { Idl, Program } from '@project-serum/anchor';
import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useOnLoad from '../hooks/useOnLoad';
import type { Post } from '../types';
import { programID, baseAccount, SystemProgram } from '../utils/config';
import Welcome from '../components/UI/Welcome';
import { getProvider } from '../utils/getProvider';
import useGetPosts from '../hooks/useGetPosts';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/UI/CreatePostModal';
import { formatWalletAddress } from '../utils/formatWalletAddress';

function App() {
  const { walletAddress, posts } = useAppContext();
  const { getPosts } = useGetPosts();
  useOnLoad();
  const [content, setContent] = useState<string>('');
  const [attachment, setAttachment] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
    if (content.length <= 2) {
      console.log('Empty content.');
      setContent('');
      setAttachment('');
      return;
    }

    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programID, provider);

      await program.methods
        .addPost(attachment, content)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();
      setContent('');
      setAttachment('');
      setModalOpen(false);
      await getPosts();
    } catch (error) {
      console.log('Error sending post: ', error);
    }
  };

  const createPostAccount = async () => {
    const provider = getProvider();
    try {
      const program = new Program(idl as Idl, programID, provider);
      await program.methods
        .startStuffOff()
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc();
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
      await getPosts();
    } catch (error) {
      console.log('Error disliking post: ', error);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programID, provider);

      await program.methods
        .deletePost(postId)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();
      await getPosts();
    } catch (error) {
      console.log('Error deleting post: ', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPost();
  };
  return (
    <>
      <main className='min-h-screen bg-neutral p-4 md:p-16 xl:px-72 3xl:px-80'>
        {!walletAddress ? (
          <Welcome />
        ) : posts === null ? (
          <div className='hero min-h-screen'>
            <button className='btn btn-primary' onClick={createPostAccount}>
              Do One-Time Initialization For Account
            </button>
          </div>
        ) : (
          <div>
            <div className='flex justify-between items-center'>
              <label
                onClick={() => {
                  setModalOpen(true);
                }}
                htmlFor='create-modal'
                className='btn btn-lg font-bold modal-button btn-primary'
              >
                Create
              </label>
              <input
                type='checkbox'
                id='create-modal'
                className='modal-toggle'
              />
              {modalOpen && (
                <CreatePostModal
                  MAX_CHAR_COUNT={MAX_CHAR_COUNT}
                  attachment={attachment}
                  content={content}
                  handleSubmit={handleSubmit}
                  setAttachment={setAttachment}
                  setContent={setContent}
                />
              )}
              <div
                data-tip='Copy your wallet address to clipboard'
                className='bg-accent text-base-200 cursor-pointer py-6 px-12 rounded-xl tooltip tooltip-bottom'
              >
                <p
                  className='font-bold'
                  onClick={() => navigator.clipboard.writeText(walletAddress)}
                >
                  {formatWalletAddress(walletAddress)}
                </p>
              </div>
            </div>
            <div className='md:masonry-3-col mt-12'>
              {posts &&
                posts.map((post: Post, idx: number) => (
                  <PostCard
                    post={post}
                    key={idx}
                    id={idx}
                    dislikePost={dislikePost}
                    likePost={likePost}
                    deletePost={deletePost}
                  />
                ))}
            </div>
          </div>
        )}
      </main>
      <footer className='footer footer-center p-4 bg-base-300 text-base-content'>
        <div>
          <a href={TWITTER_URL} target='_blank' rel='noreferrer'>
            {TWITTER_URL}
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
