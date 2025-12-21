'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Check, Star, Crown, Sparkles, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubscriptionTiersProps {
  creatorId: string
}

const CREATOR_DATA = {
  fitnessguru: {
    name: 'Fitness Guru',
    username: '@fitnessguru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru',
    banner: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=300&fit=crop',
    bio: 'Professional fitness coach helping you achieve your health goals',
  },
  janedoe: {
    name: 'Jane Doe',
    username: '@janedoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=300&fit=crop',
    bio: 'Content creator sharing lifestyle and productivity tips',
  },
}

const SUBSCRIPTION_TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    discount: 17,
    popular: false,
    freeTrial: true,
    trialDays: 7,
    benefits: [
      'Access to exclusive posts',
      'Monthly live Q&A sessions',
      'Community chat access',
      'Behind-the-scenes content',
      'Early access to new content',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    discount: 17,
    popular: true,
    freeTrial: true,
    trialDays: 14,
    benefits: [
      'Everything in Basic',
      'Weekly exclusive videos',
      'Direct messaging',
      'Personalized shoutouts',
      'Exclusive merchandise discounts',
      'Priority support',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    monthlyPrice: 49.99,
    annualPrice: 499.99,
    discount: 17,
    popular: false,
    freeTrial: false,
    trialDays: 0,
    benefits: [
      'Everything in Premium',
      '1-on-1 monthly video calls',
      'Custom content requests',
      'Exclusive VIP-only events',
      'Personal coaching sessions',
      'Lifetime access to courses',
      'VIP badge on profile',
    ],
  },
]

const FAQ_ITEMS = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Basic and Premium tiers come with a free trial period. You can cancel anytime during the trial without being charged.',
  },
  {
    question: 'Can I upgrade or downgrade my tier?',
    answer: 'Absolutely! You can change your subscription tier at any time. The price difference will be prorated.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No hidden fees! The price you see is the price you pay. Annual subscriptions include a discount.',
  },
]

export default function SubscriptionTiers({ creatorId }: SubscriptionTiersProps) {
  const router = useRouter()
  const [isAnnual, setIsAnnual] = useState(false)
  
  const creator = CREATOR_DATA[creatorId as keyof typeof CREATOR_DATA] || CREATOR_DATA.janedoe

  const handleSubscribe = (tierId: string, price: number) => {
    router.push(`/checkout/subscription?tier=${tierId}&creator=${creatorId}&price=${price}&billing=${isAnnual ? 'annual' : 'monthly'}`)
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Creator Header */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          <img
            src={creator.banner}
            alt="Banner"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Creator Info */}
        <div className="relative px-6 pb-6 -mt-16">
          <div className="flex items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={creator.avatar} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 mb-4">
              <h1 className="text-3xl font-bold">{creator.name}</h1>
              <p className="text-muted-foreground">{creator.username}</p>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">{creator.bio}</p>
        </div>
      </div>

      {/* Billing Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              Annual
              <Badge className="ml-2 bg-green-500">Save 17%</Badge>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const Icon = tier.icon
          const price = isAnnual ? tier.annualPrice : tier.monthlyPrice
          const monthlyEquivalent = isAnnual ? (tier.annualPrice / 12).toFixed(2) : null

          return (
            <Card
              key={tier.id}
              className={`relative ${tier.popular ? 'border-2 border-primary shadow-lg scale-105' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${tier.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${tier.color}`} />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${price}
                    </span>
                    <span className="text-muted-foreground">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  {isAnnual && monthlyEquivalent && (
                    <p className="text-sm mt-1">
                      ${monthlyEquivalent}/month billed annually
                    </p>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Free Trial Badge */}
                {tier.freeTrial && (
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    🎁 {tier.trialDays}-day free trial
                  </Badge>
                )}

                {/* Benefits */}
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(tier.id, price)}
                  className="w-full"
                  size="lg"
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Why Subscribe?</CardTitle>
          <CardDescription>Support your favorite creator and get exclusive perks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Exclusive Content</h3>
                <p className="text-sm text-muted-foreground">
                  Access premium content not available anywhere else
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Direct Support</h3>
                <p className="text-sm text-muted-foreground">
                  Help creators continue making amazing content
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Crown className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">VIP Treatment</h3>
                <p className="text-sm text-muted-foreground">
                  Get priority access and personalized attention
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
