"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PickAgainAction } from "@/components/pick-again-action"
import { RestaurantCard } from "@/components/restaurant-card"
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react"
import type { Filters } from "@/app/page"
import {
  getAlternativeRecommendations,
  getNextPickSet,
  createRecommendationSession,
  type RecommendationSession,
  type RecommendationSessionState,
} from "@/lib/recommendations"
import { RESTAURANTS, type Restaurant } from "@/data/restaurants"

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
  onNewSearch: () => void
  onRandomize: () => void
  fallbackMode: boolean
  resultHint: string | null
}

export function ResultsSection({ filters, onBack, onNewSearch, onRandomize, fallbackMode, resultHint }: ResultsSectionProps) {
  // Debugging utility to trace recommendation flow and decisions
  const DEBUG_RECO = true

  const debugReco = (label: string, data?: unknown) => {
    if (!DEBUG_RECO) return
    console.log(`[SanTayo Reco] ${label}`, data)
  }
  
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
  const [isRefreshingAlternatives, setIsRefreshingAlternatives] = useState(false)
  const [currentAlternativeIds, setCurrentAlternativeIds] = useState<number[]>([])
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null)
  const [directionHelperText, setDirectionHelperText] = useState<string | null>(null)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  // Centralized session container — parallel to existing state, not yet wired to behavior
  const [recommendationSession, setRecommendationSession] = useState<RecommendationSession | null>(null)
  const [isExplorationVisible, setIsExplorationVisible] = useState(false)
  const alternativesRef = useRef<HTMLDivElement | null>(null)
  const topPickRef = useRef<HTMLDivElement | null>(null)
  const timeoutsRef = useRef<number[]>([])
  const [headerTitle, setHeaderTitle] = useState(initialHeaderTitle)
  const [headerSubtitle, setHeaderSubtitle] = useState(initialHeaderSubtitle)
  const [topPickCaption, setTopPickCaption] = useState(initialTopPickCaption)

  const clearAllTimeouts = () => {
    for (const timeoutId of timeoutsRef.current) {
      window.clearTimeout(timeoutId)
    }
    timeoutsRef.current = []
  }

  const setManagedTimeout = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== timeoutId)
      callback()
    }, delay)

    timeoutsRef.current.push(timeoutId)
    return timeoutId
  }

  const revealExploration = () => {
    if (isExplorationVisible) {
      return
    }

    setIsExplorationVisible(true)
    setHasUserInteracted(true)
  }

  const restaurants = currentRestaurants

  const loadingMessages = [
    "Picking something good...",
    "Checking the vibe...",
    "Balancing your cravings...",
    "Trust me on this one 👀",
  ]

  // Reset all chip-related recommendation state for a fresh recommendation flow
  const resetRecommendationState = () => {
    // Debugging information for recommendation state reset
    debugReco("RESET recommendation state", {
      filters,
      currentRestaurants: currentRestaurants.map((r) => ({
        id: r.id,
        name: r.name,
        priceBucket: r.priceBucket,
      })),
    })

    setSessionState({
      seenTopPickIds: [],
      seenAlternativeIds: [],
      lastTopPickId: null,
    })
    setCurrentAlternativeIds([])
    setSelectedDirection(null)
    setDirectionHelperText(null)
    setRecommendationSession(null)
  }

  const resetForReroll = () => {
    // debug for reset reroll
    debugReco("RESET FOR REROLL", {
      previousSession: recommendationSession
        ? {
            topPick: recommendationSession.topPick?.id,
            activeChip: recommendationSession.activeChip,
            usedAlternativeIds: [...recommendationSession.usedAlternativeIds],
            chipHistory: recommendationSession.chipHistory,
          }
        : null,
    })

    setSessionState({
      seenTopPickIds: [],
      seenAlternativeIds: [],
      lastTopPickId: null,
    })
    setCurrentAlternativeIds([])
    setSelectedDirection(null)
    setDirectionHelperText(null)
    // Clear the session immediately so chip history and used IDs from the
    // previous session cannot leak into the new one during the loading window.
    setRecommendationSession(null)
    //to leave chip-refresh mode before starting the reroll animation
    setIsRefreshingAlternatives(false)
    setAlternativeStage(0)
  }

  const hardResetSession = () => {
    clearAllTimeouts()
    resetRecommendationState()

    setIsFirstLoad(true)
    setIsInitialLoading(true)
    setIsExplorationVisible(false)
    setCardsMounted(false)
    setHeaderMounted(false)
    setAlternativeStage(0)
    setFreshTopPick(false)
    setIsRefreshingAlternatives(false)
    setIsPickingAgain(false)
    setIsRandomizing(false)
    setLoadingIndex(0)
    setIsFaded(true)
    setHeaderTitle(initialHeaderTitle)
    setHeaderSubtitle(initialHeaderSubtitle)
    setTopPickCaption(initialTopPickCaption)
    setHasUserInteracted(false)
  }

  const handleBack = () => {
    hardResetSession()
    onBack()
  }

  const handleNewSearch = () => {
    hardResetSession()
    onNewSearch()
  }

  const handleRandomizeClick = () => {
    setLoadingIndex(0)
    setIsFaded(true)
    setIsRandomizing(true)
  }

  // Guard against spamming the pick again button or direction chips, which can cause state conflicts and a poor experience
  const pickAgainLockRef = useRef(false)
  const chipActionLockRef = useRef(false)

  const handlePickAgain = () => {   

    // Debugging information for pick again action
    debugReco("PICK AGAIN clicked", {
      filters,
      currentTopPick: currentRestaurants[0]
        ? {
            id: currentRestaurants[0].id,
            name: currentRestaurants[0].name,
            priceBucket: currentRestaurants[0].priceBucket,
          }
        : null,
      currentAlternativeIds,
      sessionState,
      recommendationSession: recommendationSession
        ? {
            topPick: recommendationSession.topPick?.id,
            activeChip: recommendationSession.activeChip,
            usedAlternativeIds: [...recommendationSession.usedAlternativeIds],
            chipHistory: recommendationSession.chipHistory,
          }
        : null,
    })

    if (pickAgainLockRef.current || chipActionLockRef.current || currentRestaurants.length === 0) {
      return
    }    

    // Reset all chip-related state for a fresh neutral reroll
    // resetRecommendationState()
    pickAgainLockRef.current = true
    setIsPickingAgain(true)
    clearAllTimeouts()
    resetForReroll()
    setDirectionHelperText(null)
    setIsRefreshingAlternatives(false)

    revealExploration()
    window.scrollTo({ top: 0, behavior: "smooth" })

    setManagedTimeout(() => {
      setIsFirstLoad(false)
      // After reset, sessionState is fresh, so generate a neutral recommendation
      const nextPickSet = getNextPickSet(filters, {
        seenTopPickIds: [],
        seenAlternativeIds: [],
        lastTopPickId: null,
      }, fallbackMode, 3)

      // Debugging information for pick again result
      debugReco("PICK AGAIN result", {
        topPick: nextPickSet.newTopPick
          ? {
              id: nextPickSet.newTopPick.id,
              name: nextPickSet.newTopPick.name,
              priceBucket: nextPickSet.newTopPick.priceBucket,
            }
          : null,
        alternatives: nextPickSet.newAlternatives.map((r) => ({
          id: r.id,
          name: r.name,
          priceBucket: r.priceBucket,
        })),
      })


      if (!nextPickSet.newTopPick) {
        setIsPickingAgain(false)
        pickAgainLockRef.current = false
        return
      }

      const topPick = nextPickSet.newTopPick
      // setIsPickingAgain(true)

      setManagedTimeout(() => {
        setCardsMounted(false)
        setAlternativeStage(0)

        setManagedTimeout(() => {
          setCurrentRestaurants([topPick, ...nextPickSet.newAlternatives])
          setCurrentAlternativeIds(nextPickSet.newAlternatives.map((restaurant) => restaurant.id))
          setSessionState({
            seenTopPickIds: [topPick.id],
            seenAlternativeIds: nextPickSet.newAlternatives.map((restaurant) => restaurant.id),
            lastTopPickId: topPick.id,
          })
          setRecommendationSession(
              createRecommendationSession(filters, fallbackMode, topPick, nextPickSet.newAlternatives),
          )
          setHeaderTitle((current) => getNextResultCopy(rerollHeaderTitles, current))
          setHeaderSubtitle((current) => getNextResultCopy(rerollHeaderSubtitles, current))
          setTopPickCaption((current) => getNextResultCopy(rerollTopPickCaptions, current))
          // setIsPickingAgain(false)

          setManagedTimeout(() => {
            setCardsMounted(true)
            setManagedTimeout(() => setAlternativeStage(1), 120)
            setManagedTimeout(() => setAlternativeStage(2), 220)
            setFreshTopPick(true)
            setManagedTimeout(() => {
              setFreshTopPick(false)
              setIsPickingAgain(false)
              pickAgainLockRef.current = false
            }, 260)
          }, 20)
        }, 180)
      }, 500 + Math.floor(Math.random() * 301))
    }, 120)
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
    const fadeTimer = setManagedTimeout(() => setIsFaded(true), 50)

    return () => window.clearTimeout(fadeTimer)
  }, [loadingIndex, isRandomizing])

  useEffect(() => {
    if (!isRandomizing) {
      return
    }

    const delay = setManagedTimeout(() => {
      onRandomize()
      setIsRandomizing(false)
    }, 2000)

    return () => window.clearTimeout(delay)
  }, [isRandomizing, onRandomize])

  useEffect(() => {
    if (isInitialLoading || isExplorationVisible || restaurants.length === 0) {
      return
    }

    const idleDelay = setManagedTimeout(() => {
      revealExploration()
    }, 1400)

    return () => window.clearTimeout(idleDelay)
  }, [isInitialLoading, isExplorationVisible, restaurants.length])

  useEffect(() => {
    if (isExplorationVisible || restaurants.length === 0) {
      return
    }

    const onScroll = () => {
      const topPickElement = topPickRef.current
      if (!topPickElement) {
        return
      }

      const rect = topPickElement.getBoundingClientRect()
      if (rect.bottom < 40) {
        revealExploration()
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [isExplorationVisible, restaurants.length])

  useEffect(() => {
    // Debugging information for initial/new filter effect
    debugReco("INITIAL/NEW FILTER effect triggered -- before getNextPickSet", {
      filters,
      fallbackMode,
      sessionState,
    })

    const pickSet = getNextPickSet(filters, sessionState, fallbackMode, 3)

    // Debugging information for initial/new filter result
    debugReco("INITIAL/NEW FILTER result -- after getNextPickSet", {
      topPick: pickSet.newTopPick
        ? {
            id: pickSet.newTopPick.id,
            name: pickSet.newTopPick.name,
            priceBucket: pickSet.newTopPick.priceBucket,
          }
        : null,
      alternatives: pickSet.newAlternatives.map((r) => ({
        id: r.id,
        name: r.name,
        priceBucket: r.priceBucket,
      })),
    })

    if (pickSet.newTopPick) {
      setCurrentRestaurants([pickSet.newTopPick, ...pickSet.newAlternatives])
      setCurrentAlternativeIds(pickSet.newAlternatives.map((restaurant) => restaurant.id))
      setSessionState({
        seenTopPickIds: [pickSet.newTopPick.id],
        seenAlternativeIds: pickSet.newAlternatives.map((restaurant) => restaurant.id),
        lastTopPickId: pickSet.newTopPick.id,
      })
      setRecommendationSession(
        createRecommendationSession(filters, fallbackMode, pickSet.newTopPick, pickSet.newAlternatives),
      )

      if (isFirstLoad) {
        setHeaderTitle(initialHeaderTitle)
        setHeaderSubtitle(initialHeaderSubtitle)
        setTopPickCaption(initialTopPickCaption)
        setIsExplorationVisible(true)
      }

      setIsInitialLoading(true)
      setHeaderMounted(false)
      setCardsMounted(false)
      setAlternativeStage(0)
      setFreshTopPick(false)

      const revealDelay = 700 + Math.floor(Math.random() * 501)
      let cardTimer: number | undefined
      const headerTimer = setManagedTimeout(() => {
        setIsInitialLoading(false)
        setHeaderMounted(true)

        cardTimer = setManagedTimeout(() => {
          setCardsMounted(true)
          setManagedTimeout(() => setAlternativeStage(1), 120)
          setManagedTimeout(() => setAlternativeStage(2), 220)
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
    setCurrentAlternativeIds([])
    setSelectedDirection(null)
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

  useEffect(() => {
    return () => {
      clearAllTimeouts()
    }
  }, [])

  const usedPrimaryPhrases = new Set<string>()
  const usedContextPhrases = new Set<string>()
  const matchReasons = restaurants.map((restaurant) =>
    getMatchReason(restaurant, filters, fallbackMode, usedPrimaryPhrases, usedContextPhrases)
  )

  const topPickExplanation = restaurants.length > 0 ? topPickCaption : undefined

  const directionOptions = [
    { key: "light", label: "Light" },
    { key: "comfort", label: "Comfort" },
    { key: "premium", label: "Premium" },
    { key: "quick bite", label: "Quick bite" },
    { key: "healthy", label: "Healthy" },
  ]

  const directionHelperCopy: Record<string, string> = {
    light: "Showing lighter options",
    comfort: "Switching to comfort food",
    premium: "Exploring premium picks",
    "quick bite": "Looking for quick bites",
    healthy: "Showing healthier options",
  }

  const handleDirectionSelect = (direction: string) => {

    // Debugging information for chip click action
    debugReco("CHIP clicked", {
      direction,
      filters,
      currentTopPick: restaurants[0]
        ? {
            id: restaurants[0].id,
            name: restaurants[0].name,
            priceBucket: restaurants[0].priceBucket,
          }
        : null,
      session: recommendationSession
        ? {
            topPick: recommendationSession.topPick?.id,
            activeChip: recommendationSession.activeChip,
            usedAlternativeIds: [...recommendationSession.usedAlternativeIds],
            chipHistory: recommendationSession.chipHistory,
          }
        : null,
    })

    if (
      pickAgainLockRef.current ||
      chipActionLockRef.current ||
      isInitialLoading ||
      isRandomizing ||
      isRefreshingAlternatives ||
      restaurants.length <= 1 ||
      !recommendationSession?.topPick
    ) {
      return
    }

    chipActionLockRef.current = true
    setIsRefreshingAlternatives(true)
    clearAllTimeouts()

    // Lock top pick to the session — never derive it from live UI state
    const session = recommendationSession
    const topPick = session.topPick
    if (!topPick) {
      chipActionLockRef.current = false
      setIsRefreshingAlternatives(false)
      return
    }

    setSelectedDirection(direction)
    setDirectionHelperText(directionHelperCopy[direction] ?? "Looking for a new direction…")
    setAlternativeStage(-1)

    // Each chip direction has its own independent rotation history within the session.
    // Same chip → accumulate excludes so we rotate through fresh alternatives.
    // Different chip → starts from its own history (empty on first click).
    const seenForChip = session.chipHistory[direction] ?? []
    const excludeIds = Array.from(new Set([topPick.id, ...seenForChip]))

    // Debugging information for chip exclude IDs
    debugReco("CHIP excludeIds", {
      direction,
      topPickId: topPick.id,
      seenForChip,
      excludeIds,
    })    

    const candidatePool = RESTAURANTS.filter(
      (r) => r.operatingStatus !== "closed" && r.id !== topPick.id,
    )

    // const directionPool =
    //   direction === "premium"
    //     ? candidatePool.filter(
    //         (r) => r.priceBucket === "premium" || r.priceBucket === "splurge"
    //       )
    //     : candidatePool

    const getDirectionPool = (direction: string, pool: Restaurant[]) => {
      switch (direction) {
        case "premium":
          return pool.filter(
            (r) => r.priceBucket === "premium" || r.priceBucket === "splurge"
          )

        case "light":
          return pool.filter(
            (r) =>
              // r.moodTags?.includes("light") ||
              r.tags?.includes("light") 
              // ||
              // r.foodCategories?.includes("salad") ||
              // r.foodCategories?.includes("healthy")
          )

        case "comfort":
          return pool.filter(
            (r) =>
              // r.moodTags?.includes("comfort") ||
              r.tags?.includes("comfort") 
              // ||
              // r.experienceTags?.includes("casual")
          )

        case "healthy":
          return pool.filter(
            (r) =>
              // r.moodTags?.includes("healthy") ||
              r.cuisine?.includes("healthy") ||
              r.tags?.includes("healthy") 
              // ||
              // r.foodCategories?.includes("healthy") ||
              // r.foodCategories?.includes("salad")
          )

        case "quick bite":
          return pool.filter(
            (r) =>
              r.tags?.includes("quick") ||
              r.tags?.includes("snack") ||
              r.tags?.includes("grab-and-go") ||
              r.moodTags?.includes("Quick") ||
              r.experienceTags?.includes("Quick") 
          )

        default:
          return pool
      }
    }

    const strictDirectionPool = getDirectionPool(direction, candidatePool)

    const directionPool =
      strictDirectionPool.length >= 2 ? strictDirectionPool : candidatePool

    debugReco("CHIP candidate pool", {
      direction,
      candidatePoolSize: candidatePool.length,
      premiumCount: candidatePool.filter((r) => r.priceBucket === "premium").length,
      splurgeCount: candidatePool.filter((r) => r.priceBucket === "splurge").length,
    })

    debugReco("CHIP direction pool", {
      direction,
      before: candidatePool.length,
      afterStrictFilter: strictDirectionPool.length,
      finalPool: directionPool.length,
      fallbackUsed: strictDirectionPool.length < 2,
      sample: directionPool.slice(0, 5).map((r) => ({
        id: r.id,
        name: r.name,
        priceBucket: r.priceBucket,
        tags: r.tags,
        moodTags: r.moodTags,
        foodCategories: r.foodCategories,
        experienceTags: r.experienceTags,
      })),
    })

    const nextAlternatives = getAlternativeRecommendations(
      topPick,
      directionPool,
      session.originalFilters,
      excludeIds,
      2,
      direction,
    )

    debugReco("CHIP alternatives result", {
      direction,
      count: nextAlternatives.length,
      alternatives: nextAlternatives.map((r) => ({
        id: r.id,
        name: r.name,
        priceBucket: r.priceBucket,
        tags: r.tags,
        moodTags: r.moodTags,
        experienceTags: r.experienceTags,
      })),
    })

    const loadingDuration = 380 + Math.floor(Math.random() * 120)
    setManagedTimeout(() => {
      if (nextAlternatives.length > 0) {
        const nextAlternativeIds = nextAlternatives.map((r) => r.id)

        // Top pick is always session.topPick — alternatives are the only thing that changes
        setCurrentRestaurants([topPick, ...nextAlternatives])
        setCurrentAlternativeIds(nextAlternativeIds)

        setRecommendationSession((current) => {
          if (!current) return current
          const updatedSeenForChip = Array.from(new Set([...seenForChip, ...nextAlternativeIds]))
          return {
            ...current,
            alternatives: nextAlternatives,
            usedAlternativeIds: new Set([...current.usedAlternativeIds, ...nextAlternativeIds]),
            activeChip: direction,
            chipHistory: {
              ...current.chipHistory,
              [direction]: updatedSeenForChip,
            },
          }
        })

        setAlternativeStage(0)
        setManagedTimeout(() => {
          setAlternativeStage(1)
          setManagedTimeout(() => {
            setAlternativeStage(2)
            setDirectionHelperText(null)
            setIsRefreshingAlternatives(false)
            chipActionLockRef.current = false
          }, 120)
          alternativesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          setDirectionHelperText(null)
        }, 20)
      } else {
        setDirectionHelperText(null)
        setIsRefreshingAlternatives(false)
        chipActionLockRef.current = false
      }
    }, loadingDuration)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button variant="outline" size="sm" onClick={handleNewSearch} className="gap-2">
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
          )}
        </div>
      )}

      {restaurants[0] && (
        <div className="mt-3" ref={topPickRef}>
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
        </div>
      )}

      {restaurants.length > 0 && !isInitialLoading && (
        <div className="mt-4">
          <PickAgainAction
            onPickAgain={handlePickAgain}
            isPickingAgain={isPickingAgain}
          />
        </div>
      )}

      {isExplorationVisible && restaurants.length > 0 && !isInitialLoading && (
        <div className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-250 ease-out">
          <p className="text-sm font-semibold text-foreground mb-1">Not feeling this pick?</p>
          <p className="text-sm leading-6 text-muted-foreground mb-3">Explore other directions without changing your top pick</p>
          <div className="flex gap-2 flex-nowrap overflow-x-auto overflow-y-hidden px-1 pr-3 pb-1 snap-x snap-mandatory touch-pan-x">
            {directionOptions.map((direction) => {
              const isActive = selectedDirection === direction.key
              return (
                <button
                  key={direction.key}
                  type="button"
                  onClick={() => handleDirectionSelect(direction.key)}
                  disabled={isPickingAgain || isInitialLoading || isRandomizing || isRefreshingAlternatives} // for now, disable direction chips during the picking again flow and initial loading. We can consider allowing direction changes during picking again in the future if it doesn't create a confusing experience.
                  // className={`flex-shrink-0 min-w-max snap-start rounded-full border px-4 py-2 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${isActive ? "border-primary bg-primary/15 text-primary shadow-sm" : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"}`}

                  className={`flex-shrink-0 min-w-max snap-start rounded-full border px-4 py-2 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive
                      ? "border-primary bg-primary/15 text-primary shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                  } ${
                    isPickingAgain || isInitialLoading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}

                  aria-pressed={isActive}
                >
                  {direction.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div ref={alternativesRef} className="mt-4">
          {directionHelperText ? (
            <p className="mb-3 text-sm text-muted-foreground">{directionHelperText}</p>
          ) : null}

          {isRefreshingAlternatives ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Looking for something different…</p>
              {[1, 2].map((item) => (
                <div key={item} className="h-32 rounded-[28px] bg-muted/20 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
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
          )}
        </div>
      )}

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
              <Button variant="outline" onClick={handleNewSearch} size="lg" className="w-full sm:w-auto">
                Adjust filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
