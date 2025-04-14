// src/App.tsx أو main.tsx
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect, ReactNode } from 'react';
import { initialize } from '@/store/darkModeSlice';

type AppProps = {
  children: ReactNode;
};

const ReduxProvider = ({ children }: AppProps) => {
  useEffect(() => {
    store.dispatch(initialize());
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
