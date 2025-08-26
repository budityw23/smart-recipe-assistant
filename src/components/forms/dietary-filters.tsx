'use client'

import { DietaryFilter } from '@/types/recipe'
import { DIETARY_OPTIONS } from '@/_data/dietary-options'

interface DietaryFiltersProps {
  selectedFilters: string[]
  onChange: (filters: string[]) => void
  disabled?: boolean
}

export function DietaryFilters({ selectedFilters, onChange, disabled = false }: DietaryFiltersProps) {
  const handleToggle = (filter: DietaryFilter) => {
    if (selectedFilters.includes(filter)) {
      onChange(selectedFilters.filter(f => f !== filter))
    } else {
      onChange([...selectedFilters, filter])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Dietary preferences (optional):
        </h3>
        {selectedFilters.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-foreground underline disabled:opacity-50"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DIETARY_OPTIONS.map((option) => {
          const isSelected = selectedFilters.includes(option.value)
          
          return (
            <label
              key={option.value}
              className={`
                relative flex flex-col p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? `border-primary ${option.bgColor} ${option.color}` 
                  : 'border-border bg-card hover:bg-accent hover:text-accent-foreground'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                disabled={disabled}
                className="absolute opacity-0 inset-0"
              />
              <div className="flex items-center space-x-3">
                <div className="text-lg" role="img" aria-label={option.label}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className={`
                      w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
                      ${isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-border'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-2 ml-8">
                {option.description}
              </span>
            </label>
          )
        })}
      </div>

      {selectedFilters.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Selected: {selectedFilters.join(', ')}
        </div>
      )}
    </div>
  )
}