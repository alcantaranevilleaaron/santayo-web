import type { Restaurant } from "./restaurant.types"
import type { PriceBucket } from "./taxonomy"

const priceBucketThresholds: Record<PriceBucket, number> = {
  budget: 400,
  mid: 700,
  premium: 1000,
  splurge: Number.MAX_SAFE_INTEGER,
}

export const inferPriceBucket = (restaurant: Pick<Restaurant, "budgetMax" | "budgetMin">): PriceBucket => {
  const target = restaurant.budgetMax ?? restaurant.budgetMin ?? 0

  if (target <= priceBucketThresholds.budget) {
    return "budget"
  }

  if (target <= priceBucketThresholds.mid) {
    return "mid"
  }

  if (target <= priceBucketThresholds.premium) {
    return "premium"
  }

  return "splurge"
}

export const isHighConfidence = (restaurant: Restaurant): boolean => {
  return restaurant.dataConfidence === "high"
}

const hasEffectiveName = (restaurant: Restaurant): boolean => {
  return Boolean(restaurant.displayName?.trim() || restaurant.name?.trim())
}

const hasEffectiveArea = (restaurant: Restaurant): boolean => {
  return Boolean(restaurant.area?.trim())
}

const hasEffectiveCuisine = (restaurant: Restaurant): boolean => {
  return Boolean(
    restaurant.cuisinePrimary ||
      restaurant.cuisineSecondary ||
      restaurant.cuisine?.trim(),
  )
}

const hasEffectivePrice = (restaurant: Restaurant): boolean => {
  return Boolean(
    restaurant.priceBucket ||
      (restaurant.budgetMin != null && restaurant.budgetMax != null) ||
      restaurant.priceRange?.trim(),
  )
}

const hasContentSignals = (restaurant: Restaurant): boolean => {
  return Boolean(
    (restaurant.dishes?.length ?? 0) > 0 ||
      (restaurant.diningTypes?.length ?? 0) > 0 ||
      (restaurant.tags?.length ?? 0) > 0 ||
      (restaurant.foodCategories?.length ?? 0) > 0 ||
      (restaurant.moodTags?.length ?? 0) > 0 ||
      (restaurant.experienceTags?.length ?? 0) > 0 ||
      (restaurant.featureTags?.length ?? 0) > 0 ||
      (restaurant.mealMoments?.length ?? 0) > 0,
  )
}

const isClosed = (restaurant: Restaurant): boolean => {
  return restaurant.operatingStatus === "closed"
}

const isLowConfidence = (restaurant: Restaurant): boolean => {
  return restaurant.dataConfidence === "low"
}

/**
 * Returns true when the restaurant has enough baseline data to be considered publish-ready.
 * Supports both legacy fields and richer structured fields.
 */
export const hasMinimumStructuredData = (restaurant: Restaurant): boolean => {
  return (
    hasEffectiveName(restaurant) &&
    hasEffectiveArea(restaurant) &&
    hasEffectiveCuisine(restaurant) &&
    hasEffectivePrice(restaurant) &&
    hasContentSignals(restaurant)
  )
}

/**
 * Returns true when the restaurant is conservatively ready for MVP publishing.
 * Closed restaurants are excluded until a later phase.
 */
export const isMvpReadyRestaurant = (restaurant: Restaurant): boolean => {
  return hasMinimumStructuredData(restaurant) && !isClosed(restaurant)
}

/**
 * Returns true when a restaurant can be considered for recommendations.
 * Low confidence and closed restaurants are conservatively excluded.
 */
export const isRecommendationEligible = (restaurant: Restaurant): boolean => {
  return isMvpReadyRestaurant(restaurant) && !isLowConfidence(restaurant)
}
