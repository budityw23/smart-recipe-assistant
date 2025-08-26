# Recipe Generation Feature

The recipe generation feature is the core functionality of Smart Recipe Assistant, leveraging Google Gemini AI to create personalized recipes based on available ingredients.

## Overview

This feature transforms user-provided ingredients into complete, detailed recipes with nutritional information, cooking instructions, and dietary considerations.

## User Flow

```
User Input → Validation → AI Processing → Recipe Display
    ↓
Ingredients + Filters → API Call → Gemini AI → Structured Response
    ↓
Display Results + Actions (Save, Share, View Details)
```

## Technical Implementation

### Frontend Components

#### IngredientInput Component
**Location**: `src/components/forms/ingredient-input.tsx`

**Features**:
- Tag-based ingredient input with autocomplete
- Real-time validation and error handling
- Servings selector (1-12 people)
- Form state management with controlled components

**Usage**:
```tsx
<IngredientInput
  onSubmit={handleRecipeGeneration}
  loading={isGeneratingRecipes}
/>
```

**Props**:
```typescript
interface IngredientInputProps {
  onSubmit: (data: IngredientInputData) => void
  loading?: boolean
}

interface IngredientInputData {
  ingredients: string[]
  dietaryFilters: string[]
  servings: number
}
```

#### DietaryFilters Component
**Location**: `src/components/forms/dietary-filters.tsx`

**Supported Filters**:
- Vegetarian
- Vegan
- Gluten-Free
- Dairy-Free
- Nut-Free
- Keto
- Paleo

**Features**:
- Multi-select functionality
- Visual indicators for active filters
- Responsive design with proper spacing

### Backend API

#### Recipe Generation Endpoint
**Location**: `src/app/api/recipes/route.ts`

**Endpoint**: `POST /api/recipes`

**Request Schema**:
```typescript
const IngredientInputSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'At least one ingredient required'),
  dietaryFilters: z.array(z.string()).optional().default([]),
  servings: z.number().min(1).max(12).default(4)
})
```

**Response Format**:
```json
{
  "success": true,
  "recipes": [
    {
      "id": "unique-recipe-id",
      "title": "Recipe Name",
      "description": "Brief recipe description",
      "prepTime": "15 minutes",
      "cookTime": "30 minutes",
      "totalTime": "45 minutes",
      "difficulty": "Easy|Medium|Hard",
      "servings": 4,
      "cuisine": "Italian",
      "dietaryTags": ["vegetarian", "gluten-free"],
      "ingredients": [
        {
          "name": "Chicken breast",
          "amount": "500",
          "unit": "g",
          "notes": "boneless, skinless"
        }
      ],
      "instructions": [
        {
          "step": 1,
          "instruction": "Heat olive oil in a large pan over medium heat.",
          "time": "2 minutes",
          "temperature": "medium heat"
        }
      ],
      "nutrition": {
        "calories": 350,
        "protein": "28g",
        "carbs": "15g",
        "fat": "18g",
        "fiber": "3g",
        "sugar": "2g",
        "sodium": "450mg"
      },
      "tips": [
        "Let meat rest for 5 minutes before serving",
        "Season with salt and pepper to taste"
      ]
    }
  ],
  "totalCount": 3,
  "processingTime": 1647123456789
}
```

### AI Integration

#### Gemini API Client
**Location**: `src/lib/gemini.ts`

**Key Features**:
- Rate limiting to prevent API abuse
- Retry logic for failed requests
- Response validation and parsing
- Error handling with fallback responses

**Prompt Engineering**:
```typescript
const generateRecipePrompt = (
  ingredients: string[],
  dietaryFilters: string[],
  servings: number
) => `
You are a professional chef and nutritionist. Create ${Math.min(3, ingredients.length)} diverse recipes using these ingredients: ${ingredients.join(', ')}.

Requirements:
- Use the provided ingredients as primary components
- Accommodate dietary restrictions: ${dietaryFilters.join(', ') || 'none'}
- Each recipe serves ${servings} people
- Provide accurate nutritional information per serving
- Include practical cooking tips
- Ensure recipes are achievable for home cooks

Return a valid JSON response with the exact structure specified...
`
```

## User Experience Features

### Loading States

**Component**: `LoadingSkeleton`
- Shimmer animations for better perceived performance
- Multiple skeleton types (card, list, text)
- Progressive loading with staggered animations

```tsx
{loading ? (
  <LoadingSkeleton type="card" count={3} />
) : (
  <RecipeGrid recipes={recipes} />
)}
```

### Error Handling

**Validation Errors**:
- Real-time form validation with instant feedback
- Clear error messages for each field
- Visual indicators (red borders, icons)

**API Errors**:
- Network error handling with retry options
- AI service error handling with fallback messages
- Rate limiting notifications

**Error Boundary**:
- Catches unexpected React errors
- Provides user-friendly error UI
- Includes error reporting capabilities

### Recipe Display

**RecipeGrid Component**:
- Responsive CSS Grid layout
- Infinite scroll capability (ready for implementation)
- Loading states between requests
- Empty state handling

**RecipeCard Components**:
- Basic card: `RecipeCard`
- Enhanced card: `RecipeCardEnhanced` with gradients
- Hover effects and animations
- Favorite functionality
- Quick view options

## Advanced Features

### Recipe Filtering and Search

**Real-time Search**:
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [filteredRecipes, setFilteredRecipes] = useState(recipes)

// Debounced search implementation
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredRecipes(filtered)
  }, 300),
  [recipes]
)

useEffect(() => {
  debouncedSearch(searchQuery)
}, [searchQuery, debouncedSearch])
```

**Advanced Filters**:
- Preparation time ranges
- Difficulty levels
- Cuisine types
- Calorie ranges
- Dietary restrictions
- Ingredient exclusions

### Recipe Sharing

**ShareRecipe Component**:
- Generate shareable URLs
- Copy recipe as formatted text
- Download as PDF (future feature)
- Print-friendly formatting
- Social media sharing

### Nutritional Analysis

**NutritionPanel Component**:
- Detailed macro and micronutrient breakdown
- Daily value percentages
- Visual progress bars
- Responsive design for mobile

## Performance Optimizations

### Bundle Optimization
- Lazy loading for heavy components
- Code splitting at route level
- Tree shaking for unused code
- Image optimization with Next.js Image

### Runtime Performance
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers
- Debounced search inputs

### API Optimization
- Request deduplication
- Caching strategies (future)
- Batch processing capabilities
- Connection pooling

## Accessibility Features

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space activation for interactive elements
- Escape key for modal dismissal
- Arrow keys for list navigation

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for all interactive elements
- Live regions for dynamic content
- Descriptive alt text for images

### Visual Accessibility
- High contrast ratios (4.5:1 minimum)
- Focus indicators for all interactive elements
- Scalable text and UI components
- Color coding supplemented with text/icons

## Error Scenarios and Handling

### Common Error Cases

1. **No Ingredients Provided**:
   ```json
   {
     "success": false,
     "error": "Validation Error",
     "message": "At least one ingredient is required"
   }
   ```

2. **AI Service Unavailable**:
   ```json
   {
     "success": false,
     "error": "Service Error",
     "message": "Recipe generation service temporarily unavailable"
   }
   ```

3. **Rate Limit Exceeded**:
   ```json
   {
     "success": false,
     "error": "Rate Limit",
     "message": "Too many requests. Please try again in a few minutes."
   }
   ```

### Recovery Strategies

- **Automatic Retry**: For transient network errors
- **Fallback Content**: Pre-generated recipes for common ingredients
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Offline Support**: PWA capabilities with cached content

## Testing Strategy

### Unit Tests
```typescript
describe('Recipe Generation', () => {
  it('validates ingredient input correctly', () => {
    const result = IngredientInputSchema.safeParse({
      ingredients: [],
      dietaryFilters: [],
      servings: 4
    })
    
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('At least one ingredient required')
  })
  
  it('generates proper API request', () => {
    const data = {
      ingredients: ['chicken', 'rice'],
      dietaryFilters: ['gluten-free'],
      servings: 4
    }
    
    const request = generateRecipeRequest(data)
    expect(request.body).toMatchObject(data)
  })
})
```

### Integration Tests
```typescript
describe('Recipe Generation Flow', () => {
  it('completes full recipe generation flow', async () => {
    render(<RecipeGenerationPage />)
    
    // Enter ingredients
    const input = screen.getByPlaceholderText('Enter ingredients')
    await userEvent.type(input, 'chicken')
    await userEvent.keyboard('{Enter}')
    
    // Select dietary filter
    const vegetarianFilter = screen.getByText('Vegetarian')
    await userEvent.click(vegetarianFilter)
    
    // Generate recipes
    const generateButton = screen.getByText('Generate Recipes')
    await userEvent.click(generateButton)
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Generated Recipes')).toBeInTheDocument()
    })
  })
})
```

## Future Enhancements

### Version 2.0 Features
- **Recipe Collections**: Save and organize recipes into collections
- **Meal Planning**: Generate weekly meal plans
- **Shopping Lists**: Automatic grocery list creation
- **Recipe Rating**: Community-driven recipe ratings
- **Advanced Substitutions**: AI-powered ingredient alternatives

### Technical Improvements
- **Caching Layer**: Redis-based response caching
- **Database Integration**: Persistent recipe storage
- **Real-time Updates**: WebSocket-based live updates
- **Advanced AI**: Custom-trained models for better recipe generation
- **Image Generation**: AI-generated recipe images

## Configuration Options

### Environment Variables
```env
# Required
GEMINI_API_KEY=your_google_gemini_api_key

# Optional
NEXT_PUBLIC_MAX_INGREDIENTS=20
NEXT_PUBLIC_MAX_RECIPES_PER_REQUEST=5
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Feature Flags
```typescript
interface FeatureFlags {
  enableAdvancedFilters: boolean
  enableRecipeSharing: boolean
  enableNutritionAnalysis: boolean
  enableOfflineMode: boolean
}
```

This comprehensive documentation covers all aspects of the recipe generation feature, from technical implementation to user experience considerations.