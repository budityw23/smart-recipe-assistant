export interface Recipe {
  id: string
  name: string
  description: string
  cuisine: string
  prepTime: string
  cookTime: string
  totalTime: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  servings: number
  ingredients: Ingredient[]
  instructions: string[]
  nutrition: NutritionInfo
  substitutions: Record<string, string>
  tags: string[]
  tips?: string
  image?: string
}

export interface Ingredient {
  name: string
  amount: string
  notes?: string
}

export interface NutritionInfo {
  calories: number
  protein: string
  carbs: string
  fat: string
  fiber: string
  sugar: string
}

export type DietaryFilter = 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'keto' 
  | 'paleo'

export interface RecipeSearchParams {
  ingredients: string[]
  dietaryFilters: DietaryFilter[]
  servings: number
  maxPrepTime?: number
}