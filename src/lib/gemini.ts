import { GoogleGenerativeAI } from '@google/generative-ai'
import { Recipe, DietaryFilter } from '@/types/recipe'
import { generateId } from './utils'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

class RecipeGenerator {
  private model: any

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    })
  }

  async generateRecipes(
    ingredients: string[], 
    dietaryFilters: DietaryFilter[] = [],
    servings: number = 4
  ): Promise<Recipe[]> {
    const prompt = this.buildRecipePrompt(ingredients, dietaryFilters, servings)
    
    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()
      return this.parseRecipeResponse(response)
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new RecipeGenerationError('Failed to generate recipes', error as Error)
    }
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new RecipeGenerationError('Failed to generate content', error as Error)
    }
  }

  private buildRecipePrompt(
    ingredients: string[], 
    dietaryFilters: DietaryFilter[],
    servings: number
  ): string {
    return `
You are a creative and experienced chef assistant. Generate 3 diverse recipe suggestions based on these available ingredients: ${ingredients.join(', ')}.

Requirements:
- Use primarily the provided ingredients (80%+ utilization)
- Each recipe should be unique in cooking style and cuisine
- Include accurate prep time, cook time, and difficulty level
- Provide detailed step-by-step cooking instructions
- Include complete nutritional information per serving (${servings} servings total)
- Suggest 2-3 ingredient substitutions for dietary flexibility
${dietaryFilters.length > 0 ? `- Must comply with: ${dietaryFilters.join(', ')} dietary requirements` : ''}

Return response as valid JSON with this exact structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief appetizing description (max 100 chars)",
      "cuisine": "cuisine type",
      "prepTime": "15 minutes",
      "cookTime": "30 minutes",
      "totalTime": "45 minutes",
      "difficulty": "Easy|Medium|Hard",
      "servings": ${servings},
      "ingredients": [
        {
          "name": "ingredient name",
          "amount": "1 cup",
          "notes": "optional preparation notes"
        }
      ],
      "instructions": [
        "Detailed step 1",
        "Detailed step 2"
      ],
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g",
        "fiber": "5g",
        "sugar": "8g"
      },
      "substitutions": {
        "ingredient name": "substitute option"
      },
      "tags": ["quick", "healthy"],
      "tips": "Optional cooking tips or variations"
    }
  ]
}

Ensure all JSON is properly formatted and parseable. Do not include any text outside the JSON structure.
    `.trim()
  }

  private parseRecipeResponse(response: string): Recipe[] {
    try {
      // Clean the response to extract JSON
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(cleanResponse)
      
      if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
        throw new Error('Invalid response format: missing recipes array')
      }

      return parsed.recipes.map((recipe: any) => ({
        ...recipe,
        id: generateId(),
      }))
    } catch (error) {
      console.error('Failed to parse recipe response:', response)
      throw new RecipeParsingError('Failed to parse AI response', error as Error)
    }
  }
}

export class RecipeGenerationError extends Error {
  constructor(message: string, public originalError: Error) {
    super(message)
    this.name = 'RecipeGenerationError'
  }
}

export class RecipeParsingError extends Error {
  constructor(message: string, public originalError: Error) {
    super(message)
    this.name = 'RecipeParsingError'
  }
}

export const recipeGenerator = new RecipeGenerator()