
import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { User } from 'lucide-react';

const OnlineUsersList: React.FC = () => {
  const { onlineUsers, currentUsername } = useChat();

  return (
    <div className="w-full lg:w-64 bg-tor-charcoal rounded-lg p-4 h-full">
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <User size={16} className="mr-2" /> Online Users : ({onlineUsers.length})
      </h3>
      
      {onlineUsers.length === 0 ? (
        <p className="text-tor-lightGray text-sm italic">No users online</p>
      ) : (
        <ul className="space-y-2">
          {onlineUsers.map((user) => (
            <li 
              key={user.id} 
              className={`text-sm ${user.username === currentUsername ? 'text-tor-purple font-semibold' : 'text-white'}`}
            >
              {user.username} {user.username === currentUsername ? '(You)' : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnlineUsersList;
