import { createContext } from 'react';

export interface AuthContextType {
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => void;
}

// 기본값 설정
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  signOut: () => {},
});
