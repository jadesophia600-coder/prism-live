import React, { createContext, useContext, useState } from 'react';
import { CREATORS } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: "usr-current-101",
    username: "PrismPioneer",
    displayName: "Prism Pioneer",
    email: "pioneer@prismlive.io",
    role: "creator", // 'viewer' | 'creator' | 'moderator' | 'admin'
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    bio: "Passionate gamer, live coder, and founding community member of PRISM LIVE!",
    isVerified: true,
    streamKey: "live_sk_prism_pioneer_9a8f7c6b5a4d3e2f",
    rtmpUrl: "rtmp://ingest.prismlive.io/live",
    followedCreatorIds: ["cr-1", "cr-2", "cr-3"],
    subscriptions: ["cr-1"]
  });

  const [notifications, setNotifications] = useState([
    { id: "n1", type: "stream_live", title: "NeonVortex went live!", message: "Cyberpunk 2077 Speedrun World Record Attempt", time: "10m ago", read: false },
    { id: "n2", type: "new_sub", title: "New Subscriber!", message: "PixelQueen subscribed at Tier 1 ($4.99)", time: "1h ago", read: false },
    { id: "n3", type: "system", title: "Platform Update 2.4", message: "PRISM LIVE HLS player latency optimized to < 1.2s", time: "1d ago", read: true }
  ]);

  const followCreator = (creatorId) => {
    setUser(prev => {
      const exists = prev.followedCreatorIds.includes(creatorId);
      const updated = exists
        ? prev.followedCreatorIds.filter(id => id !== creatorId)
        : [...prev.followedCreatorIds, creatorId];
      return { ...prev, followedCreatorIds: updated };
    });
  };

  const subscribeToCreator = (creatorId) => {
    setUser(prev => {
      if (prev.subscriptions.includes(creatorId)) return prev;
      return { ...prev, subscriptions: [...prev.subscriptions, creatorId] };
    });
  };

  const switchRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
  };

  const upgradeToCreator = () => {
    setUser(prev => ({
      ...prev,
      role: 'creator',
      streamKey: `live_sk_prism_${prev.username.toLowerCase()}_` + Math.random().toString(36).substring(2, 10)
    }));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      followCreator,
      subscribeToCreator,
      switchRole,
      upgradeToCreator,
      notifications,
      markNotificationAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
