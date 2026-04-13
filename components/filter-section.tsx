"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FilterGroup } from "@/components/filter-group"
import { Sparkles, ChevronDown } from "lucide-react"
import type { Filters } from "@/app/page"

const BUDGET_OPTIONS = [
  { value: "250", label: "Under ₱250" },
  { value: "400", label: "Under ₱400" },
  { value: "600", label: "Under ₱600" },
  { value: "1000", label: "₱1000+" },
]

const MOOD_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "filling", label: "Filling" },
  { value: "healthy", label: "Healthy" },
  { value: "comfort", label: "Comfort" },
  { value: "random", label: "Ikaw bahala" },
]

const CUISINE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "filipino", label: "Filipino" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "western", label: "Western" },
]

const DINING_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "pair", label: "Pair" },
  { value: "group", label: "Group" },
]

type FilterSectionProps = {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onSubmit: () => void
  isLoading: boolean
}

export function FilterSection({ filters, setFilters, onSubmit, isLoading }: FilterSectionProps) {
  const [isOptionalOpen, setIsOptionalOpen] = useState(false)

  const handleMoodSelect = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      mood: prev.mood === value ? null : value,
    }))
  }

  const handleOptionalFilterSelect = (key: "budget" | "cuisine" | "dining", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const hasMoodSelected = !!filters.mood

  return (
    <div className="space-y-6">
      {/* Mood - Required */}
      <FilterGroup
        title="Mood"
        options={MOOD_OPTIONS}
        selected={filters.mood}
        onSelect={handleMoodSelect}
      />

      {/* Optional Filters - Collapsible */}
      <div className="rounded-xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setIsOptionalOpen(!isOptionalOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-sm font-medium text-muted-foreground">
            May iba ka bang gusto? (optional)
          </span>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              isOptionalOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOptionalOpen && (
          <div className="space-y-5 border-t border-border px-4 py-4">
            <FilterGroup
              title="Budget"
              options={BUDGET_OPTIONS}
              selected={filters.budget}
              onSelect={(value) => handleOptionalFilterSelect("budget", value)}
            />

            <FilterGroup
              title="Cuisine"
              options={CUISINE_OPTIONS}
              selected={filters.cuisine}
              onSelect={(value) => handleOptionalFilterSelect("cuisine", value)}
            />

            <FilterGroup
              title="Dining Type"
              options={DINING_OPTIONS}
              selected={filters.dining}
              onSelect={(value) => handleOptionalFilterSelect("dining", value)}
            />
          </div>
        )}
      </div>

      <Button
        onClick={onSubmit}
        disabled={!hasMoodSelected || isLoading}
        size="lg"
        className="mt-4 w-full gap-2 text-base"
      >
        {isLoading ? (
          <>
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Eto na...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Pili na tayo
          </>
        )}
      </Button>

      {!hasMoodSelected && !isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Pick a mood to get suggestions
        </p>
      )}
    </div>
  )
}
