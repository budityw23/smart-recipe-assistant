import { Recipe, RecipeSearchParams } from './recipe'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface RecipeGenerationRequest extends RecipeSearchParams {}

export interface RecipeGenerationResponse {
  recipes: Recipe[]
  totalCount: number
  processingTime: number
}

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export type ApiEndpoint = '/api/recipes' | '/api/nutrition' | '/api/substitutions'

export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: number
}