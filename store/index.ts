import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createAuthSlice } from './slices/auth.slice'
import { AuthStore } from '@/types/auth.types'

// Combine all slices
type StoreState = AuthStore

export const useStore = create<StoreState>()(
  devtools(
    persist(
      immer((...args) => ({
        ...createAuthSlice(...args),
      })),
      {
        name: 'fanconnect-storage',
        partialize: (state) => ({
          // Only persist specific fields
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'FanConnect Store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

// Hydration handling for SSR
export const useHydration = () => {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}

import React from 'react'
