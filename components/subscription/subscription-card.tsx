'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Star, Zap } from 'lucide-react'
import { useState } from 'react'

interface SubscriptionTier {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  icon: any
  color: string
  features: string[]
  popular?: boolean
}

const tiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    interval: 'month',
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Access to all public posts',
      'Comment on posts',
      'Like and save content',
      'Basic messaging',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      'Everything in Basic',
      'Access to exclusive content',
      'Priority messaging',
      'Early access to new posts',
      'Monthly Q&A sessions',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 19.99,
    interval: 'month',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    features: [
      'Everything in Premium',
      '1-on-1 video calls (monthly)',
      'Custom content requests',
      'Behind the scenes access',
      'VIP badge on profile',
      'Lifetime discount',
    ],
  },
]

export default function SubscriptionCard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((tier) => {
        const Icon = tier.icon
        const isHovered = hoveredCard === tier.id
        
        return (
          <Card
            key={tier.id}
            className={`relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
              tier.popular ? 'border-2 border-primary ring-2 ring-primary/20' : ''
            }`}
            onMouseEnter={() => setHoveredCard(tier.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 ${isHovered ? 'opacity-10' : ''} transition-opacity duration-500`}></div>
            
            {/* Popular badge */}
            {tier.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="relative p-6 space-y-6">
              {/* Icon with glow */}
              <div className="relative inline-block">
                <div className={`absolute inset-0 bg-gradient-to-r ${tier.color} blur-xl opacity-50 ${isHovered ? 'opacity-75' : ''} transition-opacity duration-500`}></div>
                <div className={`relative p-3 rounded-xl bg-gradient-to-r ${tier.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                  {tier.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/{tier.interval}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-2 text-sm"
                    style={{ 
                      animation: isHovered ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : '' 
                    }}
                  >
                    <Check className={`h-5 w-5 flex-shrink-0 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Subscribe button */}
              <Button 
                className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 shadow-lg ${
                  isHovered ? 'shadow-2xl scale-105' : ''
                } transition-all duration-300`}
              >
                Subscribe Now
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
