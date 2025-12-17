import SubscriptionCard from '@/components/subscription/subscription-card'

export default function PricingPage() {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get exclusive access to premium content from your favorite creators
        </p>
      </div>
      
      <SubscriptionCard />

      <div className="text-center text-sm text-muted-foreground">
        <p>All plans include a 7-day free trial. Cancel anytime.</p>
      </div>
    </div>
  )
}
