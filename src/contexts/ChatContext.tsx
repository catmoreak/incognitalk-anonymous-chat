import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ref, onValue, off, push, set, update, get, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { generateUsername } from '@/lib/usernameGenerator';
import { moderateContent } from '@/lib/contentModeration';
import { useToast } from "@/components/ui/use-toast";

interface ChatContextProps {
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  onlineUsers: OnlineUser[];
  currentUsername: string;
  sendMessage: (text: string) => Promise<void>;
  joinRoom: (roomCode: string) => Promise<boolean>;
  createRoom: (roomCode: string) => Promise<boolean>;
  leaveRoom: () => void;
  isCreator: boolean;
  moderationEnabled: boolean;
  toggleModeration: () => Promise<void>;
  isModerationLoading: boolean;
}

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
}

interface OnlineUser {
  id: string;
  username: string;
  lastActive: number;
}

interface Room {
  creator: string;
  createdAt: number;
  moderationEnabled: boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>(generateUsername());
  const [userId] = useState<string>(`user_${Date.now()}_${Math.floor(Math.random() * 10000)}`);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [moderationEnabled, setModerationEnabled] = useState<boolean>(false);
  const [isModerationLoading, setIsModerationLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Change username every 10 seconds
  useEffect(() => {
    const usernameInterval = setInterval(() => {
      const newUsername = generateUsername();
      setCurrentUsername(newUsername);
      
      // Update username in online users if in a room
      if (roomCode) {
        const userRef = ref(database, `rooms/${roomCode}/users/${userId}`);
        update(userRef, { username: newUsername, lastActive: Date.now() });
      }
    }, 10000);

    return () => clearInterval(usernameInterval);
  }, [roomCode, userId]);

  // Keep user presence updated
  useEffect(() => {
    if (!roomCode || !userId) return;

    const userRef = ref(database, `rooms/${roomCode}/users/${userId}`);
    const presenceInterval = setInterval(() => {
      update(userRef, { lastActive: Date.now() });
    }, 5000);

    return () => {
      clearInterval(presenceInterval);
    };
  }, [roomCode, userId]);

  // Setup listeners for current room
  useEffect(() => {
    if (!roomCode) {
      setMessages([]);
      setOnlineUsers([]);
      setIsCreator(false);
      setModerationEnabled(false);
      return;
    }

    // Listen to messages
    const messagesRef = ref(database, `rooms/${roomCode}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      
      const messageList: Message[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })).sort((a, b) => a.timestamp - b.timestamp);
      
      setMessages(messageList);
    });

    // Listen to online users
    const usersRef = ref(database, `rooms/${roomCode}/users`);
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      
      const now = Date.now();
      const activeTimeout = 15000; // 15 seconds timeout for "active" status
      
      const userList: OnlineUser[] = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key]
        }))
        .filter((user) => now - user.lastActive < activeTimeout);
      
      setOnlineUsers(userList);
    });

    // Get room info (for creator status and moderation settings)
    const roomInfoRef = ref(database, `rooms/${roomCode}/info`);
    onValue(roomInfoRef, (snapshot) => {
      const data = snapshot.val() as Room | null;
      if (!data) return;
      
      setIsCreator(data.creator === userId);
      setModerationEnabled(data.moderationEnabled || false);
    });

    return () => {
      off(messagesRef);
      off(usersRef);
      off(roomInfoRef);
    };
  }, [roomCode, userId]);

  // Handle room cleanup for inactive rooms
  useEffect(() => {
    if (!roomCode) return;

    // Check and cleanup online users every minute
    const cleanupInterval = setInterval(async () => {
      const usersRef = ref(database, `rooms/${roomCode}/users`);
      const snapshot = await get(usersRef);
      const data = snapshot.val();
      
      if (!data) return;
      
      const now = Date.now();
      const inactiveTimeout = 60000; // 1 minute timeout for cleanup
      
      let hasActiveUsers = false;
      
      Object.keys(data).forEach((key) => {
        const user = data[key];
        if (now - user.lastActive < inactiveTimeout) {
          hasActiveUsers = true;
        } else {
          // Remove inactive user
          remove(ref(database, `rooms/${roomCode}/users/${key}`));
        }
      });
      
      // If no active users and not the creator, leave the room
      if (!hasActiveUsers && !isCreator) {
        leaveRoom();
      }
    }, 60000); // Run every minute

    return () => clearInterval(cleanupInterval);
  }, [roomCode, isCreator]);

  const createRoom = async (code: string): Promise<boolean> => {
    if (code.length !== 5 || !/^\d+$/.test(code)) {
      toast({
        title: "Invalid Room Code",
        description: "Room code must be exactly 5 digits.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if room already exists
      const roomRef = ref(database, `rooms/${code}`);
      const snapshot = await get(roomRef);
      
      if (snapshot.exists()) {
        toast({
          title: "Room Already Exists",
          description: "Please try a different room code.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create new room
      const roomInfo: Room = {
        creator: userId,
        createdAt: Date.now(),
        moderationEnabled: false
      };
      
      await set(ref(database, `rooms/${code}/info`), roomInfo);
      
      // Add current user to the room
      await set(ref(database, `rooms/${code}/users/${userId}`), {
        username: currentUsername,
        lastActive: Date.now()
      });
      
      // Add welcome message
      await push(ref(database, `rooms/${code}/messages`), {
        text: "Welcome to your new room! Share the code to invite others.",
        username: "System",
        timestamp: Date.now()
      });
      
      setRoomCode(code);
      setIsCreator(true);
      
      toast({
        title: "Room Created",
        description: `You've created room ${code}. Share this code with others to invite them.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error Creating Room",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  const joinRoom = async (code: string): Promise<boolean> => {
    if (code.length !== 5 || !/^\d+$/.test(code)) {
      toast({
        title: "Invalid Room Code",
        description: "Room code must be exactly 5 digits.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if room exists
      const roomRef = ref(database, `rooms/${code}/info`);
      const snapshot = await get(roomRef);
      
      if (!snapshot.exists()) {
        toast({
          title: "Room Not Found",
          description: "Please check the room code and try again.",
          variant: "destructive"
        });
        return false;
      }
      
      // Join the room
      await set(ref(database, `rooms/${code}/users/${userId}`), {
        username: currentUsername,
        lastActive: Date.now()
      });
      
      setRoomCode(code);
      
      // Get room info (for creator status)
      const roomData = snapshot.val() as Room;
      setIsCreator(roomData.creator === userId);
      setModerationEnabled(roomData.moderationEnabled || false);
      
      toast({
        title: "Room Joined",
        description: `You've joined room ${code}.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Error Joining Room",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  const leaveRoom = () => {
    if (!roomCode) return;
    
    // Remove user from room
    const userRef = ref(database, `rooms/${roomCode}/users/${userId}`);
    remove(userRef);
    
    setRoomCode('');
    setMessages([]);
    setOnlineUsers([]);
    setIsCreator(false);
    setModerationEnabled(false);
    
    toast({
      title: "Left Room",
      description: "You've left the chat room.",
    });
  };

  const sendMessage = async (text: string): Promise<void> => {
    if (!roomCode || !text.trim()) return;
    
    try {
      // Check moderation if enabled
      if (moderationEnabled) {
        const isAppropriate = await moderateContent(text);
        if (!isAppropriate) {
          toast({
            title: "Message Blocked",
            description: "Your message was flagged by content moderation.",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Send message
      await push(ref(database, `rooms/${roomCode}/messages`), {
        text,
        username: currentUsername,
        timestamp: Date.now()
      });
      
      // Update last active time
      const userRef = ref(database, `rooms/${roomCode}/users/${userId}`);
      await update(userRef, { lastActive: Date.now() });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const toggleModeration = async (): Promise<void> => {
    if (!roomCode || !isCreator) return;
    
    try {
      setIsModerationLoading(true);
      const newModerationState = !moderationEnabled;
      
      // Update room moderation setting
      await update(ref(database, `rooms/${roomCode}/info`), {
        moderationEnabled: newModerationState
      });
      
      setModerationEnabled(newModerationState);
      
      toast({
        title: "Content Moderation Updated",
        description: newModerationState 
          ? "Content moderation is now enabled."
          : "Content moderation is now disabled."
      });
    } catch (error) {
      console.error("Error toggling moderation:", error);
      toast({
        title: "Error Updating Moderation",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsModerationLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      roomCode,
      setRoomCode,
      messages,
      onlineUsers,
      currentUsername,
      sendMessage,
      joinRoom,
      createRoom,
      leaveRoom,
      isCreator,
      moderationEnabled,
      toggleModeration,
      isModerationLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
