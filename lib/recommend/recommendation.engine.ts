import type { Filters } from "@/app/page"
import { RESTAURANTS, type Restaurant } from "@/data/restaurants"
import {
  getEffectiveAttributes,
  getEffectiveCuisine,
  getEffectiveDiningTypes,
  getEffectivePriceBucket,
  getEffectiveTags,
} from "@/data/restaurant.helpers"

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

function isOpenRestaurant(restaurant: Restaurant) {
  return restaurant.operatingStatus !== "closed"
}

function getConfidencePenalty(restaurant: Restaurant) {
  switch (restaurant.dataConfidence) {
    case "low":
      return -18
    case "medium":
      return -6
    default:
      return 0
  }
}

function getEffectivePriceBand(restaurant: Restaurant) {
  switch (getEffectivePriceBucket(restaurant)) {
    case "budget":
      return "low"
    case "mid":
      return "mid"
    case "premium":
    case "splurge":
      return "high"
    default:
      return getPriceBand(restaurant)
  }
}

function getPriceBand(restaurant: Restaurant) {
  if (restaurant.budgetMax <= 300) return "low"
  if (restaurant.budgetMax <= 600) return "mid"
  return "high"
}

function scoreFallbackRestaurant(restaurant: Restaurant, filters: Filters) {
  const selectedCuisine =
    filters.cuisine && filters.cuisine !== "any" ? normalize(filters.cuisine) : null
  const mood = filters.mood && filters.mood !== "random" ? normalize(filters.mood) : null
  const budgetMax = parseBudgetValue(filters.budget)
  const dining = filters.dining || null

  const cuisineMatch =
    selectedCuisine && normalize(getEffectiveCuisine(restaurant)) === selectedCuisine ? 1 : 0
  const moodMatch =
    mood && getEffectiveTags(restaurant).map(normalize).includes(mood) ? 1 : 0
  const priceMatch = restaurant.budgetMax <= budgetMax ? 1 : 0
  const diningMatch =
    dining && getEffectiveDiningTypes(restaurant).includes(dining) ? 1 : 0
  const popularityScore = Math.min(restaurant.dishes.length, 4)
  const confidencePenalty = getConfidencePenalty(restaurant)

  const cuisineWeight = selectedCuisine ? 100 : 0
  const moodWeight = mood ? 30 : 0
  const priceWeight = 20
  const diningWeight = 10

  return (
    cuisineMatch * cuisineWeight +
    moodMatch * moodWeight +
    priceMatch * priceWeight +
    diningMatch * diningWeight +
    popularityScore * 5 +
    confidencePenalty
  )
}

function getMatchScore(restaurant: Restaurant, filters: Filters) {
  const selectedCuisine =
    filters.cuisine && filters.cuisine !== "any" ? normalize(filters.cuisine) : null
  const mood = filters.mood && filters.mood !== "random" ? normalize(filters.mood) : null
  const budgetMax = parseInt(filters.budget || "1000", 10)
  const dining = filters.dining || null

  let score = 0

  if (selectedCuisine && normalize(getEffectiveCuisine(restaurant)) === selectedCuisine) {
    score += 100
  }
  if (mood && getEffectiveTags(restaurant).map(normalize).includes(mood)) {
    score += 60
  }
  if (restaurant.budgetMax <= budgetMax) {
    score += 25
  }
  if (dining && getEffectiveDiningTypes(restaurant).includes(dining)) {
    score += 15
  }

  score += Math.min(restaurant.dishes.length, 4)
  score += getConfidencePenalty(restaurant)

  return score
}

function getVarietyBoost(restaurant: Restaurant, reference: Restaurant | null) {
  if (!reference) {
    return 0
  }

  let boost = 0

  if (normalize(getEffectiveCuisine(restaurant)) !== normalize(getEffectiveCuisine(reference))) {
    boost += 18
  }
  if (getEffectivePriceBand(restaurant) !== getEffectivePriceBand(reference)) {
    boost += 12
  }
  if (
    !getEffectiveDiningTypes(restaurant).some((type) =>
      getEffectiveDiningTypes(reference).includes(type)
    )
  ) {
    boost += 8
  }

  return boost
}

function getDirectionBoost(restaurant: Restaurant, direction: string | null) {
  if (!direction) {
    return 0
  }

  const cuisine = normalize(getEffectiveCuisine(restaurant))
  const tags = getEffectiveTags(restaurant).map(normalize)
  const attributes = getEffectiveAttributes(restaurant).map(normalize)
  const priceBand = getEffectivePriceBand(restaurant)

  let boost = 0

  switch (direction) {
    case "light":
      if (priceBand === "low") boost += 16
      if (priceBand === "mid") boost += 8
      if (tags.includes("light")) boost += 20
      if (tags.includes("healthy")) boost += 12
      if (cuisine === "cafe") boost += 10
      break
    case "comfort":
      if (tags.includes("comfort")) boost += 20
      if (tags.includes("filling")) boost += 12
      if (["filipino", "western", "indian", "chinese", "japanese"].includes(cuisine)) {
        boost += 10
      }
      break
    case "premium":
      if (priceBand === "high") boost += 22
      if (attributes.includes("premium")) boost += 18
      if (tags.includes("premium")) boost += 16
      if (cuisine === "cafe") boost += 6
      break
    case "quick bite":
      if (tags.includes("quick")) boost += 20
      if (priceBand === "low") boost += 10
      if (tags.includes("light")) boost += 8
      break
    case "healthy":
      if (tags.includes("healthy")) boost += 22
      if (tags.includes("light")) boost += 12
      if (cuisine === "healthy") boost += 16
      break
    default:
      break
  }

  return boost
}

function getRecommendationScore(
  restaurant: Restaurant,
  filters: Filters,
  reference: Restaurant | null,
  direction: string | null = null
) {
  return (
    getMatchScore(restaurant, filters) +
    getVarietyBoost(restaurant, reference) +
    getDirectionBoost(restaurant, direction)
  )
}

function sortRecommendationPool(
  restaurants: Restaurant[],
  filters: Filters,
  reference: Restaurant | null,
  preferVariety = false,
  direction: string | null = null
) {
  const randomized = shuffle(restaurants)

  return randomized.sort((a, b) => {
    const scoreA = getRecommendationScore(a, filters, reference, direction)
    const scoreB = getRecommendationScore(b, filters, reference, direction)

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

    // Keep tied results fresh instead of alphabetical.
    return 0
  })
}

function chooseFromTopBand(
  restaurants: Restaurant[],
  filters: Filters,
  reference: Restaurant | null,
  preferVariety = false,
  direction: string | null = null
) {
  const sorted = sortRecommendationPool(
    restaurants,
    filters,
    reference,
    preferVariety,
    direction
  )

  if (sorted.length === 0) {
    return null
  }

  const bestScore = getRecommendationScore(sorted[0], filters, reference, direction)

  // Allow similarly strong candidates to rotate.
  const TOP_BAND_DELTA = 5

  const topBand = sorted.filter(
    (restaurant) =>
      getRecommendationScore(restaurant, filters, reference, direction) >=
      bestScore - TOP_BAND_DELTA
  )

  const candidates = topBand.length > 0 ? topBand : [sorted[0]]
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function chooseBestCandidate(
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[],
  lastTopPickId: number | null,
  preferVariety = false
) {
  const reference =
    restaurants.find((restaurant) => restaurant.id === lastTopPickId) ?? null

  const available = restaurants.filter((restaurant) => !excludeIds.includes(restaurant.id))
  if (available.length > 0) {
    return chooseFromTopBand(available, filters, reference, preferVariety)
  }

  const fallbackCandidates = restaurants.filter(
    (restaurant) => restaurant.id !== lastTopPickId
  )
  if (fallbackCandidates.length > 0) {
    return chooseFromTopBand(fallbackCandidates, filters, reference, preferVariety)
  }

  return chooseFromTopBand(restaurants, filters, reference, preferVariety)
}

export function getMatchedRestaurants(filters: Filters, count = 3): Restaurant[] {
  const budgetMax = parseInt(filters.budget || "1000", 10)
  const isRandom = filters.mood === "random"

  const filtered = RESTAURANTS.filter((restaurant) => {
    if (!isOpenRestaurant(restaurant)) {
      return false
    }

    if (restaurant.budgetMax > budgetMax && filters.budget !== "1000") {
      return false
    }

    if (
      filters.mood &&
      !isRandom &&
      !getEffectiveTags(restaurant).map(normalize).includes(normalize(filters.mood))
    ) {
      return false
    }

    if (filters.cuisine && filters.cuisine !== "any") {
      if (normalize(getEffectiveCuisine(restaurant)) !== normalize(filters.cuisine)) {
        return false
      }
    }

    if (filters.dining && !getEffectiveDiningTypes(restaurant).includes(filters.dining)) {
      return false
    }

    return true
  })

  return shuffle(filtered).slice(0, count)
}

export function getFallbackRestaurants(filters: Filters, count = 3): Restaurant[] {
  const selectedCuisine =
    filters.cuisine && filters.cuisine !== "any" ? normalize(filters.cuisine) : null
  const eligibleRestaurants = RESTAURANTS.filter(isOpenRestaurant)

  const candidates = selectedCuisine
    ? eligibleRestaurants.filter(
        (restaurant) => normalize(getEffectiveCuisine(restaurant)) === selectedCuisine
      )
    : eligibleRestaurants

  const pool = candidates.length > 0 ? candidates : eligibleRestaurants

  const randomizedPool = shuffle(pool)
  const scored = randomizedPool.sort((a, b) => {
    const scoreB = scoreFallbackRestaurant(b, filters)
    const scoreA = scoreFallbackRestaurant(a, filters)

    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }

    return 0
  })

  const result = scored.slice(0, count)

  if (result.length === count) {
    return result
  }

  const remaining = shuffle(
    eligibleRestaurants.filter(
      (restaurant) => !result.some((selected) => selected.id === restaurant.id)
    )
  ).sort((a, b) => {
    const scoreB = scoreFallbackRestaurant(b, filters)
    const scoreA = scoreFallbackRestaurant(a, filters)

    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }

    return 0
  })

  return [...result, ...remaining.slice(0, count - result.length)]
}

export function getCandidatePool(filters: Filters, fallbackMode: boolean) {
  if (fallbackMode) {
    return getFallbackRestaurants(filters, RESTAURANTS.length)
  }

  const budgetMax = parseInt(filters.budget || "1000", 10)
  const isRandom = filters.mood === "random"

  return RESTAURANTS.filter((restaurant) => {
    if (!isOpenRestaurant(restaurant)) {
      return false
    }

    if (restaurant.budgetMax > budgetMax && filters.budget !== "1000") {
      return false
    }

    if (
      filters.mood &&
      !isRandom &&
      !getEffectiveTags(restaurant).map(normalize).includes(normalize(filters.mood))
    ) {
      return false
    }

    if (filters.cuisine && filters.cuisine !== "any") {
      if (normalize(getEffectiveCuisine(restaurant)) !== normalize(filters.cuisine)) {
        return false
      }
    }

    if (filters.dining && !getEffectiveDiningTypes(restaurant).includes(filters.dining)) {
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
  return chooseBestCandidate(
    restaurants,
    filters,
    excludeIds,
    lastTopPickId,
    fallbackMode || filters.mood === "random"
  )
}

export function getAlternativeRecommendations(
  topPick: Restaurant,
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[] = [],
  count = 2,
  direction: string | null = null
) {
  const available = restaurants.filter(
    (restaurant) => restaurant.id !== topPick.id && !excludeIds.includes(restaurant.id)
  )

  const scored = sortRecommendationPool(available, filters, topPick, true, direction)
  if (scored.length >= count) {
    return scored.slice(0, count)
  }

  const fallback = restaurants.filter((restaurant) => restaurant.id !== topPick.id)
  return sortRecommendationPool(fallback, filters, topPick, true, direction).slice(0, count)
}

export function getNextPickSet(
  filters: Filters,
  seenIds: {
    seenTopPickIds: number[]
    seenAlternativeIds: number[]
    lastTopPickId: number | null
  },
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

  const baseExcludeIds = Array.from(
    new Set([...seenIds.seenTopPickIds, ...seenIds.seenAlternativeIds])
  )

  const strongerExcludeIds =
    seenIds.lastTopPickId !== null && pool.length > count + 2
      ? Array.from(new Set([...baseExcludeIds, seenIds.lastTopPickId]))
      : baseExcludeIds

  const nextTopPick = getTopPick(
    pool,
    filters,
    strongerExcludeIds,
    seenIds.lastTopPickId,
    fallbackMode
  )

  const nextAlternatives = nextTopPick
    ? getAlternativeRecommendations(
        nextTopPick,
        pool,
        filters,
        [...strongerExcludeIds, nextTopPick.id],
        count - 1
      )
    : []

  return {
    newTopPick: nextTopPick,
    newAlternatives: nextAlternatives,
  }
}