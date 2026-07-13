"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular"
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={cn(
        "animate-pulse rounded bg-white/10 dark:bg-black/20",
        {
          "h-4 w-full": variant === "text",
          "h-10 w-10 rounded-full": variant === "circular",
          "h-12 w-12 rounded-lg": variant === "rectangular",
        },
        className
      )}
      {...props}
    />
  )
}

export function WeatherCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up space-y-4 p-6 ${className || ''}`}>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-16 w-16" />
        <Skeleton className="h-12 w-24 text-right" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  )
}

export function AirQualityCardSkeleton() {
  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up space-y-4 p-6">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-12 w-12 rounded-full mx-auto" />
      <Skeleton className="h-4 w-20 mx-auto" />
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  )
}

export function ForecastCardSkeleton() {
  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up p-4 text-center space-y-2">
      <Skeleton className="h-4 w-16 mx-auto" />
      <Skeleton className="h-10 w-10 mx-auto" />
      <Skeleton className="h-6 w-16 mx-auto" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up p-6 space-y-4">
      <Skeleton className="h-6 w-24" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up aspect-[4/3]">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      ))}
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl animate-slide-up p-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}