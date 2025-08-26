'use client'

import React, { useState } from 'react'
import { ChefHat } from 'lucide-react'
import { IngredientInputForm } from '@/components/forms/ingredient-input'
import { RecipeGrid } from '@/components/recipe/recipe-grid'
import { RecipeModal } from '@/components/recipe/recipe-modal'
import { RecipeFilters } from '@/components/recipe/recipe-filters'
import { useRecipes } from '@/hooks/use-recipes'
import { Recipe } from '@/types/recipe'

export default function HomePage() {
  const { 
    recipes, 
    selectedRecipe, 
    loading, 
    error, 
    generateRecipes, 
    selectRecipe,
    clearError 
  } = useRecipes()
  
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleRecipeGeneration = async (data: any) => {
    clearError()
    await generateRecipes(data)
    setShowFilters(false) // Hide filters while generating
  }

  // Update filtered recipes when main recipes change
  React.useEffect(() => {
    setFilteredRecipes(recipes)
    if (recipes.length > 0) {
      setShowFilters(true) // Show filters when recipes are available
    }
  }, [recipes])

  const handleFilter = (filtered: Recipe[]) => {
    setFilteredRecipes(filtered)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <ChefHat className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Smart Recipe Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us what ingredients you have, and we&apos;ll suggest delicious recipes 
            you can make right now using AI.
          </p>
        </div>

        {/* Ingredient Input Form */}
        <div className="max-w-4xl mx-auto">
          <IngredientInputForm
            onSubmit={handleRecipeGeneration}
            loading={loading}
            error={error}
          />
        </div>

        {/* Recipe Filters */}
        {showFilters && recipes.length > 0 && !loading && (
          <RecipeFilters
            recipes={recipes}
            onFilter={handleFilter}
          />
        )}

        {/* Recipe Results */}
        {(recipes.length > 0 || loading) && (
          <RecipeGrid
            recipes={loading ? [] : filteredRecipes}
            loading={loading}
            onRecipeSelect={selectRecipe}
          />
        )}

        {/* Recipe Detail Modal */}
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => selectRecipe(null)}
        />
      </div>
    </div>
  )
}