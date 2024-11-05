import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقائق
      cacheTime: 1000 * 60 * 10, // 10 دقائق
    },
  },
});

export default queryClient;
