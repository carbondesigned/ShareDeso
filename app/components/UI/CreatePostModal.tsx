import React from 'react';
import { charCount } from '../../utils/charCount';

type Props = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: (content: string) => void;
  attachment: string;
  setAttachment: (attachment: string) => void;
  MAX_CHAR_COUNT: number;
};

const CreatePostModal = ({
  handleSubmit,
  attachment,
  content,
  setAttachment,
  setContent,
  MAX_CHAR_COUNT,
}: Props) => {
  return (
    <div className='modal'>
      <div className='modal-box p-12 bg-base-200 rounded-xl'>
        <div className='flex justify-between items-center w-full'>
          <h2 className='text-2xl font-bold leading-none'>
            Write a quick post
          </h2>

          <label htmlFor='create-modal' className='btn btn-sm btn-circle'>
            ✕
          </label>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col text-left'>
          <div>
            <label className='label' htmlFor='content'>
              <span className='label-text'>Write something</span>
            </label>
            <textarea
              name='content'
              value={content}
              placeholder='Something.'
              className='textarea w-full min-h-[8em] text-md'
              maxLength={MAX_CHAR_COUNT}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className='flex justify-end'>
              {charCount(content) === MAX_CHAR_COUNT ? (
                <span className='text-red-500'>
                  {charCount(content)}/{MAX_CHAR_COUNT}
                </span>
              ) : (
                <span>
                  {charCount(content)}/{MAX_CHAR_COUNT}
                </span>
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
            <div className='tooltip tooltip-bottom' data-tip='Post something!'>
              <button className='btn btn-primary'>Post</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
