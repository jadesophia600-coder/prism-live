import React, { createContext, useContext, useState } from 'react';
import { CREATORS } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    id: "usr-current-101",
    username: "PrismPioneer",
    displayName: "Prism Pioneer",
    email: "pioneer@prismlive.io",
    role: "viewer", // 'viewer' | 'creator' | 'moderator' | 'admin'
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    bio: "Passionate streamer, live coder, and founding community member of PRISM LIVE!",
    isVerified: true,
    memberSince: "September 2026",
    streamKey: "live_sk_prism_pioneer_9a8f7c6b5a4d3e2f",
    rtmpUrl: "rtmp://ingest.prismlive.io/live",
    followedCreatorIds: ["cr-1", "cr-2", "cr-3"],
    subscriptions: ["cr-1"],
    favoriteCategories: ["podcasts", "technology", "music"],
    onboardingCompleted: false,
    twoFactorEnabled: false,
    defaultQuality: "1080p60",
    watchHistory: [
      { id: "s1", title: "[WORLD RECORD] Cyberpunk 2077 Speedrun", creator: "NeonVortex", date: "Yesterday" },
      { id: "s2", title: "Building an AI Code Assistant Live", creator: "Alex CodeCraft", date: "3 days ago" }
    ],
    transactionHistory: [
      { id: "tx-101", type: "Tier 1 Subscription", amount: "$4.99", creator: "NeonVortex", date: "Sep 20, 2026" },
      { id: "tx-102", type: "Cheer Bits Tip", amount: "$10.00", creator: "Aura Synth", date: "Sep 18, 2026" }
    ]
  });

  const [notifications, setNotifications] = useState([
    { id: "n1", type: "stream_live", title: "NeonVortex went live!", message: "Cyberpunk 2077 Speedrun World Record Attempt", time: "10m ago", read: false },
    { id: "n2", type: "new_sub", title: "New Subscriber!", message: "PixelQueen subscribed at Tier 1 ($4.99)", time: "1h ago", read: false },
    { id: "n3", type: "system", title: "Platform Update 2.4", message: "PRISM LIVE HLS player latency optimized to < 1.2s", time: "1d ago", read: true }
  ]);

  const followCreator = (creatorId) => {
    setUser(prev => {
      const followed = prev?.followedCreatorIds || [];
      const exists = followed.includes(creatorId);
      const updated = exists
        ? followed.filter(id => id !== creatorId)
        : [...followed, creatorId];
      return { ...prev, followedCreatorIds: updated };
    });
  };

  const subscribeToCreator = (creatorId) => {
    setUser(prev => {
      const subs = prev?.subscriptions || [];
      if (subs.includes(creatorId)) return prev;
      return { ...prev, subscriptions: [...subs, creatorId] };
    });
  };

  const switchRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
  };

  const upgradeToCreator = () => {
    setUser(prev => ({
      ...prev,
      role: 'creator',
      streamKey: `live_sk_prism_${(prev?.username || 'user').toLowerCase()}_` + Math.random().toString(36).substring(2, 10)
    }));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const registerUser = (profileData) => {
    setUser(prev => ({
      ...prev,
      ...profileData,
      onboardingCompleted: true
    }));
    setIsAuthenticated(true);
  };

  const signInUser = (email, password) => {
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      onboardingCompleted: true
    }));
  };

  const signOutUser = () => {
    setIsAuthenticated(false);
    setUser(prev => ({
      ...prev,
      onboardingCompleted: false
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      registerUser,
      signInUser,
      signOutUser,
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
