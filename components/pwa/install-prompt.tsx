'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    
    // Check if prompt was already shown this session
    const promptShownThisSession = sessionStorage.getItem('pwa-prompt-shown')

    if (isInstalled || promptShownThisSession) {
      return
    }

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after 30 seconds
      setTimeout(() => {
        if (!sessionStorage.getItem('pwa-prompt-shown')) {
          setShowPrompt(true)
        }
      }, 30000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`)
    
    setDeferredPrompt(null)
    setShowPrompt(false)
    sessionStorage.setItem('pwa-prompt-shown', 'true')
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('pwa-prompt-shown', 'true')
  }

  if (!showPrompt || !isMobile) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-2xl border-2 border-primary/20">
        <CardContent className="p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">Install FanConnect</h3>
              <p className="text-xs text-muted-foreground">
                Add to your home screen for a better experience
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleInstall}
              className="w-full gap-2"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Install App
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Not Now
            </Button>
          </div>

          <div className="mt-3 pt-3 border-t">
            <p className="text-[10px] text-muted-foreground">
              ✓ Faster loading • ✓ Offline access • ✓ Push notifications
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
