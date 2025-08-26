# API Reference

This document provides comprehensive documentation for all API endpoints in the Smart Recipe Assistant application.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, no authentication is required for API endpoints. All endpoints are publicly accessible.

## Rate Limiting

API endpoints include built-in rate limiting protection to prevent abuse of the Google Gemini API integration.

---

## Endpoints

### Recipe Generation

Generate AI-powered recipe suggestions based on available ingredients.

#### `POST /api/recipes`

**Description**: Generate recipes using Google Gemini AI based on provided ingredients and dietary preferences.

**Request Body**:
```json
{
  "ingredients": ["string"],
  "dietaryFilters": ["string"] (optional),
  "servings": number (optional, default: 4)
}
```

**Request Schema**:
- `ingredients` (string[], required): Array of available ingredients
  - Minimum 1 ingredient required
  - Each ingredient should be a descriptive string (e.g., "chicken breast", "fresh basil")
- `dietaryFilters` (string[], optional): Array of dietary preferences
  - Supported values: `"vegetarian"`, `"vegan"`, `"gluten-free"`, `"dairy-free"`, `"nut-free"`, `"keto"`, `"paleo"`
- `servings` (number, optional): Number of servings for the recipe
  - Default: 4
  - Range: 1-12

**Example Request**:
```json
{
  "ingredients": ["chicken breast", "broccoli", "garlic", "olive oil"],
  "dietaryFilters": ["gluten-free"],
  "servings": 4
}
```

**Success Response** (200):
```json
{
  "success": true,
  "recipes": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "prepTime": "string",
      "cookTime": "string",
      "totalTime": "string",
      "difficulty": "Easy|Medium|Hard",
      "servings": number,
      "cuisine": "string",
      "dietaryTags": ["string"],
      "ingredients": [
        {
          "name": "string",
          "amount": "string",
          "unit": "string",
          "notes": "string"
        }
      ],
      "instructions": [
        {
          "step": number,
          "instruction": "string",
          "time": "string (optional)",
          "temperature": "string (optional)"
        }
      ],
      "nutrition": {
        "calories": number,
        "protein": "string",
        "carbs": "string",
        "fat": "string",
        "fiber": "string",
        "sugar": "string",
        "sodium": "string"
      },
      "tips": ["string"]
    }
  ],
  "totalCount": number,
  "processingTime": number
}
```

**Error Responses**:

*400 Bad Request* - Validation Error:
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "path": ["field_name"],
      "message": "Error description"
    }
  ]
}
```

*500 Internal Server Error* - Processing Error:
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Error description"
}
```

---

### Ingredient Substitutions

Get AI-powered suggestions for ingredient substitutions.

#### `POST /api/substitutions`

**Description**: Generate intelligent ingredient substitutions for recipe modifications.

**Request Body**:
```json
{
  "ingredients": ["string"],
  "dietaryFilters": ["string"] (optional),
  "recipeName": "string" (optional),
  "recipeType": "string" (optional)
}
```

**Request Schema**:
- `ingredients` (string[], required): Array of ingredients to find substitutions for
  - Minimum 1 ingredient required
- `dietaryFilters` (string[], optional): Dietary restrictions to consider
- `recipeName` (string, optional): Name of the recipe for context
- `recipeType` (string, optional): Type of recipe (e.g., "dessert", "main course")

**Example Request**:
```json
{
  "ingredients": ["butter", "eggs", "milk"],
  "dietaryFilters": ["vegan"],
  "recipeName": "Chocolate Chip Cookies",
  "recipeType": "dessert"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "substitutions": [
    {
      "original": "butter",
      "alternatives": [
        {
          "substitute": "vegan butter",
          "ratio": "1:1",
          "notes": "Maintains similar texture and flavor",
          "availability": "common",
          "dietaryTags": ["vegan", "dairy-free"]
        },
        {
          "substitute": "coconut oil",
          "ratio": "3/4 cup = 1 cup butter",
          "notes": "Solid at room temperature, may add slight coconut flavor",
          "availability": "common",
          "dietaryTags": ["vegan", "dairy-free", "paleo"]
        }
      ]
    }
  ],
  "generalTips": [
    "When substituting fats, consider the melting point for texture",
    "Vegan substitutes may slightly alter flavor profiles"
  ],
  "processingTime": number
}
```

**Error Responses**:

*400 Bad Request* - Validation Error:
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "path": ["field_name"],
      "message": "Error description"
    }
  ]
}
```

*500 Internal Server Error* - Processing Error:
```json
{
  "success": false,
  "error": "Substitution Error",
  "message": "Failed to generate substitutions"
}
```

---

## CORS Headers

All endpoints include CORS headers for cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Error Handling

### Common Error Types

1. **Validation Errors** (400): Invalid input data structure
2. **Rate Limiting** (429): Too many requests to AI service
3. **AI Service Errors** (500): Google Gemini API failures
4. **Network Errors** (500): Connection or timeout issues

### Error Response Structure

All error responses follow this consistent structure:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error description",
  "details": "Additional error details (optional)"
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// Generate recipes
const response = await fetch('/api/recipes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ingredients: ['chicken', 'rice', 'vegetables'],
    dietaryFilters: ['gluten-free'],
    servings: 4
  })
});

const data = await response.json();

if (data.success) {
  console.log('Generated recipes:', data.recipes);
} else {
  console.error('Error:', data.message);
}
```

```typescript
// Get ingredient substitutions
const response = await fetch('/api/substitutions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ingredients: ['eggs', 'milk'],
    dietaryFilters: ['vegan'],
    recipeName: 'Pancakes'
  })
});

const data = await response.json();

if (data.success) {
  console.log('Substitutions:', data.substitutions);
} else {
  console.error('Error:', data.message);
}
```

### cURL

```bash
# Generate recipes
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["tomatoes", "basil", "mozzarella"],
    "dietaryFilters": ["vegetarian"],
    "servings": 2
  }'

# Get substitutions
curl -X POST http://localhost:3000/api/substitutions \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["butter", "eggs"],
    "dietaryFilters": ["vegan"],
    "recipeName": "Cookies"
  }'
```

## Performance Considerations

- **Response Time**: Typical API response time is 2-5 seconds due to AI processing
- **Payload Size**: Recipe responses can be large (10-50KB per recipe)
- **Concurrent Requests**: Limited by Google Gemini API rate limits
- **Caching**: Consider implementing client-side caching for repeated requests

## Security Notes

- All user inputs are validated using Zod schemas
- No sensitive data is logged or stored
- CORS is configured for development flexibility
- Rate limiting prevents API abuse