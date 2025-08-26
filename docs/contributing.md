# Contributing Guide

Thank you for your interest in contributing to Smart Recipe Assistant! This document provides guidelines and information for contributors to help maintain code quality and project consistency.

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: For version control
- **Google Gemini API Key**: For testing AI functionality

### Development Setup

1. **Fork and Clone**:
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/your-username/smart-recipe-assistant.git
   cd smart-recipe-assistant
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your API key
   echo "GEMINI_API_KEY=your_api_key_here" >> .env.local
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Verify Setup**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Test recipe generation functionality
   - Check that all features work correctly

---

## Contributing Workflow

### 1. Choose an Issue

- Browse [open issues](https://github.com/yourusername/smart-recipe-assistant/issues)
- Look for issues labeled `good first issue` for beginners
- Comment on the issue to express interest and get assigned

### 2. Create a Branch

```bash
# Create a new branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Make Your Changes

Follow these guidelines while coding:

#### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use descriptive variable and function names
- Add comments for complex logic only

#### Component Guidelines
```typescript
// ✅ Good component structure
interface ComponentProps {
  required: string
  optional?: number
}

export const Component: React.FC<ComponentProps> = ({ 
  required, 
  optional = defaultValue 
}) => {
  // Hooks at the top
  const [state, setState] = useState<Type>(initial)
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Handler logic
  }, [dependencies])
  
  // Render
  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  )
}
```

#### API Guidelines
```typescript
// ✅ Good API route structure
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json()
    const validatedData = Schema.parse(body)
    
    // 2. Process business logic
    const result = await processData(validatedData)
    
    // 3. Return consistent response
    return NextResponse.json({
      success: true,
      data: result
    })
    
  } catch (error) {
    // 4. Handle errors
    return handleError(error)
  }
}
```

### 4. Test Your Changes

```bash
# Run all checks before committing
npm run lint          # Check code style
npm run type-check    # TypeScript validation
npm run build         # Test production build

# Run tests (when available)
npm test
```

### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Commit message format
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git add .
git commit -m "feat: add ingredient substitution feature"
git commit -m "fix(api): handle empty ingredient list properly"
git commit -m "docs: update component documentation"
git commit -m "refactor: extract recipe filtering logic to custom hook"
```

### 6. Push and Create Pull Request

```bash
# Push your changes
git push origin feature/your-feature-name

# Create pull request via GitHub interface
```

**Pull Request Guidelines:**
- Use a descriptive title
- Reference related issues with `Closes #123`
- Provide clear description of changes
- Include screenshots for UI changes
- Add testing instructions

**PR Template:**
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All checks pass
- [ ] No console errors
- [ ] Responsive design verified

## Screenshots (if applicable)
Add screenshots here

## Closes
Closes #123
```

---

## Code Standards

### TypeScript Guidelines

```typescript
// ✅ Use strict types
interface Recipe {
  id: string
  title: string
  ingredients: Ingredient[]
  instructions: Instruction[]
}

// ✅ Use enums for constants
enum DifficultyLevel {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

// ✅ Use proper error types
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

// ❌ Avoid any type
const data: any = response.json() // Don't do this

// ✅ Use proper typing
const data: ApiResponse = await response.json()
```

### React Best Practices

```typescript
// ✅ Use functional components
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{/* content */}</div>
}

// ✅ Use proper hooks
const [loading, setLoading] = useState(false)
const [data, setData] = useState<Data | null>(null)

// ✅ Memoize expensive operations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// ✅ Use proper dependency arrays
const handleClick = useCallback(() => {
  processData(data)
}, [data])

// ❌ Don't mutate props
const Component = ({ items }) => {
  items.push(newItem) // Don't do this
  return <div>{/* content */}</div>
}

// ✅ Create new arrays/objects
const Component = ({ items }) => {
  const newItems = [...items, newItem]
  return <div>{/* content */}</div>
}
```

### CSS and Styling

```typescript
// ✅ Use Tailwind utility classes
<div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">

// ✅ Create component variants
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900'
}

// ✅ Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Support dark mode
<div className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">
```

---

## Testing Guidelines

### Component Testing

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### API Testing

```typescript
// Example API test
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/recipes/route'

describe('/api/recipes', () => {
  it('generates recipes successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ingredients: ['chicken', 'rice'],
        dietaryFilters: [],
        servings: 4
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(data.recipes).toBeDefined()
  })
})
```

---

## Documentation Standards

### Code Documentation

```typescript
/**
 * Generates recipes based on available ingredients using AI
 * 
 * @param ingredients - Array of available ingredients
 * @param dietaryFilters - Optional dietary restrictions
 * @param servings - Number of people to serve (default: 4)
 * @returns Promise resolving to generated recipes
 * 
 * @example
 * ```typescript
 * const recipes = await generateRecipes(
 *   ['chicken', 'rice', 'vegetables'],
 *   ['gluten-free'],
 *   4
 * )
 * ```
 */
export async function generateRecipes(
  ingredients: string[],
  dietaryFilters: string[] = [],
  servings: number = 4
): Promise<Recipe[]> {
  // Implementation
}
```

### README Updates

When adding new features, update relevant documentation:

- Update feature list in README
- Add usage examples
- Update screenshots if UI changed
- Document any new environment variables

### Component Documentation

```typescript
// Component prop documentation
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode
  
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline'
  
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  
  /** Whether button is in loading state */
  loading?: boolean
  
  /** Click event handler */
  onClick?: () => void
}
```

---

## Review Process

### Self Review Checklist

Before requesting review:

- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] Components are accessible (ARIA labels, keyboard navigation)
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design works on mobile
- [ ] Dark mode is supported
- [ ] No console.log statements in production code
- [ ] Tests pass (when available)
- [ ] Build succeeds without warnings

### Code Review Guidelines

**For Reviewers:**
- Focus on logic, performance, and maintainability
- Check for accessibility issues
- Verify TypeScript usage is correct
- Ensure error handling is present
- Test the changes locally when possible

**For Contributors:**
- Respond to feedback promptly
- Ask questions if feedback is unclear
- Make requested changes in separate commits
- Keep discussions professional and constructive

---

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Specific code feedback

### Asking Questions

When asking for help:

1. **Search existing issues** first
2. **Provide context** about what you're trying to achieve
3. **Include error messages** and relevant code
4. **Describe what you've tried** already
5. **Specify your environment** (OS, Node version, etc.)

### Issue Templates

**Bug Report:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

**Feature Request:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features.

**Additional context**
Any other context or screenshots.
```

---

## Recognition

### Contributors

We maintain a list of contributors in the README and celebrate contributions through:

- GitHub contributor graphs
- Release notes mentioning contributors
- Special recognition for significant contributions

### Types of Contributions

We value all types of contributions:

- **Code**: New features, bug fixes, optimizations
- **Documentation**: Guides, API docs, README improvements
- **Design**: UI/UX improvements, accessibility enhancements
- **Testing**: Test coverage, bug reports
- **Community**: Helping other users, discussions, feedback

---

## License

By contributing to Smart Recipe Assistant, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Smart Recipe Assistant! Your help makes this project better for everyone. 🙏