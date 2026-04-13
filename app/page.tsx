"use client"

import { useState } from "react"
import { FilterSection } from "@/components/filter-section"
import { ResultsSection } from "@/components/results-section"
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

  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 1200)
  }

  const handleBack = () => {
    setShowResults(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 md:py-10">
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
          <ResultsSection filters={filters} onBack={handleBack} />
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
