"use client"

import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
      },
    },
  })
}

export function useQueryClient() {
  const [queryClient] = useState(makeQueryClient)
  return queryClient
}