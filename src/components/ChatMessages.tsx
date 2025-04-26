
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';

const ChatMessages: React.FC = () => {
  const { messages, currentUsername } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-blue-950/90 backdrop-blur-sm">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-blue-400 italic">Waiting for messages. Start the conversation securely!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => {
            const isSystem = message.username === 'System';
            const isSelf = message.username === currentUsername;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'} ${isSystem ? 'justify-center' : ''}`}
              >
                <div className={`
                  max-w-[80%] px-4 py-2 rounded-xl shadow-md
                  ${isSystem ? 'bg-blue-800/50 text-blue-300 text-center text-sm italic' : ''}
                  ${!isSystem && isSelf ? 'bg-blue-700 text-white' : ''}
                  ${!isSystem && !isSelf ? 'bg-blue-800 text-white' : ''}
                `}>
                  {!isSystem && (
                    <div className={`text-xs opacity-70 mb-1 ${isSelf ? 'text-right' : 'text-left'}`}>
                      {message.username}
                    </div>
                  )}
                  <div>{message.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
