import type { Filters } from "@/app/page"
import { RESTAURANTS, type Restaurant } from "@/data/restaurants"

export type RecommendationSessionState = {
  seenTopPickIds: number[]
  seenAlternativeIds: number[]
  lastTopPickId: number | null
}

export type RecommendationPickSet = {
  newTopPick: Restaurant | null
  newAlternatives: Restaurant[]
}

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

function getPriceBand(restaurant: Restaurant) {
  if (restaurant.budgetMax <= 300) return "low"
  if (restaurant.budgetMax <= 600) return "mid"
  return "high"
}

function getMatchScore(restaurant: Restaurant, filters: Filters) {
  const selectedCuisine = filters.cuisine && filters.cuisine !== "any" ? normalize(filters.cuisine) : null
  const mood = filters.mood && filters.mood !== "random" ? normalize(filters.mood) : null
  const budgetMax = parseInt(filters.budget || "1000", 10)
  const dining = filters.dining || null

  let score = 0
  if (selectedCuisine && normalize(restaurant.cuisine) === selectedCuisine) score += 100
  if (mood && restaurant.tags.map(normalize).includes(mood)) score += 60
  if (restaurant.budgetMax <= budgetMax) score += 25
  if (dining && restaurant.diningTypes.includes(dining)) score += 15
  score += Math.min(restaurant.dishes.length, 4)

  return score
}

function getVarietyBoost(restaurant: Restaurant, reference: Restaurant | null) {
  if (!reference) {
    return 0
  }

  let boost = 0
  if (normalize(restaurant.cuisine) !== normalize(reference.cuisine)) boost += 18
  if (getPriceBand(restaurant) !== getPriceBand(reference)) boost += 12
  if (!restaurant.diningTypes.some((type) => reference.diningTypes.includes(type))) boost += 8
  return boost
}

function sortRecommendationPool(
  restaurants: Restaurant[],
  filters: Filters,
  reference: Restaurant | null,
  preferVariety = false
) {
  return [...restaurants].sort((a, b) => {
    const scoreA = getMatchScore(a, filters) + getVarietyBoost(a, reference)
    const scoreB = getMatchScore(b, filters) + getVarietyBoost(b, reference)

    if (preferVariety) {
      const varietyA = getVarietyBoost(a, reference)
      const varietyB = getVarietyBoost(b, reference)
      if (varietyA !== varietyB) {
        return varietyB - varietyA
      }
    }

    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }

    return a.name.localeCompare(b.name)
  })
}

function chooseBestCandidate(
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[],
  lastTopPickId: number | null,
  preferVariety = false
) {
  const available = restaurants.filter((restaurant) => !excludeIds.includes(restaurant.id))
  if (available.length > 0) {
    return sortRecommendationPool(available, filters, restaurants.find((restaurant) => restaurant.id === lastTopPickId) ?? null, preferVariety)[0]
  }

  const fallbackCandidates = restaurants.filter((restaurant) => restaurant.id !== lastTopPickId)
  if (fallbackCandidates.length > 0) {
    return sortRecommendationPool(fallbackCandidates, filters, restaurants.find((restaurant) => restaurant.id === lastTopPickId) ?? null, preferVariety)[0]
  }

  return sortRecommendationPool(restaurants, filters, restaurants.find((restaurant) => restaurant.id === lastTopPickId) ?? null, preferVariety)[0]
}

function getCandidatePool(filters: Filters, fallbackMode: boolean) {
  if (fallbackMode) {
    return getFallbackRestaurants(filters, RESTAURANTS.length)
  }

  const budgetMax = parseInt(filters.budget || "1000", 10)
  const isRandom = filters.mood === "random"

  return RESTAURANTS.filter((restaurant) => {
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
}

export function getTopPick(
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[] = [],
  lastTopPickId: number | null = null,
  fallbackMode = false
) {
  const preferred = chooseBestCandidate(restaurants, filters, excludeIds, lastTopPickId, fallbackMode || filters.mood === "random")
  return preferred
}

export function getAlternativeRecommendations(
  topPick: Restaurant,
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[] = [],
  count = 2
) {
  const available = restaurants.filter(
    (restaurant) => restaurant.id !== topPick.id && !excludeIds.includes(restaurant.id)
  )

  const scored = sortRecommendationPool(available, filters, topPick, true)
  if (scored.length >= count) {
    return scored.slice(0, count)
  }

  const fallback = restaurants.filter((restaurant) => restaurant.id !== topPick.id)
  return sortRecommendationPool(fallback, filters, topPick, true).slice(0, count)
}

export function getNextPickSet(
  filters: Filters,
  seenIds: { seenTopPickIds: number[]; seenAlternativeIds: number[]; lastTopPickId: number | null },
  fallbackMode: boolean,
  count = 3
) {
  const pool = getCandidatePool(filters, fallbackMode)
  if (pool.length === 0) {
    return {
      newTopPick: null,
      newAlternatives: [] as Restaurant[],
    }
  }

  const excludeIds = Array.from(new Set([...seenIds.seenTopPickIds, ...seenIds.seenAlternativeIds]))
  const nextTopPick = getTopPick(pool, filters, excludeIds, seenIds.lastTopPickId, fallbackMode)
  const nextAlternatives = nextTopPick
    ? getAlternativeRecommendations(nextTopPick, pool, filters, [...excludeIds, nextTopPick.id], count - 1)
    : []

  return {
    newTopPick: nextTopPick,
    newAlternatives: nextAlternatives,
  }
}
