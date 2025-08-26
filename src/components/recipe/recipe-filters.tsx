'use client'

import { useState } from 'react'
import { Filter, Clock, Users, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Recipe, DietaryFilter } from '@/types/recipe'
import { DIETARY_OPTIONS } from '@/_data/dietary-options'

interface RecipeFiltersProps {
  recipes: Recipe[]
  onFilter: (filteredRecipes: Recipe[]) => void
  className?: string
}

interface FilterState {
  search: string
  maxPrepTime: number
  servings: number[]
  difficulty: string[]
  cuisine: string[]
  dietary: DietaryFilter[]
  maxCalories: number
}

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard']
const PREP_TIME_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: 'Any', value: 999 },
]

export function RecipeFilters({ recipes, onFilter, className }: RecipeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    maxPrepTime: 999,
    servings: [],
    difficulty: [],
    cuisine: [],
    dietary: [],
    maxCalories: 2000,
  })

  // Extract unique cuisines from recipes
  const availableCuisines = Array.from(new Set(recipes.map(r => r.cuisine).filter(Boolean)))
  
  // Extract serving sizes
  const availableServings = Array.from(new Set(recipes.map(r => r.servings))).sort((a, b) => a - b)

  const applyFilters = (newFilters: FilterState) => {
    let filtered = recipes

    // Text search
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchLower)) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Prep time filter
    if (newFilters.maxPrepTime < 999) {
      filtered = filtered.filter(recipe => {
        const prepTime = parseInt(recipe.prepTime.replace(/\D/g, '')) || 0
        return prepTime <= newFilters.maxPrepTime
      })
    }

    // Servings filter
    if (newFilters.servings.length > 0) {
      filtered = filtered.filter(recipe => 
        newFilters.servings.includes(recipe.servings)
      )
    }

    // Difficulty filter
    if (newFilters.difficulty.length > 0) {
      filtered = filtered.filter(recipe =>
        newFilters.difficulty.includes(recipe.difficulty)
      )
    }

    // Cuisine filter
    if (newFilters.cuisine.length > 0) {
      filtered = filtered.filter(recipe =>
        newFilters.cuisine.includes(recipe.cuisine)
      )
    }

    // Dietary filters
    if (newFilters.dietary.length > 0) {
      filtered = filtered.filter(recipe =>
        newFilters.dietary.every(diet => recipe.tags.includes(diet))
      )
    }

    // Calories filter
    if (newFilters.maxCalories < 2000) {
      filtered = filtered.filter(recipe =>
        recipe.nutrition.calories <= newFilters.maxCalories
      )
    }

    onFilter(filtered)
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilter(key, newArray)
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      maxPrepTime: 999,
      servings: [],
      difficulty: [],
      cuisine: [],
      dietary: [],
      maxCalories: 2000,
    }
    setFilters(defaultFilters)
    applyFilters(defaultFilters)
  }

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search' && value) return count + 1
    if (key === 'maxPrepTime' && value < 999) return count + 1
    if (key === 'maxCalories' && value < 2000) return count + 1
    if (Array.isArray(value) && value.length > 0) return count + 1
    return count
  }, 0)

  return (
    <div className={className}>
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            Clear all
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Recipes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search recipes, ingredients, or keywords..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>

            {/* Quick Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Prep Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Max Prep Time
                </label>
                <div className="flex flex-wrap gap-1">
                  {PREP_TIME_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.maxPrepTime === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('maxPrepTime', option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  Difficulty
                </label>
                <div className="flex flex-wrap gap-1">
                  {DIFFICULTY_OPTIONS.map((diff) => (
                    <Button
                      key={diff}
                      variant={filters.difficulty.includes(diff) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('difficulty', diff)}
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Servings */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Servings
                </label>
                <div className="flex flex-wrap gap-1">
                  {availableServings.map((serving) => (
                    <Button
                      key={serving}
                      variant={filters.servings.includes(serving) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('servings', serving.toString())}
                    >
                      {serving}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dietary Preferences</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {DIETARY_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.dietary.includes(option.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleArrayFilter('dietary', option.value)}
                    className="justify-start"
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cuisine */}
            {availableCuisines.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Cuisine</label>
                <div className="flex flex-wrap gap-1">
                  {availableCuisines.map((cuisine) => (
                    <Button
                      key={cuisine}
                      variant={filters.cuisine.includes(cuisine) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('cuisine', cuisine)}
                    >
                      {cuisine}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Calories */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Max Calories: {filters.maxCalories === 2000 ? 'Any' : filters.maxCalories}
              </label>
              <Input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={filters.maxCalories}
                onChange={(e) => updateFilter('maxCalories', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>200</span>
                <span>1000</span>
                <span>2000+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}