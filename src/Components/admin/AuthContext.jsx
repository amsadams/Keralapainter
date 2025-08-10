
// ============================================
// 2. AuthContext.jsx - Session Management
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setSession(session);
          localStorage.setItem('adminSession', JSON.stringify({
            user: session.user,
            session: session,
            loginTime: new Date().toISOString()
          }));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          localStorage.removeItem('adminSession');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      // Check Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session) {
        setUser(session.user);
        setSession(session);
      } else {
        // Check localStorage for session
        const savedSession = localStorage.getItem('adminSession');
        if (savedSession) {
          const { user: savedUser, loginTime } = JSON.parse(savedSession);
          
          // Check if session is still valid (24 hours)
          const sessionAge = new Date() - new Date(loginTime);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            setUser(savedUser);
          } else {
            localStorage.removeItem('adminSession');
          }
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      localStorage.removeItem('adminSession');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Supabase call fails
      setUser(null);
      setSession(null);
      localStorage.removeItem('adminSession');
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
