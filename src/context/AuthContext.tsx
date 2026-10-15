import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { checkIsAdmin, bootstrapFirstAdmin } from '../lib/dbService';
import { AdminProfile } from '../types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  adminProfile: AdminProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  claimFirstAdmin: (adminName: string) => Promise<{ success: boolean; message: string }>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyUserAdminStatus = async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      setAdminProfile(null);
      return;
    }

    try {
      const admin = await checkIsAdmin(currentUser.id);
      setIsAdmin(admin);

      if (admin) {
        const { data } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (data) {
          setAdminProfile(data as AdminProfile);
        }
      } else {
        setAdminProfile(null);
      }
    } catch (err) {
      console.error('Error verifying admin status:', err);
      setIsAdmin(false);
      setAdminProfile(null);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        verifyUserAdminStatus(initialSession.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await verifyUserAdminStatus(newSession.user);
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'لم يتم ربط قاعدة بيانات Supabase بعد في ملف .env' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const admin = await checkIsAdmin(data.user.id);
        if (!admin) {
          // User authenticated, but is not an authorized administrator
          return {
            success: false,
            error: 'هذا الحساب غير مسجل كمسؤول معتمد في لوحة تحكم Connectors Team.',
          };
        }
        setIsAdmin(true);
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'فشل تسجيل الدخول',
      };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAdminProfile(null);
  };

  const claimFirstAdmin = async (adminName: string) => {
    const res = await bootstrapFirstAdmin(adminName);
    if (res.success && user) {
      await verifyUserAdminStatus(user);
    }
    return res;
  };

  const refreshAdminStatus = async () => {
    if (user) {
      await verifyUserAdminStatus(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        adminProfile,
        isLoading,
        signIn,
        signOut,
        claimFirstAdmin,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
