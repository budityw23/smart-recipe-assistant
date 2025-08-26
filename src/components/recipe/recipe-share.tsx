'use client'

import { useState } from 'react'
import { Share2, Copy, Link, Check, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Recipe } from '@/types/recipe'

interface RecipeShareProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
}

export function RecipeShare({ recipe, isOpen, onClose }: RecipeShareProps) {
  const [copied, setCopied] = useState(false)
  
  // Generate a shareable URL (in a real app, this would be a proper URL)
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/recipe/${recipe.id}`
  
  // Generate recipe text for sharing
  const recipeText = `🍳 ${recipe.name}

${recipe.description}

⏱️ Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Total: ${recipe.totalTime}
👥 Servings: ${recipe.servings} | 🔥 ${recipe.difficulty}
🍽️ ${recipe.cuisine} cuisine

📝 Ingredients:
${recipe.ingredients.map(ing => `• ${ing.amount} ${ing.name}`).join('\n')}

👨‍🍳 Instructions:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

📊 Nutrition (per serving):
• Calories: ${recipe.nutrition.calories}
• Protein: ${recipe.nutrition.protein}
• Carbs: ${recipe.nutrition.carbs}
• Fat: ${recipe.nutrition.fat}

Generated with Smart Recipe Assistant`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: recipe.description,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  const downloadRecipe = () => {
    const element = document.createElement('a')
    const file = new Blob([recipeText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${recipe.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: <Link className="h-4 w-4" />,
      action: () => copyToClipboard(shareUrl),
      description: 'Copy recipe URL to clipboard',
    },
    {
      name: 'Copy Recipe Text',
      icon: <Copy className="h-4 w-4" />,
      action: () => copyToClipboard(recipeText),
      description: 'Copy formatted recipe text',
    },
    {
      name: 'Download Recipe',
      icon: <Download className="h-4 w-4" />,
      action: downloadRecipe,
      description: 'Download as text file',
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Recipe"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Recipe Preview */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold">{recipe.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {recipe.description}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span>⏱️ {recipe.totalTime}</span>
            <span>👥 {recipe.servings} servings</span>
            <span>🔥 {recipe.difficulty}</span>
          </div>
        </div>

        {/* Share URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipe URL</label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => copyToClipboard(shareUrl)}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Share Options</label>
          <div className="grid gap-2">
            {/* Native Web Share (if available) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                onClick={shareViaWebShare}
                className="justify-start"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share via...
              </Button>
            )}

            {shareOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={option.action}
                className="justify-start"
              >
                {option.icon}
                <div className="ml-2 text-left">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Social Share Buttons (placeholder for future social integrations) */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            More sharing options coming soon! For now, copy the recipe text or URL to share.
          </p>
        </div>

        {/* Copy Confirmation */}
        {copied && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            Copied to clipboard!
          </div>
        )}
      </div>
    </Modal>
  )
}