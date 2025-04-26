
import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3.33; // Roughly 30 steps in 3 seconds
      });
    }, 100);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-900 animate-fade-in">
      <ShieldCheck className="h-20 w-20 text-blue-300 mb-6 animate-pulse" />
      <h2 className="text-2xl font-bold text-white mb-6">IncogniTalk</h2>
      <div className="w-64 mb-4">
        <Progress value={progress} className="h-2 bg-blue-800" />
      </div>
      <p className="text-blue-200">Establishing  connection with the Server..</p>
    </div>
  );
};

export default LoadingScreen;
