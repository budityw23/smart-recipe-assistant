# Component Documentation

This document provides comprehensive documentation for all React components in the Smart Recipe Assistant application.

## Component Architecture

The application follows an atomic design methodology with components organized into logical categories:

- **UI Components**: Reusable, unstyled primitive components
- **Layout Components**: Application structure and navigation
- **Form Components**: Input handling and validation
- **Recipe Components**: Recipe-specific functionality
- **Utility Components**: Error handling and system components

---

## UI Components (`/src/components/ui/`)

### Button (`button.tsx`)

A versatile button component with multiple variants and states.

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  children: React.ReactNode
}
```

**Usage**:
```tsx
<Button variant="primary" size="lg" loading={isLoading}>
  Generate Recipes
</Button>

<Button variant="outline" onClick={handleClick}>
  Cancel
</Button>
```

**Variants**:
- `primary`: Primary action button (blue background)
- `secondary`: Secondary action (gray background)
- `outline`: Outlined button with transparent background
- `ghost`: Minimal styling, hover effects only
- `destructive`: Red variant for dangerous actions

### Input (`input.tsx`)

Form input component with validation states and accessibility features.

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
  label?: string
  required?: boolean
}
```

**Usage**:
```tsx
<Input
  label="Enter ingredients"
  placeholder="e.g., chicken, rice, vegetables"
  error={!!errors.ingredients}
  helperText={errors.ingredients?.message}
  required
/>
```

### Card (`card.tsx`)

Container component for grouping related content with consistent styling.

**Props**:
```typescript
interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
}
```

**Usage**:
```tsx
<Card hover onClick={handleCardClick}>
  <h3>Recipe Title</h3>
  <p>Recipe description...</p>
</Card>
```

### Modal (`modal.tsx`)

Accessible modal dialog with backdrop and focus management.

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

**Usage**:
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Recipe Details"
  size="lg"
>
  <RecipeDetails recipe={selectedRecipe} />
</Modal>
```

### Skeleton (`skeleton.tsx`)

Loading placeholder component for better perceived performance.

**Props**:
```typescript
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
}
```

**Usage**:
```tsx
<Skeleton variant="text" className="h-4 w-3/4" />
<Skeleton variant="rectangular" width={200} height={120} />
```

### LoadingSkeleton (`loading-skeleton.tsx`)

Enhanced skeleton component with shimmer animations for recipe cards.

**Props**:
```typescript
interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text'
  count?: number
  className?: string
}
```

**Usage**:
```tsx
<LoadingSkeleton type="card" count={6} />
<LoadingSkeleton type="list" count={3} />
```

---

## Layout Components (`/src/components/layout/`)

### Header (`header.tsx`)

Application header with navigation, theme toggle, and responsive design.

**Features**:
- Responsive logo and title
- Dark/light theme toggle
- Mobile-friendly navigation
- Accessibility compliant

**Usage**:
```tsx
// Automatically included in root layout
<Header />
```

### Footer (`footer.tsx`)

Application footer with links and attribution.

**Features**:
- Responsive layout
- External links with proper attributes
- Copyright information
- Social links (if configured)

**Usage**:
```tsx
// Automatically included in root layout
<Footer />
```

---

## Form Components (`/src/components/forms/`)

### IngredientInput (`ingredient-input.tsx`)

Main ingredient input form with validation and submission handling.

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

**Features**:
- Tag-based ingredient input
- Real-time validation
- Servings counter
- Submit handling with loading states

**Usage**:
```tsx
<IngredientInput
  onSubmit={handleRecipeGeneration}
  loading={isGenerating}
/>
```

### DietaryFilters (`dietary-filters.tsx`)

Multi-select component for dietary restriction filtering.

**Props**:
```typescript
interface DietaryFiltersProps {
  selected: string[]
  onChange: (filters: string[]) => void
  className?: string
}
```

**Available Filters**:
- Vegetarian
- Vegan
- Gluten-Free
- Dairy-Free
- Nut-Free
- Keto
- Paleo

**Usage**:
```tsx
<DietaryFilters
  selected={selectedFilters}
  onChange={setSelectedFilters}
/>
```

### IngredientSuggestions (`ingredient-suggestions.tsx`)

Autocomplete suggestions for ingredient input with debounced search.

**Props**:
```typescript
interface IngredientSuggestionsProps {
  query: string
  onSelect: (ingredient: string) => void
  visible: boolean
}
```

**Features**:
- Debounced search (300ms)
- Keyboard navigation
- Click-to-select functionality
- Common ingredient database

**Usage**:
```tsx
<IngredientSuggestions
  query={inputValue}
  onSelect={handleIngredientSelect}
  visible={showSuggestions}
/>
```

---

## Recipe Components (`/src/components/recipe/`)

### RecipeCard (`recipe-card.tsx`)

Basic recipe card component for grid display.

**Props**:
```typescript
interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
  onFavorite?: (id: string) => void
  isFavorite?: boolean
}
```

**Features**:
- Recipe title and description
- Cooking time and difficulty
- Dietary tags
- Favorite functionality

### RecipeCardEnhanced (`recipe-card-enhanced.tsx`)

Enhanced recipe card with gradient backgrounds and improved visual design.

**Props**:
```typescript
interface RecipeCardEnhancedProps extends RecipeCardProps {
  gradient?: string
  showNutrition?: boolean
}
```

**Additional Features**:
- Dynamic gradient backgrounds
- Nutrition summary
- Enhanced animations
- Better mobile experience

### RecipeGrid (`recipe-grid.tsx`)

Grid container for displaying multiple recipe cards with responsive layout.

**Props**:
```typescript
interface RecipeGridProps {
  recipes: Recipe[]
  loading?: boolean
  onRecipeClick: (recipe: Recipe) => void
  onFavorite?: (id: string) => void
  favorites?: string[]
}
```

**Features**:
- Responsive CSS Grid
- Loading states
- Empty states
- Infinite scroll ready

### RecipeModal (`recipe-modal.tsx`)

Detailed recipe view modal with full recipe information.

**Props**:
```typescript
interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
  onShare?: () => void
  onSave?: () => void
}
```

**Features**:
- Complete recipe details
- Ingredient list with measurements
- Step-by-step instructions
- Nutrition information
- Share and save actions

### RecipeFilters (`recipe-filters.tsx`)

Advanced filtering component for recipe search and filtering.

**Props**:
```typescript
interface RecipeFiltersProps {
  filters: RecipeFilters
  onChange: (filters: RecipeFilters) => void
  onReset: () => void
}
```

**Filter Options**:
- Search by name
- Preparation time
- Difficulty level
- Cuisine type
- Dietary restrictions
- Calorie range

### NutritionPanel (`nutrition-panel.tsx`)

Detailed nutritional information component with progress bars and daily values.

**Props**:
```typescript
interface NutritionPanelProps {
  nutrition: NutritionInfo
  showDailyValues?: boolean
  className?: string
}
```

**Features**:
- Macronutrient breakdown
- Daily value percentages
- Progress bar visualizations
- Responsive layout

### RecipeShare (`recipe-share.tsx`)

Recipe sharing component with multiple share options.

**Props**:
```typescript
interface RecipeShareProps {
  recipe: Recipe
  onShare?: (method: ShareMethod) => void
}

type ShareMethod = 'url' | 'text' | 'download' | 'print'
```

**Share Options**:
- Copy recipe URL
- Share as text
- Download as PDF
- Print recipe

### RecipeSchema (`recipe-schema.tsx`)

SEO component that generates structured data for recipes.

**Props**:
```typescript
interface RecipeSchemaProps {
  recipe: Recipe
}
```

**Features**:
- JSON-LD structured data
- Rich snippets support
- SEO optimization
- Recipe markup compliance

---

## Utility Components

### ErrorBoundary (`error-boundary.tsx`)

React error boundary component for graceful error handling.

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{error: Error, reset: () => void}>
}
```

**Features**:
- Catches JavaScript errors
- Displays user-friendly error UI
- Error reporting (if configured)
- Recovery functionality

**Usage**:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Component Patterns

### Composition Pattern

Components are designed to be composable and reusable:

```tsx
// Compose complex UI from simple components
<Card hover onClick={handleClick}>
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{recipe.title}</h3>
    <p className="text-gray-600">{recipe.description}</p>
    <div className="flex justify-between">
      <span>{recipe.prepTime}</span>
      <Button size="sm">View Recipe</Button>
    </div>
  </div>
</Card>
```

### Controlled Components

Form components follow controlled component patterns:

```tsx
const [ingredients, setIngredients] = useState<string[]>([])
const [filters, setFilters] = useState<string[]>([])

return (
  <div>
    <IngredientInput
      value={ingredients}
      onChange={setIngredients}
    />
    <DietaryFilters
      selected={filters}
      onChange={setFilters}
    />
  </div>
)
```

### Loading States

All components handle loading states gracefully:

```tsx
{loading ? (
  <LoadingSkeleton type="card" count={6} />
) : (
  <RecipeGrid recipes={recipes} />
)}
```

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus management in modals and dropdowns
- Tab order follows logical flow

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content

### Visual Accessibility
- High contrast ratios
- Focus indicators
- Scalable text and UI elements

## Performance Optimizations

### React Optimizations
- `React.memo` for expensive components
- `useCallback` for event handlers
- `useMemo` for computed values

### Bundle Optimization
- Tree-shakable imports
- Code splitting at component level
- Lazy loading for heavy components

### Runtime Performance
- Debounced search inputs
- Virtual scrolling for large lists
- Optimized re-renders

## Testing Guidelines

### Unit Testing
- Test component rendering
- Test prop handling
- Test user interactions

### Integration Testing
- Test component composition
- Test data flow
- Test error handling

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation