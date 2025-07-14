import { Provider } from '@/types';
import { providers } from './providers';

// Mock data for recently visited providers
// In a real app, this would be tracked and stored in the user's profile
export const recentlyVisited: Provider[] = [
  providers[2], // Polished Nails
  providers[0], // Modern Cuts
];