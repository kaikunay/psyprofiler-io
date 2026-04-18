"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Models } from "appwrite";
import { account } from "@/lib/appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkSession = async () => {
    try {
      const currentAccount = await account.get();
      setUser(currentAccount);
    } catch (error) {
      // User is not logged in / No session active
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const completeLoginAndCheckSession = async () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");
        const secret = urlParams.get("secret");

        if (userId && secret) {
          try {
            // This handles BOTH:
            // 1. OAuth2 token flow (from createOAuth2Token) — Google/GitHub sign-in
            // 2. Magic URL flow (from createMagicURLToken) — email magic link
            // Both return userId + secret params; createSession works for both.
            await account.createSession(userId, secret);
            // Clean the URL without causing a page reload
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            console.error("Session creation from callback failed:", error);
          }
        }
      }
      
      await checkSession();
    };

    completeLoginAndCheckSession();
  }, []);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isModalOpen,
      openAuthModal,
      closeAuthModal,
      checkSession,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
