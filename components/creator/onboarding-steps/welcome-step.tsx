import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, DollarSign, Users, TrendingUp, Video, Heart } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn from Your Content',
      description: 'Set your own subscription prices and keep 85% of your earnings',
    },
    {
      icon: Users,
      title: 'Build Your Community',
      description: 'Connect directly with fans and grow your audience',
    },
    {
      icon: Video,
      title: 'Go Live Anytime',
      description: 'Stream live content and engage with your subscribers in real-time',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Growth',
      description: 'Access detailed analytics to understand your audience better',
    },
    {
      icon: Heart,
      title: 'Receive Support',
      description: 'Get tips and donations from your biggest fans',
    },
    {
      icon: Sparkles,
      title: 'Exclusive Features',
      description: 'Access creator-only tools and priority support',
    },
  ]

  return (
    <Card>
      <CardContent className="pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Welcome to FanConnect Creators!
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators earning from their passion. Let's get you set up in just a few minutes.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 p-6 rounded-lg bg-muted/50">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">85%</p>
            <p className="text-sm text-muted-foreground">You Keep</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">10K+</p>
            <p className="text-sm text-muted-foreground">Active Creators</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">$2M+</p>
            <p className="text-sm text-muted-foreground">Paid Monthly</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-6">
        <Button onClick={onNext} size="lg" className="gap-2">
          Get Started
          <Sparkles className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
