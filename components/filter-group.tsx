"use client"

import { cn } from "@/lib/utils"

type Option = {
  value: string
  label: string
}

type FilterGroupProps = {
  title: string
  options: Option[]
  selected: string | null
  onSelect: (value: string) => void
}

export function FilterGroup({ title, options, selected, onSelect }: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              selected === option.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
