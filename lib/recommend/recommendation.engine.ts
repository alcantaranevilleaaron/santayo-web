import type { Filters } from "@/app/page";
import { RESTAURANTS, type Restaurant } from "@/data/restaurants";
import {
  getEffectiveAttributes,
  getEffectiveCuisine,
  getEffectiveDiningTypes,
  getEffectivePriceBucket,
  getEffectiveTags,
} from "@/data/restaurant.helpers";

export type RecommendationSessionState = {
  seenTopPickIds: number[];
  seenAlternativeIds: number[];
  lastTopPickId: number | null;
};

export type RecommendationPickSet = {
  newTopPick: Restaurant | null;
  newAlternatives: Restaurant[];
};

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function parseBudgetValue(budget: string | null | undefined) {
  return budget && budget !== "1000" ? parseInt(budget, 10) : 1000;
}

function isOpenRestaurant(restaurant: Restaurant) {
  return restaurant.operatingStatus !== "closed";
}

function getConfidencePenalty(restaurant: Restaurant) {
  switch (restaurant.dataConfidence) {
    case "low":
      return -18;
    case "medium":
      return -6;
    default:
      return 0;
  }
}

function getEffectivePriceBand(restaurant: Restaurant) {
  switch (getEffectivePriceBucket(restaurant)) {
    case "budget":
      return "low";
    case "mid":
      return "mid";
    case "premium":
    case "splurge":
      return "high";
    default:
      return getPriceBand(restaurant);
  }
}

function getPriceBand(restaurant: Restaurant) {
  if (restaurant.budgetMax <= 300) return "low";
  if (restaurant.budgetMax <= 600) return "mid";
  return "high";
}

function scoreFallbackRestaurant(restaurant: Restaurant, filters: Filters) {
  const selectedCuisine =
    filters.cuisine && filters.cuisine !== "any"
      ? normalize(filters.cuisine)
      : null;
  const mood =
    filters.mood && filters.mood !== "random" ? normalize(filters.mood) : null;
  const budgetMax = parseBudgetValue(filters.budget);
  const dining = filters.dining || null;

  const cuisineMatch =
    selectedCuisine &&
    normalize(getEffectiveCuisine(restaurant)) === selectedCuisine
      ? 1
      : 0;
  const moodMatch =
    mood && getEffectiveTags(restaurant).map(normalize).includes(mood) ? 1 : 0;
  const priceMatch = restaurant.budgetMax <= budgetMax ? 1 : 0;
  const diningMatch =
    dining && getEffectiveDiningTypes(restaurant).includes(dining) ? 1 : 0;
  const popularityScore = Math.min(restaurant.dishes.length, 4);
  const confidencePenalty = getConfidencePenalty(restaurant);

  const cuisineWeight = selectedCuisine ? 100 : 0;
  const moodWeight = mood ? 30 : 0;
  const priceWeight = 20;
  const diningWeight = 10;

  return (
    cuisineMatch * cuisineWeight +
    moodMatch * moodWeight +
    priceMatch * priceWeight +
    diningMatch * diningWeight +
    popularityScore * 5 +
    confidencePenalty
  );
}

function getMatchScore(restaurant: Restaurant, filters: Filters) {
  const selectedCuisine =
    filters.cuisine && filters.cuisine !== "any"
      ? normalize(filters.cuisine)
      : null;
  const mood =
    filters.mood && filters.mood !== "random" ? normalize(filters.mood) : null;
  const budgetMax = parseInt(filters.budget || "1000", 10);
  const dining = filters.dining || null;

  let score = 0;

  if (
    selectedCuisine &&
    normalize(getEffectiveCuisine(restaurant)) === selectedCuisine
  ) {
    score += 100;
  }
  if (mood && getEffectiveTags(restaurant).map(normalize).includes(mood)) {
    score += 60;
  }
  if (restaurant.budgetMax <= budgetMax) {
    score += 25;
  }
  if (dining && getEffectiveDiningTypes(restaurant).includes(dining)) {
    score += 15;
  }

  score += Math.min(restaurant.dishes.length, 4);
  score += getConfidencePenalty(restaurant);

  return score;
}

function getVarietyBoost(restaurant: Restaurant, reference: Restaurant | null) {
  if (!reference) {
    return 0;
  }

  let boost = 0;

  if (
    normalize(getEffectiveCuisine(restaurant)) !==
    normalize(getEffectiveCuisine(reference))
  ) {
    boost += 18;
  }
  if (getEffectivePriceBand(restaurant) !== getEffectivePriceBand(reference)) {
    boost += 12;
  }
  if (
    !getEffectiveDiningTypes(restaurant).some((type) =>
      getEffectiveDiningTypes(reference).includes(type),
    )
  ) {
    boost += 8;
  }

  return boost;
}

function getDirectionBoost(restaurant: Restaurant, direction: string | null) {
  if (!direction) {
    return 0;
  }

  const cuisine = normalize(getEffectiveCuisine(restaurant));
  const tags = getEffectiveTags(restaurant).map(normalize);
  const attributes = getEffectiveAttributes(restaurant).map(normalize);
  const priceBand = getEffectivePriceBand(restaurant);

  let boost = 0;

  switch (direction) {
    case "light":
      if (priceBand === "low") boost += 16;
      if (priceBand === "mid") boost += 8;
      if (tags.includes("light")) boost += 20;
      if (tags.includes("healthy")) boost += 12;
      if (cuisine === "cafe") boost += 10;
      break;
    case "comfort":
      if (tags.includes("comfort")) boost += 20;
      if (tags.includes("filling")) boost += 12;
      if (
        ["filipino", "western", "indian", "chinese", "japanese"].includes(
          cuisine,
        )
      ) {
        boost += 10;
      }
      // Extended comfort scoring
      if (tags.includes("filipino")) boost += 10;
      if (tags.includes("light")) boost -= 6;
      break;
    case "premium":
      // 🟢 STRONG POSITIVE SIGNALS (true premium)
      if (priceBand === "high") boost += 24;
      if (attributes.includes("premium")) boost += 20;
      if (tags.includes("premium")) boost += 18;
      if (tags.some((tag) => ["sosyal", "date"].includes(tag))) boost += 8;

      // 🔴 HARD NEGATIVE — non-dining / irrelevant
      if (priceBand === "low") boost -= 30;

      if (
        tags.some((tag) =>
          [
            "budget",
            "fastfood",
            "snack",
            "dessert",
            "bubble",
            "tea",
            "drink",
            "juice",
            "smoothie",
          ].includes(tag),
        )
      ) {
        boost -= 25;
      }

      // 🔴 HARD NEGATIVE — snacks / drinks
      if (restaurant.mealType === "snack") boost -= 30;

      // 🟠 MEDIUM NEGATIVE — casual full meal (THIS FIXES YELLOW CAB)
      if (priceBand === "mid" && !attributes.includes("premium")) {
        boost -= 12;
      }

      // 🟠 MEDIUM NEGATIVE — generic casual tags
      if (tags.includes("casual")) boost -= 10;

      // 🟠 MEDIUM NEGATIVE — fast casual experience
      if (restaurant.mealType === "fast-casual") boost -= 15;

      break;
    case "quick bite":
      if (tags.includes("quick")) boost += 20;
      if (priceBand === "low") boost += 10;
      if (tags.includes("light")) boost += 8;
      // Extended quick bite scoring
      if (tags.includes("fast") || tags.includes("quick")) boost += 10;
      if (tags.includes("casual")) boost += 5;
      if (tags.includes("fine-dining")) boost -= 6;
      break;
    case "healthy":
      // Healthy-specific scoring based on tags
      if (tags.includes("healthy")) boost += 12;
      if (tags.some((tag) => ["light", "salad", "grilled"].includes(tag)))
        boost += 6;
      if (tags.some((tag) => ["fried", "heavy", "steak"].includes(tag)))
        boost -= 10;
      if (cuisine === "healthy") boost += 16;
      break;
    default:
      break;
  }

  return boost;
}

function isEligibleForDirection(
  restaurant: Restaurant,
  direction: string | null,
) {
  if (!direction) {
    return true;
  }

  const priceBand = getEffectivePriceBand(restaurant);
  const tags = getEffectiveTags(restaurant).map(normalize);

  switch (direction) {
    case "premium":
      if (priceBand === "low") return false;
      if (restaurant.mealType === "snack") return false;
      return true;
    case "quick bite":
      if (priceBand === "high" && restaurant.mealType === "full-meal") {
        return false;
      }
      return true;
    case "healthy":
      // Only block explicit heavy/fried places when there is no healthy counter-signal.
      if (
        tags.some((tag) => ["fried", "heavy"].includes(tag)) &&
        !tags.some((tag) => ["healthy", "light", "salad", "grilled"].includes(tag))
      ) {
        return false;
      }
      return true;
    default:
      return true;
  }
}

function getRecommendationScore(
  restaurant: Restaurant,
  filters: Filters,
  reference: Restaurant | null,
  direction: string | null = null,
) {
  // Strengthen direction influence: multiply direction boost by 3
  return (
    getMatchScore(restaurant, filters) +
    getVarietyBoost(restaurant, reference) +
    getDirectionBoost(restaurant, direction) * 3
  );
}

function sortRecommendationPool(
  restaurants: Restaurant[],
  filters: Filters,
  reference: Restaurant | null,
  preferVariety = false,
  direction: string | null = null,
) {
  const randomized = shuffle(restaurants);

  return randomized.sort((a, b) => {
    const scoreA = getRecommendationScore(a, filters, reference, direction);
    const scoreB = getRecommendationScore(b, filters, reference, direction);

    if (preferVariety) {
      const varietyA = getVarietyBoost(a, reference);
      const varietyB = getVarietyBoost(b, reference);

      if (varietyA !== varietyB) {
        return varietyB - varietyA;
      }
    }

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Keep tied results fresh instead of alphabetical.
    return 0;
  });
}

function chooseFromTopBand(
  restaurants: Restaurant[],
  filters: Filters,
  reference: Restaurant | null,
  preferVariety = false,
  direction: string | null = null,
) {
  const sorted = sortRecommendationPool(
    restaurants,
    filters,
    reference,
    preferVariety,
    direction,
  );

  if (sorted.length === 0) {
    return null;
  }

  const bestScore = getRecommendationScore(
    sorted[0],
    filters,
    reference,
    direction,
  );

  // Allow similarly strong candidates to rotate.
  const TOP_BAND_DELTA = 5;

  const topBand = sorted.filter(
    (restaurant) =>
      getRecommendationScore(restaurant, filters, reference, direction) >=
      bestScore - TOP_BAND_DELTA,
  );

  const candidates = topBand.length > 0 ? topBand : [sorted[0]];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function chooseBestCandidate(
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[],
  lastTopPickId: number | null,
  preferVariety = false,
  direction: string | null = null,
) {
  const reference =
    restaurants.find((restaurant) => restaurant.id === lastTopPickId) ?? null;

  const available = restaurants.filter(
    (restaurant) => !excludeIds.includes(restaurant.id),
  );
  if (available.length > 0) {
    return chooseFromTopBand(
      available,
      filters,
      reference,
      preferVariety,
      direction,
    );
  }

  const fallbackCandidates = restaurants.filter(
    (restaurant) => restaurant.id !== lastTopPickId,
  );
  if (fallbackCandidates.length > 0) {
    return chooseFromTopBand(
      fallbackCandidates,
      filters,
      reference,
      preferVariety,
      direction,
    );
  }

  return chooseFromTopBand(
    restaurants,
    filters,
    reference,
    preferVariety,
    direction,
  );
}

export function getMatchedRestaurants(
  filters: Filters,
  count = 3,
): Restaurant[] {
  const budgetMax = parseInt(filters.budget || "1000", 10);
  const isRandom = filters.mood === "random";

  const filtered = RESTAURANTS.filter((restaurant) => {
    if (!isOpenRestaurant(restaurant)) {
      return false;
    }

    if (restaurant.budgetMax > budgetMax && filters.budget !== "1000") {
      return false;
    }

    if (
      filters.mood &&
      !isRandom &&
      !getEffectiveTags(restaurant)
        .map(normalize)
        .includes(normalize(filters.mood))
    ) {
      return false;
    }

    if (filters.cuisine && filters.cuisine !== "any") {
      if (
        normalize(getEffectiveCuisine(restaurant)) !==
        normalize(filters.cuisine)
      ) {
        return false;
      }
    }

    if (
      filters.dining &&
      !getEffectiveDiningTypes(restaurant).includes(filters.dining)
    ) {
      return false;
    }

    return true;
  });

  return shuffle(filtered).slice(0, count);
}

export function getFallbackRestaurants(
  filters: Filters,
  count = 3,
): Restaurant[] {
  const selectedCuisine =
    filters.cuisine && filters.cuisine !== "any"
      ? normalize(filters.cuisine)
      : null;
  const eligibleRestaurants = RESTAURANTS.filter(isOpenRestaurant);

  const candidates = selectedCuisine
    ? eligibleRestaurants.filter(
        (restaurant) =>
          normalize(getEffectiveCuisine(restaurant)) === selectedCuisine,
      )
    : eligibleRestaurants;

  const pool = candidates.length > 0 ? candidates : eligibleRestaurants;

  const randomizedPool = shuffle(pool);
  const scored = randomizedPool.sort((a, b) => {
    const scoreB = scoreFallbackRestaurant(b, filters);
    const scoreA = scoreFallbackRestaurant(a, filters);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    return 0;
  });

  const result = scored.slice(0, count);

  if (result.length === count) {
    return result;
  }

  const remaining = shuffle(
    eligibleRestaurants.filter(
      (restaurant) => !result.some((selected) => selected.id === restaurant.id),
    ),
  ).sort((a, b) => {
    const scoreB = scoreFallbackRestaurant(b, filters);
    const scoreA = scoreFallbackRestaurant(a, filters);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    return 0;
  });

  return [...result, ...remaining.slice(0, count - result.length)];
}

export function getCandidatePool(filters: Filters, fallbackMode: boolean) {
  if (fallbackMode) {
    return getFallbackRestaurants(filters, RESTAURANTS.length);
  }

  const budgetMax = parseInt(filters.budget || "1000", 10);
  const isRandom = filters.mood === "random";

  return RESTAURANTS.filter((restaurant) => {
    if (!isOpenRestaurant(restaurant)) {
      return false;
    }

    if (restaurant.budgetMax > budgetMax && filters.budget !== "1000") {
      return false;
    }

    if (
      filters.mood &&
      !isRandom &&
      !getEffectiveTags(restaurant)
        .map(normalize)
        .includes(normalize(filters.mood))
    ) {
      return false;
    }

    if (filters.cuisine && filters.cuisine !== "any") {
      if (
        normalize(getEffectiveCuisine(restaurant)) !==
        normalize(filters.cuisine)
      ) {
        return false;
      }
    }

    if (
      filters.dining &&
      !getEffectiveDiningTypes(restaurant).includes(filters.dining)
    ) {
      return false;
    }

    return true;
  });
}

export function getTopPick(
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[] = [],
  lastTopPickId: number | null = null,
  fallbackMode = false,
  direction: string | null = null,
) {
  return chooseBestCandidate(
    restaurants,
    filters,
    excludeIds,
    lastTopPickId,
    fallbackMode || filters.mood === "random",
    direction,
  );
}

export function getAlternativeRecommendations(
  topPick: Restaurant,
  restaurants: Restaurant[],
  filters: Filters,
  excludeIds: number[] = [],
  count = 2,
  direction: string | null = null,
) {
  const strictEligible = restaurants.filter(
    (restaurant) =>
      restaurant.id !== topPick.id &&
      !excludeIds.includes(restaurant.id) &&
      isEligibleForDirection(restaurant, direction),
  );

  const strictRanked = sortRecommendationPool(
    strictEligible,
    filters,
    topPick,
    true,
    direction,
  );

  if (strictRanked.length >= count) {
    return strictRanked.slice(0, count);
  }

  if (strictRanked.length > 0) {
    return strictRanked.slice(0, count);
  }

  const directionOnlyFallback = restaurants.filter(
    (restaurant) =>
      restaurant.id !== topPick.id &&
      isEligibleForDirection(restaurant, direction),
  );

  const directionOnlyRanked = sortRecommendationPool(
    directionOnlyFallback,
    filters,
    topPick,
    true,
    direction,
  );

  if (directionOnlyRanked.length > 0) {
    return directionOnlyRanked.slice(0, count);
  }

  const generalFallback = restaurants.filter(
    (restaurant) => restaurant.id !== topPick.id && !excludeIds.includes(restaurant.id),
  );

  return sortRecommendationPool(
    generalFallback,
    filters,
    topPick,
    true,
    direction,
  ).slice(0, count);
}

export function getNextPickSet(
  filters: Filters,
  seenIds: {
    seenTopPickIds: number[];
    seenAlternativeIds: number[];
    lastTopPickId: number | null;
  },
  fallbackMode: boolean,
  count = 3,
  direction: string | null = null,
) {
  void fallbackMode;

  // Global-scoring model: start from all open restaurants and apply only light eligibility.
  const pool = RESTAURANTS.filter(
    (restaurant) =>
      isOpenRestaurant(restaurant) &&
      isEligibleForDirection(restaurant, direction),
  );

  if (pool.length === 0) {
    return {
      newTopPick: null,
      newAlternatives: [] as Restaurant[],
    };
  }

  // Strictly limit exclusion window
  const RECENT_TOP_PICKS = 2;
  const RECENT_ALTERNATIVES = 2;
  const MIN_POOL_SIZE = 12;
  const recentTopPickIds = seenIds.seenTopPickIds.slice(-RECENT_TOP_PICKS);
  const recentAlternativeIds =
    seenIds.seenAlternativeIds.slice(-RECENT_ALTERNATIVES);
  let excludeIds = Array.from(
    new Set([...recentTopPickIds, ...recentAlternativeIds]),
  );

  // Minimum pool guard: relax only recent exclusions if pool is too small.
  let availablePool = pool.filter((r) => !excludeIds.includes(r.id));
  if (availablePool.length < MIN_POOL_SIZE) {
    excludeIds = seenIds.lastTopPickId !== null ? [seenIds.lastTopPickId] : [];
    availablePool = pool.filter((r) => !excludeIds.includes(r.id));
  }

  // Optionally exclude lastTopPickId if pool is large enough
  if (
    seenIds.lastTopPickId !== null &&
    availablePool.length > count + 2 &&
    !excludeIds.includes(seenIds.lastTopPickId)
  ) {
    excludeIds = [...excludeIds, seenIds.lastTopPickId];
    availablePool = pool.filter((r) => !excludeIds.includes(r.id));
  }

  // If exclusions are too strict, relax all recent exclusion while preserving eligibility.
  if (availablePool.length === 0) {
    availablePool = [...pool];
  }

  const reference =
    pool.find((restaurant) => restaurant.id === seenIds.lastTopPickId) ?? null;

  const rankedTopCandidates = sortRecommendationPool(
    availablePool,
    filters,
    reference,
    false,
    direction,
  );

  const nextTopPick = rankedTopCandidates[0] ?? null;

  let nextAlternatives: Restaurant[] = [];
  if (nextTopPick) {
    let altExclude = [...excludeIds, nextTopPick.id];
    let altPool = pool.filter((r) => !altExclude.includes(r.id));
    // Prevent tight fallback loops: if too few alternatives, relax recent exclusions but keep eligibility.
    if (altPool.length < count - 1) {
      altExclude =
        seenIds.lastTopPickId !== null
          ? [seenIds.lastTopPickId, nextTopPick.id]
          : [nextTopPick.id];
      altPool = pool.filter((r) => !altExclude.includes(r.id));
    }

    if (altPool.length === 0) {
      altPool = pool.filter((r) => r.id !== nextTopPick.id);
    }

    nextAlternatives = sortRecommendationPool(
      altPool,
      filters,
      nextTopPick,
      false,
      direction,
    ).slice(0, count - 1);
  }

  return {
    newTopPick: nextTopPick,
    newAlternatives: nextAlternatives,
  };
}
