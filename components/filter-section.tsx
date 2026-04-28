"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
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
  onSubmit: (moodOverride?: string) => void
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
    setFilters((prev) => {
      const nextMood = prev.mood === value ? null : value
      return {
        ...prev,
        mood: nextMood,
      }
    })
  }

  const handleRandomMood = () => {
    setFilters((prev) => ({
      ...prev,
      mood: "random",
    }))
    onSubmit("random")
  }

  const handleOptionalFilterSelect = (key: "budget" | "cuisine" | "dining", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const hasMoodSelected = !!filters.mood
  const isRandomSelected = filters.mood === "random"
  const ctaLabel = hasMoodSelected ? "Tara, hanap tayo! 🍽️" : "Pili ka muna ☝️"
  const loadingLabel = "Picking something good…🍜"

  return (
    <div className="relative">
      <div className="space-y-4 pb-16">
        {/* Mood - Required */}
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="space-y-0.5">
            <p className="text-sm font-medium leading-tight text-foreground">
              Anong trip mo today?
            </p>
            <p className="text-xs leading-tight text-muted-foreground">
              What are you craving?
            </p>
          </div>

          <div className="mt-5 space-y-6">
            <FilterGroup
              title=""
              options={MOOD_OPTIONS.filter((option) => option.value !== "random")}
              selected={filters.mood}
              onSelect={handleMoodSelect}
              columns={4}
            />

            <button
              type="button"
              onClick={handleRandomMood}
              disabled={isLoading}
              className={
                isRandomSelected
                  ? "w-full rounded-[14px] border border-rose-300 bg-rose-100 px-4 py-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out transform-gpu active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
                  : "w-full rounded-[14px] border border-rose-300 bg-rose-50/80 px-4 py-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out transform-gpu hover:border-rose-400 hover:bg-rose-100 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold leading-tight text-rose-900">Ikaw na bahala</p>
                  <p className="text-[11px] leading-tight text-rose-700/70">You pick for me</p>
                </div>
                <Sparkles className="size-5 shrink-0 text-rose-500/80" />
              </div>

            </button>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 z-20 bg-background px-4 py-2 shadow-none sm:static sm:border-0 sm:bg-transparent sm:py-0 sm:shadow-none">
          <Button
            onClick={() => onSubmit()}
            disabled={!hasMoodSelected || isLoading}
            className={cn(
              "w-full rounded-[14px] px-4 py-3 text-left gap-2 transition duration-200 ease-out transform-gpu active:scale-[0.97]",
              hasMoodSelected && !isLoading
                ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : isLoading && isRandomSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "opacity-80"
            )}
          >
            {isLoading ? (
              isRandomSelected ? (
                <div className="premium-soft-pulse flex w-full flex-col items-center gap-1">
                  <span className="text-sm font-semibold tracking-tight text-primary-foreground">
                    Picking something good...
                  </span>
                  <span className="text-xs text-primary-foreground/80">Trust us on this one ✨</span>
                </div>
              ) : (
                <>
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {loadingLabel}
                </>
              )
            ) : (
              <>{ctaLabel}</>
            )}
          </Button>
        </div>

        {/* Optional Filters - Collapsible */}
        <div className="rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setIsOptionalOpen(!isOptionalOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span>
              <span className="text-sm font-medium text-foreground">Adjust filters</span>
              <span className="block text-xs text-muted-foreground">Optional</span>
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
