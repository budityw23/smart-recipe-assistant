import { NextRequest, NextResponse } from 'next/server'
import { recipeGenerator } from '@/lib/gemini'
import { z } from 'zod'

const SubstitutionRequestSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'At least one ingredient required'),
  dietaryFilters: z.array(z.string()).optional().default([]),
  recipeName: z.string().optional(),
  recipeType: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = SubstitutionRequestSchema.parse(body)
    const { ingredients, dietaryFilters, recipeName, recipeType } = validatedData

    const substitutions = await generateSubstitutions(
      ingredients,
      dietaryFilters,
      recipeName,
      recipeType
    )

    return NextResponse.json({
      success: true,
      substitutions,
      processingTime: Date.now(),
    })

  } catch (error) {
    console.error('Substitution API Error:', error)

    if (error instanceof z.ZodError) {
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

    return NextResponse.json(
      {
        success: false,
        error: 'Substitution Error',
        message: error instanceof Error ? error.message : 'Failed to generate substitutions',
      },
      { status: 500 }
    )
  }
}

async function generateSubstitutions(
  ingredients: string[],
  dietaryFilters: string[] = [],
  recipeName?: string,
  recipeType?: string
) {
  const prompt = `
You are a culinary expert specializing in ingredient substitutions. Provide smart substitution suggestions for the following ingredients: ${ingredients.join(', ')}.

Context:
${recipeName ? `- Recipe: ${recipeName}` : ''}
${recipeType ? `- Recipe Type: ${recipeType}` : ''}
${dietaryFilters.length > 0 ? `- Dietary Requirements: ${dietaryFilters.join(', ')}` : ''}

For each ingredient, provide:
1. 2-3 suitable substitutions
2. Brief explanation of how it affects the recipe
3. Quantity conversion if different
4. Any preparation notes

Return response as valid JSON with this structure:
{
  "substitutions": [
    {
      "original": "ingredient name",
      "alternatives": [
        {
          "substitute": "substitute ingredient",
          "ratio": "1:1" or "1 cup = 3/4 cup substitute",
          "notes": "How it affects flavor/texture",
          "availability": "common|specialty",
          "dietaryTags": ["vegan", "gluten-free", etc.]
        }
      ]
    }
  ],
  "generalTips": [
    "General substitution tip 1",
    "General substitution tip 2"
  ]
}

Focus on practical, readily available substitutions that maintain recipe quality.
  `.trim()

  try {
    const result = await recipeGenerator.generateContent(prompt)
    const response = result
    
    // Clean and parse the response
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanResponse)
    
    if (!parsed.substitutions) {
      throw new Error('Invalid substitution response format')
    }

    return parsed
  } catch (error) {
    console.error('Failed to generate substitutions:', error)
    throw new Error('Failed to generate ingredient substitutions')
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