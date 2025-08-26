'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IngredientInputSchema, type IngredientInput } from '@/lib/validations'
import { DietaryFilters } from './dietary-filters'
import { IngredientSuggestions } from './ingredient-suggestions'
import { isValidIngredient } from '@/lib/utils'

interface IngredientInputFormProps {
  onSubmit: (data: IngredientInput) => void
  loading: boolean
  error: string | null
}

export function IngredientInputForm({ onSubmit, loading, error }: IngredientInputFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([])
  const [servings, setServings] = useState(4)
  const [validationError, setValidationError] = useState<string | null>(null)

  const addIngredient = () => {
    const trimmed = currentIngredient.trim()
    
    if (!trimmed) return
    
    if (!isValidIngredient(trimmed)) {
      setValidationError('Please enter a valid ingredient (letters, spaces, hyphens only)')
      return
    }
    
    if (ingredients.includes(trimmed.toLowerCase())) {
      setValidationError('This ingredient is already added')
      return
    }
    
    if (ingredients.length >= 15) {
      setValidationError('Maximum 15 ingredients allowed')
      return
    }

    setIngredients(prev => [...prev, trimmed])
    setCurrentIngredient('')
    setValidationError(null)
  }

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    try {
      const data = IngredientInputSchema.parse({
        ingredients,
        dietaryFilters,
        servings,
      })
      
      onSubmit(data)
    } catch (err: any) {
      setValidationError(err.errors?.[0]?.message || 'Invalid input data')
    }
  }

  const canSubmit = ingredients.length >= 2 && !loading

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>What ingredients do you have?</CardTitle>
        <CardDescription>
          Add at least 2 ingredients to get AI-powered recipe suggestions. 
          We&apos;ll find delicious recipes that use what you have on hand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredient Input */}
          <div className="space-y-2">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Enter an ingredient (e.g., chicken, tomatoes, rice)"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="focus-ring pr-10"
                    disabled={loading}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={currentIngredient.length >= 2}
                    aria-haspopup="listbox"
                    aria-label="Enter ingredient name"
                  />
                  {currentIngredient.length >= 2 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary" />
                    </div>
                  )}
                  <IngredientSuggestions
                    value={currentIngredient}
                    onSelect={(ingredient) => {
                      setCurrentIngredient(ingredient)
                      setTimeout(addIngredient, 100)
                    }}
                    excludeIngredients={ingredients}
                  />
                </div>
                <Button 
                  type="button"
                  onClick={addIngredient}
                  disabled={!currentIngredient.trim() || ingredients.length >= 15 || loading}
                  size="icon"
                  className="focus-ring"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Ingredients List */}
          {ingredients.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                Your ingredients ({ingredients.length}/15):
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm"
                  >
                    <span>{ingredient}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      onClick={() => removeIngredient(index)}
                      disabled={loading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Servings Input */}
          <div className="space-y-2">
            <label htmlFor="servings" className="text-sm font-medium text-foreground">
              Number of servings:
            </label>
            <Input
              id="servings"
              type="number"
              min="1"
              max="12"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 4)}
              className="w-24"
              disabled={loading}
            />
          </div>

          {/* Dietary Filters */}
          <DietaryFilters
            selectedFilters={dietaryFilters}
            onChange={setDietaryFilters}
            disabled={loading}
          />

          {/* Submit Button */}
          <Button 
            type="submit"
            size="lg"
            className="w-full"
            disabled={!canSubmit}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Generating Recipes...
              </>
            ) : (
              'Generate Recipe Suggestions 🍳'
            )}
          </Button>

          {!canSubmit && !loading && (
            <p className="text-sm text-muted-foreground text-center">
              {ingredients.length < 2 
                ? `Add ${2 - ingredients.length} more ingredient${2 - ingredients.length === 1 ? '' : 's'} to continue`
                : 'Ready to generate recipes!'
              }
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}