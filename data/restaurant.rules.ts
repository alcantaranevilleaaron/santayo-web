import type { Restaurant } from "./restaurant.types"
import { PRICE_BUCKETS, PriceBucket } from "./taxonomy"

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
