import type { Restaurant } from "../restaurant.types";

export const FORBESTOWN_RESTAURANTS: Restaurant[] = [
  {
    id: 5,
    name: "Locavore",
    area: "Forbes Town Center",
    cuisine: "Filipino",
    priceRange: "₱600-1200",
    dishes: ["Sizzling Sinigang", "Lechon and Oyster Sisig", "Prawns"],
    tags: ["comfort", "filling", "premium"],
    attributes: ["comfort", "filling", "premium"],
    antiAttributes: ["fried", "oily", "pork-heavy", "heavy", "indulgent"],
    budgetMax: 1200,
    diningTypes: ["pair", "group"],
    slug: "locavore-forbes-town-center-5",
    cuisinePrimary: "Filipino",
    foodCategories: ["Filipino", "Asian"],
    moodTags: ["Comfort", "Filling", "Premium"],
    experienceTags: ["Group", "Casual", "Sit-down"],
    budgetMin: 600,
    priceBucket: "premium",
  }
];
