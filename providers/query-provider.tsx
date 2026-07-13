"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useQueryClient } from "@/lib/query-client"
import { ReactNode } from "react"

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}