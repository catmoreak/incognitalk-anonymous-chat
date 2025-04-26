
import React, { useState } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import { useChat } from '@/contexts/ChatContext';
import RoomJoin from '@/components/RoomJoin';
import ChatRoom from '@/components/ChatRoom';
import LoadingScreen from '@/components/LoadingScreen';

const ChatApp: React.FC = () => {
  const { roomCode } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  
  // This effect runs when roomCode changes from empty to a value
  React.useEffect(() => {
    if (roomCode) {
      setIsLoading(true);
    }
  }, [roomCode]);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  return (
    <div className="min-h-screen bg-blue-950">
      {roomCode ? <ChatRoom /> : <RoomJoin />}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default Index;
