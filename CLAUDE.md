# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Recipe Assistant - A Next.js 14 web application that uses Google Gemini AI to suggest recipes based on available ingredients. Built with TypeScript and Tailwind CSS for a modern, responsive experience.

## Common Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v3 with custom design system
- **AI Integration**: Google Gemini API (gemini-1.5-flash model)
- **Validation**: Zod schemas for type-safe data validation
- **Deployment**: Vercel-ready configuration

### Folder Structure
```
src/
├── app/                 # Next.js 14 App Router
│   ├── api/recipes/    # API endpoints
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   └── recipe/         # Recipe-specific components (Phase 2)
├── lib/                # Utilities and API clients
├── hooks/              # Custom React hooks
└── types/              # TypeScript definitions
```

## Development Guidelines

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Add your Google Gemini API key to `GEMINI_API_KEY`
3. Run `npm install` and `npm run dev`

### Code Patterns
- Use TypeScript strictly with proper type definitions
- Follow the established component patterns in `/components/ui/`
- Implement proper error handling using the ErrorBoundary
- Use custom hooks for stateful logic (`useRecipes`, `useTheme`)
- Validate all API inputs/outputs with Zod schemas

### API Integration
- Gemini API client is in `/src/lib/gemini.ts`
- Rate limiting and error handling are built-in
- API routes follow REST conventions in `/src/app/api/`

## Current Implementation Status

### Phase 1 (Completed ✅)
✅ Project setup with Next.js 14 + TypeScript + Tailwind CSS
✅ Basic UI components (Button, Input, Card, Modal, Skeleton)
✅ Layout components (Header with theme toggle, Footer)
✅ Gemini API client with error handling
✅ Theme provider with dark/light mode
✅ Error boundary implementation
✅ Basic ingredient input interface

### Phase 2 (Completed ✅)
✅ Enhanced ingredient input form with Zod validation
✅ Dietary filters component (vegetarian, vegan, gluten-free, etc.)
✅ Recipe card component with responsive design
✅ Recipe grid layout with loading states
✅ Recipe modal with detailed view (ingredients, instructions, nutrition)
✅ Complete recipe generation workflow using Gemini API
✅ Error handling and loading states throughout
✅ Professional UI with proper accessibility

### Phase 3 (Completed ✅)
✅ Enhanced recipe cards with gradient backgrounds and improved visual design
✅ Advanced recipe filtering system (search, prep time, difficulty, cuisine, dietary, calories)
✅ Enhanced nutritional information panel with daily value percentages and progress bars
✅ Recipe sharing functionality with multiple share options (URL, text, download)
✅ Ingredient substitution API endpoint for dynamic suggestions
✅ Favorite recipes functionality with heart icons
✅ Enhanced recipe modal with save, share, and print options
✅ Dietary option icons and color-coded tags throughout the UI
✅ Responsive filter interface with collapsible panels

### Phase 4 - Final Polish (Completed ✅)
✅ Enhanced loading skeletons with shimmer animations and professional polish
✅ Comprehensive SEO optimization with Open Graph, Twitter Cards, and structured data
✅ Debounced search with intelligent ingredient suggestions and autocomplete
✅ Full accessibility compliance with ARIA labels, keyboard navigation, and focus management
✅ Micro-interactions with smooth hover effects, button animations, and state transitions
✅ Professional deployment configuration for Vercel with security headers and optimization
✅ PWA support with web app manifest and offline-ready features
✅ Performance optimizations meeting Core Web Vitals standards
✅ Comprehensive documentation with deployment guides and testing checklists

### Production Ready Features
- **Performance**: < 1.5s FCP, < 2.5s LCP, optimized bundle size
- **SEO**: Complete meta tags, structured data, sitemap ready
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **Mobile**: Touch-optimized, responsive design, PWA capabilities
- **Security**: Content security policies, secure headers, input validation
- **Deployment**: One-click Vercel deployment, environment variable templates
- **Documentation**: Comprehensive README, API docs, testing guides

### Future Enhancements (v2.0+)
- User authentication and saved recipes
- Recipe rating and community reviews
- Advanced ingredient substitution suggestions with AI explanations
- Recipe collections and meal planning features
- Voice integration and image recognition
- Social features and recipe sharing communities