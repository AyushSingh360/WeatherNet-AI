"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { Search, MapPin, Clock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCitySearch, type CitySuggestion } from "@/hooks/use-city-search"

interface CitySearchProps {
  onSelect: (query: string, label: string) => void
  isFetching?: boolean
  children?: ReactNode
}

interface RecentCity {
  query: string
  label: string
}

const RECENTS_KEY = "weathernet-recent-cities"
const MAX_RECENTS = 5

function readRecents(): RecentCity[] {
  try {
    const stored = localStorage.getItem(RECENTS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : []
  } catch {
    return []
  }
}

function labelFor(city: CitySuggestion): string {
  return [city.name, city.state, city.country].filter(Boolean).join(", ")
}

export function CitySearch({ onSelect, isFetching, children }: CitySearchProps) {
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [recents, setRecents] = useState<RecentCity[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: suggestions = [], isFetching: isSearching } = useCitySearch(input)

  useEffect(() => {
    setRecents(readRecents())
  }, [])

  useEffect(() => {
    setHighlight(-1)
  }, [input])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const remember = (city: RecentCity) => {
    setRecents((prev) => {
      const next = [city, ...prev.filter((r) => r.label !== city.label)].slice(0, MAX_RECENTS)
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      } catch {
        console.warn("Failed to persist recent cities")
      }
      return next
    })
  }

  const pick = (query: string, label: string) => {
    remember({ query, label })
    onSelect(query, label)
    setInput("")
    setOpen(false)
    setHighlight(-1)
  }

  const trimmed = input.trim()
  const isOpen = open && (trimmed.length >= 2 || recents.length > 0)
  const hasSuggestions = trimmed.length >= 2
  const highlightList: Array<RecentCity | CitySuggestion> = hasSuggestions
    ? suggestions
    : showRecentsList(recents, trimmed)
  const recentsMode = hasSuggestions ? false : recents.length > 0

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
      return
    }

    if (isOpen && highlightList.length > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault()
      setHighlight((h) => {
        if (e.key === "ArrowDown") return (h + 1) % highlightList.length
        return (h - 1 + highlightList.length) % highlightList.length
      })
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      if (isOpen && highlight >= 0 && highlightList.length > 0) {
        if (hasSuggestions) {
          const c = suggestions[highlight]
          if (c) pick(`${c.lat},${c.lon}`, labelFor(c))
          return
        }
        if (recentsMode) {
          const r = recents[highlight]
          if (r) pick(r.query, r.label)
          return
        }
      }
      if (trimmed) pick(trimmed, trimmed)
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <div ref={containerRef} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/70 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for a city..."
          aria-label="Search for a city"
          role="combobox"
          aria-expanded={isOpen && highlightList.length > 0}
          aria-controls="city-search-listbox"
          aria-autocomplete="list"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-white/40 border-black/15 text-black placeholder:text-black/60 focus:bg-white/70 focus:border-black/30 transition-all duration-300"
        />

        {isOpen && (
          <ul
            id="city-search-listbox"
            role="listbox"
            aria-label={recentsMode && highlightList.length > 0 ? "Recent cities" : "City suggestions"}
            className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border border-black/15 bg-white/95 backdrop-blur-xl shadow-2xl max-h-72 overflow-y-auto text-black"
          >
            {hasSuggestions && suggestions.length === 0 && isSearching && (
              <li className="flex items-center gap-2 px-3 py-2 text-sm text-black/60" aria-live="polite">
                <Loader2 className="h-3 w-3 animate-spin" />
                Searching...
              </li>
            )}
            {hasSuggestions && suggestions.length === 0 && !isSearching && (
              <li className="px-3 py-2 text-sm text-black/60">No matches - press Enter to search &quot;{trimmed}&quot;</li>
            )}
            {hasSuggestions &&
              suggestions.map((c, i) => (
                <li
                  key={`${c.lat},${c.lon},${i}`}
                  role="option"
                  aria-selected={i === highlight}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pick(`${c.lat},${c.lon}`, labelFor(c))
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-black transition-colors ${
                    i === highlight ? "bg-black/10 font-medium" : "hover:bg-black/5"
                  }`}
                >
                  <MapPin className="h-4 w-4 text-black/60 shrink-0" />
                  <span>
                    {c.name}
                    {c.state ? `, ${c.state}` : ""}, {c.country}
                  </span>
                </li>
              ))}
            {recentsMode &&
              recents.map((r, i) => (
                <li
                  key={`${r.query},${i}`}
                  role="option"
                  aria-selected={i === highlight}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pick(r.query, r.label)
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-black transition-colors ${
                    i === highlight ? "bg-black/10 font-medium" : "hover:bg-black/5"
                  }`}
                >
                  <Clock className="h-4 w-4 text-black/60 shrink-0" />
                  <span>{r.label}</span>
                </li>
              ))}
          </ul>
        )}
      </div>

      <Button
        type="button"
        aria-label="Search city"
        disabled={isFetching}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => trimmed && pick(trimmed, trimmed)}
        className="bg-white/40 hover:bg-white/60 text-black border border-black/15 transition-all duration-300 hover:scale-105"
      >
        {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
      {children}
    </div>
  )
}

function showRecentsList(recents: RecentCity[], trimmed: string): RecentCity[] {
  return trimmed.length < 2 ? recents : []
}
