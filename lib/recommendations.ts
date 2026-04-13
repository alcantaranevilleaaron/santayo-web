import type { Filters } from "@/app/page"
import { RESTAURANTS, type Restaurant } from "@/data/restaurants"

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export function getMatchedRestaurants(filters: Filters, count = 3): Restaurant[] {
  const budgetMax = parseInt(filters.budget || "1000", 10)
  const isRandom = filters.mood === "random"

  const filtered = RESTAURANTS.filter((restaurant) => {
    if (restaurant.budgetMax > budgetMax && filters.budget !== "1000") {
      return false
    }

    if (filters.mood && !isRandom && !restaurant.tags.includes(filters.mood)) {
      return false
    }

    if (filters.cuisine && filters.cuisine !== "any") {
      if (restaurant.cuisine.toLowerCase() !== filters.cuisine) {
        return false
      }
    }

    if (filters.dining && !restaurant.diningTypes.includes(filters.dining)) {
      return false
    }

    return true
  })

  return shuffle(filtered).slice(0, count)
}

export function getRandomFallbackRestaurants(count = 3): Restaurant[] {
  return shuffle(RESTAURANTS).slice(0, count)
}
