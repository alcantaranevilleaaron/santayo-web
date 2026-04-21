import type {
  CuisinePrimary,
  FoodCategory,
  MealMoment,
  MoodTag,
  ExperienceTag,
  FeatureTag,
  PriceBucket,
  OperatingStatus,
  DataConfidence,
  ISODateString,
} from "./taxonomy"

export type Restaurant = {
  id: number
  name: string
  area: string
  cuisine: string
  priceRange: string
  dishes: string[]
  tags: string[]
  attributes: string[]
  budgetMax: number
  diningTypes: string[]

  // New optional structured fields for future data normalization.
  slug?: string
  displayName?: string
  cuisinePrimary?: CuisinePrimary
  cuisineSecondary?: CuisinePrimary
  foodCategories?: FoodCategory[]
  mealMoments?: MealMoment[]
  moodTags?: MoodTag[]
  experienceTags?: ExperienceTag[]
  featureTags?: FeatureTag[]
  budgetMin?: number
  priceBucket?: PriceBucket
  operatingStatus?: OperatingStatus
  dataConfidence?: DataConfidence
  verifiedAt?: ISODateString
  lastUpdatedAt?: ISODateString
  // New semantic fields for improved scoring
  category?: "steakhouse" | "fine-dining" | "casual" | "bistro" | "cafe" | "fast-casual" | "dessert" | "drinks" | "bar" | "buffet"
  mealType?: "snack" | "light-meal" | "full-meal" | "dessert-focused" | "drinks-focused" | "fast-casual"
  occasions?: Array<"date" | "business" | "celebration" | "casual-hangout" | "family">
}
