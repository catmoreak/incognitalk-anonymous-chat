
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useChat } from '@/contexts/ChatContext';
import { Info, Copy, Users, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ChatHeader: React.FC = () => {
  const { roomCode, onlineUsers, leaveRoom, isCreator, moderationEnabled, toggleModeration, isModerationLoading } = useChat();
  const { toast } = useToast();

  const copyRoomCode = () => {
    navigator.clipboard.writeText("🔐 You can access the room code "+roomCode+" in IncogniTalk.\n💬 Join the chat here: chat.sujnan.info \n https://incognitalk-anonymous-chat.vercel.app/");

    toast({
      title: "Room Code Copied! 📌",
      
      className: "bg-blue-800 text-white border-blue-700"
    });
  };

  return (
    <div className="flex justify-between items-center bg-blue-900/80 backdrop-blur-sm p-4 border-b border-blue-800">
      <div className="flex items-center space-x-3">
        <ShieldCheck className="h-6 w-6 text-blue-400" strokeWidth={2.5} />
        <h2 className="text-xl font-bold text-white tracking-tight">IncogniTalk</h2>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-blue-300 hover:bg-blue-800/50">
              <Info size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-blue-900 border-blue-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>⚠️ Important Notice</AlertDialogTitle>
              <AlertDialogDescription className="text-blue-300">
              Please do not share sensitive information such as your phone number, physical address, debit/credit card details, or any other personal data.
              For any queries or assistance, feel free to contact us at sujnanpc@gmail.com
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-blue-600 hover:bg-blue-700">
                Understood
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-blue-950/50 px-3 py-2 rounded-md flex items-center">
          <span className="text-sm mr-2 text-blue-200">Room: {roomCode}</span>
          <button 
            onClick={copyRoomCode}
            className="text-blue-400 hover:text-blue-200 transition-colors"
          >
            <Copy size={16} />
          </button>
        </div>
        
        <div className="flex items-center text-blue-300">
          <Users size={16} className="mr-1" />
          <span className="text-sm">{onlineUsers.length}</span>
        </div>
        
        {isCreator && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleModeration}
            disabled={isModerationLoading}
            className={moderationEnabled 
              ? "bg-blue-600/50 text-white border-blue-500" 
              : "bg-transparent text-blue-300 border-blue-700"}
          >
            {moderationEnabled ? "Moderation: ON" : "Moderation: OFF"}
          </Button>
        )}
        
        <Button 
          variant="destructive" 
          size="sm" 
          className="bg-red-600/80 hover:bg-red-700/90"
          onClick={leaveRoom}
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
