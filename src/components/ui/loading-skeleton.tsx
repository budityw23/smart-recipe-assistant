'use client'

import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'circle' | 'image'
  lines?: number
}

export function LoadingSkeleton({ 
  className, 
  variant = 'default', 
  lines = 1 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer'

  const variants = {
    default: 'rounded-md',
    card: 'rounded-lg',
    text: 'rounded h-4',
    circle: 'rounded-full',
    image: 'rounded-lg aspect-video',
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variants.text,
              index === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
    />
  )
}

export function RecipeCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Image skeleton */}
      <LoadingSkeleton variant="image" className="h-48" />
      
      <div className="p-6 space-y-4">
        {/* Title */}
        <LoadingSkeleton variant="text" className="h-6 w-3/4" />
        
        {/* Description */}
        <LoadingSkeleton variant="text" lines={2} />
        
        {/* Metrics */}
        <div className="flex gap-4">
          <LoadingSkeleton variant="text" className="h-4 w-16" />
          <LoadingSkeleton variant="text" className="h-4 w-20" />
          <LoadingSkeleton variant="text" className="h-4 w-14" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2">
          <LoadingSkeleton variant="default" className="h-6 w-16 rounded-full" />
          <LoadingSkeleton variant="default" className="h-6 w-20 rounded-full" />
          <LoadingSkeleton variant="default" className="h-6 w-14 rounded-full" />
        </div>
        
        {/* Button */}
        <LoadingSkeleton variant="default" className="h-10 w-full" />
      </div>
    </div>
  )
}

export function IngredientInputSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 bg-card">
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="h-6 w-48" />
        <LoadingSkeleton variant="text" lines={2} />
      </div>
      
      <div className="flex gap-2">
        <LoadingSkeleton variant="default" className="h-10 flex-1" />
        <LoadingSkeleton variant="default" className="h-10 w-10" />
      </div>
      
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="h-4 w-32" />
        <div className="flex flex-wrap gap-2">
          <LoadingSkeleton variant="default" className="h-8 w-20 rounded-full" />
          <LoadingSkeleton variant="default" className="h-8 w-24 rounded-full" />
          <LoadingSkeleton variant="default" className="h-8 w-16 rounded-full" />
        </div>
      </div>
      
      <LoadingSkeleton variant="default" className="h-12 w-full" />
    </div>
  )
}

export function NutritionSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-6 bg-card">
      <LoadingSkeleton variant="text" className="h-6 w-40" />
      
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-4 rounded-lg border space-y-2">
            <LoadingSkeleton variant="text" className="h-4 w-16" />
            <LoadingSkeleton variant="text" className="h-8 w-12" />
            <LoadingSkeleton variant="default" className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}