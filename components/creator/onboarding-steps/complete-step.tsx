'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, Upload, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { Separator } from '@/components/ui/separator'

interface CompleteStepProps {
  data: any
}

export default function CompleteStep({ data }: CompleteStepProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Clear saved progress
    localStorage.removeItem('onboarding-progress')

    // Trigger confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    setTimeout(() => setShowContent(true), 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardContent className="pt-12 pb-8 text-center">
        {/* Success Animation */}
        <div className="mb-8 flex justify-center">
          <div className={`relative transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
            <CheckCircle2 className="relative h-32 w-32 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Success Message */}
        <div className={`space-y-4 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Setup Complete
            </span>
          </div>

          <h1 className="text-4xl font-bold">You're All Set!</h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your creator profile is ready. Start uploading content and building your community!
          </p>
        </div>

        {/* Setup Summary */}
        <div className={`mt-8 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Card className="bg-muted/50 border-2 max-w-lg mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Your Setup Summary</h3>
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Display Name</span>
                  <span className="font-semibold">{data.displayName || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold">{data.category || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subscription Tiers</span>
                  <span className="font-semibold">{data.tiers?.length || 0} tiers</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Setup</span>
                  <span className={`font-semibold ${data.stripeConnected ? 'text-green-600' : 'text-orange-600'}`}>
                    {data.stripeConnected ? 'Connected' : 'Pending'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className={`mt-8 p-6 bg-muted/50 rounded-lg text-left max-w-lg mx-auto transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="font-semibold mb-3 text-center">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Upload your first post to start attracting subscribers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Share your profile link on social media</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Track your growth in the analytics dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Engage with your community through comments</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-8 transition-all duration-1000 delay-900 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Link href="/creator/upload">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <Upload className="h-4 w-4" />
              Upload First Post
            </Button>
          </Link>
          <Link href="/creator/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <BarChart3 className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <Separator className="my-8" />

        {/* Help & Resources */}
        <div className="text-sm text-muted-foreground">
          <p>Need help getting started?</p>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            <Link href="/help/creator-guide" className="text-primary hover:underline">
              Creator Guide
            </Link>
            <Link href="/help/best-practices" className="text-primary hover:underline">
              Best Practices
            </Link>
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
