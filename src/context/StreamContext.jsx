import React, { createContext, useContext, useState } from 'react';
import { LIVE_STREAMS } from '../data/mockData';

const StreamContext = createContext();

export function StreamProvider({ children }) {
  const [activeStream, setActiveStream] = useState(LIVE_STREAMS[0]);
  const [theaterMode, setTheaterMode] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [reactions, setReactions] = useState([]);

  const triggerReaction = (emoji) => {
    const id = Date.now() + Math.random();
    const xPos = Math.floor(Math.random() * 70) + 15; // 15% to 85% width
    setReactions(prev => [...prev, { id, emoji, xPos }]);

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2200);
  };

  return (
    <StreamContext.Provider value={{
      activeStream,
      setActiveStream,
      theaterMode,
      setTheaterMode,
      activeCategorySlug,
      setActiveCategorySlug,
      reactions,
      triggerReaction
    }}>
      {children}
    </StreamContext.Provider>
  );
}

export function useStream() {
  return useContext(StreamContext);
}
