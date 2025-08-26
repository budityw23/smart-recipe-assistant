import { NextRequest, NextResponse } from 'next/server'
import { recipeGenerator } from '@/lib/gemini'
import { IngredientInputSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = IngredientInputSchema.parse(body)
    const { ingredients, dietaryFilters, servings } = validatedData

    // Generate recipes using Gemini API
    const recipes = await recipeGenerator.generateRecipes(
      ingredients,
      dietaryFilters,
      servings
    )

    return NextResponse.json({
      success: true,
      recipes,
      totalCount: recipes.length,
      processingTime: Date.now(),
    })

  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid input data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.name,
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unknown Error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}