'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Sparkles, Download, User, Mail } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function SuccessPage() {
  const [showContent, setShowContent] = useState(false)
  const searchParams = useSearchParams()
  
  // Get details from URL params (would come from payment processor in production)
  const tier = searchParams.get('tier') || 'Premium'
  const creator = searchParams.get('creator') || 'janedoe'
  const amount = searchParams.get('amount') || '19.99'
  const orderId = `ORD-${Date.now()}`

  useEffect(() => {
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

    // Show content after animation
    setTimeout(() => setShowContent(true), 500)

    return () => clearInterval(interval)
  }, [])

  const handleDownloadReceipt = () => {
    // Mock receipt download
    const receiptData = `
FanConnect Receipt
==================
Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}
Tier: ${tier}
Creator: @${creator}
Amount: $${amount}
==================
Thank you for your purchase!
    `
    const blob = new Blob([receiptData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${orderId}.txt`
    a.click()
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
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
                Payment Successful
              </span>
            </div>

            <h1 className="text-4xl font-bold">Welcome to the Community!</h1>
            
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your subscription is now active. Get ready to unlock exclusive content and connect with your favorite creator!
            </p>
          </div>

          {/* Subscription Details */}
          <div className={`mt-8 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Card className="bg-muted/50 border-2">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Subscription Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-semibold">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription Tier</span>
                    <span className="font-semibold capitalize">{tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creator</span>
                    <span className="font-semibold">@{creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold">${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Date</span>
                    <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Billing</span>
                    <span className="font-semibold">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Confirmation */}
          <div className={`mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-all duration-1000 delay-600 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Email Confirmation Sent
                </p>
                <p className="text-blue-700 dark:text-blue-200">
                  We've sent a confirmation email with your receipt and subscription details to your registered email address.
                </p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className={`mt-8 p-6 bg-muted/50 rounded-lg text-left max-w-md mx-auto transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h3 className="font-semibold mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Access exclusive content immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Join the community chat and introduce yourself</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Participate in exclusive live streams and Q&As</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Manage your subscription in settings anytime</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-8 transition-all duration-1000 delay-800 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Link href={`/${creator}`}>
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <User className="h-4 w-4" />
                View Profile
              </Button>
            </Link>
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/feed">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                Go to Feed
              </Button>
            </Link>
            <Link href="/subscriptions">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                View All Subscriptions
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="mt-8 text-sm text-muted-foreground">
            Need help?{' '}
            <Link href="/support" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
