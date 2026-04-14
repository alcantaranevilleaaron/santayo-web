"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RestaurantCard } from "@/components/restaurant-card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { Filters } from "@/app/page"
import { getMatchedRestaurants, getRandomFallbackRestaurants } from "@/lib/recommendations"
import { type Restaurant } from "@/data/restaurants"

function getMatchReason(restaurant: Restaurant, filters: Filters): string {
  const attributePhraseMap: Record<string, string> = {
    comfort: "Comfort food na safe move",
    filling: "Heavy at satisfying",
    healthy: "Fresh at hindi mabigat",
    light: "Magaan pero may lasa",
    filipino: "Pinoy flavors na familiar",
    japanese: "Japanese comfort na sulit",
    korean: "Korean cravings na shareable",
    western: "Western favorites na easy order",
    cafe: "Cafe vibes, may coffee at bakery",
    chinese: "Chinese classics na sulit",
    thai: "Thai na may kick",
    italian: "Italiano na cozy",
    indian: "Indian spice trip",
    buffet: "Maraming choices at sulit",
    dessert: "Sweet treat na pang-treat",
    sosial: "Sosyal setup na shareable",
    group: "Good for barkada",
    pair: "Swak sa date o tandem",
    solo: "Perfect sa solo chow",
  }

  const moodContexts: Record<string, string[]> = {
    comfort: [
      "Panalo kung gusto mo ng hug in a bowl.",
      "Trip mo 'yong comfort food na familiar.",
      "Bagay kapag gusto mo ng soft at satisfying.",
    ],
    filling: [
      "Solid kung gutom ka na gutom.",
      "Good move sa cravings mode.",
      "Swak para sa heavy meal day.",
    ],
    healthy: [
      "Maganda sa light pero busog na choice.",
      "Swak kung ayaw mo ng greasy.",
      "Ganda kung balance ang hanap mo.",
    ],
    light: [
      "Magaan at easy lang, pero may lasa.",
      "Perfect kung ayaw mo ng sobra-sobrang bigat.",
      "Ganda sa quick bite mood.",
    ],
    random: [
      "Pili kami — panalo 'to sa mood mo.",
      "Good move kung gusto mo ng solid kahit hindi sure.",
      "Safe choice para sa current vibe mo.",
    ],
  }

  const getSeededChoice = <T,>(items: T[], seed: string): T => {
    const sum = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0)
    return items[sum % items.length]
  }

  const normalizedAttributes = Array.from(
    new Set(restaurant.attributes.map((attribute) => attribute.toLowerCase()))
  )

  const preferredAttributes: string[] = []
  const mood = filters.mood || "random"

  if (mood !== "random" && normalizedAttributes.includes(mood)) {
    preferredAttributes.push(mood)
  }

  const cuisine = restaurant.cuisine.toLowerCase()
  if (normalizedAttributes.includes(cuisine) && !preferredAttributes.includes(cuisine)) {
    preferredAttributes.push(cuisine)
  }

  if (filters.dining) {
    const dining = filters.dining.toLowerCase()
    if (normalizedAttributes.includes(dining) && !preferredAttributes.includes(dining)) {
      preferredAttributes.push(dining)
    }
  }

  for (const attribute of normalizedAttributes) {
    if (!preferredAttributes.includes(attribute)) {
      preferredAttributes.push(attribute)
    }
  }

  const selectedAttributes = preferredAttributes.filter(
    (attribute): attribute is keyof typeof attributePhraseMap => attribute in attributePhraseMap
  )

  const attributePhrases = selectedAttributes.slice(0, 2).map((attribute) => attributePhraseMap[attribute])
  const primaryPhrase = attributePhrases[0] ?? "Good choice na swak sa mood mo"
  const attributeText = attributePhrases.length > 1
    ? `${primaryPhrase} at ${attributePhrases[1].toLowerCase()}`
    : primaryPhrase

  const contextOptions = moodContexts[mood] ?? moodContexts.random
  const contextPhrase = getSeededChoice(contextOptions, restaurant.name)

  return `${attributeText}. ${contextPhrase}`
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
    ? `Para sa '${capitalize(filters.mood)}' mood mo`
    : "Recommended base sa napili mo"

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
            matchReason={getMatchReason(restaurant, filters)}
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
