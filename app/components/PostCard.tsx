import React from 'react';
import { Post } from '../types';
import { formatWalletAddress } from '../utils/formatWalletAddress';

type Props = {
  post: Post;
  likePost: (idx: number) => void;
  dislikePost: (idx: number) => void;
  id: number;
};

const PostCard = ({ post, likePost, dislikePost, id }: Props) => {
  return (
    <div className='card flex-1 bg-base-200 text-primary-content'>
      <figure>
        <img src={post.attachment} alt={post.attachment} />
      </figure>
      <div className='card-body'>
        <h6 className='text-slate-600'>
          ({formatWalletAddress(post.userAddress.toString())})
        </h6>
        <p>{post.content}</p>
        <div
          onClick={() => {
            if (!post.liked) likePost(id);
            else dislikePost(id);
          }}
          className={`${
            post.liked ? 'bg-primary-focus' : 'bg-slate-600'
          }   grid place-items-center rounded-full px-4 py-2 w-fit cursor-pointer`}
        >
          <span className='font-bold'>{post.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
