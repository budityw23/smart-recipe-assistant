'use client'

import { TrendingUp, Zap, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NutritionInfo } from '@/types/recipe'
import { cn } from '@/lib/utils'

interface NutritionPanelProps {
  nutrition: NutritionInfo
  servings?: number
  className?: string
}

interface NutrientData {
  label: string
  value: string | number
  unit?: string
  percentage?: number
  color: string
  bgColor: string
  icon: React.ReactNode
}

export function NutritionPanel({ nutrition, servings = 1, className }: NutritionPanelProps) {
  // Calculate daily value percentages (based on 2000 calorie diet)
  const getDailyValuePercentage = (nutrient: string, value: number) => {
    const dailyValues: Record<string, number> = {
      calories: 2000,
      protein: 50, // grams
      carbs: 300, // grams  
      fat: 65, // grams
      fiber: 25, // grams
      sugar: 50, // grams
    }
    
    return dailyValues[nutrient] ? Math.round((value / dailyValues[nutrient]) * 100) : 0
  }

  // Parse numeric values from strings like "25g"
  const parseNutrientValue = (value: string): number => {
    return parseInt(value.replace(/[^\d.]/g, '')) || 0
  }

  const nutrients: NutrientData[] = [
    {
      label: 'Calories',
      value: nutrition.calories,
      percentage: getDailyValuePercentage('calories', nutrition.calories),
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      icon: <Zap className="h-4 w-4" />,
    },
    {
      label: 'Protein',
      value: parseNutrientValue(nutrition.protein),
      unit: 'g',
      percentage: getDailyValuePercentage('protein', parseNutrientValue(nutrition.protein)),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: 'Carbs',
      value: parseNutrientValue(nutrition.carbs),
      unit: 'g',
      percentage: getDailyValuePercentage('carbs', parseNutrientValue(nutrition.carbs)),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: 'Fat',
      value: parseNutrientValue(nutrition.fat),
      unit: 'g',
      percentage: getDailyValuePercentage('fat', parseNutrientValue(nutrition.fat)),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  const secondaryNutrients = [
    { label: 'Fiber', value: nutrition.fiber, color: 'text-green-600' },
    { label: 'Sugar', value: nutrition.sugar, color: 'text-pink-600' },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Nutrition Facts
          {servings > 1 && (
            <span className="text-sm font-normal text-muted-foreground">
              (per serving)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Nutrients Grid */}
        <div className="grid grid-cols-2 gap-4">
          {nutrients.map((nutrient, index) => (
            <div
              key={index}
              className={cn(
                'relative p-4 rounded-lg border-l-4 border-l-current',
                nutrient.color,
                nutrient.bgColor
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {nutrient.icon}
                  <span className="text-sm font-medium text-foreground">
                    {nutrient.label}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {nutrient.value}{nutrient.unit}
                </div>
                
                {nutrient.percentage && nutrient.percentage > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                      <div
                        className={cn('h-full transition-all duration-500', nutrient.color.replace('text-', 'bg-'))}
                        style={{ width: `${Math.min(nutrient.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {nutrient.percentage}% DV
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Nutrients */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Additional Info</h4>
          <div className="grid grid-cols-2 gap-4">
            {secondaryNutrients.map((nutrient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-sm text-muted-foreground">{nutrient.label}</span>
                <span className={cn('text-sm font-medium', nutrient.color)}>
                  {nutrient.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Label Footer */}
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <p>
            * Percent Daily Values are based on a 2,000 calorie diet. Your daily
            values may be higher or lower depending on your calorie needs.
          </p>
          {servings > 1 && (
            <p className="mt-1">
              Total recipe makes {servings} servings. Values shown are per serving.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}