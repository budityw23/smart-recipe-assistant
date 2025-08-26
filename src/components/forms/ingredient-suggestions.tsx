'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { searchIngredients } from '@/_data/common-ingredients'
import { cn } from '@/lib/utils'

interface IngredientSuggestionsProps {
  value: string
  onSelect: (ingredient: string) => void
  excludeIngredients: string[]
  className?: string
}

export function IngredientSuggestions({ 
  value, 
  onSelect, 
  excludeIngredients,
  className 
}: IngredientSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isVisible, setIsVisible] = useState(false)
  const debouncedValue = useDebounce(value, 300)
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (debouncedValue.length >= 2) {
      const results = searchIngredients(debouncedValue)
        .map(item => item.name)
        .filter(name => !excludeIngredients.includes(name))
        .slice(0, 6)
      
      setSuggestions(results)
      setIsVisible(results.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setIsVisible(false)
    }
  }, [debouncedValue, excludeIngredients])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isVisible || suggestions.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsVisible(false)
        setSelectedIndex(-1)
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, suggestions, selectedIndex, handleKeyDown])

  // Focus selected suggestion
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.focus()
    }
  }, [selectedIndex])

  const handleSelect = (ingredient: string) => {
    onSelect(ingredient)
    setIsVisible(false)
    setSelectedIndex(-1)
  }

  const handleClickOutside = () => {
    setTimeout(() => setIsVisible(false), 150) // Delay to allow click events
  }

  if (!isVisible || suggestions.length === 0) {
    return null
  }

  return (
    <div 
      className={cn(
        'absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto',
        className
      )}
      onBlur={handleClickOutside}
    >
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Search className="h-3 w-3" />
          <span>Suggestions</span>
        </div>
      </div>
      
      <div className="py-1">
        {suggestions.map((suggestion, index) => {
          const isAlreadyAdded = excludeIngredients.includes(suggestion)
          
          return (
            <button
              key={suggestion}
              ref={el => { suggestionRefs.current[index] = el }}
              onClick={() => !isAlreadyAdded && handleSelect(suggestion)}
              disabled={isAlreadyAdded}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors',
                selectedIndex === index && 'bg-accent text-accent-foreground',
                isAlreadyAdded && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center justify-between">
                <span>{suggestion}</span>
                {isAlreadyAdded && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="h-3 w-3" />
                    <span>Added</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {suggestions.length === 6 && (
        <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
          Keep typing for more suggestions...
        </div>
      )}
    </div>
  )
}