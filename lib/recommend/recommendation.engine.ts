export type RecommendationInput = {
  restaurantId: number
  filters?: Record<string, unknown>
}

export type RecommendationResult = {
  restaurantId: number
  score: number
  reason?: string
}

export const scoreRestaurant = (_input: RecommendationInput): RecommendationResult => {
  return {
    restaurantId: _input.restaurantId,
    score: 0,
  }
}
