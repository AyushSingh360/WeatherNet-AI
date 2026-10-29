"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeatherMapProps {
  lat?: number
  lon?: number
  city: string
}

export function WeatherMap({ lat, lon, city }: WeatherMapProps) {
  const openInMaps = () => {
    if (lat && lon) {
      window.open(`https://www.google.com/maps/@${lat},${lon},10z`, '_blank', 'noopener,noreferrer')
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(city)}`, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="backdrop-blur-md bg-white/40 dark:bg-white/30 border-black/10 shadow-xl animate-slide-up text-black">
      <CardHeader>
        <CardTitle className="text-black flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-white/40 rounded-lg flex items-center justify-center relative overflow-hidden border border-black/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10"></div>
          <div className="text-center z-10">
            <MapPin className="h-12 w-12 text-black/80 mx-auto mb-2 animate-bounce-slow" />
            <p className="text-black font-bold text-lg">{city}</p>
            {lat && lon && (
              <p className="text-black/70 text-sm mt-1 font-medium">
                {lat.toFixed(4)}, {lon.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        <Button 
          onClick={openInMaps}
          className="w-full bg-white/60 hover:bg-white/80 text-black border border-black/15 font-semibold transition-all duration-300 hover:scale-105"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Maps
        </Button>
      </CardContent>
    </Card>
  )
}