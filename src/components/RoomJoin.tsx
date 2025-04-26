import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck } from 'lucide-react';

const RoomJoin: React.FC = () => {
  const [roomInput, setRoomInput] = useState('');
  const { joinRoom, createRoom } = useChat();
  const { toast } = useToast();

  const validateRoomCode = (code: string): boolean => {
    if (code.length !== 5) {
      toast({
        title: "Invalid Room Code",
        description: "Room code must be exactly 5 digits.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!/^\d+$/.test(code)) {
      toast({
        title: "Invalid Room Code",
        description: "Room code must contain only digits.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleJoinRoom = async () => {
    if (!validateRoomCode(roomInput)) return;
    await joinRoom(roomInput);
  };

  const handleCreateRoom = async () => {
    if (!validateRoomCode(roomInput)) return;
    await createRoom(roomInput);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-900">
      <div className="w-full max-w-md p-6 bg-blue-950 rounded-lg shadow-lg animate-fade-in">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="h-16 w-16 text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">IncogniTalk</h2>
        <p className="text-blue-200 mb-6 text-center">
          Enter a 5-digit room code to join or create a new room
        </p>
        
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter 5-digit room code"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value.slice(0, 5))}
            className="bg-blue-800 border border-blue-700 text-white focus-visible:ring-blue-500"
            maxLength={5}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleJoinRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Join Room
            </Button>
            
            <Button 
              onClick={handleCreateRoom}
              variant="outline"
              className="border-blue-500 text-blue-300 hover:bg-blue-700 hover:text-white"
            >
              Create Room
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-center text-blue-300">
          <p><strong>"Anonymous Chats, Real Connections 🔒💬"</strong></p>
          {/* <p className="mt-2">© 2025 IncogniTalk • Anonymous Chatting</p> */}
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;
