import Link from 'next/link';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Post } from '../types';
import { formatWalletAddress } from '../utils/formatWalletAddress';

type Props = {
  post: Post;
  likePost: (idx: number) => void;
  dislikePost: (idx: number) => void;
  deletePost: (idx: number) => void;
  id: number;
};

const PostCard = ({ post, likePost, dislikePost, id, deletePost }: Props) => {
  const { walletAddress } = useAppContext();
  const isAuthor = post.userAddress.toString() === walletAddress;
  const isOnlyContentPost = post.attachment && post.attachment.length <= 0;
  return (
    <Link href={id.toString()}>
      <a className='card break-inside flex-1 bg-accent text-base-100 h-fit my-6'>
        {/* @ts-ignore */}
        {post?.attachment.length > 0 && (
          <img
            src={post.attachment}
            alt={post.attachment}
            className='object-cover'
          />
        )}
        <div className='card-body'>
          <div className='flex items-center justify-between'>
            <h6 className='text-base-200 text-sm py-2 px-6 bg-base-300 w-fit rounded-full'>
              ({formatWalletAddress(post.userAddress.toString())})
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
                    className='h-6 w-6'
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
                  className='dropdown-content menu p-2 shadow-2xl bg-base-300 rounded-box w-52'
                >
                  <li onClick={() => deletePost(id)}>
                    <a className='text-sm'>Delete</a>
                  </li>
                  <li>
                    <a className='text-sm'>Copy Wallet Address</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <p>{post.content}</p>
          <div
            onClick={() => {
              if (!post.liked) likePost(id);
              else dislikePost(id);
            }}
            className={`${
              post.liked ? 'bg-primary-focus text-base-300' : 'bg-base-300'
            }   rounded-full px-6 py-2 w-fit cursor-pointer duration-200 origin-left`}
          >
            <span className='font-bold'>{post.likes}</span> <span>Likes</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default PostCard;
