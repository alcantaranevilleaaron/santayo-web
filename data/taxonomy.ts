export const CUISINE_PRIMARY = [
  "Filipino",
  "Korean",
  "Japanese",
  "Western",
  "Cafe",
  "Chinese",
  "Thai",
  "Italian",
  "Indian",
  "Buffet",
  "Dessert",
  "Healthy",
  "Mediterranean",
  "Middle Eastern",
  "French",
  "Asian",
  "Mexican",
  "American",
  "Bakery",
  "Vietnamese",
  "Spanish",
  "Vegetarian",
  "Indonesian",
  "Peruvian",
  "Snacks"
] as const
export type CuisinePrimary = (typeof CUISINE_PRIMARY)[number]

export const FOOD_CATEGORIES = [
  "Asian",
  "Western",
  "Cafe",
  "Dessert",
  "Healthy",
  "Premium",
  "Buffet",
  "Middle Eastern",
  "International"
] as const
export type FoodCategory = (typeof FOOD_CATEGORIES)[number]

export const MEAL_MOMENTS = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Snack",
  "LateNight",
] as const
export type MealMoment = (typeof MEAL_MOMENTS)[number]

export const MOOD_TAGS = [
  "Comfort",
  "Light",
  "Filling",
  "Healthy",
  "Premium",
  "Casual",
  "Energetic",
  "Quick",
] as const
export type MoodTag = (typeof MOOD_TAGS)[number]

export const EXPERIENCE_TAGS = [
  "Relaxed",
  "Social",
  "Date",
  "Solo",
  "Family",
  "Group",
  "Quick",
  "Pair"
] as const
export type ExperienceTag = (typeof EXPERIENCE_TAGS)[number]

export const FEATURE_TAGS = [
  "OutdoorSeating",
  "Delivery",
  "Reservations",
  "PetFriendly",
  "GoodForGroups",
] as const
export type FeatureTag = (typeof FEATURE_TAGS)[number]

export const PRICE_BUCKETS = ["budget", "mid", "premium", "splurge"] as const
export type PriceBucket = (typeof PRICE_BUCKETS)[number]

export const OPERATING_STATUS = ["open", "closed", "limited", "unknown"] as const
export type OperatingStatus = (typeof OPERATING_STATUS)[number]

export const DATA_CONFIDENCE_LEVELS = ["high", "medium", "low"] as const
export type DataConfidence = (typeof DATA_CONFIDENCE_LEVELS)[number]

export type ISODateString = string
