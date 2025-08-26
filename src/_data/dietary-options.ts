import { DietaryFilter } from '@/types/recipe'

export interface DietaryOption {
  value: DietaryFilter
  label: string
  description: string
  icon: string
  color: string
  bgColor: string
}

export const DIETARY_OPTIONS: DietaryOption[] = [
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat, poultry, or seafood',
    icon: '🥕',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'No animal products whatsoever',
    icon: '🌱',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
  {
    value: 'gluten-free',
    label: 'Gluten-Free',
    description: 'No wheat, barley, rye, or gluten',
    icon: '🌾',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
  },
  {
    value: 'dairy-free',
    label: 'Dairy-Free',
    description: 'No milk, cheese, or dairy products',
    icon: '🥛',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    value: 'keto',
    label: 'Keto',
    description: 'Low-carb, high-fat ketogenic diet',
    icon: '🥑',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    value: 'paleo',
    label: 'Paleo',
    description: 'Natural, unprocessed whole foods',
    icon: '🦴',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
  },
]

export const getDietaryOption = (filter: DietaryFilter): DietaryOption | undefined => {
  return DIETARY_OPTIONS.find(option => option.value === filter)
}

export const getDietaryFilterLabels = (filters: DietaryFilter[]): string[] => {
  return filters.map(filter => {
    const option = getDietaryOption(filter)
    return option ? option.label : filter
  })
}