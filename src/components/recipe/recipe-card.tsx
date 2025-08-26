'use client'

import { Clock, Users, ChefHat, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Recipe } from '@/types/recipe'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe
  onViewDetails: (recipe: Recipe) => void
  className?: string
}

const DIFFICULTY_CONFIG = {
  'Easy': { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  'Medium': { color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  'Hard': { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' },
} as const

export function RecipeCard({ recipe, onViewDetails, className }: RecipeCardProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[recipe.difficulty]

  return (
    <Card className={cn('h-full hover:shadow-md transition-shadow cursor-pointer group', className)}>
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
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium shrink-0',
            difficultyConfig.color,
            difficultyConfig.bgColor
          )}>
            {recipe.difficulty}
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
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{recipe.totalTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{recipe.nutrition.calories} cal</span>
          </div>
        </div>

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

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onViewDetails(recipe)}
          className="w-full"
          variant="default"
        >
          View Recipe Details
        </Button>
      </CardContent>
    </Card>
  )
}