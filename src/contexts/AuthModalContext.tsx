'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'login' | 'signup' | null;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | null>(null);

  const openLoginModal = () => {
    setMode('login');
    setIsOpen(true);
  };

  const openSignUpModal = () => {
    setMode('signup');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMode(null);
  };

  const value: AuthModalContextType = {
    isOpen,
    mode,
    openLoginModal,
    openSignUpModal,
    closeModal,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};
