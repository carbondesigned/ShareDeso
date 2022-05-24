import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
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
  const { postErrors } = useAppContext();
  return (
    <label
      htmlFor='create-modal'
      className='modal modal-bottom sm:modal-middle'
    >
      <label
        htmlFor='create-modal'
        className='modal-box w-11/12 max-w-5xl p-12 bg-accent text-base-200 rounded-xl'
      >
        <div className='flex justify-between items-center w-full'>
          <h2 className='text-4xl font-bold leading-none'>
            Write a quick post
          </h2>
          <label
            htmlFor='create-modal'
            className='btn bg-base-300 btn-sm btn-circle border-0'
          >
            ✕
          </label>
        </div>
        <form onSubmit={handleSubmit} className='flex mt-12 flex-col text-left'>
          <div>
            <label className='label' htmlFor='content'>
              <span className='label-text text-base-200'>Write something</span>
            </label>
            <textarea
              name='content'
              value={content}
              placeholder='Something.'
              className='textarea w-full min-h-[8em] text-md bg-base-300 placeholder:text-base-200'
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
              <span className='label-text text-base-200'>Attachments</span>
            </label>
            <label className='input-group'>
              <span className='bg-accent border-4 border-base-300'>
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
                className='input w-full input-bordered bg-base-300 placeholder:text-base-200'
              />
            </label>
            <p className='text-xs mt-2 text-base-200'>
              Find something cool at{' '}
              <a className='underline' href='https://giphy.com/'>
                https://giphy.com/
              </a>{' '}
              or{' '}
              <a className='underline' href='https://unsplash.com/'>
                https://unsplash.com/
              </a>
            </p>
          </div>
          <div
            className={`${
              postErrors.length > 0 ? 'justify-between' : 'justify-end'
            } modal-action w-full mt-12 flex `}
          >
            {postErrors.length > 0 && (
              <div className='text-red-500 text-sm'>
                {postErrors.map((error: string, idx: number) => (
                  <p key={idx}>{error}</p>
                ))}
              </div>
            )}
            <div className='tooltip tooltip-bottom' data-tip='Post something!'>
              <button className='btn btn-primary'>Post</button>
            </div>
          </div>
        </form>
      </label>
    </label>
  );
};

export default CreatePostModal;
