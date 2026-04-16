"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PickAgainAction } from "@/components/pick-again-action"
import { RestaurantCard } from "@/components/restaurant-card"
import { ArrowLeft, RefreshCw, Sparkles, ChevronDown } from "lucide-react"
import type { Filters } from "@/app/page"
import { getNextPickSet, type RecommendationSessionState } from "@/lib/recommendations"
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
    filipino: ["Filipino staples", "Filipino classics", "Local favorites", "Filipino comfort"],
    japanese: ["Japanese variety", "Classic ramen", "Ramen spot", "Tokyo bowls"],
    korean: ["Korean grill", "Korean plates", "Korean variety", "Korean specialties"],
    western: ["Steakhouse plates", "Rotisserie plates", "Grilled specialties", "Western comfort"],
    cafe: ["Cafe comfort", "Warm cafe bites", "Cafe plates", "Coffeehouse meal"],
    chinese: ["Chinese dimsum", "Chinese classics", "Dim sum favorites", "Chinese specialties"],
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
      "light and well-balanced",
      "light and polished",
      "clean and simple",
    ],
    random: [
      "warm and reliable",
      "balanced and satisfying",
      "smart and flexible",
      "refined and approachable",
      "broad appeal across tastes",
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
      "balanced and thoughtful",
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

function getTopPickExplanation(mood: string): string {
  const explanations: Record<string, string[]> = {
    random: [
      "Can’t go wrong with this one.",
      "Safe, satisfying choice.",
      "Works for almost any craving.",
    ],
    filling: [
      "Top choice for hearty, satisfying plates.",
      "Most satisfying option for a full meal.",
    ],
    light: [
      "Best pick for a clean, easy meal.",
      "Top option for a lighter, refined meal.",
    ],
    comfort: [
      "Best choice for warm, comforting flavors.",
      "Top option for familiar, feel-good meals.",
    ],
  }

  const options = explanations[mood] ?? explanations.random
  return options[0]
}

const initialHeaderTitle = "This is our pick for you ✨"
const initialHeaderSubtitle = "Based on your vibe"
const initialTopPickCaption = "Can’t go wrong with this one."

const rerollHeaderTitles = [
  "Here’s another option ✨",
  "We found another good one ✨",
  "This one might fit better ✨",
]

const rerollHeaderSubtitles = [
  "Still based on your preferences",
  "A fresh option for you",
  "Another match worth checking",
]

const rerollTopPickCaptions = [
  "This one might fit better.",
  "Worth considering.",
  "Another strong option.",
]

function getNextResultCopy<T extends string>(options: T[], previous?: T): T {
  const available = previous ? options.filter((option) => option !== previous) : options
  const pool = available.length > 0 ? available : options
  return pool[Math.floor(Math.random() * pool.length)]
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
  const [currentRestaurants, setCurrentRestaurants] = useState<Restaurant[]>([])
  const [sessionState, setSessionState] = useState<RecommendationSessionState>({
    seenTopPickIds: [],
    seenAlternativeIds: [],
    lastTopPickId: null,
  })
  const [isPickingAgain, setIsPickingAgain] = useState(false)
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [isFaded, setIsFaded] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [headerMounted, setHeaderMounted] = useState(false)
  const [cardsMounted, setCardsMounted] = useState(false)
  const [alternativeStage, setAlternativeStage] = useState(0)
  const [freshTopPick, setFreshTopPick] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [headerTitle, setHeaderTitle] = useState(initialHeaderTitle)
  const [headerSubtitle, setHeaderSubtitle] = useState(initialHeaderSubtitle)
  const [topPickCaption, setTopPickCaption] = useState(initialTopPickCaption)

  const restaurants = currentRestaurants

  const loadingMessages = [
    "Picking something good...",
    "Checking the vibe...",
    "Balancing your cravings...",
    "Trust me on this one 👀",
  ]

  const handleRandomizeClick = () => {
    setLoadingIndex(0)
    setIsFaded(true)
    setIsRandomizing(true)
  }

  const handlePickAgain = () => {
    if (isPickingAgain || currentRestaurants.length === 0) {
      return
    }

    setIsFirstLoad(false)
    const nextPickSet = getNextPickSet(filters, sessionState, fallbackMode, 3)
    if (!nextPickSet.newTopPick) {
      return
    }

    setIsPickingAgain(true)

    const thinkingDelay = window.setTimeout(() => {
      setCardsMounted(false)
      setAlternativeStage(0)

      const swapDelay = window.setTimeout(() => {
        setCurrentRestaurants([nextPickSet.newTopPick, ...nextPickSet.newAlternatives])
        setSessionState((prev) => ({
          seenTopPickIds: Array.from(new Set([...prev.seenTopPickIds, nextPickSet.newTopPick!.id])),
          seenAlternativeIds: Array.from(new Set([
            ...prev.seenAlternativeIds,
            ...nextPickSet.newAlternatives.map((restaurant) => restaurant.id),
          ])),
          lastTopPickId: nextPickSet.newTopPick!.id,
        }))
        setHeaderTitle((current) => getNextResultCopy(rerollHeaderTitles, current))
        setHeaderSubtitle((current) => getNextResultCopy(rerollHeaderSubtitles, current))
        setTopPickCaption((current) => getNextResultCopy(rerollTopPickCaptions, current))
        setIsPickingAgain(false)

        window.setTimeout(() => {
          setCardsMounted(true)
          window.setTimeout(() => setAlternativeStage(1), 120)
          window.setTimeout(() => setAlternativeStage(2), 220)
          setFreshTopPick(true)
          window.setTimeout(() => setFreshTopPick(false), 260)
        }, 20)

        window.clearTimeout(swapDelay)
      }, 180)

      window.clearTimeout(thinkingDelay)
    }, 500 + Math.floor(Math.random() * 301))
  }

  useEffect(() => {
    if (!isRandomizing) {
      return
    }

    const rotate = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % loadingMessages.length)
    }, 650)

    return () => window.clearInterval(rotate)
  }, [isRandomizing])

  useEffect(() => {
    if (!isRandomizing) {
      return
    }

    setIsFaded(false)
    const fadeTimer = window.setTimeout(() => setIsFaded(true), 50)

    return () => window.clearTimeout(fadeTimer)
  }, [loadingIndex, isRandomizing])

  useEffect(() => {
    if (!isRandomizing) {
      return
    }

    const delay = window.setTimeout(() => {
      onRandomize()
      setIsRandomizing(false)
    }, 2000)

    return () => window.clearTimeout(delay)
  }, [isRandomizing, onRandomize])

  useEffect(() => {
    const pickSet = getNextPickSet(filters, sessionState, fallbackMode, 3)

    if (pickSet.newTopPick) {
      setCurrentRestaurants([pickSet.newTopPick, ...pickSet.newAlternatives])
      setSessionState({
        seenTopPickIds: [pickSet.newTopPick.id],
        seenAlternativeIds: pickSet.newAlternatives.map((restaurant) => restaurant.id),
        lastTopPickId: pickSet.newTopPick.id,
      })

      if (isFirstLoad) {
        setHeaderTitle(initialHeaderTitle)
        setHeaderSubtitle(initialHeaderSubtitle)
        setTopPickCaption(initialTopPickCaption)
      }

      setIsInitialLoading(true)
      setHeaderMounted(false)
      setCardsMounted(false)
      setAlternativeStage(0)
      setFreshTopPick(false)

      const revealDelay = 700 + Math.floor(Math.random() * 501)
      let cardTimer: number | undefined
      const headerTimer = window.setTimeout(() => {
        setIsInitialLoading(false)
        setHeaderMounted(true)

        cardTimer = window.setTimeout(() => {
          setCardsMounted(true)
          window.setTimeout(() => setAlternativeStage(1), 120)
          window.setTimeout(() => setAlternativeStage(2), 220)
        }, 220)
      }, revealDelay)

      return () => {
        window.clearTimeout(headerTimer)
        if (cardTimer) {
          window.clearTimeout(cardTimer)
        }
      }
    }

    setCurrentRestaurants([])
    setSessionState({
      seenTopPickIds: [],
      seenAlternativeIds: [],
      lastTopPickId: null,
    })
    setIsInitialLoading(false)
    setHeaderMounted(false)
    setCardsMounted(false)
    setAlternativeStage(0)
    setFreshTopPick(false)
  }, [filters, fallbackMode])

  const usedPrimaryPhrases = new Set<string>()
  const usedContextPhrases = new Set<string>()
  const matchReasons = restaurants.map((restaurant) =>
    getMatchReason(restaurant, filters, fallbackMode, usedPrimaryPhrases, usedContextPhrases)
  )

  const topPickExplanation = restaurants.length > 0 ? topPickCaption : undefined

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
        <div className="space-y-2">
          {isInitialLoading ? (
            <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{['Looking for the best fit...', 'Checking your options...', 'We found something good.'][Math.floor(Math.random() * 3)]}</p>
              <div className="h-4 rounded-full bg-muted/30" />
            </div>
          ) : (
            <>
              <div className={`transform transition-all duration-250 ease-out ${headerMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <h2 className="text-lg font-semibold text-foreground">{headerTitle}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{headerSubtitle}</p>
                {resultHint && (
                  <p className="text-sm leading-6 text-muted-foreground">{resultHint}</p>
                )}
                <div className="min-h-5">
                  {isPickingAgain && (
                    <p className="text-sm font-medium text-primary-foreground/80">
                      Trying another option...
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-y-3">
        {restaurants[0] && (
          <div
            key={restaurants[0].id}
            style={{ transitionDelay: `0ms` }}
            className={`transform transition-all duration-250 ease-out ${cardsMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isPickingAgain && cardsMounted ? "opacity-60 animate-pulse" : ""} ${freshTopPick ? "scale-[1.02] shadow-[0_14px_34px_rgba(0,0,0,0.08)]" : "scale-100"}`}
          >
            <RestaurantCard
              index={1}
              name={restaurants[0].name}
              area={restaurants[0].area}
              cuisine={restaurants[0].cuisine}
              priceRange={restaurants[0].priceRange}
              dishes={restaurants[0].dishes}
              matchReason={matchReasons[0]}
              isTopPick
              topPickExplanation={topPickExplanation}
            />
          </div>
        )}

        {restaurants.length > 0 && !isInitialLoading && (
          <PickAgainAction
            onPickAgain={handlePickAgain}
            isPickingAgain={isPickingAgain}
          />
        )}

        {restaurants.slice(1).map((restaurant, index) => {
          const delay = 120 + index * 100

          return (
            <div
              key={restaurant.id}
              style={{ transitionDelay: `${delay}ms` }}
              className={`transform transition-all duration-250 ease-out ${alternativeStage > index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} scale-100`}
            >
              <RestaurantCard
                index={index + 2}
                name={restaurant.name}
                area={restaurant.area}
                cuisine={restaurant.cuisine}
                priceRange={restaurant.priceRange}
                dishes={restaurant.dishes}
                matchReason={matchReasons[index + 1]}
              />
            </div>
          )
        })}
      </div>

      {restaurants.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <p className="text-lg font-semibold text-foreground">
            No exact match found.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            But we’ve curated a few strong options for you.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Or let us decide — kami na bahala.
          </p>

          {isRandomizing ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                size="lg"
                disabled
                className="w-full sm:w-auto border-2 border-rose-500 bg-rose-100 text-rose-900 shadow-lg"
                aria-busy="true"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-sm font-semibold tracking-tight text-foreground transition-opacity duration-500 ${isFaded ? "opacity-100" : "opacity-0"}`}>
                    {loadingMessages[loadingIndex]}
                  </span>
                  <span className="text-xs text-foreground/80">
                    Taking a moment to select the best match for you.
                  </span>
                </div>
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={handleRandomizeClick}
                size="lg"
                className="w-full sm:w-auto border-rose-300 bg-rose-50 text-rose-900 hover:border-rose-400 hover:bg-rose-100 hover:-translate-y-0.5 active:scale-95"
              >
                <div className="flex items-center justify-between gap-3">
                  <span>Ikaw na bahala</span>
                  <Sparkles className="size-5 text-rose-600" />
                </div>
              </Button>
              <Button variant="outline" onClick={onBack} size="lg" className="w-full sm:w-auto">
                Adjust filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
