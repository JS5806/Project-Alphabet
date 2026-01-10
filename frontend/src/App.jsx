import React, { useState, useEffect } from 'react';
import { Settings, Maximize2, Info } from 'lucide-react';

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
      {/* Minimal Header Controls */}
      <div className="absolute top-8 right-8 flex space-x-6 opacity-40 hover:opacity-100 transition-opacity">
        <Settings className="text-white cursor-pointer w-5 h-5" />
        <Maximize2 className="text-white cursor-pointer w-5 h-5" />
        <Info className="text-white cursor-pointer w-5 h-5" />
      </div>

      {/* Layout Grid System (WCAG 2.1 Compliant Contrast) */}
      <main className="text-center">
        <p className="text-white/50 text-sm tracking-[0.4em] mb-4 uppercase">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        
        <h1 className="text-[12rem] font-bold text-white tracking-tighter leading-none select-none">
          {formatTime(time)}
        </h1>

        <div className="mt-8 flex justify-center space-x-2">
          <div className="h-1 w-12 bg-white"></div>
          <div className="h-1 w-4 bg-white/20"></div>
          <div className="h-1 w-4 bg-white/20"></div>
        </div>
      </main>

      {/* Design System Metadata Overlay */}
      <footer className="absolute bottom-8 left-8 text-[10px] text-white/20 tracking-widest">
        PHASE 2: UI/UX DARK MODE IDENTITY / #000000 / #FFFFFF
      </footer>
    </div>
  );
}

export default App;