'use client'

import { Recipe } from '@/types/recipe'
import { RecipeCard } from './recipe-card'
import { RecipeCardSkeleton } from '@/components/ui/loading-skeleton'

interface RecipeGridProps {
  recipes: Recipe[]
  loading: boolean
  onRecipeSelect: (recipe: Recipe) => void
}

export function RecipeGrid({ recipes, loading, onRecipeSelect }: RecipeGridProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Generating Recipes...</h2>
          <p className="text-muted-foreground mt-2">
            Our AI is crafting personalized recipes based on your ingredients
          </p>
        </div>
        <RecipeGridSkeleton />
      </div>
    )
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No recipes generated yet. Add ingredients above to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Recipe Suggestions
        </h2>
        <p className="text-muted-foreground mt-2">
          Here are {recipes.length} personalized recipe{recipes.length !== 1 ? 's' : ''} based on your ingredients
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onViewDetails={onRecipeSelect}
          />
        ))}
      </div>
    </div>
  )
}

function RecipeGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}