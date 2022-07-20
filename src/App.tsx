import React, { useState, Dispatch, SetStateAction, useMemo } from 'react';

import Login from './pages/Login';
import Chat from './pages/Chat';

import styles from './common/styles/App.module.scss';

export type User = {
  username: string;
  token: string;
};

type UserContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>> | null;
};

type ErrorContext = {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>> | null;
};

export const UserContext = React.createContext<UserContext>({
  user: null,
  setUser: null,
});

export const ErrorContext = React.createContext<ErrorContext>({
  error: null,
  setError: null,
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userContextValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const errorContextValue = useMemo(() => ({ error, setError }), [
    error,
    setError,
  ]);

  return (
    <UserContext.Provider value={userContextValue}>
      <ErrorContext.Provider value={errorContextValue}>
        <div className={styles.container}>
          <div className={styles['inner-container']}>
            {/*
          For this simple scenario, basic if block will do.
          When page count grows and url navigation support becomes
          necessary - react-router or some similar navigation solution
          should be introduced.
        */}
            {(!user && <Login />) || <Chat />}
          </div>
        </div>
      </ErrorContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
