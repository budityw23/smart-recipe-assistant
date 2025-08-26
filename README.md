# Smart Recipe Assistant 🍳

> **Live Demo**: [smartrecipe.vercel.app](https://smartrecipe.vercel.app) *(coming soon)*

An advanced AI-powered web application that transforms your available ingredients into personalized recipe suggestions. Built with Next.js 14, TypeScript, and Google Gemini AI for a professional portfolio showcase.

![Smart Recipe Assistant](public/og-image.png)

## 🌟 **Key Features**

### 🤖 **AI-Powered Recipe Generation**
- **Intelligent Suggestions**: Uses Google Gemini 1.5 Flash for creative, practical recipes
- **Context-Aware**: Considers dietary restrictions, cooking skill level, and available time
- **Multi-Cuisine Support**: Generates recipes from various world cuisines

### 🎯 **Advanced Filtering & Search**
- **Smart Search**: Real-time ingredient suggestions with debounced input
- **Multi-Criteria Filtering**: Filter by prep time, difficulty, calories, cuisine, and dietary needs
- **Visual Dietary Tags**: Color-coded icons for vegetarian 🥕, vegan 🌱, keto 🥑, etc.

### 📱 **Professional UX/UI**
- **Mobile-First Design**: Fully responsive with touch-optimized interactions
- **Dark/Light Mode**: System-aware theme switching with smooth transitions
- **Micro-Interactions**: Hover effects, loading animations, and smooth state changes
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### 📊 **Enhanced Recipe Experience**
- **Detailed Nutrition**: Comprehensive nutritional information with daily value percentages
- **Smart Substitutions**: AI-generated ingredient alternatives for dietary needs
- **Recipe Sharing**: Multiple sharing options including URL, formatted text, and downloadable files
- **Structured Data**: SEO-optimized with recipe schema markup for search engines

## 🛠 **Tech Stack**

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | Next.js | 14.2+ | React framework with App Router |
| **Language** | TypeScript | 5.6+ | Type safety and developer experience |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first styling with custom design system |
| **AI** | Google Gemini API | 1.5 Flash | Recipe generation and ingredient analysis |
| **Validation** | Zod | 3.23+ | Runtime type validation and schema parsing |
| **Icons** | Lucide React | 0.468+ | Consistent icon library |
| **Deployment** | Vercel | Latest | Serverless deployment with edge functions |

## ⚡ **Quick Start**

### Prerequisites
- **Node.js**: 18.17.0 or later
- **Google Gemini API Key**: [Get one free](https://ai.google.dev/gemini-api/docs/api-key)
- **Package Manager**: npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-recipe-assistant.git
cd smart-recipe-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Gemini API key to .env.local
echo "GEMINI_API_KEY=your_api_key_here" >> .env.local

# Start development server
npm run dev
```

**🌐 Open [http://localhost:3000](http://localhost:3000)** to see the application.

## 📁 **Project Architecture**

### **Folder Structure**
```
smart-recipe-assistant/
├── 📁 src/
│   ├── 📁 app/                    # Next.js 14 App Router
│   │   ├── api/recipes/          # Recipe generation API
│   │   ├── api/substitutions/    # Ingredient substitution API
│   │   ├── layout.tsx            # Root layout with SEO
│   │   └── page.tsx              # Homepage with recipe workflow
│   ├── 📁 components/            # React components
│   │   ├── ui/                   # Base UI components (Button, Card, Modal)
│   │   ├── forms/                # Form components with validation
│   │   ├── recipe/               # Recipe-specific components
│   │   └── layout/               # Layout components (Header, Footer)
│   ├── 📁 lib/                   # Core utilities
│   │   ├── gemini.ts            # Gemini API client
│   │   ├── utils.ts             # Helper functions
│   │   └── validations.ts       # Zod schemas
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 types/                # TypeScript definitions
│   └── 📁 _data/                # Static data and configurations
├── 📁 public/                   # Static assets and PWA files
├── 📄 vercel.json              # Deployment configuration
└── 📄 next.config.js           # Next.js configuration
```

### **Component Hierarchy**
```
App Layout
├── Header (Navigation, Theme Toggle, Branding)
├── Main Content
│   ├── Hero Section
│   ├── Ingredient Input Form
│   │   ├── Smart Input with Suggestions
│   │   ├── Dietary Filters
│   │   └── Validation & Submit
│   ├── Advanced Recipe Filters
│   ├── Recipe Grid (Responsive Layout)
│   │   └── Recipe Cards (Enhanced with Images)
│   └── Recipe Modal (Detailed View)
│       ├── Comprehensive Nutrition Panel
│       ├── Step-by-Step Instructions
│       ├── Ingredient Substitutions
│       └── Sharing Options
└── Footer (Branding, Links, Attribution)
```

## 🧪 **Development Commands**

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build           # Create optimized production build  
npm run start           # Start production server locally
npm run lint            # Run ESLint for code quality
npm run type-check      # Run TypeScript compiler checks

# Testing & Quality Assurance
npm run test            # Run unit tests (if implemented)
npm run test:e2e        # Run end-to-end tests (if implemented)
npm run analyze         # Analyze bundle size and dependencies
```

## 🚀 **Deployment Guide**

### **Vercel (Recommended)**

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   
   # Connect to Vercel
   # Visit https://vercel.com/new
   # Import your GitHub repository
   ```

2. **Configure Environment Variables**
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   GEMINI_API_KEY=your_production_api_key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Automatic deployment on every push
   - Preview deployments for pull requests
   - Production deployment from main branch

### **Manual Deployment**
```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to your hosting provider
# Upload .next folder and package.json
# Install dependencies: npm ci --production
# Start: npm start
```

## ⚙️ **Configuration**

### **Environment Variables**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key | `AIza...` |
| `NEXT_PUBLIC_APP_URL` | ❌ Optional | App URL for SEO/sharing | `https://yourapp.com` |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ Optional | API rate limit | `50` |
| `RATE_LIMIT_WINDOW_MS` | ❌ Optional | Rate limit window | `3600000` |

### **Customization Options**

```typescript
// src/lib/constants.ts - App configuration
export const APP_CONFIG = {
  maxIngredients: 15,
  minIngredients: 2,
  debounceDelay: 300,
  recipesPerGeneration: 3,
}

// Customize dietary options in src/_data/dietary-options.ts
// Modify color schemes in tailwind.config.js
// Update API prompts in src/lib/gemini.ts
```

## 📈 **Performance & SEO**

### **Core Web Vitals**
- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Largest Contentful Paint**: < 2.5s  
- ✅ **Cumulative Layout Shift**: < 0.1
- ✅ **First Input Delay**: < 100ms

### **SEO Features**
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Structured Data**: Recipe schema markup for rich snippets
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine optimization
- **PWA Support**: Web app manifest and service worker ready

### **Performance Optimizations**
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Route-based and component-based splitting
- **Caching**: API response caching and static asset optimization
- **Bundle Analysis**: Optimized for minimal bundle size

## 🧪 **Testing Guide**

### **Manual Testing Checklist**

**✅ Core Functionality**
- [ ] Add/remove ingredients with validation
- [ ] Generate recipes with various ingredient combinations
- [ ] Apply dietary filters (vegetarian, vegan, etc.)
- [ ] View detailed recipe information
- [ ] Share recipes via different methods

**✅ Responsive Design**
- [ ] Test on mobile phones (iOS/Android)
- [ ] Test on tablets (iPad/Android tablets)
- [ ] Test on desktop (Chrome/Firefox/Safari)
- [ ] Test landscape/portrait orientations

**✅ Accessibility**
- [ ] Keyboard navigation works throughout
- [ ] Screen reader compatibility (NVDA/JAWS)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible and logical

**✅ Performance**
- [ ] Page loads within 3 seconds
- [ ] Smooth animations and transitions
- [ ] No layout shifts during loading
- [ ] Efficient API response times

## 🎯 **Portfolio Showcase**

### **Technical Highlights**
- **Modern Architecture**: Next.js 14 App Router with TypeScript
- **AI Integration**: Advanced prompt engineering with Gemini API
- **State Management**: Efficient React hooks and context patterns
- **Performance**: Optimized for Core Web Vitals and SEO
- **Accessibility**: WCAG 2.1 AA compliant design
- **Professional UI**: Polished design with micro-interactions

### **Business Value Demonstration**
- **User Experience**: Intuitive ingredient-to-recipe workflow
- **Scalability**: Modular component architecture
- **SEO Ready**: Structured data and meta tag optimization
- **Mobile-First**: Responsive design for all device types
- **Production-Ready**: Comprehensive error handling and validation

## 📋 **Future Enhancements**

### **v2.0 Planned Features**
- [ ] **User Authentication**: Save favorite recipes and preferences
- [ ] **Recipe Collections**: Create and manage recipe collections
- [ ] **Meal Planning**: Weekly meal planning with shopping lists
- [ ] **Recipe Rating**: Community-driven recipe feedback system
- [ ] **Advanced AI**: Enhanced substitution suggestions with explanations

### **v3.0 Vision**
- [ ] **Voice Integration**: Voice input for hands-free cooking
- [ ] **Image Recognition**: Identify ingredients from photos
- [ ] **Social Features**: Recipe sharing and cooking communities
- [ ] **IoT Integration**: Smart kitchen appliance connectivity
- [ ] **Nutrition Tracking**: Personal dietary goal monitoring

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the code style**: Run `npm run lint` before committing
4. **Add tests**: Ensure your changes are tested
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Provide a clear description of changes

### **Code Style Guidelines**
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure responsive design for new UI components

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🙏 **Acknowledgments**

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Vercel](https://vercel.com/)** - Seamless deployment platform  
- **[Google AI](https://ai.google.dev/)** - Gemini API for recipe generation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide](https://lucide.dev/)** - Beautiful icon library
- **[Zod](https://zod.dev/)** - TypeScript-first validation

---

**Built with ❤️ as a portfolio showcase | [View Live Demo](https://smartrecipe.vercel.app)**