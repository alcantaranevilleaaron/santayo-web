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
  autoSubmitOnMood?: boolean
}

export function FilterSection({
  filters,
  setFilters,
  onSubmit,
  isLoading,
  autoSubmitOnMood = false,
}: FilterSectionProps) {
  const [isOptionalOpen, setIsOptionalOpen] = useState(
    !!filters.budget || !!filters.cuisine || !!filters.dining
  )

  const handleMoodSelect = (value: string) => {
    const nextMood = filters.mood === value ? null : value
    setFilters((prev) => ({
      ...prev,
      mood: nextMood,
    }))

    if (autoSubmitOnMood && nextMood) {
      onSubmit()
    }
  }

  const handleOptionalFilterSelect = (key: "budget" | "cuisine" | "dining", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const hasMoodSelected = !!filters.mood

  return (
    <div className="relative">
      <div className="space-y-6 pb-28">
        {/* Mood - Required */}
        <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Mood
            </p>
            <p className="text-sm text-muted-foreground">
              Pili ka lang, kami na bahala.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <FilterGroup
              title=""
              options={MOOD_OPTIONS.filter((option) => option.value !== "random")}
              selected={filters.mood}
              onSelect={handleMoodSelect}
              columns={4}
            />

            <button
              type="button"
              onClick={() => handleMoodSelect("random")}
              className={
                filters.mood === "random"
                  ? "w-full rounded-3xl border border-rose-500 bg-rose-100 px-5 py-4 text-left text-sm font-semibold text-rose-900 shadow-sm transition duration-150 ease-out"
                  : "w-full rounded-3xl border border-amber-300 bg-amber-50 px-5 py-4 text-left text-sm font-semibold text-amber-900 transition duration-150 ease-out hover:border-amber-400 hover:bg-amber-100"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span>Ikaw na bahala</span>
                <span>🤷</span>
              </div>
              {/* <p className="mt-2 text-xs text-amber-700/90">
                I’ll take care of the choice for you.
              </p> */}
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border/70 bg-background/95 px-0 py-4 backdrop-blur-sm shadow-[0_-10px_30px_-15px_rgba(15,23,42,0.12)] sm:static sm:border-0 sm:bg-transparent sm:py-0 sm:shadow-none">
          <Button
            onClick={onSubmit}
            disabled={!hasMoodSelected || isLoading}
            size="lg"
            className="w-full gap-2 text-base"
          >
            {isLoading ? (
              <>
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Hanap lang kami...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Pili na tayo
              </>
            )}
          </Button>

          {!hasMoodSelected && !isLoading && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Pili ka lang, kami na bahala.
            </p>
          )}
        </div>

        {/* Optional Filters - Collapsible */}
        <div className="rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setIsOptionalOpen(!isOptionalOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span>
              <span className="text-sm font-medium text-foreground">Refine pa natin?</span>
              <span className="block text-xs text-muted-foreground">Optional filters</span>
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
      </div>
    </div>
  )
}
