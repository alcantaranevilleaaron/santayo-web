"use client"

import { useState } from "react"
import { FilterSection } from "@/components/filter-section"
import { ResultsSection } from "@/components/results-section"
import { getMatchedRestaurants, getFallbackRestaurants } from "@/lib/recommendations"
import { MapPin, Utensils } from "lucide-react"

export type Filters = {
  budget: string | null
  mood: string | null
  cuisine: string | null
  dining: string | null
}

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    budget: null,
    mood: null,
    cuisine: null,
    dining: null,
  })

  const handleSubmit = (moodOverride?: string) => {
    setIsLoading(true)
    const duration = (moodOverride ?? filters.mood) === "random" ? 2200 : 1200

    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, duration)
  }

  const [fallbackRandom, setFallbackRandom] = useState(false)
  const [resultsHint, setResultsHint] = useState<string | null>(null)

  const handleBack = () => {
    setShowResults(false)
    setFallbackRandom(false)
    setResultsHint(null)
  }

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

  const handleRandomize = () => {
    const exactResults = getMatchedRestaurants(filters, 3)
    let nextHint: string | null = null
    let willFallback = false

    if (exactResults.length === 0) {
      willFallback = true
      if (filters.cuisine && filters.cuisine !== "any") {
        nextHint = `We prioritized ${capitalize(filters.cuisine)} for you.`
      } else if (filters.mood && filters.mood !== "random") {
        nextHint = `We kept your ${capitalize(filters.mood)} mood in mind.`
      } else {
        nextHint = "We found a strong fallback based on your preferences."
      }

      console.log("fallback_ikaw_na_bahala_triggered", {
        originalFilters: filters,
      })
    } else if (filters.cuisine && filters.cuisine !== "any") {
      nextHint = `${capitalize(filters.cuisine)} picks for you`
    }

    setFallbackRandom(willFallback)
    setResultsHint(nextHint)
    setShowResults(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[420px] px-4 py-6 md:max-w-lg md:py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Utensils className="size-4" />
            <span className="text-sm font-medium">Saan tayo kakain?</span>
          </div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Kami na bahala.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4" />
            <span className="text-sm">Bonifacio Global City</span>
          </div>
        </header>

        {/* Content */}
        {showResults ? (
          <ResultsSection
            filters={filters}
            onBack={handleBack}
            onRandomize={handleRandomize}
            fallbackMode={fallbackRandom}
            resultHint={resultsHint}
          />
        ) : (
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  )
}
