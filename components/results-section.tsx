"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PickAgainAction } from "@/components/pick-again-action"
import { RestaurantCard } from "@/components/restaurant-card"
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react"
import type { Filters } from "@/app/page"
import {
  createRecommendationSession,
  getAlternativeRecommendations,
  getNextPickSet,
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
    if (options.length === 0) return "Recommended pick"

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

function getNextResultCopy<T extends string>(options: T[], previous?: T): T {
  const available = previous ? options.filter((option) => option !== previous) : options
  const pool = available.length > 0 ? available : options
  return pool[Math.floor(Math.random() * pool.length)]
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getDirectionPool(direction: string, pool: Restaurant[]) {
  switch (direction) {
    case "premium":
      return pool.filter((restaurant) =>
        restaurant.priceBucket === "premium" || restaurant.priceBucket === "splurge"
      )

    case "light":
      return pool.filter((restaurant) => restaurant.tags?.includes("light"))

    case "comfort":
      return pool.filter((restaurant) => restaurant.tags?.includes("comfort"))

    case "healthy":
      return pool.filter(
        (restaurant) =>
          restaurant.cuisine?.toLowerCase().includes("healthy") ||
          restaurant.tags?.includes("healthy")
      )

    case "quick bite":
      return pool.filter(
        (restaurant) =>
          restaurant.tags?.includes("quick") ||
          restaurant.tags?.includes("snack") ||
          restaurant.tags?.includes("grab-and-go") ||
          restaurant.moodTags?.includes("Quick") ||
          restaurant.experienceTags?.includes("Quick")
      )

    default:
      return pool
  }
}

type ResultsSectionProps = {
  filters: Filters
  onBack: () => void
  onNewSearch: () => void
  onRandomize: () => void
  fallbackMode: boolean
  resultHint: string | null
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function ResultsSection({
  filters,
  onBack,
  onNewSearch,
  onRandomize,
  fallbackMode,
  resultHint,
}: ResultsSectionProps) {
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
  const [recommendationSession, setRecommendationSession] = useState<RecommendationSession | null>(null)
  const [isExplorationVisible, setIsExplorationVisible] = useState(false)
  const [headerTitle, setHeaderTitle] = useState(initialHeaderTitle)
  const [headerSubtitle, setHeaderSubtitle] = useState(initialHeaderSubtitle)
  const [topPickCaption, setTopPickCaption] = useState(initialTopPickCaption)

  const alternativesRef = useRef<HTMLDivElement | null>(null)
  const topPickRef = useRef<HTMLDivElement | null>(null)
  const timeoutsRef = useRef<number[]>([])
  const pickAgainLockRef = useRef(false)
  const chipActionLockRef = useRef(false)

  const restaurants = currentRestaurants

  // Toggle this to true only when debugging recommendation/session behavior.
  const DEBUG_RECO = true

  const debugReco = (label: string, data?: unknown) => {
    if (!DEBUG_RECO) return
    console.log(`[SanTayo Reco] ${label}`, data)
  }

  const summarizeRestaurant = (restaurant: Restaurant | null | undefined) =>
    restaurant
      ? {
          id: restaurant.id,
          name: restaurant.name,
          priceBucket: restaurant.priceBucket,
        }
      : null

  const summarizeRestaurants = (items: Restaurant[]) =>
    items.map((restaurant) => summarizeRestaurant(restaurant))

  const loadingMessages = [
    "Picking something good...",
    "Checking the vibe...",
    "Balancing your cravings...",
    "Trust me on this one 👀",
  ]

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
    if (isExplorationVisible) return
    setIsExplorationVisible(true)
    setHasUserInteracted(true)
  }

  const resetRecommendationState = () => {
    debugReco("RESET recommendation state", {
      filters,
      currentRestaurants: summarizeRestaurants(currentRestaurants),
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
    debugReco("RESET for reroll", {
      previousSession: recommendationSession
        ? {
            topPick: summarizeRestaurant(recommendationSession.topPick),
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
    setRecommendationSession(null)
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
    debugReco("Ikaw na bahala clicked", {
      filters,
      currentTopPick: summarizeRestaurant(currentRestaurants[0]),
      currentAlternativeIds,
      selectedDirection,
    })

    setLoadingIndex(0)
    setIsFaded(true)
    setIsRandomizing(true)
  }

  const handlePickAgain = () => {
    debugReco("Pick again clicked", {
      filters,
      currentTopPick: summarizeRestaurant(currentRestaurants[0]),
      currentAlternativeIds,
      sessionState,
      recommendationSession: recommendationSession
        ? {
            topPick: summarizeRestaurant(recommendationSession.topPick),
            activeChip: recommendationSession.activeChip,
            usedAlternativeIds: [...recommendationSession.usedAlternativeIds],
            chipHistory: recommendationSession.chipHistory,
          }
        : null,
    })

    if (pickAgainLockRef.current || chipActionLockRef.current || currentRestaurants.length === 0) {
      return
    }

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

      const nextPickSet = getNextPickSet(
        filters,
        {
          seenTopPickIds: [],
          seenAlternativeIds: [],
          lastTopPickId: null,
        },
        fallbackMode,
        3
      )

      debugReco("Pick again result", {
        topPick: summarizeRestaurant(nextPickSet.newTopPick),
        alternatives: summarizeRestaurants(nextPickSet.newAlternatives),
      })

      if (!nextPickSet.newTopPick) {
        setIsPickingAgain(false)
        pickAgainLockRef.current = false
        return
      }

      const topPick = nextPickSet.newTopPick

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
            createRecommendationSession(filters, fallbackMode, topPick, nextPickSet.newAlternatives)
          )
          setHeaderTitle((current) => getNextResultCopy(rerollHeaderTitles, current))
          setHeaderSubtitle((current) => getNextResultCopy(rerollHeaderSubtitles, current))
          setTopPickCaption((current) => getNextResultCopy(rerollTopPickCaptions, current))

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

  const handleDirectionSelect = (direction: string) => {
    debugReco("Chip clicked", {
      direction,
      filters,
      currentTopPick: summarizeRestaurant(restaurants[0]),
      session: recommendationSession
        ? {
            topPick: summarizeRestaurant(recommendationSession.topPick),
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

    const seenForChip = session.chipHistory[direction] ?? []
    const excludeIds = Array.from(new Set([topPick.id, ...currentAlternativeIds, ...seenForChip]))

    debugReco("Chip exclude IDs", {
      direction,
      topPickId: topPick.id,
      seenForChip,
      excludeIds,
    })

    const candidatePool = RESTAURANTS.filter(
      (restaurant) => restaurant.operatingStatus !== "closed" && restaurant.id !== topPick.id
    )
    const strictDirectionPool = getDirectionPool(direction, candidatePool)
    const directionPool = strictDirectionPool.length >= 2 ? strictDirectionPool : candidatePool
    const unseenDirectionPool = directionPool.filter((restaurant) => !excludeIds.includes(restaurant.id))
    const finalDirectionPool = unseenDirectionPool.length >= 2 ? unseenDirectionPool : directionPool
    // const variedDirectionPool = [...finalDirectionPool].sort(() => Math.random() - 0.5)

    const lastFirstAlternativeId = currentAlternativeIds[0] ?? null

    const unseenFirstPool = [
      ...finalDirectionPool.filter(
        (r) => !session.usedAlternativeIds.has(r.id) && r.id !== lastFirstAlternativeId
      ),
      ...finalDirectionPool.filter(
        (r) => session.usedAlternativeIds.has(r.id) || r.id === lastFirstAlternativeId
      ),
    ]

    const variedDirectionPool = shuffle(unseenFirstPool)

    debugReco("Chip pool summary", {
      direction,
      candidatePoolSize: candidatePool.length,
      strictDirectionPoolSize: strictDirectionPool.length,
      directionPoolSize: directionPool.length,
      unseenDirectionPoolSize: unseenDirectionPool.length,
      finalDirectionPoolSize: finalDirectionPool.length,
      fallbackUsed: strictDirectionPool.length < 2 || unseenDirectionPool.length < 2,
      premiumCount: variedDirectionPool.filter((restaurant) => restaurant.priceBucket === "premium").length,
      splurgeCount: variedDirectionPool.filter((restaurant) => restaurant.priceBucket === "splurge").length,
      sample: variedDirectionPool.slice(0, 5).map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        priceBucket: restaurant.priceBucket,
        tags: restaurant.tags,
        moodTags: restaurant.moodTags,
        foodCategories: restaurant.foodCategories,
        experienceTags: restaurant.experienceTags,
      })),
    })

    const expandedAlternatives = getAlternativeRecommendations(
      topPick,
      variedDirectionPool,
      session.originalFilters,
      excludeIds,
      8,
      direction,
    )

    const postScoredPool = [
      ...expandedAlternatives.filter((r) => r.id !== lastFirstAlternativeId),
      ...expandedAlternatives.filter((r) => r.id === lastFirstAlternativeId),
    ]

    const nextAlternatives = shuffle(postScoredPool).slice(0, 2)    

    debugReco("Chip alternatives result", {
      direction,
      count: nextAlternatives.length,
      alternatives: nextAlternatives.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        priceBucket: restaurant.priceBucket,
        tags: restaurant.tags,
        moodTags: restaurant.moodTags,
        experienceTags: restaurant.experienceTags,
      })),
    })

    const loadingDuration = 380 + Math.floor(Math.random() * 120)
    setManagedTimeout(() => {
      if (nextAlternatives.length === 0) {
        setDirectionHelperText(null)
        setIsRefreshingAlternatives(false)
        chipActionLockRef.current = false
        return
      }

      const nextAlternativeIds = nextAlternatives.map((restaurant) => restaurant.id)
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
    }, loadingDuration)
  }

  useEffect(() => {
    if (!isRandomizing) return

    const rotate = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % loadingMessages.length)
    }, 650)

    return () => window.clearInterval(rotate)
  }, [isRandomizing, loadingMessages.length])

  useEffect(() => {
    if (!isRandomizing) return

    setIsFaded(false)
    const fadeTimer = setManagedTimeout(() => setIsFaded(true), 50)

    return () => window.clearTimeout(fadeTimer)
  }, [loadingIndex, isRandomizing])

  useEffect(() => {
    if (!isRandomizing) return

    const delay = setManagedTimeout(() => {
      onRandomize()
      setIsRandomizing(false)
    }, 2000)

    return () => window.clearTimeout(delay)
  }, [isRandomizing, onRandomize])

  useEffect(() => {
    if (isInitialLoading || isExplorationVisible || restaurants.length === 0) return

    const idleDelay = setManagedTimeout(() => {
      revealExploration()
    }, 1400)

    return () => window.clearTimeout(idleDelay)
  }, [isInitialLoading, isExplorationVisible, restaurants.length])

  useEffect(() => {
    if (isExplorationVisible || restaurants.length === 0) return

    const onScroll = () => {
      const topPickElement = topPickRef.current
      if (!topPickElement) return

      const rect = topPickElement.getBoundingClientRect()
      if (rect.bottom < 40) revealExploration()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [isExplorationVisible, restaurants.length])

  useEffect(() => {
    debugReco("Initial/new filter effect", {
      filters,
      fallbackMode,
      sessionState,
    })

    const pickSet = getNextPickSet(filters, sessionState, fallbackMode, 3)

    debugReco("Initial/new filter result", {
      topPick: summarizeRestaurant(pickSet.newTopPick),
      alternatives: summarizeRestaurants(pickSet.newAlternatives),
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
        createRecommendationSession(filters, fallbackMode, pickSet.newTopPick, pickSet.newAlternatives)
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
        if (cardTimer) window.clearTimeout(cardTimer)
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
  const isChipDisabled = isPickingAgain || isInitialLoading || isRandomizing || isRefreshingAlternatives

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
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
              <p className="text-sm font-medium text-foreground">
                {
                  ["Looking for the best fit...", "Checking your options...", "We found something good."][
                    Math.floor(Math.random() * 3)
                  ]
                }
              </p>
              <div className="h-4 rounded-full bg-muted/30" />
            </div>
          ) : (
            <div
              className={`transform transition-all duration-250 ease-out ${
                headerMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <h2 className="text-lg font-semibold text-foreground">{headerTitle}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{headerSubtitle}</p>
              {resultHint && <p className="text-sm leading-6 text-muted-foreground">{resultHint}</p>}
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
            style={{ transitionDelay: "0ms" }}
            className={`transform transition-all duration-250 ease-out ${
              cardsMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            } ${isPickingAgain && cardsMounted ? "animate-pulse opacity-60" : ""} ${
              freshTopPick ? "scale-[1.02] shadow-[0_14px_34px_rgba(0,0,0,0.08)]" : "scale-100"
            }`}
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
          <PickAgainAction onPickAgain={handlePickAgain} isPickingAgain={isPickingAgain} />
        </div>
      )}

      {isExplorationVisible && restaurants.length > 0 && !isInitialLoading && (
        <div className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-250 ease-out">
          <p className="mb-1 text-sm font-semibold text-foreground">Not feeling this pick?</p>
          <p className="mb-3 text-sm leading-6 text-muted-foreground">
            Explore other directions without changing your top pick
          </p>
          <div className="flex touch-pan-x snap-x snap-mandatory flex-nowrap gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1 pr-3">
            {directionOptions.map((direction) => {
              const isActive = selectedDirection === direction.key
              return (
                <button
                  key={direction.key}
                  type="button"
                  onClick={() => handleDirectionSelect(direction.key)}
                  disabled={isChipDisabled}
                  className={`min-w-max flex-shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive
                      ? "border-primary bg-primary/15 text-primary shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                  } ${isChipDisabled ? "pointer-events-none opacity-50" : ""}`}
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
                <div key={item} className="h-32 animate-pulse rounded-[28px] bg-muted/20" />
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
                    className={`scale-100 transform transition-all duration-250 ease-out ${
                      alternativeStage > index ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
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
          <p className="text-lg font-semibold text-foreground">No exact match found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            But we’ve curated a few strong options for you.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Or let us decide — kami na bahala.</p>

          {isRandomizing ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                size="lg"
                disabled
                className="w-full border-2 border-rose-500 bg-rose-100 text-rose-900 shadow-lg sm:w-auto"
                aria-busy="true"
              >
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`text-sm font-semibold tracking-tight text-foreground transition-opacity duration-500 ${
                      isFaded ? "opacity-100" : "opacity-0"
                    }`}
                  >
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
                className="w-full border-rose-300 bg-rose-50 text-rose-900 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-100 active:scale-95 sm:w-auto"
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
