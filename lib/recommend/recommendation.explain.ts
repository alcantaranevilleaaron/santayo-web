import type { Filters } from "@/app/page"
import type { Restaurant } from "@/data/restaurants"
import {
  getEffectiveAttributes,
  getEffectiveCuisine,
  getEffectiveDiningTypes,
  getEffectiveTags,
} from "@/data/restaurant.helpers"

const normalize = (value: string) => value.trim().toLowerCase()

const getNormalizedStrings = (values: Array<string | undefined> = []) =>
  Array.from(new Set(values.filter(Boolean).map((value) => normalize(value!))))

const getReasonSet = (restaurant: Restaurant, filters?: Filters) => {
  const reasons = new Set<string>()
  const tags = getEffectiveTags(restaurant).map(normalize)
  const attributes = getEffectiveAttributes(restaurant).map(normalize)
  const diningTypes = getEffectiveDiningTypes(restaurant).map(normalize)
  const cuisine = normalize(getEffectiveCuisine(restaurant))
  const experienceTags = getNormalizedStrings(restaurant.experienceTags)
  const moodTags = getNormalizedStrings(restaurant.moodTags)
  const featureTags = getNormalizedStrings(restaurant.featureTags)
  const foodCategories = getNormalizedStrings(restaurant.foodCategories)
  const priceBucket = normalize(restaurant.priceBucket ?? "")
  const budgetMax = restaurant.budgetMax

  if (filters?.cuisine && filters.cuisine !== "any" && cuisine === normalize(filters.cuisine)) {
    reasons.add("Matches your cuisine")
  }

  if (filters?.budget && filters.budget !== "1000" && budgetMax <= parseInt(filters.budget, 10)) {
    reasons.add("Fits your budget")
  }

  if (priceBucket === "budget" || priceBucket === "mid" || budgetMax <= 400) {
    reasons.add("Fits your budget")
  }

  if (priceBucket === "premium" || priceBucket === "splurge" || tags.includes("premium") || attributes.includes("premium")) {
    reasons.add("Premium pick")
  }

  if (experienceTags.includes("date") || tags.includes("date")) {
    reasons.add("Good for pairs")
  }

  if (experienceTags.includes("social") || attributes.includes("social")) {
    reasons.add("Great for catch-ups")
  }

  if (experienceTags.includes("family") || attributes.includes("family")) {
    reasons.add("Family-friendly")
  }

  if (experienceTags.includes("group") || attributes.includes("group")) {
    reasons.add("Good for groups")
  }

  if (experienceTags.includes("solo") || attributes.includes("solo")) {
    reasons.add("Solo-friendly")
  }

  if (moodTags.includes("comfort") || tags.includes("comfort")) {
    reasons.add("Comfort pick")
  }

  if (moodTags.includes("light") || tags.includes("light")) {
    reasons.add("Light option")
  }

  if (moodTags.includes("healthy") || tags.includes("healthy") || foodCategories.includes("healthy")) {
    reasons.add("Healthy choice")
  }

  if (tags.includes("quick") || diningTypes.includes("takeout") || diningTypes.includes("delivery")) {
    reasons.add("Quick bite")
  }

  if (featureTags.includes("outdoorseating") || tags.includes("outdoor")) {
    reasons.add("Outdoor seating")
  }

  if (featureTags.includes("delivery") || diningTypes.includes("delivery")) {
    reasons.add("Delivery available")
  }

  if (featureTags.includes("reservations") || tags.includes("reservations")) {
    reasons.add("Reservations available")
  }

  if (tags.includes("comfort food")) {
    reasons.add("Comfort pick")
  }

  return Array.from(reasons)
}

export function getRecommendationReasons(restaurant: Restaurant, filters?: Filters): string[] {
  return getReasonSet(restaurant, filters)
}

export function getRecommendationExplanation(restaurant: Restaurant, filters?: Filters): string {
  const reasons = getReasonSet(restaurant, filters)
  return reasons[0] ?? "Great match"
}
