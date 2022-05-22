import Image from 'next/image';
import React from 'react';
import useConnectWallet from '../../hooks/useConnectWallet';

function Welcome() {
  const { connectWallet } = useConnectWallet();
  return (
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
          <div className='tooltip tooltip-bottom' data-tip='Using Solana!'>
            <button className='btn btn-primary' onClick={connectWallet}>
              Connect your Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
