import React, { useEffect } from 'react';
import idl from '../myepicproject.json';
import { useRouter } from 'next/router';
import { useAppContext } from '../contexts/AppContext';
import { Post } from '../types';
import { programID, baseAccount, SystemProgram } from '../utils/config';
import { getProvider } from '../utils/getProvider';
import { Idl, Program } from '@project-serum/anchor';
import useGetPosts from '../hooks/useGetPosts';
import { formatWalletAddress } from '../utils/formatWalletAddress';
import Link from 'next/link';

const PostDetails = () => {
  const { getPosts } = useGetPosts();
  useEffect(() => {
    getPosts();
  }, []);
  const { posts, walletAddress } = useAppContext();
  const router = useRouter();
  const { id } = router.query;
  const post: Post = posts[id as string];
  const isAuthor = post?.userAddress.toString() === walletAddress;
  const isOnlyContentPost = post?.attachment && post.attachment.length <= 0;

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
  return (
    <>
      {id && (
        <div className='min-h-screen bg-neutral p-4 md:p-32 lg:px-52 2xl:px-72 3xl:px-80'>
          <div className='mb-20'>
            <Link href='/'>
              <a className='w-fit rounded-full px-16 text-base-200 py-4 bg-accent'>
                Back
              </a>
            </Link>
          </div>
          <div className='flex-col items-start flex gap-6'>
            {post?.attachment && post.attachment.length > 0 && (
              <div className='w-full grid place-items-center'>
                <img
                  src={post.attachment}
                  alt={post.content}
                  className='rounded-xl object-cover w-full'
                />
              </div>
            )}
            <div className='flex justify-between w-full items-center'>
              <h6 className='text-base-200 text-sm py-2 px-6 bg-base-300 w-fit rounded-full'>
                ({formatWalletAddress(post?.userAddress.toString())})
              </h6>
              {isAuthor && (
                <div
                  className={`dropdown ${
                    isOnlyContentPost
                      ? 'dropdown-end'
                      : 'dropdown-left dropdown-end'
                  }`}
                >
                  <label tabIndex={0} className='cursor-pointer'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 stroke-base-200'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                      />
                    </svg>
                  </label>
                  <ul
                    tabIndex={0}
                    className='dropdown-content menu p-2 shadow-2xl bg-base-300 rounded-box w-52 text-base-100'
                  >
                    <li
                      onClick={() => id && deletePost(id as unknown as number)}
                    >
                      <a className='text-sm'>Delete</a>
                    </li>
                    <li>
                      <a className='text-sm'>Copy Wallet Address</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <p className='text-base-100'>{post?.content}</p>
            <div
              onClick={() => {
                if (!post?.liked) likePost(id as unknown as number);
                else dislikePost(id as unknown as number);
              }}
              className={`${
                post?.liked ? 'bg-primary-focus text-base-300' : 'bg-base-300'
              }   rounded-full px-6 py-2 w-fit cursor-pointer duration-200 origin-left text-base-200`}
            >
              <span className='font-bold'>{post?.likes}</span>{' '}
              <span>Likes</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetails;
