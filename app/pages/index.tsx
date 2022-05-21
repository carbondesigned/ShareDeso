import idl from '../myepicproject.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Idl, Program, web3 } from '@project-serum/anchor';
import { useEffect, useState } from 'react';
import kp from '../keypair.json';
import Image from 'next/image';

type Post = {
  content: string;
  userAddress: string;
  attachment?: string;
  likes: number;
  liked: boolean;
};

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [attachment, setAttachment] = useState<string>('');
  const [posts, setPosts] = useState<Post[] | null>([]);

  const TWITTER_HANDLE = 'devdylanr';
  const TWITTER_URL = `https://twitter.com/${TWITTER_HANDLE}`;

  const charCount = (text: string): number => {
    return text.length;
  };

  const getProvider = () => {
    const connection = new Connection(network, 'processed');
    const provider = new AnchorProvider(connection, window.solana, {
      commitment: 'processed',
    });
    return provider;
  };

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

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const res = await solana.connect();
      console.log('connect: ', res.publicKey.toString());
      setWalletAddress(res.publicKey.toString());
    }
  };

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
  console.log(posts);
  useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Posts...');

      getPosts();
    }
  }, [walletAddress]);

  const sendPost = async () => {
    if (charCount(content) < 0) {
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
      console.log('Post: ', content, attachment);
      setContent('');
      setAttachment('');
      await getPosts();
    } catch (error) {
      console.log('Error sending post: ', error);
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
  return (
    <div className='App'>
      <main className='p-32 xl:px-72'>
        {!walletAddress ? (
          <div className='hero min-h-screen bg-base-200'>
            <div className='hero-content flex-col text-center'>
              <div className='mask mask-squircle'>
                <Image
                  alt='solana'
                  layout='intrinsic'
                  width={250}
                  height={250}
                  objectFit='contain'
                  objectPosition='center'
                  src='https://images.unsplash.com/photo-1651055712444-4e0f78a60c20?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250'
                />
              </div>
              <div className='max-w-md'>
                <h1 className='text-5xl font-bold'>DeSo Twitter</h1>
                <p className='py-6'>Learning Solana & Rust</p>
                <div
                  className='tooltip tooltip-bottom'
                  data-tip='Using Solana!'
                >
                  <button className='btn btn-primary' onClick={connectWallet}>
                    Connect your Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : posts === null ? (
          <>
            <button className='btn btn-primary' onClick={createPostAccount}>
              Do One-Time Initialization For Account
            </button>
          </>
        ) : (
          <>
            <div className='bg-base-200 p-12 rounded-xl'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendPost();
                }}
                className='flex flex-col gap-2 text-left'
              >
                <h2 className='text-2xl font-bold'>Write a quick post</h2>
                <div>
                  <label className='label' htmlFor='content'>
                    <span className='label-text'>Write something</span>
                  </label>
                  <textarea
                    name='content'
                    value={content}
                    placeholder='Something.'
                    className='textarea w-full min-h-[6em] text-lg'
                    maxLength={250}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className='flex justify-end'>
                    {charCount(content) === 250 ? (
                      <span className='text-red-500'>
                        {charCount(content)}/250
                      </span>
                    ) : (
                      <span>{charCount(content)}/250</span>
                    )}
                  </div>
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Attachments</span>
                  </label>
                  <label className='input-group'>
                    <span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                        />
                      </svg>
                    </span>
                    <input
                      value={attachment}
                      onChange={(e) => setAttachment(e.target.value)}
                      type='text'
                      placeholder='https://image.com/image.png'
                      className='input w-full input-bordered'
                    />
                  </label>
                </div>
                <div className='w-full flex justify-end'>
                  <div
                    className='tooltip tooltip-bottom'
                    data-tip='Post something!'
                  >
                    <button className='btn btn-primary'>Post</button>
                  </div>
                </div>
              </form>
            </div>
            <div className='grid grid-cols-3 gap-6 mt-12'>
              {posts.map((post: Post, idx: number) => (
                <div
                  key={idx}
                  className='card flex-1 bg-base-200 text-primary-content'
                >
                  <figure>
                    <img src={post.attachment} alt={post.attachment} />
                  </figure>
                  <div className='card-body'>
                    <h6 className='text-slate-600'>
                      (
                      {post.userAddress.toString().substring(0, 4) +
                        '...' +
                        post.userAddress
                          .toString()
                          .substring(
                            post.userAddress.toString().length - 4,
                            post.userAddress.toString().length
                          )}
                      )
                    </h6>
                    <p>{post.content}</p>
                    <div
                      onClick={() => {
                        if (!post.liked) likePost(idx);
                        else dislikePost(idx);
                      }}
                      className={`${
                        post.liked ? 'bg-primary-focus' : 'bg-slate-600'
                      }   grid place-items-center rounded-full px-4 py-2 w-fit cursor-pointer`}
                    >
                      <span className='font-bold'>{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
