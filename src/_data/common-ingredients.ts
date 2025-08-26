export interface IngredientSuggestion {
  name: string
  category: string
  common: boolean
}

export const COMMON_INGREDIENTS: IngredientSuggestion[] = [
  // Proteins
  { name: 'chicken breast', category: 'protein', common: true },
  { name: 'ground beef', category: 'protein', common: true },
  { name: 'salmon', category: 'protein', common: true },
  { name: 'eggs', category: 'protein', common: true },
  { name: 'tofu', category: 'protein', common: true },
  { name: 'beans', category: 'protein', common: true },
  
  // Vegetables
  { name: 'onions', category: 'vegetable', common: true },
  { name: 'garlic', category: 'vegetable', common: true },
  { name: 'tomatoes', category: 'vegetable', common: true },
  { name: 'bell peppers', category: 'vegetable', common: true },
  { name: 'carrots', category: 'vegetable', common: true },
  { name: 'potatoes', category: 'vegetable', common: true },
  { name: 'spinach', category: 'vegetable', common: true },
  { name: 'broccoli', category: 'vegetable', common: true },
  
  // Grains & Starches
  { name: 'rice', category: 'grain', common: true },
  { name: 'pasta', category: 'grain', common: true },
  { name: 'bread', category: 'grain', common: true },
  { name: 'quinoa', category: 'grain', common: false },
  { name: 'oats', category: 'grain', common: true },
  
  // Dairy & Alternatives
  { name: 'milk', category: 'dairy', common: true },
  { name: 'cheese', category: 'dairy', common: true },
  { name: 'yogurt', category: 'dairy', common: true },
  { name: 'butter', category: 'dairy', common: true },
  
  // Pantry Staples
  { name: 'olive oil', category: 'pantry', common: true },
  { name: 'salt', category: 'pantry', common: true },
  { name: 'black pepper', category: 'pantry', common: true },
  { name: 'flour', category: 'pantry', common: true },
  { name: 'sugar', category: 'pantry', common: true },
  
  // Herbs & Spices
  { name: 'basil', category: 'herb', common: true },
  { name: 'oregano', category: 'herb', common: true },
  { name: 'thyme', category: 'herb', common: true },
  { name: 'rosemary', category: 'herb', common: false },
  { name: 'paprika', category: 'spice', common: true },
  { name: 'cumin', category: 'spice', common: false },
]

export const getIngredientsByCategory = (category: string): IngredientSuggestion[] => {
  return COMMON_INGREDIENTS.filter(ingredient => ingredient.category === category)
}

export const getCommonIngredients = (): IngredientSuggestion[] => {
  return COMMON_INGREDIENTS.filter(ingredient => ingredient.common)
}

export const searchIngredients = (query: string): IngredientSuggestion[] => {
  const lowercaseQuery = query.toLowerCase()
  return COMMON_INGREDIENTS.filter(ingredient =>
    ingredient.name.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 8)
}