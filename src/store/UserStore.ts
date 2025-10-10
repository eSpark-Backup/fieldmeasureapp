import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Role } from '../types/navigationParams';

export interface User {
  email: string;
  role: Role;
}

interface UserStoreTypes {
  user: User | null;
  saveUser: (userInfo: User) => void;
  setHasHydrated: (v: boolean) => void;
  hasHydrated: boolean;
}

export const useUserStore = create<UserStoreTypes>()(
  persist(
    set => ({
      user: null,
      hasHydrated: false,
      saveUser: (userInfo: User) => set(() => ({ user: userInfo })),
      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Hydration error', error);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
