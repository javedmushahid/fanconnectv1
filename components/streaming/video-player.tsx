'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface VideoPlayerProps {
  streamId: string
}

export default function VideoPlayer({ streamId }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [quality, setQuality] = useState('1080p')
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const qualities = ['Auto', '1080p', '720p', '480p', '360p']

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  })

  return (
    <div
      ref={videoRef}
      className="relative w-full h-full bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Mock Video - Replace with actual HLS player */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
            <p className="text-white text-sm">Connecting to stream...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-full h-full flex items-center justify-center">
              {/* Placeholder - Replace with actual video element */}
              <div className="text-white text-lg font-semibold">
                🎥 Live Stream Playing
                <p className="text-sm text-white/70 mt-2">Stream ID: {streamId}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Controls Overlay */}
      {!isLoading && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Volume */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded text-white text-sm font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>

            <div className="flex-1" />

            {/* Quality Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-sm text-white border-white/20">
                <div className="px-2 py-1.5 text-xs font-semibold">Quality</div>
                {qualities.map((q) => (
                  <DropdownMenuItem
                    key={q}
                    onClick={() => setQuality(q)}
                    className="hover:bg-white/20 cursor-pointer"
                  >
                    <span className={quality === q ? 'font-bold' : ''}>{q}</span>
                    {quality === q && <span className="ml-2">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Connection Quality Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-green-500 rounded" />
            <div className="w-1 h-3 bg-green-500 rounded" />
            <div className="w-1 h-3 bg-green-500 rounded" />
            <div className="w-1 h-2 bg-green-500/50 rounded" />
          </div>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  )
}
