'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Construction, Clock, Bell, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function MaintenancePage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Mock estimated time
  const estimatedTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setSubscribed(true)
    toast.success(`You'll be notified when we're back!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-orange-50 dark:from-yellow-950/20 dark:via-background dark:to-orange-950/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Maintenance Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse" />
              <Construction className="relative h-32 w-32 text-yellow-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <Badge className="bg-yellow-500 text-white text-lg px-6 py-2 mb-4">
              🔧 Under Maintenance
            </Badge>
            <h1 className="text-4xl font-bold mb-2">We'll be back soon!</h1>
          </div>

          {/* Message */}
          <div className="mb-8 space-y-3">
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              We're currently performing scheduled maintenance to improve your experience.
              We apologize for any inconvenience.
            </p>
          </div>

          {/* Estimated Time */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <p className="font-semibold">Estimated Return Time</p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {estimatedTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {estimatedTime.toLocaleDateString([], { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Subscribe Form */}
          {!subscribed ? (
            <div className="mb-8 max-w-md mx-auto">
              <p className="text-sm font-medium mb-3 flex items-center justify-center gap-2">
                <Bell className="h-4 w-4" />
                Get notified when we're back
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit">Notify Me</Button>
              </form>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg max-w-md mx-auto">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✓ You'll receive an email when we're back online!
              </p>
            </div>
          )}

          {/* Social Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Stay connected with us
            </p>
            <div className="flex justify-center gap-3">
              <Link href="https://twitter.com" target="_blank">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://facebook.com" target="_blank">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://linkedin.com" target="_blank">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
