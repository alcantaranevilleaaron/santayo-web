import type { Restaurant } from "./restaurant.types"

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
  return restaurant.displayName ?? restaurant.name
}
