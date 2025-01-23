import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserProfile, AuthState } from '../types/auth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setState({
        isAuthenticated: true,
        user: data as UserProfile,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setState(s => ({ ...s, isLoading: true }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setState(s => ({ ...s, isLoading: true }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    ...state,
    error,
    signIn,
    signUp,
    signOut,
  };
}