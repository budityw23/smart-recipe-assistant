'use client'

import { useState } from 'react'
import { Clock, Users, ChefHat, Utensils, Share2, Heart } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Recipe } from '@/types/recipe'
import { NutritionPanel } from './nutrition-panel'
import { RecipeShare } from './recipe-share'
import { cn } from '@/lib/utils'

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

const DIFFICULTY_CONFIG = {
  'Easy': { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  'Medium': { color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  'Hard': { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' },
} as const

export function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  const [showShare, setShowShare] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!recipe) return null

  const difficultyConfig = DIFFICULTY_CONFIG[recipe.difficulty]

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real app, this would save to user preferences or database
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recipe.name}
      className="max-w-4xl max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Recipe Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {recipe.prepTime} prep • {recipe.cookTime} cook • {recipe.totalTime} total
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{recipe.servings} servings</span>
            </div>
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              difficultyConfig.color,
              difficultyConfig.bgColor
            )}>
              {recipe.difficulty}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{recipe.cuisine} cuisine</span>
          </div>

          <p className="text-muted-foreground">{recipe.description}</p>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-start gap-3">
                    <span className="font-medium">{ingredient.amount}</span>
                    <div className="flex-1">
                      <span>{ingredient.name}</span>
                      {ingredient.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {ingredient.notes}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Enhanced Nutrition Info */}
          <NutritionPanel 
            nutrition={recipe.nutrition} 
            servings={recipe.servings}
          />
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Cooking Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="flex-1 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Substitutions */}
        {Object.keys(recipe.substitutions).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ingredient Substitutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(recipe.substitutions).map(([ingredient, substitute], index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <span className="font-medium">{ingredient}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">{substitute}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {recipe.tips && (
          <Card>
            <CardHeader>
              <CardTitle>Chef&apos;s Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recipe.tips}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button 
            onClick={toggleFavorite}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current text-red-500')} />
            {isFavorite ? 'Saved' : 'Save Recipe'}
          </Button>
          
          <Button 
            onClick={() => setShowShare(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          <Button 
            onClick={() => window.print()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            Print Recipe
          </Button>
          
          <Button onClick={onClose} variant="default" className="ml-auto">
            Close
          </Button>
        </div>

        {/* Share Modal */}
        <RecipeShare
          recipe={recipe}
          isOpen={showShare}
          onClose={() => setShowShare(false)}
        />
      </div>
    </Modal>
  )
}