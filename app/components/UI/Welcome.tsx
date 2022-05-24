import Image from 'next/image';
import React from 'react';
import useConnectWallet from '../../hooks/useConnectWallet';

function Welcome() {
  const { connectWallet } = useConnectWallet();
  return (
    <div className='hero bg-base-300 rounded-2xl'>
      <div className='hero-content flex-col text-center py-32'>
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
          <h1 className='text-5xl font-bold text-base-100'>Share Deso</h1>
          <p className='pt-4 pb-12 text-xl text-base-200'>
            Share your thoughts with a splash of art decentralized on the web.
          </p>
          <div className='tooltip tooltip-bottom' data-tip='Using Solana!'>
            <button
              className='btn btn-lg btn-primary font-bold'
              onClick={connectWallet}
            >
              Connect your Wallet
            </button>
          </div>
          <p className='text-base-200 mt-4'>
            Use{' '}
            <a href='https://phantom.app/' className='underline'>
              Phantom Wallet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
