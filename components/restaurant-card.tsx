"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, UtensilsCrossed } from "lucide-react"

type RestaurantCardProps = {
  index: number
  name: string
  area: string
  cuisine: string
  priceRange: string
  dishes: string[]
  matchReason: string
  isTopPick?: boolean
  topPickExplanation?: string
}

export function RestaurantCard({
  index,
  name,
  area,
  cuisine,
  priceRange,
  dishes,
  matchReason,
  isTopPick = false,
  topPickExplanation,
}: RestaurantCardProps) {
  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${isTopPick ? "border-2 border-primary ring-2 ring-primary/20" : ""}`}>
      <CardHeader className="pb-3">
        {isTopPick && (
          <div className="mb-2 -mt-1">
            <Badge className="bg-primary text-primary-foreground">Top Pick for You 🔥</Badge>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${isTopPick ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
              {index}
            </span>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              {isTopPick && topPickExplanation ? (
                <p className="mt-1 text-sm text-foreground">{topPickExplanation}</p>
              ) : null}
              <CardDescription className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3" />
                {area}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <UtensilsCrossed className="size-3" />
            {cuisine}
          </Badge>
          <Badge variant="outline">{priceRange}</Badge>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Popular dishes
          </p>
          <p className="text-sm text-foreground">{dishes.join(" · ")}</p>
        </div>

        <div className="rounded-md bg-accent/30 px-3 py-2">
          <p className="text-sm text-accent-foreground">{matchReason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
