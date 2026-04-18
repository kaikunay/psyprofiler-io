"use client";

import React, { createContext, useContext, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface User {
  $id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map NextAuth session to the User shape the rest of the app expects
  const user: User | null = session?.user
    ? {
        $id: (session.user as any).id || session.user.email || "",
        email: session.user.email || "",
        name: session.user.name || "",
      }
    : null;

  const isLoading = status === "loading";

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  // NextAuth handles session management automatically
  const checkSession = async () => {};

  const logout = async () => {
    await nextAuthSignOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isModalOpen,
        openAuthModal,
        closeAuthModal,
        checkSession,
        logout,
      }}
    >
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
