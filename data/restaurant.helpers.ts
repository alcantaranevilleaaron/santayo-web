import type { Restaurant } from "./restaurant.types"
import { inferPriceBucket } from "./restaurant.rules"

const normalizeArray = (values: Array<string | undefined> = []): string[] => {
  return Array.from(new Set(values.filter(Boolean).map((value) => value!.trim())))
}

export const getDisplayName = (restaurant: Restaurant): string => {
  return restaurant.displayName?.trim() || restaurant.name
}

export const getEffectiveCuisine = (restaurant: Restaurant): string => {
  if (restaurant.cuisinePrimary && restaurant.cuisineSecondary) {
    return `${restaurant.cuisinePrimary} / ${restaurant.cuisineSecondary}`
  }

  if (restaurant.cuisinePrimary) {
    return restaurant.cuisinePrimary
  }

  return restaurant.cuisine
}

export const getEffectiveDishes = (restaurant: Restaurant): string[] => {
  return normalizeArray(restaurant.dishes)
}

export const getEffectiveTags = (restaurant: Restaurant): string[] => {
  const structuredTags = [
    ...(restaurant.moodTags ?? []),
    ...(restaurant.featureTags ?? []),
    ...(restaurant.foodCategories ?? []),
  ]

  const fallbackTags = restaurant.tags ?? []
  const combined = structuredTags.length > 0 ? [...structuredTags, ...fallbackTags] : fallbackTags

  return normalizeArray(combined)
}

export const getEffectiveAttributes = (restaurant: Restaurant): string[] => {
  const structuredAttributes = [
    ...(restaurant.experienceTags ?? []),
    ...(restaurant.mealMoments ?? []),
  ]

  const fallbackAttributes = restaurant.attributes ?? []
  const combined = structuredAttributes.length > 0 ? [...structuredAttributes, ...fallbackAttributes] : fallbackAttributes

  return normalizeArray(combined)
}

export const getEffectiveDiningTypes = (restaurant: Restaurant): string[] => {
  return normalizeArray(restaurant.diningTypes)
}

export const getEffectivePriceBucket = (restaurant: Restaurant) => {
  return restaurant.priceBucket ?? inferPriceBucket({
    budgetMin: restaurant.budgetMin,
    budgetMax: restaurant.budgetMax,
  })
}

export const getEffectivePriceLabel = (restaurant: Restaurant): string => {
  const priceBucket = getEffectivePriceBucket(restaurant)

  switch (priceBucket) {
    case "budget":
      return "Budget"
    case "mid":
      return "Mid-range"
    case "premium":
      return "Premium"
    case "splurge":
      return "Splurge"
  }

  if (restaurant.budgetMin != null && restaurant.budgetMax != null) {
    return `₱${restaurant.budgetMin}-${restaurant.budgetMax}`
  }

  return restaurant.priceRange
}

export const buildRestaurantSlug = (restaurant: Pick<Restaurant, "name" | "area" | "id">): string => {
  const normalizedName = restaurant.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const normalizedArea = restaurant.area
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return `${normalizedName}-${normalizedArea}-${restaurant.id}`
}

export const getRestaurantLabel = (restaurant: Restaurant): string => {
  return getDisplayName(restaurant)
}
