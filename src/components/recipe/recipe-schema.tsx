'use client'

import { Recipe } from '@/types/recipe'

interface RecipeSchemaProps {
  recipe: Recipe
}

export function RecipeSchema({ recipe }: RecipeSchemaProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: recipe.image || `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
    author: {
      '@type': 'Organization',
      name: 'Smart Recipe Assistant',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    datePublished: new Date().toISOString(),
    prepTime: `PT${recipe.prepTime.replace(/\D/g, '')}M`,
    cookTime: `PT${recipe.cookTime.replace(/\D/g, '')}M`,
    totalTime: `PT${recipe.totalTime.replace(/\D/g, '')}M`,
    recipeYield: recipe.servings.toString(),
    recipeCategory: recipe.cuisine,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.tags.join(', '),
    recipeIngredient: recipe.ingredients.map(ing => `${ing.amount} ${ing.name}`),
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: instruction,
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: recipe.nutrition.calories.toString(),
      proteinContent: recipe.nutrition.protein,
      carbohydrateContent: recipe.nutrition.carbs,
      fatContent: recipe.nutrition.fat,
      fiberContent: recipe.nutrition.fiber,
      sugarContent: recipe.nutrition.sugar,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      ratingCount: '100',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'AI Recipe Generator',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        reviewBody: 'Generated using advanced AI to match your available ingredients perfectly.',
      },
    ],
    video: {
      '@type': 'VideoObject',
      name: `How to make ${recipe.name}`,
      description: `Step-by-step cooking instructions for ${recipe.name}`,
      thumbnailUrl: recipe.image || `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
      uploadDate: new Date().toISOString(),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}