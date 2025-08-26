# Development Guide

This comprehensive guide covers everything you need to know to develop and contribute to the Smart Recipe Assistant project.

## Quick Start

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Google Gemini API Key**: Required for AI functionality

### Initial Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/smart-recipe-assistant.git
   cd smart-recipe-assistant
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your API key
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Development Workflow

### Branch Strategy

We follow a GitFlow-inspired workflow:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature development
- **hotfix/***: Critical bug fixes
- **release/***: Release preparation

### Feature Development

1. **Create Feature Branch**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Develop Feature**:
   - Write code following project conventions
   - Add/update tests as needed
   - Update documentation if required

3. **Test Your Changes**:
   ```bash
   npm run lint       # Check code style
   npm run type-check # TypeScript validation
   npm run build      # Production build test
   npm test          # Run test suite (when available)
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request via GitHub interface
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat: add ingredient substitution feature
fix(api): handle empty ingredient list error
docs: update deployment guide
style: format component files with prettier
refactor: extract recipe card logic to custom hook
```

---

## Project Structure Deep Dive

```
smart-recipe-assistant/
├── public/                 # Static assets
│   ├── icons/             # PWA icons
│   ├── images/            # Static images
│   └── manifest.json      # PWA manifest
├── src/
│   ├── app/               # Next.js 14 App Router
│   │   ├── api/           # API routes
│   │   │   ├── recipes/   # Recipe generation endpoint
│   │   │   └── substitutions/ # Ingredient substitution endpoint
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout component
│   │   └── page.tsx       # Homepage component
│   ├── components/        # React components
│   │   ├── ui/            # Base UI components
│   │   ├── layout/        # Layout components
│   │   ├── forms/         # Form components
│   │   └── recipe/        # Recipe-specific components
│   ├── lib/               # Utility libraries
│   │   ├── gemini.ts      # Google Gemini API client
│   │   ├── validations.ts # Zod validation schemas
│   │   └── utils.ts       # General utilities
│   ├── hooks/             # Custom React hooks
│   │   ├── useRecipes.ts  # Recipe management hook
│   │   └── useTheme.ts    # Theme management hook
│   ├── types/             # TypeScript type definitions
│   │   └── recipe.ts      # Recipe-related types
│   └── providers/         # React context providers
│       └── theme-provider.tsx # Theme context
├── docs/                  # Project documentation
├── .env.example          # Environment variables template
├── .env.local           # Local environment variables (gitignored)
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

---

## Development Commands

### Essential Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Code Quality
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Prettier (if configured)

# Analysis
npm run analyze      # Analyze bundle size
npm run audit        # Security audit
```

### Custom Scripts

Add these to your `package.json` for enhanced development:

```json
{
  "scripts": {
    "dev:turbo": "next dev --turbo",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "clean": "rm -rf .next out node_modules/.cache",
    "deps:update": "npm-check-updates -u"
  }
}
```

---

## API Development

### Creating New Endpoints

1. **Create Route File**:
   ```typescript
   // src/app/api/your-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server'
   import { z } from 'zod'
   
   // Define request schema
   const RequestSchema = z.object({
     field: z.string().min(1)
   })
   
   export async function POST(request: NextRequest) {
     try {
       const body = await request.json()
       const validatedData = RequestSchema.parse(body)
       
       // Your logic here
       const result = await processRequest(validatedData)
       
       return NextResponse.json({
         success: true,
         data: result
       })
     } catch (error) {
       return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
       )
     }
   }
   ```

2. **Add Type Definitions**:
   ```typescript
   // src/types/api.ts
   export interface YourEndpointRequest {
     field: string
   }
   
   export interface YourEndpointResponse {
     success: boolean
     data?: any
     error?: string
   }
   ```

3. **Create Client Function**:
   ```typescript
   // src/lib/api.ts
   export async function callYourEndpoint(data: YourEndpointRequest) {
     const response = await fetch('/api/your-endpoint', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
     })
     
     return response.json()
   }
   ```

### API Testing

```typescript
// __tests__/api/your-endpoint.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/your-endpoint/route'

describe('/api/your-endpoint', () => {
  it('should handle valid requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { field: 'test' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
  })
})
```

---

## Component Development

### Component Creation Checklist

1. **Create Component File**:
   ```typescript
   // src/components/category/ComponentName.tsx
   import React from 'react'
   
   interface ComponentNameProps {
     // Define props with TypeScript
   }
   
   export const ComponentName: React.FC<ComponentNameProps> = ({
     // Destructure props
   }) => {
     return (
       <div>
         {/* Component JSX */}
       </div>
     )
   }
   
   export default ComponentName
   ```

2. **Add PropTypes/Types** (TypeScript handles this)

3. **Create Stories** (if using Storybook):
   ```typescript
   // src/components/category/ComponentName.stories.ts
   import type { Meta, StoryObj } from '@storybook/react'
   import { ComponentName } from './ComponentName'
   
   const meta: Meta<typeof ComponentName> = {
     title: 'Components/ComponentName',
     component: ComponentName,
     parameters: {
       layout: 'centered'
     }
   }
   
   export default meta
   type Story = StoryObj<typeof meta>
   
   export const Default: Story = {
     args: {
       // Default props
     }
   }
   ```

4. **Write Tests**:
   ```typescript
   // src/components/category/ComponentName.test.tsx
   import { render, screen } from '@testing-library/react'
   import { ComponentName } from './ComponentName'
   
   describe('ComponentName', () => {
     it('renders correctly', () => {
       render(<ComponentName />)
       expect(screen.getByText('Expected text')).toBeInTheDocument()
     })
   })
   ```

### Component Patterns

#### Custom Hooks

```typescript
// src/hooks/useCustomHook.ts
import { useState, useEffect } from 'react'

export function useCustomHook(dependency: string) {
  const [state, setState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await someAsyncOperation(dependency)
        setState(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dependency])

  return { state, loading, error }
}
```

#### Context Providers

```typescript
// src/providers/CustomProvider.tsx
import React, { createContext, useContext, useReducer } from 'react'

interface State {
  // Define state shape
}

interface Actions {
  // Define actions
}

const StateContext = createContext<State | null>(null)
const ActionsContext = createContext<Actions | null>(null)

export function CustomProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const actions = {
    // Define action creators
  }

  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  )
}

export function useCustomState() {
  const context = useContext(StateContext)
  if (!context) throw new Error('useCustomState must be used within CustomProvider')
  return context
}

export function useCustomActions() {
  const context = useContext(ActionsContext)
  if (!context) throw new Error('useCustomActions must be used within CustomProvider')
  return context
}
```

---

## Styling Guidelines

### Tailwind CSS Usage

1. **Responsive Design**:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Responsive grid */}
   </div>
   ```

2. **Dark Mode**:
   ```tsx
   <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
     {/* Theme-aware styling */}
   </div>
   ```

3. **Component Variants**:
   ```tsx
   const buttonVariants = {
     primary: 'bg-blue-600 hover:bg-blue-700 text-white',
     secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
     outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
   }
   ```

### Custom CSS (When Needed)

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .recipe-card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow;
  }
  
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  }
}

@layer utilities {
  .text-gradient {
    background: linear-gradient(90deg, theme('colors.blue.600'), theme('colors.purple.600'));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

---

## State Management

### Local State (useState)

```typescript
const [state, setState] = useState<StateType>(initialValue)

// Functional updates for complex state
setState(prev => ({
  ...prev,
  field: newValue
}))
```

### Form State

```typescript
// Using controlled components
const [formData, setFormData] = useState({
  ingredients: [] as string[],
  dietaryFilters: [] as string[],
  servings: 4
})

const handleInputChange = (field: keyof typeof formData, value: any) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }))
}
```

### Global State (Context)

```typescript
// For app-wide state like theme, user preferences
const { theme, toggleTheme } = useTheme()
const { recipes, loading, error } = useRecipes()
```

---

## Performance Optimization

### React Optimizations

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return expensiveCalculation(data)
}, [data])

// Memoize callback functions
const handleClick = useCallback(() => {
  // Handle click
}, [dependency])

// Memoize components
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.id === nextProps.id
})
```

### Next.js Optimizations

```typescript
// Dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false // Client-side only if needed
})

// Image optimization
import Image from 'next/image'

<Image
  src="/recipe-image.jpg"
  alt="Recipe"
  width={300}
  height={200}
  priority // For above-the-fold images
/>
```

---

## Testing Strategy

### Unit Testing Setup

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

module.exports = createJestConfig(customJestConfig)
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

### Test Examples

```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

// Hook testing
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

---

## Debugging

### Development Tools

1. **React Developer Tools**: Browser extension for component inspection
2. **Next.js DevTools**: Built-in development features
3. **VS Code Extensions**:
   - ES7+ React/Redux/React-Native snippets
   - Auto Rename Tag
   - Bracket Pair Colorizer
   - GitLens

### Debugging Techniques

```typescript
// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Error boundaries for React errors
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

// API debugging
const debugAPI = (url: string, options: any) => {
  console.log(`API Call: ${url}`, options)
  return fetch(url, options).then(response => {
    console.log(`API Response: ${url}`, response.status)
    return response
  })
}
```

---

## Contributing Guidelines

### Code Review Process

1. **Self Review**: Review your own PR before requesting review
2. **Automated Checks**: Ensure all CI checks pass
3. **Peer Review**: At least one other developer reviews
4. **Documentation**: Update docs if needed
5. **Testing**: Add/update tests for new features

### Review Checklist

- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] Components are accessible
- [ ] Performance implications considered
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] No console.logs in production code
- [ ] Error handling is implemented

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code changes with clear descriptions
- **Documentation**: Keep docs up to date

---

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

2. **TypeScript Errors**:
   ```bash
   # Run type check
   npm run type-check
   
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   ```

3. **Styling Issues**:
   ```bash
   # Rebuild Tailwind
   npm run build
   ```

4. **API Key Issues**:
   - Verify `.env.local` file exists
   - Check variable names match exactly
   - Restart development server after changes

### Getting Help

- Check existing GitHub issues
- Review documentation thoroughly
- Create detailed issue reports with:
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details
  - Error messages/logs

---

This development guide should provide everything you need to contribute effectively to the Smart Recipe Assistant project. For additional questions, please refer to the other documentation files or create a GitHub issue.