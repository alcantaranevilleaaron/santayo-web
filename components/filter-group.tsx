"use client"

import { cn } from "@/lib/utils"

type Option = {
  value: string
  label: string
}

type FilterGroupProps = {
  title?: string
  options: Option[]
  selected: string | null
  onSelect: (value: string) => void
  columns?: 4
  fullWidth?: boolean
}

export function FilterGroup({ title, options, selected, onSelect, columns, fullWidth }: FilterGroupProps) {
  const layoutClass = columns === 4 ? "grid grid-cols-4 gap-3" : fullWidth ? "grid gap-3" : "flex flex-wrap gap-2"

  return (
    <div className="space-y-3">
      {title ? <h2 className="text-sm font-medium text-foreground">{title}</h2> : null}
      <div className={layoutClass}>
        {options.map((option) => {
          const isRandom = option.value === "random"
          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onSelect(option.value)}
              aria-pressed={selected === option.value}
              className={cn(
                "inline-flex items-center justify-center min-h-11 rounded-full border px-4 py-2 text-sm font-medium leading-none text-center transition duration-200 ease-out transform-gpu focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95",
                columns === 4 || fullWidth ? "w-full" : "",
                selected === option.value
                  ? "border-rose-200 bg-rose-100 text-rose-900"
                  : isRandom
                  ? "border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-400 hover:bg-amber-100 hover:-translate-y-0.5"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5"
              )}
            >
              {option.label}
              {isRandom ? " 🤷" : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
