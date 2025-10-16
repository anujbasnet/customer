import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();
const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;
const API_BASE_URL = `https://${BASE_URL}`;


export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${API_BASE_URL}/api/trpc`,
      transformer: superjson,
      fetch: (url, options) => {
        // Create timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        })
        .then((response) => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.warn('tRPC request failed:', error.message);
          throw error;
        });
      },
    }),
  ],
});