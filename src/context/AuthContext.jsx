import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CREATORS } from '../data/mockData';

const AuthContext = createContext();

const LOCAL_STORAGE_KEY = 'prismlive_user_session_v2';

const DEFAULT_USER = {
  id: "usr-live-101",
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
  onboardingCompleted: true,
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
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: "n1", type: "stream_live", title: "NeonVortex went live!", message: "Cyberpunk 2077 Speedrun World Record Attempt", time: "10m ago", read: false },
    { id: "n2", type: "new_sub", title: "New Subscriber!", message: "PixelQueen subscribed at Tier 1 ($4.99)", time: "1h ago", read: false },
    { id: "n3", type: "system", title: "Platform Update 2.5", message: "PRISM LIVE Ultra-Low Latency engine active!", time: "1d ago", read: true }
  ]);

  // Persist user session to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.warn("Could not save user session:", e);
    }
  }, [user]);

  // Supabase Auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email,
            displayName: profile.display_name || prev.displayName,
            username: profile.username || prev.username,
            avatar: profile.avatar_url || prev.avatar,
            role: profile.role || prev.role,
            bio: profile.bio || prev.bio,
            onboardingCompleted: true
          }));
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

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

  const registerUser = async (profileData) => {
    try {
      if (profileData.email && profileData.password) {
        await supabase.auth.signUp({
          email: profileData.email,
          password: profileData.password,
          options: {
            data: {
              display_name: profileData.displayName,
              username: profileData.username,
              avatar_url: profileData.avatar
            }
          }
        });
      }
    } catch (e) {
      console.warn("Supabase auth registration fallback:", e);
    }

    setUser(prev => ({
      ...prev,
      ...profileData,
      onboardingCompleted: true
    }));
    setIsAuthenticated(true);
  };

  const signInUser = async (email, password) => {
    try {
      if (email && password) {
        await supabase.auth.signInWithPassword({ email, password });
      }
    } catch (e) {
      console.warn("Supabase auth sign in fallback:", e);
    }

    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      email: email || prev.email,
      onboardingCompleted: true
    }));
  };

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase auth sign out:", e);
    }
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
