import { devMode } from '../env';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'backend';

const backendServer = devMode ? 'http://localhost:3000' : '';

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${backendServer}/api`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: devMode ? 'include' : 'same-origin'
        });
      }
    })
  ]
});
