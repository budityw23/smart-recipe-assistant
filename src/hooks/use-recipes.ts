'use client'

import { useState, useCallback } from 'react'
import { Recipe } from '@/types/recipe'
import { IngredientInput } from '@/lib/validations'

interface RecipeState {
  recipes: Recipe[]
  selectedRecipe: Recipe | null
  loading: boolean
  error: string | null
}

export function useRecipes() {
  const [state, setState] = useState<RecipeState>({
    recipes: [],
    selectedRecipe: null,
    loading: false,
    error: null,
  })

  const generateRecipes = useCallback(async (input: IngredientInput) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setState(prev => ({ 
        ...prev, 
        recipes: data.recipes || [], 
        loading: false 
      }))
    } catch (error) {
      console.error('Recipe generation error:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false 
      }))
    }
  }, [])

  const clearRecipes = useCallback(() => {
    setState(prev => ({ ...prev, recipes: [], selectedRecipe: null }))
  }, [])

  const selectRecipe = useCallback((recipe: Recipe | null) => {
    setState(prev => ({ ...prev, selectedRecipe: recipe }))
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    generateRecipes,
    clearRecipes,
    selectRecipe,
    clearError,
  }
}