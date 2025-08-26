import { z } from 'zod'

export const IngredientInputSchema = z.object({
  ingredients: z
    .array(z.string().min(1, 'Ingredient cannot be empty').max(50, 'Ingredient name too long'))
    .min(2, 'Please enter at least 2 ingredients')
    .max(15, 'Maximum 15 ingredients allowed'),
  dietaryFilters: z.array(
    z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'])
  ).default([]),
  servings: z.number().min(1, 'At least 1 serving required').max(12, 'Maximum 12 servings allowed').default(4),
  maxPrepTime: z.number().min(5).max(240).optional(),
})

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Recipe name is required'),
  description: z.string(),
  cuisine: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  totalTime: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  servings: z.number().positive(),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string(),
    notes: z.string().optional(),
  })),
  instructions: z.array(z.string()),
  nutrition: z.object({
    calories: z.number(),
    protein: z.string(),
    carbs: z.string(),
    fat: z.string(),
    fiber: z.string(),
    sugar: z.string(),
  }),
  substitutions: z.record(z.string()),
  tags: z.array(z.string()),
  tips: z.string().optional(),
  image: z.string().optional(),
})

export type IngredientInput = z.infer<typeof IngredientInputSchema>
export type RecipeValidation = z.infer<typeof RecipeSchema>