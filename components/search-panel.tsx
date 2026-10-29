"use client"

import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CitySearch } from "@/components/city-search"
import { UnitToggle } from "@/components/unit-toggle"

interface SearchPanelProps {
  onSelect: (query: string, label: string) => void
  onLocate: () => void
  isFetching?: boolean
  locationLoading?: boolean
}

export function SearchPanel({ onSelect, onLocate, isFetching, locationLoading }: SearchPanelProps) {
  return (
    <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
      <CardContent className="p-6 space-y-4">
        <CitySearch onSelect={onSelect} isFetching={isFetching}>
          <Button
            type="button"
            onClick={onLocate}
            aria-label="Use my current location"
            disabled={locationLoading}
            className="bg-white/40 hover:bg-white/60 text-black border border-black/15 transition-all duration-300 hover:scale-105"
          >
            {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </CitySearch>
        <div className="flex justify-end">
          <UnitToggle />
        </div>
      </CardContent>
    </Card>
  )
}
