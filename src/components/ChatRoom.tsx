
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatRoom: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-blue-950/95 backdrop-blur-sm">
      <div className="flex-1 flex flex-col overflow-hidden shadow-2xl rounded-xl border border-blue-900/50">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatRoom;
