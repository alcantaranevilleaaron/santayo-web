"use client"

import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { Filters } from "@/app/page"
import { RESTAURANTS, type Restaurant } from "@/data/restaurants"

function getMatchedRestaurants(filters: Filters) {
  const budgetMax = parseInt(filters.budget || "1000")
  const isRandom = filters.mood === "random"
  
  const filtered = RESTAURANTS.filter((restaurant) => {
    // Check budget
    if (restaurant.budgetMax > budgetMax && filters.budget !== "1000") {
      return false
    }
    
    // Check mood (skip if random)
    if (filters.mood && !isRandom && !restaurant.tags.includes(filters.mood)) {
      return false
    }
    
    // Check cuisine
    if (filters.cuisine && filters.cuisine !== "any") {
      if (restaurant.cuisine.toLowerCase() !== filters.cuisine) {
        return false
      }
    }
    
    // Check dining type
    if (filters.dining && !restaurant.diningTypes.includes(filters.dining)) {
      return false
    }
    
    return true
  })

  // Shuffle and return up to 3
  const shuffled = filtered.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

function getMatchReason(restaurant: Restaurant, filters: Filters): string {
  const reasons: string[] = []

  if (filters.mood === "random") {
    reasons.push("A strong pick for your current vibe")
  } else if (filters.mood === "comfort" && restaurant.tags.includes("comfort")) {
    reasons.push("Great for comfort food")
  } else if (filters.mood === "healthy" && restaurant.tags.includes("healthy")) {
    reasons.push("Good for a healthier meal")
  } else if (filters.mood === "light" && restaurant.tags.includes("light")) {
    reasons.push("Nice if you want something lighter")
  } else if (filters.mood === "filling" && restaurant.tags.includes("filling")) {
    reasons.push("Good if you want something filling")
  }

  if (filters.budget && filters.budget !== "1000") {
    const budgetValue = parseInt(filters.budget, 10)

    if (!Number.isNaN(budgetValue)) {
      if (restaurant.budgetMax <= budgetValue) {
        reasons.push("fully within your budget")
      } else {
        reasons.push("with options above your budget")
      }
    }
  }

  if (filters.cuisine && filters.cuisine !== "any" && restaurant.cuisine.toLowerCase() === filters.cuisine) {
    reasons.push(`a solid ${restaurant.cuisine.toLowerCase()} option`)
  }

  if (filters.dining === "solo" && restaurant.diningTypes.includes("solo")) {
    reasons.push("works well for solo meals")
  } else if (filters.dining === "pair" && restaurant.diningTypes.includes("pair")) {
    reasons.push("nice for pairs")
  } else if (filters.dining === "group" && restaurant.diningTypes.includes("group")) {
    reasons.push("good for groups")
  }

  if (reasons.length === 0) {
    return "A solid option based on your picks."
  }

  const primary = reasons[0]
  const secondary = reasons[1]

  if (!secondary) {
    return capitalize(primary) + "."
  }

  return `${capitalize(primary)}, ${secondary}.`
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getFilterSummary(filters: Filters): string {
  const parts: string[] = []

  if (filters.mood && filters.mood !== "random") {
    parts.push(capitalize(filters.mood))
  }

  if (filters.budget && filters.budget !== "1000") {
    parts.push(`Under ₱${filters.budget}`)
  }

  if (filters.cuisine && filters.cuisine !== "any") {
    parts.push(capitalize(filters.cuisine))
  }

  if (filters.dining) {
    parts.push(capitalize(filters.dining))
  }

  // return parts.length > 0 ? parts.join(" · ") : "Based on your preferences"

  if (filters.mood === "random") {
    if (parts.length > 0) {
      return `A mix of solid picks ${parts.join(" · ")}`
    }
    return "Kami na pumili"
  }

  return parts.join(" · ")
}

type ResultsSectionProps = {
  filters: Filters
  onBack: () => void
}

export function ResultsSection({ filters, onBack }: ResultsSectionProps) {
  const restaurants = getMatchedRestaurants(filters)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="gap-2">
          <RefreshCw className="size-4" />
          New search
        </Button>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          {restaurants.length > 0 ? "Here are your top picks" : "No matches found"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {restaurants.length > 0
            ? getFilterSummary(filters)
            : "Try adjusting your filters"}
        </p>
      </div>

      <div className="space-y-3">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id}
            index={index + 1}
            name={restaurant.name}
            area={restaurant.area}
            cuisine={restaurant.cuisine}
            priceRange={restaurant.priceRange}
            dishes={restaurant.dishes}
            matchReason={getMatchReason(restaurant, filters)}
            isTopPick={filters.mood === "random" && index === 0}
          />
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No restaurants match your current filters. Try selecting different options.
          </p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            Adjust filters
          </Button>
        </div>
      )}
    </div>
  )
}
