import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';

import ScrollToBottomButton from './ScrollToBottomButton';
import ChatTitle from './ChatTitle';
import Message from './Message';
import NewMessageButton from './Message/NewMessageButton';
import CrossIcon from '@icon/CrossIcon';
import Introduce from './Introduce';
import useSubmit from '@hooks/useSubmit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ChatContent = () => {
  const inputRole = useStore((state) => state.inputRole);
  const setError = useStore((state) => state.setError);
  const { error, handleSubmit, insertMessage } = useSubmit();
  const messages = useStore((state) =>
    state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const stickyIndex = useStore((state) =>
    state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const advancedMode = useStore((state) => state.advancedMode);
  const generating = useStore.getState().generating;
  const hideSideMenu = useStore((state) => state.hideSideMenu);

  const saveRef = useRef<HTMLDivElement>(null);

  // clear error at the start of generating new messages
  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true
      });
    }
  }, [error])


  return (
    <div className='h-screen m-2 mt-0 bg-white rounded-md flex-1 flex flex-col justify-between overflow-hidden'>
      <ScrollToBottom
        className='flex-1 dark:bg-gray-800 overflow-hidden'
        followButtonClassName='hidden'
      >
        <ScrollToBottomButton />
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <div
            className='flex flex-col items-center text-sm dark:bg-gray-800 w-full' ref={saveRef}
          >

            {!generating && advancedMode && messages?.length === 0 && (
              <NewMessageButton messageIndex={-1} />
            )}
            {!messages?.length && (
              <Introduce onClickDefaultQuestion={async (q: string) => {
                await insertMessage(q)
                handleSubmit(['auto'])
              }} />
            )}
            {messages?.map((message, index) => (
              <React.Fragment key={index}>
                <Message
                  role={message.role}
                  content={message.content}
                  messageIndex={index}
                />
                {!generating && advancedMode && <NewMessageButton messageIndex={index} />}
              </React.Fragment>
            ))}
          </div>

        </div>
      </ScrollToBottom>
      <div className='shrink-0 justify-self-end'>
        <Message
          role={inputRole}
          content=''
          messageIndex={stickyIndex}
          sticky
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatContent;
