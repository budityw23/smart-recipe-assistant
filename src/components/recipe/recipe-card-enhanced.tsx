'use client'

import { Clock, Users, ChefHat, Star, ImageIcon, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Recipe } from '@/types/recipe'
import { getDietaryOption } from '@/_data/dietary-options'
import { cn } from '@/lib/utils'

interface RecipeCardEnhancedProps {
  recipe: Recipe
  onViewDetails: (recipe: Recipe) => void
  onToggleFavorite?: (recipe: Recipe) => void
  isFavorite?: boolean
  className?: string
}

const DIFFICULTY_CONFIG = {
  'Easy': { 
    color: 'text-green-600', 
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    icon: '😊'
  },
  'Medium': { 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    icon: '🤔'
  },
  'Hard': { 
    color: 'text-red-600', 
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    icon: '🔥'
  },
} as const

// Generate a placeholder gradient based on recipe name
const getRecipeGradient = (recipeName: string) => {
  const colors = [
    'from-rose-400 to-pink-400',
    'from-orange-400 to-red-400',
    'from-amber-400 to-orange-400',
    'from-yellow-400 to-amber-400',
    'from-lime-400 to-green-400',
    'from-emerald-400 to-teal-400',
    'from-cyan-400 to-blue-400',
    'from-blue-400 to-indigo-400',
    'from-indigo-400 to-purple-400',
    'from-purple-400 to-pink-400',
  ]
  
  const index = recipeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

export function RecipeCardEnhanced({ 
  recipe, 
  onViewDetails, 
  onToggleFavorite, 
  isFavorite = false, 
  className 
}: RecipeCardEnhancedProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[recipe.difficulty]
  const gradientClass = getRecipeGradient(recipe.name)

  return (
    <Card className={cn('h-full hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] overflow-hidden', className)}>
      {/* Recipe Image Placeholder */}
      <div 
        className={cn(
          'h-48 bg-gradient-to-br flex items-center justify-center relative overflow-hidden',
          gradientClass
        )}
        onClick={() => onViewDetails(recipe)}
      >
        {recipe.image ? (
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-white/90 flex flex-col items-center">
            <ImageIcon className="h-12 w-12 mb-2" />
            <span className="text-sm font-medium text-center px-4">
              {recipe.cuisine} Cuisine
            </span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Difficulty Badge */}
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20',
            'text-white bg-black/30'
          )}>
            <span className="mr-1">{difficultyConfig.icon}</span>
            {recipe.difficulty}
          </div>
          
          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full backdrop-blur-sm bg-black/20 hover:bg-black/40 text-white border border-white/20"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(recipe)
              }}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-current text-red-400')} />
            </Button>
          )}
        </div>

        {/* Time Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-black/30 text-white border border-white/20">
          <Clock className="h-3 w-3 inline mr-1" />
          {recipe.totalTime}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {recipe.name}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {recipe.description}
            </CardDescription>
          </div>
        </div>

        {/* Cuisine Tag */}
        {recipe.cuisine && (
          <div className="flex items-center gap-1 mt-2">
            <ChefHat className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{recipe.cuisine}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recipe Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{recipe.nutrition.calories} cal</span>
          </div>
        </div>

        {/* Dietary Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => {
              const dietaryOption = getDietaryOption(tag as any)
              return (
                <span
                  key={index}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                    dietaryOption 
                      ? `${dietaryOption.bgColor} ${dietaryOption.color}` 
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  {dietaryOption && (
                    <span role="img" aria-label={tag}>{dietaryOption.icon}</span>
                  )}
                  {tag}
                </span>
              )
            })}
            {recipe.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Main Ingredients Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Main Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
              >
                {ingredient.name}
              </span>
            ))}
            {recipe.ingredients.length > 4 && (
              <span className="inline-block px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                +{recipe.ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onViewDetails(recipe)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="default"
        >
          View Recipe Details
        </Button>
      </CardContent>
    </Card>
  )
}