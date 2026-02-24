'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Loader2 } from 'lucide-react'
import { subscriptionsAPI, SubscriptionTier } from '@/lib/api/endpoints/subscriptions'
import { toast } from 'sonner'

interface SubscriptionTiersProps {
  creatorId: string
}

export default function SubscriptionTiers({ creatorId }: SubscriptionTiersProps) {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)

  useEffect(() => {
    subscriptionsAPI
      .getTiers(creatorId)
      .then(setTiers)
      .catch(() => toast.error('Failed to load subscription tiers'))
      .finally(() => setLoading(false))
  }, [creatorId])

  const handleSubscribe = async (tierId: string) => {
    setCheckingOut(tierId)
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const { url } = await subscriptionsAPI.createCheckout({
        tierId,
        successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&creatorId=${creatorId}`,
        cancelUrl: `${appUrl}/subscribe/${creatorId}`,
      })
      window.location.href = url
    } catch {
      toast.error('Failed to start checkout. Please try again.')
      setCheckingOut(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 pb-20">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-3">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (tiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <p className="text-lg font-semibold">No subscription tiers available</p>
        <p className="text-sm text-muted-foreground">
          This creator hasn't set up subscription tiers yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Subscribe</h1>
        <p className="text-muted-foreground mt-1">
          Choose a plan to unlock exclusive content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              {tier.description && (
                <CardDescription>{tier.description}</CardDescription>
              )}
              <div className="mt-2">
                <span className="text-4xl font-bold">
                  ${parseFloat(tier.price).toFixed(2)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {tier.subscribersCount !== undefined && (
                <Badge variant="secondary" className="w-fit text-xs">
                  {tier.subscribersCount} subscriber{tier.subscribersCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-2">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(tier.id)}
                disabled={!!checkingOut}
              >
                {checkingOut === tier.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
