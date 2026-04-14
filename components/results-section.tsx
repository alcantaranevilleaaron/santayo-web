"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { Filters } from "@/app/page"
import { getMatchedRestaurants, getRandomFallbackRestaurants } from "@/lib/recommendations"
import { type Restaurant } from "@/data/restaurants"

function getMatchReason(
  restaurant: Restaurant,
  filters: Filters,
  fallbackMode: boolean,
  usedPrimary: Set<string>,
  usedContext: Set<string>
): string {
  const attributePhraseOptions: Record<string, string[]> = {
    comfort: ["Comfort bowl", "Warm comfort", "Comfort plates", "Comfort meal"],
    filling: ["Hearty meal", "Rich plate", "Satisfying entree", "Hearty serving"],
    healthy: ["Fresh bowls", "Healthy plate", "Pure meal", "Fresh selection"],
    light: ["Light bites", "Light plate", "Refined meal", "Easy selection"],
    filipino: ["Filipino classics", "Local favorites", "Filipino comfort", "Classic Filipino"],
    japanese: ["Japanese variety", "Classic ramen", "Ramen spot", "Tokyo bowls"],
    korean: ["Korean grill", "Korean plates", "Korean variety", "Korean specialties"],
    western: ["Steakhouse plates", "Western comfort", "Grilled specialties", "Western classics"],
    cafe: ["Cafe comfort", "Cafe plates", "Coffeehouse meal", "Cafe selection"],
    chinese: ["Chinese dimsum", "Chinese classics", "Chinese plates", "Chinese favorites"],
    thai: ["Thai classics", "Thai flavors", "Thai specialties", "Thai selection"],
    italian: ["Italian pasta", "Pasta classics", "Italian specialties", "Italian selection"],
    indian: ["Indian curry", "Indian flavors", "Indian specialties", "Indian classics"],
    buffet: ["Buffet variety", "Buffet spread", "Curated buffet", "Varied buffet"],
    dessert: ["Sweet treats", "Dessert plates", "Dessert selection", "Sweet finale"],
    sosial: ["Social dining", "Shared dining", "Social plates", "Shared selection"],
    group: ["Group feast", "Group dining", "Shared feast", "Group selection"],
    pair: ["Pair meals", "Date meal", "Two-person set", "Shared meal"],
    solo: ["Solo order", "Solo meal", "Single plate", "Individual meal"],
    premium: ["Premium dining", "Premium plates", "Elevated meal", "Refined meal"],
    noodles: ["Noodle comfort", "Udon comfort", "Noodle bowls", "Noodle classic"],
    quick: ["Quick meal", "Quick plate", "Express meal", "Fast dining"],
  }

  const moodContexts: Record<string, string[]> = {
    comfort: [
      "designed for relaxed dining",
      "best for calm appetites",
      "gentle and satisfying",
      "ideal for comfort cravings",
      "soft and refined",
    ],
    filling: [
      "rich and satisfying",
      "hearty and indulgent",
      "bold and rewarding",
      "ideal for large appetites",
      "rich and tasteful",
    ],
    healthy: [
      "clean and balanced",
      "light yet flavorful",
      "fresh and natural",
      "refined and healthy",
      "simple and crisp",
    ],
    light: [
      "easy and refreshing",
      "mild but flavorful",
      "low-impact dining",
      "light and polished",
      "clean and simple",
    ],
    random: [
      "warm and reliable",
      "balanced and satisfying",
      "great all-around choice",
      "something for any craving",
      "easy pick for any craving",
      "smart and flexible",
    ],
  }

  const fallbackMoodContexts: Record<string, string[]> = {
    comfort: [
      "cozy without being heavy",
      "still comfortable and warm",
      "a softer comfort option",
      "warm and composed",
      "relaxed but refined",
    ],
    filling: [
      "still satisfying and rich",
      "generous without excess",
      "a generous portion",
      "rich yet composed",
      "hearty and balanced",
    ],
    healthy: [
      "still fresh and clean",
      "lighter with good balance",
      "healthy without being sparse",
      "fresh with careful flavor",
      "balanced and thoughtful",
    ],
    light: [
      "still easy and tidy",
      "soft on the palate",
      "light yet composed",
      "simple and elegant",
      "clean and effortless",
    ],
    random: [
      "recommended with confidence",
      "chosen for refined taste",
      "a polished option",
      "carefully selected for you",
      "a balanced recommendation",
    ],
  }

  const getSeededChoice = <T,>(items: T[], seed: string): T => {
    const sum = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0)
    return items[sum % items.length]
  }

  const chooseUniquePhrase = (options: string[], seed: string, used: Set<string>): string => {
    if (options.length === 0) {
      return "Recommended pick"
    }

    const start = options.indexOf(getSeededChoice(options, seed))
    const ordered = [...options.slice(start), ...options.slice(0, start)]
    const selected = ordered.find((option) => !used.has(option)) ?? ordered[0]
    used.add(selected)
    return selected
  }

  const normalizedAttributes = Array.from(
    new Set(
      [
        ...(restaurant.attributes ?? restaurant.tags),
        restaurant.cuisine.toLowerCase(),
        ...restaurant.diningTypes,
      ].map((attribute) => attribute.toLowerCase())
    )
  )

  const primaryAttributePriority = [
    "dessert",
    "buffet",
    "cafe",
    "noodles",
    "quick",
    "premium",
    "filipino",
    "japanese",
    "korean",
    "western",
    "chinese",
    "thai",
    "italian",
    "indian",
    "healthy",
    "light",
    "comfort",
    "filling",
    "sosial",
    "group",
    "pair",
    "solo",
  ]

  const primaryAttribute = primaryAttributePriority.find((attribute) =>
    normalizedAttributes.includes(attribute)
  ) ?? normalizedAttributes[0]

  const primaryPhraseOptions = primaryAttribute
    ? attributePhraseOptions[primaryAttribute] ?? ["Recommended pick"]
    : ["Recommended pick"]

  const primaryPhrase = chooseUniquePhrase(
    primaryPhraseOptions,
    `${restaurant.name}-${restaurant.id}-${primaryAttribute ?? "default"}`,
    usedPrimary
  )

  const mood = filters.mood || "random"
  const contextOptions = fallbackMode
    ? fallbackMoodContexts[mood] ?? fallbackMoodContexts.random
    : moodContexts[mood] ?? moodContexts.random
  const contextPhrase = chooseUniquePhrase(
    contextOptions,
    `${restaurant.name}-${restaurant.id}-${mood}-context`,
    usedContext
  )

  return `${primaryPhrase} — ${contextPhrase}`
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getFilterSummary(filters: Filters): string {
  const parts: string[] = []

  if (filters.mood && filters.mood !== "random") {
    parts.push(capitalize(filters.mood))
  }

  if (filters.budget && filters.budget !== "1000") {
    parts.push(`Under ₱${filters.budget}`)
  }

  if (filters.cuisine && filters.cuisine !== "any") {
    parts.push(capitalize(filters.cuisine))
  }

  if (filters.dining) {
    parts.push(capitalize(filters.dining))
  }

  // return parts.length > 0 ? parts.join(" · ") : "Based on your preferences"

  if (filters.mood === "random") {
    if (parts.length > 0) {
      return `A mix of solid picks ${parts.join(" · ")}`
    }
    return "Kami na pumili"
  }

  return parts.join(" · ")
}

type ResultsSectionProps = {
  filters: Filters
  onBack: () => void
  onRandomize: () => void
  fallbackMode: boolean
  resultHint: string | null
}

export function ResultsSection({ filters, onBack, onRandomize, fallbackMode, resultHint }: ResultsSectionProps) {
  const [isRandomizing, setIsRandomizing] = useState(false)
  const restaurants = fallbackMode
    ? getRandomFallbackRestaurants()
    : getMatchedRestaurants(filters, 3)

  const handleRandomizeClick = () => {
    setIsRandomizing(true)
    onRandomize()
  }

  const moodContext = filters.mood
    ? filters.mood === "light"
      ? "Light and easy."
      : filters.mood === "filling"
      ? "Hearty and satisfying."
      : filters.mood === "comfort"
      ? "Warm and comforting."
      : "No specific mood."
    : "Picked for you — refined recommendations."

  const usedPrimaryPhrases = new Set<string>()
  const usedContextPhrases = new Set<string>()
  const matchReasons = restaurants.map((restaurant) =>
    getMatchReason(restaurant, filters, fallbackMode, usedPrimaryPhrases, usedContextPhrases)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="gap-2">
          <RefreshCw className="size-4" />
          New search
        </Button>
      </div>

      {restaurants.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Best match for your mood 👇</h2>
          <p className="text-sm text-muted-foreground">{moodContext}</p>
          {resultHint && (
            <p className="text-sm text-muted-foreground">{resultHint}</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id}
            index={index + 1}
            name={restaurant.name}
            area={restaurant.area}
            cuisine={restaurant.cuisine}
            priceRange={restaurant.priceRange}
            dishes={restaurant.dishes}
            matchReason={matchReasons[index]}
            isTopPick={index === 0}
          />
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-lg font-semibold text-foreground">
            Walang exact match 😅
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Medyo specific yung napili mo. Gusto mo kami na bahala pumili?
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Pipili kami ng best options base sa setup mo
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={handleRandomizeClick} size="lg" className="w-full sm:w-auto">
              {isRandomizing ? "Sige, kami na bahala… 🍜" : "Ikaw na bahala"}
            </Button>
            <Button variant="outline" onClick={onBack} size="lg" className="w-full sm:w-auto">
              Ayusin filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
