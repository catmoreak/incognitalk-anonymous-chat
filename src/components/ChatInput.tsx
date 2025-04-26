
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, currentUsername } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    await sendMessage(message);
    setMessage('');
  };

  return (
    <div className="p-4 bg-blue-900/80 backdrop-blur-sm border-t border-blue-800">
      <div className="text-xs text-blue-300 mb-2 text-right">
        Sending as: <span className="font-semibold text-white">{currentUsername}</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a secure message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-blue-950/50 border border-blue-800 text-white placeholder-blue-400 focus-visible:ring-blue-600"
        />
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send size={18} className="mr-1" /> Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
