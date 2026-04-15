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

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function parseBudgetValue(budget: string | null | undefined) {
  return budget && budget !== "1000" ? parseInt(budget, 10) : 1000
}

function scoreFallbackRestaurant(restaurant: Restaurant, filters: Filters) {
  const selectedCuisine = filters.cuisine && filters.cuisine !== "any" ? normalize(filters.cuisine) : null
  const mood = filters.mood && filters.mood !== "random" ? normalize(filters.mood) : null
  const budgetMax = parseBudgetValue(filters.budget)
  const dining = filters.dining || null

  const cuisineMatch = selectedCuisine && normalize(restaurant.cuisine) === selectedCuisine ? 1 : 0
  const moodMatch = mood && restaurant.tags.map(normalize).includes(mood) ? 1 : 0
  const priceMatch = restaurant.budgetMax <= budgetMax ? 1 : 0
  const diningMatch = dining && restaurant.diningTypes.includes(dining) ? 1 : 0
  const popularityScore = Math.min(restaurant.dishes.length, 4)

  const cuisineWeight = selectedCuisine ? 100 : 0
  const moodWeight = mood ? 30 : 0
  const priceWeight = 20
  const diningWeight = 10

  return (
    cuisineMatch * cuisineWeight +
    moodMatch * moodWeight +
    priceMatch * priceWeight +
    diningMatch * diningWeight +
    popularityScore * 5
  )
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

export function getFallbackRestaurants(filters: Filters, count = 3): Restaurant[] {
  const selectedCuisine = filters.cuisine && filters.cuisine !== "any" ? normalize(filters.cuisine) : null
  const candidates = selectedCuisine
    ? RESTAURANTS.filter((restaurant) => normalize(restaurant.cuisine) === selectedCuisine)
    : RESTAURANTS

  const pool = candidates.length > 0 ? candidates : RESTAURANTS

  const scored = [...pool].sort((a, b) => {
    const scoreB = scoreFallbackRestaurant(b, filters)
    const scoreA = scoreFallbackRestaurant(a, filters)
    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }
    return a.name.localeCompare(b.name)
  })

  const result = scored.slice(0, count)

  if (result.length === count) {
    return result
  }

  const remaining = [...RESTAURANTS]
    .filter((restaurant) => !result.some((selected) => selected.id === restaurant.id))
    .sort((a, b) => {
      const scoreB = scoreFallbackRestaurant(b, filters)
      const scoreA = scoreFallbackRestaurant(a, filters)
      if (scoreB !== scoreA) {
        return scoreB - scoreA
      }
      return a.name.localeCompare(b.name)
    })

  return [...result, ...remaining.slice(0, count - result.length)]
}
