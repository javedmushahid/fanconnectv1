'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  X,
  Camera,
  Image as ImageIcon,
  RotateCw,
  Type,
  Smile,
  Download,
  Send,
  ChevronDown,
  Pencil,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const FONTS = [
  { name: 'Classic', family: 'Arial, sans-serif' },
  { name: 'Modern', family: 'Helvetica, sans-serif' },
  { name: 'Typewriter', family: '"Courier New", monospace' },
  { name: 'Strong', family: 'Impact, sans-serif' },
  { name: 'Neon', family: '"Comic Sans MS", cursive' },
]

const FILTERS = [
  { name: 'Normal', css: '' },
  { name: 'Clarendon', css: 'contrast(1.2) saturate(1.35)' },
  { name: 'Gingham', css: 'brightness(1.05) hue-rotate(-10deg)' },
  { name: 'Moon', css: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'Lark', css: 'contrast(0.9)' },
  { name: 'Reyes', css: 'sepia(0.22) brightness(1.1) contrast(0.85)' },
  { name: 'Juno', css: 'contrast(1.2) brightness(1.1) saturate(1.4)' },
  { name: 'Slumber', css: 'saturate(0.66) brightness(1.05)' },
  { name: 'Crema', css: 'sepia(0.5) contrast(1.25)' },
  { name: 'Ludwig', css: 'brightness(1.05) saturate(2)' },
]

const STICKERS = ['😀', '😍', '🔥', '💪', '✨', '🎉', '❤️', '👍', '🌟', '💯', '🎨', '🎵', '😂', '😎', '🥰', '😊', '🤔', '😭', '🙏', '💖', '🎯', '⚡', '🌈', '🎮']

interface Overlay {
  id: string
  type: 'text' | 'sticker'
  content: string
  x: number
  y: number
  color?: string
  bgColor?: string
  fontSize?: number
  fontFamily?: string
  align?: 'left' | 'center' | 'right'
}

export default function InstagramStoryCreator() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawCanvasRef = useRef<HTMLCanvasElement>(null)

  const [mode, setMode] = useState<'select' | 'camera' | 'editor'>('select')
  const [media, setMedia] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const [currentTool, setCurrentTool] = useState<'none' | 'text' | 'sticker' | 'draw' | 'filter'>('none')
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const [currentFilter, setCurrentFilter] = useState(0)

  // Text
  const [textInput, setTextInput] = useState('')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [textBgStyle, setTextBgStyle] = useState<'none' | 'solid' | 'semi'>('none')
  const [fontSize, setFontSize] = useState(32)
  const [fontIndex, setFontIndex] = useState(0)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center')

  // Draw
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState('#FF0000')
  const [brushSize, setBrushSize] = useState(5)
  const [drawingMode, setDrawingMode] = useState<'pen' | 'eraser'>('pen')

  // Swipe detection
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    
    // Only swipe if horizontal movement is greater than vertical (not scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (currentTool === 'filter') {
        // Swipe changes filter
        if (deltaX > 0) {
          // Swipe right - previous filter
          setCurrentFilter(prev => prev === 0 ? FILTERS.length - 1 : prev - 1)
        } else {
          // Swipe left - next filter
          setCurrentFilter(prev => prev === FILTERS.length - 1 ? 0 : prev + 1)
        }
      } else {
        // Swipe changes tool
        const tools: Array<'none' | 'text' | 'sticker' | 'draw' | 'filter'> = ['text', 'draw', 'sticker', 'filter']
        const currentIndex = tools.indexOf(currentTool === 'none' ? 'text' : currentTool)
        
        if (deltaX > 0) {
          // Swipe right - previous tool
          const newIndex = currentIndex === 0 ? tools.length - 1 : currentIndex - 1
          setCurrentTool(tools[newIndex])
        } else {
          // Swipe left - next tool
          const newIndex = currentIndex === tools.length - 1 ? 0 : currentIndex + 1
          setCurrentTool(tools[newIndex])
        }
      }
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      })
      if (videoRef.current) videoRef.current.srcObject = mediaStream
      setStream(mediaStream)
      setMode('camera')
    } catch (error) {
      toast.error('Camera access denied')
      fileInputRef.current?.click()
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop())
    setStream(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
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
      ctx.drawImage(video, 0, 0)
      setMedia(canvas.toDataURL('image/jpeg', 0.95))
      stopCamera()
      setMode('editor')
    }
  }

  const toggleCamera = () => {
    stopCamera()
    setFacingMode(facingMode === 'user' ? 'environment' : 'user')
    setTimeout(startCamera, 100)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setMedia(reader.result as string)
      setMode('editor')
    }
    reader.readAsDataURL(file)
  }

  const addText = () => {
    if (!textInput.trim()) return
    
    let bgColor = 'transparent'
    let textColorFinal = textColor

    if (textBgStyle === 'solid') {
      bgColor = textColor
      textColorFinal = textColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
    } else if (textBgStyle === 'semi') {
      bgColor = `${textColor}AA`
    }

    setOverlays([...overlays, {
      id: Date.now().toString(),
      type: 'text',
      content: textInput,
      x: 50,
      y: 30 + (overlays.length * 10),
      color: textColorFinal,
      bgColor,
      fontSize,
      fontFamily: FONTS[fontIndex].family,
      align: textAlign,
    }])

    setTextInput('')
    setCurrentTool('none')
    toast.success('Text added!')
  }

  const addSticker = (emoji: string) => {
    setOverlays([...overlays, {
      id: Date.now().toString(),
      type: 'sticker',
      content: emoji,
      x: 50,
      y: 50 + (overlays.length * 10),
      fontSize: 64,
    }])
    setCurrentTool('none')
  }

  const removeOverlay = (id: string) => {
    setOverlays(overlays.filter(o => o.id !== id))
  }

  const handleShare = () => {
    toast.success('Story published!')
    router.push('/stories')
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  // RENDER: Selection
  if (mode === 'select') {
    return (
      <div className="fixed inset-0 bg-black z-[9999]">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-white">Create</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
            <button onClick={startCamera} className="w-full max-w-xs">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform active:scale-95">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Camera className="h-12 w-12 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">Camera</p>
              </div>
            </button>

            <button onClick={() => fileInputRef.current?.click()} className="w-full max-w-xs">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform active:scale-95">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">Gallery</p>
              </div>
            </button>

            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      </div>
    )
  }

  // RENDER: Camera
  if (mode === 'camera') {
    return (
      <div className="fixed inset-0 bg-black z-[9999]">
        <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
          <Button variant="ghost" size="icon" onClick={() => { stopCamera(); setMode('select') }} className="text-white hover:bg-white/10">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-around items-center px-8">
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-white hover:bg-white/10">
              <ImageIcon className="h-7 w-7" />
            </Button>
            <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white border-4 border-white/30 hover:scale-110 active:scale-95 transition-transform" />
            <Button variant="ghost" size="icon" onClick={toggleCamera} className="text-white hover:bg-white/10">
              <RotateCw className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // RENDER: Editor
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Main Image Area with Overlays */}
      <div 
        className="relative flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={media!} 
          alt="Story" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ filter: FILTERS[currentFilter].css || 'none' }} 
        />

        {/* Drawing Canvas */}
        {currentTool === 'draw' && (
          <canvas
            ref={drawCanvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            onMouseDown={(e) => {
              setIsDrawing(true)
              const rect = e.currentTarget.getBoundingClientRect()
              const ctx = drawCanvasRef.current?.getContext('2d')
              if (ctx) {
                ctx.beginPath()
                ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
              }
            }}
            onMouseMove={(e) => {
              if (!isDrawing) return
              const rect = e.currentTarget.getBoundingClientRect()
              const ctx = drawCanvasRef.current?.getContext('2d')
              if (ctx) {
                ctx.strokeStyle = drawingMode === 'eraser' ? 'rgba(0,0,0,1)' : drawColor
                ctx.lineWidth = brushSize
                ctx.lineCap = 'round'
                ctx.globalCompositeOperation = drawingMode === 'eraser' ? 'destination-out' : 'source-over'
                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
                ctx.stroke()
              }
            }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          />
        )}

        {/* Overlays */}
        {overlays.map(overlay => (
          <div
            key={overlay.id}
            className="absolute group cursor-move"
            style={{ 
              left: `${overlay.x}%`, 
              top: `${overlay.y}%`, 
              transform: 'translate(-50%, -50%)',
            }}
            draggable
          >
            {overlay.type === 'text' && (
              <p
                className="px-4 py-2 font-bold whitespace-nowrap"
                style={{
                  color: overlay.color,
                  backgroundColor: overlay.bgColor,
                  fontSize: `${overlay.fontSize}px`,
                  fontFamily: overlay.fontFamily,
                  textAlign: overlay.align,
                  textShadow: overlay.bgColor === 'transparent' ? '3px 3px 6px rgba(0,0,0,0.9)' : 'none',
                }}
              >
                {overlay.content}
              </p>
            )}

            {overlay.type === 'sticker' && (
              <span 
                style={{ 
                  fontSize: `${overlay.fontSize}px`,
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                {overlay.content}
              </span>
            )}

            <button 
              onClick={() => removeOverlay(overlay.id)} 
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="h-4 w-4 text-black" />
            </button>
          </div>
        ))}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { 
              setMedia(null); 
              setOverlays([]); 
              setCurrentFilter(0);
              setCurrentTool('none');
              setMode('select') 
            }} 
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tool Indicator */}
        <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
            {currentTool === 'none' && <><Sparkles className="h-4 w-4" /> Swipe to select tool</>}
            {currentTool === 'text' && <><Type className="h-4 w-4" /> Text</>}
            {currentTool === 'draw' && <><Pencil className="h-4 w-4" /> Draw</>}
            {currentTool === 'sticker' && <><Smile className="h-4 w-4" /> Stickers</>}
            {currentTool === 'filter' && <>🎨 {FILTERS[currentFilter].name} - Swipe to change</>}
          </div>
        </div>

        {/* Tool Panels */}
        {currentTool === 'text' && (
          <div className="absolute bottom-24 left-0 right-0 px-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <button 
                  onClick={() => setFontIndex((fontIndex + 1) % FONTS.length)} 
                  className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium"
                >
                  {FONTS[fontIndex].name}
                </button>
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)} 
                  className="w-8 h-8 rounded-full border-2 border-white/30" 
                />
                <button 
                  onClick={() => setTextBgStyle(textBgStyle === 'none' ? 'solid' : textBgStyle === 'solid' ? 'semi' : 'none')} 
                  className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium"
                >
                  {textBgStyle === 'none' ? 'No BG' : textBgStyle === 'solid' ? 'Solid' : 'Semi'}
                </button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setTextAlign(textAlign === 'left' ? 'center' : textAlign === 'center' ? 'right' : 'left')} 
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {textAlign === 'left' && <AlignLeft className="h-4 w-4" />}
                  {textAlign === 'center' && <AlignCenter className="h-4 w-4" />}
                  {textAlign === 'right' && <AlignRight className="h-4 w-4" />}
                </Button>
              </div>
              <Input 
                value={textInput} 
                onChange={(e) => setTextInput(e.target.value)} 
                placeholder="Type something..." 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg mb-2" 
                onKeyDown={(e) => e.key === 'Enter' && addText()} 
                autoFocus
              />
              <div className="mb-3">
                <p className="text-white text-xs mb-2">Size: {fontSize}px</p>
                <Slider 
                  value={[fontSize]} 
                  onValueChange={(v) => setFontSize(v[0])} 
                  min={16} 
                  max={72}
                />
              </div>
              <Button onClick={addText} className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                Done
              </Button>
            </div>
          </div>
        )}

        {currentTool === 'sticker' && (
          <div className="absolute bottom-24 left-0 right-0 px-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="grid grid-cols-8 gap-3 max-h-64 overflow-y-auto">
                {STICKERS.map(emoji => (
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

        {currentTool === 'draw' && (
          <div className="absolute bottom-24 left-0 right-0 px-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Button 
                  variant={drawingMode === 'pen' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setDrawingMode('pen')} 
                  className={drawingMode === 'pen' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Pen
                </Button>
                <Button 
                  variant={drawingMode === 'eraser' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setDrawingMode('eraser')} 
                  className={drawingMode === 'eraser' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}
                >
                  <Eraser className="h-4 w-4 mr-2" /> Eraser
                </Button>
                <input 
                  type="color" 
                  value={drawColor} 
                  onChange={(e) => setDrawColor(e.target.value)} 
                  className="w-8 h-8 rounded-full border-2 border-white/30" 
                />
              </div>
              <div>
                <p className="text-white text-xs mb-2">Brush Size: {brushSize}px</p>
                <Slider 
                  value={[brushSize]} 
                  onValueChange={(v) => setBrushSize(v[0])} 
                  min={1} 
                  max={20}
                />
              </div>
            </div>
          </div>
        )}

        {currentTool === 'filter' && (
          <div className="absolute bottom-24 left-0 right-0 px-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
              <p className="text-white text-sm text-center mb-2">👈 Swipe left/right to change filter 👉</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {FILTERS.map((filter, i) => (
                  <button 
                    key={filter.name} 
                    onClick={() => setCurrentFilter(i)} 
                    className={`flex-shrink-0 ${currentFilter === i ? 'ring-2 ring-white' : ''}`}
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden">
                      <img src={media!} className="w-full h-full object-cover" style={{ filter: filter.css || 'none' }} />
                    </div>
                    <p className="text-xs text-white text-center mt-1">{filter.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar - ALWAYS VISIBLE */}
      <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-white">
          <ChevronDown className="h-5 w-5" />
          <span className="text-sm font-medium">Your Story</span>
        </div>
        <Button 
          onClick={handleShare} 
          className="bg-white text-black hover:bg-white/90 px-6 gap-2 font-semibold"
        >
          <Send className="h-4 w-4" /> 
          Share
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
