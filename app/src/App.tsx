import './index.css';
import react, { useEffect, useState } from 'react';
type Post = {
  content: string;
  username: string;
  attachment?: string;
};
function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [attachment, setAttachment] = useState<string>('');

  const TWITTER_HANDLE = 'devdylanr';
  const TWITTER_URL = `https://twitter.com/${TWITTER_HANDLE}`;

  const charCount = (text: string): number => {
    return text.length;
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

  useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  const posts: Post[] = [
    {
      username: 'Jon',
      content: 'This is a shorter post and actually the first!',
      attachment:
        'https://media.giphy.com/media/ViPOweHStsX59yqXoX/giphy-downsized-large.gif',
    },
    {
      username: 'Jon',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi eveniet dignissimos nisi non magnam incidunt repudiandae delectus, ut sint harum. Aperiam nihil eum est earum dolorum, ea ex distinctio ad.',
      attachment:
        'https://images.unsplash.com/photo-1652949843495-c6af1f4ca9a0?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500',
    },
    {
      username: 'Jon',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi eveniet dignissimos nisi non magnam incidunt repudiandae delectus, ut sint harum. Aperiam nihil eum est earum dolorum, ea ex distinctio ad.',
    },
    {
      username: 'Jon',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi eveniet dignissimos nisi non magnam incidunt repudiandae delectus, ut sint harum. Aperiam nihil eum est earum dolorum, ea ex distinctio ad.',
    },
  ];

  const sendPost = async () => {
    if (charCount(content) > 0) {
      console.log('Post: ', content, attachment);
    } else {
      console.log('Empty content.');
    }
  };
  return (
    <div className='App'>
      <main className='p-32 xl:px-72'>
        {!walletAddress ? (
          <div className='hero min-h-screen bg-base-200'>
            <div className='hero-content flex-col text-center'>
              <img
                className='mask mask-squircle'
                src='https://images.unsplash.com/photo-1651055712444-4e0f78a60c20?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250'
              />
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
                    <h4 className='card-title'>{post.username}</h4>
                    <p>{post.content}</p>
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
