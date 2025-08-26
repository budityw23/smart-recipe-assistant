# Testing Guide

This document outlines the testing strategy, setup, and best practices for the Smart Recipe Assistant project.

## Testing Philosophy

We follow a comprehensive testing approach that balances thorough coverage with maintainable, reliable tests:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test component interactions and data flow
- **End-to-End Tests**: Test complete user workflows
- **Accessibility Tests**: Ensure WCAG 2.1 AA compliance
- **Performance Tests**: Validate Core Web Vitals and load times

## Testing Stack

### Core Testing Libraries

```json
{
  "jest": "^29.5.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/user-event": "^14.4.3",
  "playwright": "^1.36.0",
  "@axe-core/playwright": "^4.7.3"
}
```

### Setup Configuration

#### Jest Configuration (`jest.config.js`)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*test.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}

module.exports = createJestConfig(customJestConfig)
```

#### Jest Setup (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

// Mock environment variables
process.env.GEMINI_API_KEY = 'test-api-key'

// Setup global TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
}))
```

---

## Unit Testing

### Component Testing Best Practices

#### Basic Component Test Structure
```typescript
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Clickable</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state correctly', () => {
    render(<Button loading>Loading Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Keyboard Test</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Form Component Testing
```typescript
// src/components/forms/IngredientInput.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IngredientInput } from './IngredientInput'

describe('IngredientInput Component', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    loading: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('allows users to add ingredients', async () => {
    const user = userEvent.setup()
    render(<IngredientInput {...defaultProps} />)

    const input = screen.getByPlaceholderText('Enter ingredients')
    
    await user.type(input, 'chicken')
    await user.keyboard('{Enter}')

    expect(screen.getByText('chicken')).toBeInTheDocument()
  })

  it('prevents duplicate ingredients', async () => {
    const user = userEvent.setup()
    render(<IngredientInput {...defaultProps} />)

    const input = screen.getByPlaceholderText('Enter ingredients')
    
    // Add same ingredient twice
    await user.type(input, 'tomato')
    await user.keyboard('{Enter}')
    await user.type(input, 'tomato')
    await user.keyboard('{Enter}')

    const ingredients = screen.getAllByText('tomato')
    expect(ingredients).toHaveLength(1)
  })

  it('validates minimum ingredients requirement', async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()
    
    render(<IngredientInput {...defaultProps} onSubmit={mockSubmit} />)

    const submitButton = screen.getByText('Generate Recipes')
    await user.click(submitButton)

    expect(screen.getByText('At least one ingredient is required')).toBeInTheDocument()
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()
    
    render(<IngredientInput {...defaultProps} onSubmit={mockSubmit} />)

    // Add ingredients
    const input = screen.getByPlaceholderText('Enter ingredients')
    await user.type(input, 'chicken')
    await user.keyboard('{Enter}')
    await user.type(input, 'rice')
    await user.keyboard('{Enter}')

    // Select dietary filter
    const vegetarianFilter = screen.getByLabelText('Vegetarian')
    await user.click(vegetarianFilter)

    // Change servings
    const servingsInput = screen.getByLabelText('Servings')
    await user.clear(servingsInput)
    await user.type(servingsInput, '6')

    // Submit
    const submitButton = screen.getByText('Generate Recipes')
    await user.click(submitButton)

    expect(mockSubmit).toHaveBeenCalledWith({
      ingredients: ['chicken', 'rice'],
      dietaryFilters: ['vegetarian'],
      servings: 6
    })
  })
})
```

### Hook Testing

```typescript
// src/hooks/useRecipes.test.ts
import { renderHook, act } from '@testing-library/react'
import { useRecipes } from './useRecipes'

// Mock the API
jest.mock('@/lib/api', () => ({
  generateRecipes: jest.fn()
}))

describe('useRecipes Hook', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useRecipes())

    expect(result.current.recipes).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles recipe generation successfully', async () => {
    const mockRecipes = [
      { id: '1', title: 'Test Recipe', ingredients: [] }
    ]
    
    const mockGenerateRecipes = require('@/lib/api').generateRecipes
    mockGenerateRecipes.mockResolvedValue({ success: true, recipes: mockRecipes })

    const { result } = renderHook(() => useRecipes())

    await act(async () => {
      await result.current.generateRecipes(['chicken'], [], 4)
    })

    expect(result.current.recipes).toEqual(mockRecipes)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles API errors correctly', async () => {
    const mockError = new Error('API Error')
    const mockGenerateRecipes = require('@/lib/api').generateRecipes
    mockGenerateRecipes.mockRejectedValue(mockError)

    const { result } = renderHook(() => useRecipes())

    await act(async () => {
      await result.current.generateRecipes(['chicken'], [], 4)
    })

    expect(result.current.recipes).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(mockError)
  })
})
```

### Utility Function Testing

```typescript
// src/lib/utils.test.ts
import { formatTime, validateIngredients, calculateNutrition } from './utils'

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('formats minutes correctly', () => {
      expect(formatTime(30)).toBe('30 minutes')
      expect(formatTime(1)).toBe('1 minute')
      expect(formatTime(0)).toBe('0 minutes')
    })

    it('formats hours and minutes correctly', () => {
      expect(formatTime(90)).toBe('1 hour 30 minutes')
      expect(formatTime(60)).toBe('1 hour')
      expect(formatTime(125)).toBe('2 hours 5 minutes')
    })
  })

  describe('validateIngredients', () => {
    it('accepts valid ingredients', () => {
      const ingredients = ['chicken breast', 'olive oil', 'garlic']
      expect(validateIngredients(ingredients)).toBe(true)
    })

    it('rejects empty arrays', () => {
      expect(validateIngredients([])).toBe(false)
    })

    it('rejects arrays with empty strings', () => {
      const ingredients = ['chicken', '', 'rice']
      expect(validateIngredients(ingredients)).toBe(false)
    })
  })
})
```

---

## Integration Testing

### API Route Testing

```typescript
// src/app/api/recipes/route.test.ts
import { NextRequest } from 'next/server'
import { POST } from './route'

// Mock the Gemini API
jest.mock('@/lib/gemini', () => ({
  recipeGenerator: {
    generateRecipes: jest.fn()
  }
}))

describe('/api/recipes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles valid requests successfully', async () => {
    const mockRecipes = [
      {
        id: '1',
        title: 'Chicken Rice Bowl',
        ingredients: [],
        instructions: [],
        nutrition: {}
      }
    ]

    const { recipeGenerator } = require('@/lib/gemini')
    recipeGenerator.generateRecipes.mockResolvedValue(mockRecipes)

    const request = new NextRequest('http://localhost:3000/api/recipes', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: ['chicken', 'rice'],
        dietaryFilters: [],
        servings: 4
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.recipes).toEqual(mockRecipes)
  })

  it('validates request body correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/recipes', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: [], // Invalid: empty array
        dietaryFilters: [],
        servings: 4
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Validation Error')
  })

  it('handles API errors gracefully', async () => {
    const { recipeGenerator } = require('@/lib/gemini')
    recipeGenerator.generateRecipes.mockRejectedValue(new Error('API Error'))

    const request = new NextRequest('http://localhost:3000/api/recipes', {
      method: 'POST',
      body: JSON.stringify({
        ingredients: ['chicken'],
        dietaryFilters: [],
        servings: 4
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Error')
  })
})
```

### Full Page Integration Tests

```typescript
// src/app/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/providers/theme-provider'
import HomePage from './page'

// Mock API calls
jest.mock('@/lib/api', () => ({
  generateRecipes: jest.fn()
}))

const MockedHomePage = () => (
  <ThemeProvider>
    <HomePage />
  </ThemeProvider>
)

describe('Homepage Integration', () => {
  it('completes full recipe generation flow', async () => {
    const user = userEvent.setup()
    const mockRecipes = [
      {
        id: '1',
        title: 'Chicken Stir Fry',
        description: 'Delicious chicken stir fry',
        prepTime: '15 minutes',
        cookTime: '20 minutes',
        ingredients: [],
        instructions: [],
        nutrition: {}
      }
    ]

    const mockGenerateRecipes = require('@/lib/api').generateRecipes
    mockGenerateRecipes.mockResolvedValue({
      success: true,
      recipes: mockRecipes
    })

    render(<MockedHomePage />)

    // Enter ingredients
    const ingredientInput = screen.getByPlaceholderText('Enter ingredients')
    await user.type(ingredientInput, 'chicken')
    await user.keyboard('{Enter}')
    await user.type(ingredientInput, 'broccoli')
    await user.keyboard('{Enter}')

    // Select dietary filter
    const vegetarianFilter = screen.getByLabelText('Vegetarian')
    await user.click(vegetarianFilter)

    // Generate recipes
    const generateButton = screen.getByText('Generate Recipes')
    await user.click(generateButton)

    // Check loading state
    expect(screen.getByText('Generating your recipes...')).toBeInTheDocument()

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Chicken Stir Fry')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Verify API was called with correct data
    expect(mockGenerateRecipes).toHaveBeenCalledWith({
      ingredients: ['chicken', 'broccoli'],
      dietaryFilters: ['vegetarian'],
      servings: 4
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const mockGenerateRecipes = require('@/lib/api').generateRecipes
    mockGenerateRecipes.mockRejectedValue(new Error('Network error'))

    render(<MockedHomePage />)

    // Add ingredient and generate
    const ingredientInput = screen.getByPlaceholderText('Enter ingredients')
    await user.type(ingredientInput, 'chicken')
    await user.keyboard('{Enter}')

    const generateButton = screen.getByText('Generate Recipes')
    await user.click(generateButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error generating recipes/i)).toBeInTheDocument()
    })

    // Check retry functionality
    const retryButton = screen.getByText('Try Again')
    expect(retryButton).toBeInTheDocument()
  })
})
```

---

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

### E2E Test Examples

```typescript
// e2e/recipe-generation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Recipe Generation Flow', () => {
  test('should generate recipes successfully', async ({ page }) => {
    await page.goto('/')

    // Check page loads correctly
    await expect(page.getByRole('heading', { name: 'Smart Recipe Assistant' })).toBeVisible()

    // Add ingredients
    const ingredientInput = page.getByPlaceholder('Enter ingredients')
    await ingredientInput.fill('chicken breast')
    await ingredientInput.press('Enter')
    
    await ingredientInput.fill('rice')
    await ingredientInput.press('Enter')

    // Select dietary filter
    await page.getByText('Gluten-Free').click()

    // Generate recipes
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Wait for loading to complete
    await expect(page.getByText('Generating your recipes...')).toBeVisible()
    await expect(page.getByText('Generating your recipes...')).toBeHidden({ timeout: 10000 })

    // Check results
    await expect(page.getByText('Generated Recipes')).toBeVisible()
    await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(3)
  })

  test('should handle empty ingredients error', async ({ page }) => {
    await page.goto('/')

    // Try to generate without ingredients
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Check error message
    await expect(page.getByText('At least one ingredient is required')).toBeVisible()
  })

  test('should open recipe modal', async ({ page }) => {
    await page.goto('/')

    // Add ingredient and generate
    await page.getByPlaceholder('Enter ingredients').fill('pasta')
    await page.getByPlaceholder('Enter ingredients').press('Enter')
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Wait for results
    await expect(page.getByText('Generated Recipes')).toBeVisible()

    // Click on first recipe
    await page.locator('[data-testid="recipe-card"]').first().click()

    // Check modal opens
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  })
})
```

### Accessibility Testing with Playwright

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have accessibility violations on homepage', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.getByPlaceholder('Enter ingredients')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Generate Recipes' })).toBeFocused()

    // Test Enter key activation
    await page.getByPlaceholder('Enter ingredients').fill('chicken')
    await page.keyboard.press('Enter')
    await expect(page.getByText('chicken')).toBeVisible()
  })

  test('should announce dynamic content to screen readers', async ({ page }) => {
    await page.goto('/')

    // Add ingredient
    await page.getByPlaceholder('Enter ingredients').fill('rice')
    await page.getByPlaceholder('Enter ingredients').press('Enter')

    // Generate recipes
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Check loading announcement
    const loadingRegion = page.getByRole('status')
    await expect(loadingRegion).toHaveText('Generating your recipes...')

    // Check results announcement
    await expect(loadingRegion).toHaveText(/recipes generated/i, { timeout: 10000 })
  })
})
```

---

## Performance Testing

### Core Web Vitals Testing

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/')

    // Measure First Contentful Paint
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime)
            }
          }
        }).observe({ entryTypes: ['paint'] })
      })
    })

    expect(fcp).toBeLessThan(1500) // FCP should be under 1.5s

    // Measure Largest Contentful Paint
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Fallback timeout
        setTimeout(() => resolve(0), 5000)
      })
    })

    expect(lcp).toBeLessThan(2500) // LCP should be under 2.5s
  })

  test('should load recipe generation quickly', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.getByPlaceholder('Enter ingredients').fill('chicken')
    await page.getByPlaceholder('Enter ingredients').press('Enter')
    await page.getByRole('button', { name: 'Generate Recipes' }).click()
    
    // Wait for recipes to load
    await expect(page.getByText('Generated Recipes')).toBeVisible({ timeout: 5000 })

    const endTime = Date.now()
    const totalTime = endTime - startTime

    expect(totalTime).toBeLessThan(5000) // Total interaction should be under 5s
  })
})
```

### Load Testing

```typescript
// scripts/load-test.js
const autocannon = require('autocannon')

async function runLoadTest() {
  const result = await autocannon({
    url: 'http://localhost:3000/api/recipes',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ingredients: ['chicken', 'rice'],
      dietaryFilters: [],
      servings: 4
    }),
    connections: 10,
    duration: 30 // 30 seconds
  })

  console.log('Load test results:', result)
}

runLoadTest()
```

---

## Test Data Management

### Test Fixtures

```typescript
// __fixtures__/recipes.ts
export const mockRecipes = [
  {
    id: '1',
    title: 'Chicken Stir Fry',
    description: 'Quick and easy chicken stir fry with vegetables',
    prepTime: '15 minutes',
    cookTime: '10 minutes',
    totalTime: '25 minutes',
    difficulty: 'Easy',
    servings: 4,
    cuisine: 'Asian',
    dietaryTags: ['gluten-free'],
    ingredients: [
      {
        name: 'Chicken breast',
        amount: '500',
        unit: 'g',
        notes: 'cut into strips'
      }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Heat oil in a wok over high heat.',
        time: '1 minute'
      }
    ],
    nutrition: {
      calories: 320,
      protein: '28g',
      carbs: '12g',
      fat: '18g',
      fiber: '2g',
      sugar: '6g',
      sodium: '450mg'
    },
    tips: ['Serve immediately for best texture']
  }
]

export const mockIngredients = [
  'chicken breast',
  'broccoli',
  'bell peppers',
  'onion',
  'garlic',
  'soy sauce',
  'olive oil'
]
```

### Test Utilities

```typescript
// __utils__/test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/providers/theme-provider'

interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Custom matchers
export const expectRecipeCard = (element: HTMLElement) => ({
  toHaveRecipeTitle: (title: string) => {
    const titleElement = element.querySelector('[data-testid="recipe-title"]')
    expect(titleElement).toHaveTextContent(title)
  }
})
```

---

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test -- --coverage --watchAll=false
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run lint
        run: npm run lint
        
      - name: Build application
        run: npm run build
        
      - name: Run E2E tests
        run: npx playwright test
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/
```

## Testing Commands

```bash
# Unit and integration tests
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run tests with coverage
npm test Button             # Run specific test file

# E2E tests
npx playwright test                    # Run all E2E tests
npx playwright test --headed          # Run with visible browser
npx playwright test --debug          # Run in debug mode
npx playwright test recipe-generation # Run specific test

# Accessibility tests
npx playwright test accessibility     # Run accessibility tests

# Performance tests
npm run test:performance              # Run performance tests

# Load tests
npm run test:load                     # Run load tests
```

This comprehensive testing guide ensures that the Smart Recipe Assistant maintains high quality, reliability, and performance standards across all aspects of the application.