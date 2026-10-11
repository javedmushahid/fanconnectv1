'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  X,
  Camera,
  Image as ImageIcon,
  RotateCw,
  Zap,
  ZapOff,
  Type,
  Smile,
  Download,
  Send,
  Settings,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { storiesAPI } from '@/lib/api/endpoints/stories'

const STICKERS = ['😀', '😍', '🔥', '💪', '✨', '🎉', '❤️', '👍', '🌟', '💯', '🎨', '🎵', '😂', '��', '🥰', '😊']

const TEXT_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#FF1493',
]

const FILTERS = [
  { name: 'Normal', style: {} },
  { name: 'Clarendon', style: { filter: 'contrast(1.2) saturate(1.35)' } },
  { name: 'Gingham', style: { filter: 'brightness(1.05) hue-rotate(-10deg)' } },
  { name: 'Moon', style: { filter: 'grayscale(1) contrast(1.1) brightness(1.1)' } },
  { name: 'Lark', style: { filter: 'contrast(0.9)' } },
  { name: 'Reyes', style: { filter: 'sepia(0.22) brightness(1.1) contrast(0.85)' } },
  { name: 'Juno', style: { filter: 'contrast(1.2) brightness(1.1) saturate(1.4)' } },
  { name: 'Slumber', style: { filter: 'saturate(0.66) brightness(1.05)' } },
]

interface TextOverlay {
  id: string
  text: string
  color: string
  bgColor: string
  align: 'left' | 'center' | 'right'
}

export default function StoryCreator() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // States
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select')
  const [media, setMedia] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [visibility, setVisibility] = useState<'PUBLIC' | 'FOLLOWERS' | 'SUBSCRIBERS' | 'CLOSE_FRIENDS'>('PUBLIC')
  const [isSharing, setIsSharing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [flashEnabled, setFlashEnabled] = useState(false)
  
  // Tools
  const [showTextInput, setShowTextInput] = useState(false)
  const [showStickers, setShowStickers] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(0)
  
  // Overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [currentText, setCurrentText] = useState('')
  const [currentTextColor, setCurrentTextColor] = useState(0)
  const [currentBgStyle, setCurrentBgStyle] = useState(0) // 0: no bg, 1: solid bg, 2: semi-transparent

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setMode('camera')
    } catch (error) {
      toast.error('Could not access camera')
      fileInputRef.current?.click()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL('image/jpeg', 0.95)
        setMedia(imageData)
        setMediaType('IMAGE')
        // Convert data URL to File for upload
        canvas.toBlob((blob) => {
          if (blob) setMediaFile(new File([blob], 'story.jpg', { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.95)
        stopCamera()
        setMode('preview')
      }
    }
  }

  const toggleCamera = () => {
    stopCamera()
    setFacingMode(facingMode === 'user' ? 'environment' : 'user')
    setTimeout(() => startCamera(), 100)
  }

  // File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMediaFile(file)
    setMediaType(file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE')

    const reader = new FileReader()
    reader.onloadend = () => {
      setMedia(reader.result as string)
      setMode('preview')
    }
    reader.readAsDataURL(file)
  }

  // Text functions
  const addText = () => {
    if (!currentText.trim()) return

    const colors = TEXT_COLORS
    const textColor = colors[currentTextColor]
    let bgColor = 'transparent'

    if (currentBgStyle === 1) {
      bgColor = textColor
    } else if (currentBgStyle === 2) {
      bgColor = `${textColor}80`
    }

    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: currentText,
      color: currentBgStyle === 1 ? '#000000' : textColor,
      bgColor,
      align: 'center',
    }

    setTextOverlays([...textOverlays, newText])
    setCurrentText('')
    setShowTextInput(false)
  }

  const cycleTextColor = () => {
    setCurrentTextColor((prev) => (prev + 1) % TEXT_COLORS.length)
  }

  const cycleTextBg = () => {
    setCurrentBgStyle((prev) => (prev + 1) % 3)
  }

  const addSticker = (emoji: string) => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: emoji,
      color: 'transparent',
      bgColor: 'transparent',
      align: 'center',
    }
    setTextOverlays([...textOverlays, newText])
    setShowStickers(false)
  }

  const removeOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter((t) => t.id !== id))
  }

  // Share
  const handleShare = async () => {
    if (!mediaFile) {
      toast.error('No media selected')
      return
    }
    setIsSharing(true)
    try {
      await storiesAPI.createStory(mediaFile, mediaType, visibility)
      toast.success('Story shared!')
      router.push('/stories')
    } catch {
      toast.error('Failed to share story')
    } finally {
      setIsSharing(false)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => stopCamera()
  }, [])

  // RENDER: Selection Screen
  if (mode === 'select') {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Create</h1>
            <div className="w-10" />
          </div>

          {/* Options */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
            {/* Camera */}
            <button
              onClick={startCamera}
              className="w-full max-w-sm"
            >
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform active:scale-95">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-1">Camera</p>
                  <p className="text-white/80">Take a photo</p>
                </div>
              </div>
            </button>

            {/* Gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm"
            >
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform active:scale-95">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-1">Gallery</p>
                  <p className="text-white/80">Choose a photo</p>
                </div>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    )
  }

  // RENDER: Camera
  if (mode === 'camera') {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          }`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopCamera()
              setMode('select')
            }}
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFlashEnabled(!flashEnabled)}
            className="text-white hover:bg-white/10"
          >
            {flashEnabled ? (
              <Zap className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ) : (
              <ZapOff className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-around px-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-white hover:bg-white/10"
            >
              <ImageIcon className="h-7 w-7" />
            </Button>

            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-white/30 hover:scale-110 active:scale-95 transition-transform"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCamera}
              className="text-white hover:bg-white/10"
            >
              <RotateCw className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // RENDER: Preview/Editor
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Image Container - Full Screen */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={media!}
          alt="Story"
          className="absolute inset-0 w-full h-full object-cover"
          style={FILTERS[currentFilter].style}
        />

        {/* Text Overlays */}
        {textOverlays.map((overlay, index) => (
          <div
            key={overlay.id}
            className="absolute left-1/2 -translate-x-1/2 cursor-move group"
            style={{
              top: `${20 + index * 15}%`,
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move'
            }}
          >
            <div className="relative">
              <p
                className="text-4xl font-bold px-4 py-2 whitespace-nowrap"
                style={{
                  color: overlay.color,
                  backgroundColor: overlay.bgColor,
                  textAlign: overlay.align,
                  textShadow:
                    overlay.bgColor === 'transparent'
                      ? '2px 2px 8px rgba(0,0,0,0.8)'
                      : 'none',
                }}
              >
                {overlay.text}
              </p>
              <button
                onClick={() => removeOverlay(overlay.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>
        ))}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMedia(null)
              setTextOverlays([])
              setMode('select')
            }}
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right Side Tools */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <Type className="h-6 w-6" />
          </button>

          <button
            onClick={() => setShowStickers(!showStickers)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <Smile className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Strip - Bottom */}
        {showFilters && (
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {FILTERS.map((filter, index) => (
                <button
                  key={filter.name}
                  onClick={() => {
                    setCurrentFilter(index)
                    setShowFilters(false)
                  }}
                  className={`flex-shrink-0 ${
                    currentFilter === index ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden">
                    <img
                      src={media!}
                      className="w-full h-full object-cover"
                      style={filter.style}
                    />
                  </div>
                  <p className="text-xs text-white text-center mt-1">
                    {filter.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input - Bottom */}
        {showTextInput && (
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={cycleTextColor}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: TEXT_COLORS[currentTextColor] }}
                />
                <button
                  onClick={cycleTextBg}
                  className="px-3 py-1 rounded-full bg-white/20 text-white text-sm"
                >
                  {currentBgStyle === 0 && 'No BG'}
                  {currentBgStyle === 1 && 'Solid'}
                  {currentBgStyle === 2 && 'Semi'}
                </button>
              </div>
              <Input
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Type something..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg"
                maxLength={100}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addText()
                }}
              />
              <Button
                onClick={addText}
                className="w-full mt-3 bg-white text-black hover:bg-white/90"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Stickers - Bottom */}
        {showStickers && (
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="grid grid-cols-8 gap-2">
                {STICKERS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addSticker(emoji)}
                    className="text-4xl hover:scale-125 transition-transform active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar - Fixed */}
      <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between gap-3">
        <Select
          value={visibility}
          onValueChange={(v) => setVisibility(v as typeof visibility)}
        >
          <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white text-sm">
            <ChevronDown className="h-4 w-4 mr-1 opacity-60" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PUBLIC">Everyone</SelectItem>
            <SelectItem value="FOLLOWERS">Followers</SelectItem>
            <SelectItem value="SUBSCRIBERS">Subscribers</SelectItem>
            <SelectItem value="CLOSE_FRIENDS">Close Friends</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleShare}
          disabled={isSharing}
          className="bg-white text-black hover:bg-white/90 px-6 gap-2"
        >
          {isSharing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSharing ? 'Sharing...' : 'Share'}
        </Button>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
