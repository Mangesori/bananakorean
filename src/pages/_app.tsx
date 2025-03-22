import type { AppProps } from 'next/app';
import { createContext } from 'react';
import '../styles/globals.css';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  signOut: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  // 에러 페이지인 경우 Context Provider를 사용하지 않음
  if (Component.name === 'Error') {
    return <Component {...pageProps} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAuthenticated: false,
        loading: false,
        signOut: () => {},
      }}
    >
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
