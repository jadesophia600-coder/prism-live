import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

const LOCAL_STORAGE_KEY = 'prismlive_user_session_v3';

const INITIAL_GUEST_USER = {
  id: "",
  username: "",
  displayName: "",
  email: "",
  role: "viewer", // 'viewer' | 'creator' | 'moderator' | 'admin'
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  banner: "",
  bio: "",
  isVerified: false,
  memberSince: "September 2026",
  streamKey: "",
  rtmpUrl: "rtmp://ingest.prismlive.io/live",
  followedCreatorIds: [],
  subscriptions: [],
  favoriteCategories: [],
  onboardingCompleted: false,
  twoFactorEnabled: false,
  defaultQuality: "1080p60",
  watchHistory: [],
  transactionHistory: []
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_GUEST_USER;
    } catch {
      return INITIAL_GUEST_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(user && user.email && user.onboardingCompleted);
  });

  const [notifications, setNotifications] = useState([]);

  // Persist user session to localStorage
  useEffect(() => {
    try {
      if (user && user.onboardingCompleted) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
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
      id: prev.id || `usr-${Date.now()}`,
      streamKey: `live_sk_prism_${(profileData.username || 'user').toLowerCase()}_` + Math.random().toString(36).substring(2, 8),
      onboardingCompleted: true
    }));
    setIsAuthenticated(true);
  };

  const signInUser = async (email, password) => {
    try {
      if (email && password) {
        const { data } = await supabase.auth.signInWithPassword({ email, password });
        if (data?.user) {
          setUser(prev => ({
            ...prev,
            id: data.user.id,
            email: data.user.email,
            displayName: data.user.user_metadata?.display_name || email.split('@')[0],
            username: data.user.user_metadata?.username || email.split('@')[0],
            avatar: data.user.user_metadata?.avatar_url || prev.avatar,
            onboardingCompleted: true
          }));
        }
      }
    } catch (e) {
      console.warn("Supabase auth sign in fallback:", e);
    }

    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      email: email || prev.email || "user@prismlive.io",
      displayName: prev.displayName || email?.split('@')[0] || "User",
      username: prev.username || email?.split('@')[0] || "user",
      onboardingCompleted: true
    }));
  };

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase auth sign out:", e);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(INITIAL_GUEST_USER);
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
