'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Lock, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const tier = searchParams.get('tier') || 'basic'
  const creator = searchParams.get('creator') || 'janedoe'
  const price = parseFloat(searchParams.get('price') || '9.99')
  const billing = searchParams.get('billing') || 'monthly'

  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [saveCard, setSaveCard] = useState(true)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock tax calculation (8% for demo)
  const taxRate = 0.08
  const subtotal = price - discount
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handleApplyPromo = () => {
    // Mock promo code
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(price * 0.1)
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(price * 0.2)
    } else {
      alert('Invalid promo code')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      alert('Please accept the terms and conditions')
      return
    }

    setIsProcessing(true)

    // Mock payment processing
    setTimeout(() => {
      router.push('/checkout/success')
    }, 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/subscribe/${creator}`} className="hover:text-foreground">
          Subscription
        </Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <h1 className="text-3xl font-bold">Complete Your Subscription</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>Enter your card details securely</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM / YY"
                      maxLength={7}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <Separator />

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Billing Address</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="United States" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="12345" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Main St" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" required />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      checked={saveCard}
                      onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                    />
                    <Label htmlFor="saveCard" className="text-sm font-normal cursor-pointer">
                      Save card for future purchases
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing || !acceptTerms}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Complete Payment - ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <span>256-bit SSL</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tier Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold capitalize">{tier} Tier</span>
                  <Badge>{billing}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Subscription to @{creator}
                </p>
              </div>

              <Separator />

              {/* Promo Code */}
              <div className="space-y-2">
                <Label htmlFor="promo">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handleApplyPromo} variant="outline">
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600">
                    ✓ Discount applied: -${discount.toFixed(2)}
                  </p>
                )}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Billed {billing === 'annual' ? 'annually' : 'monthly'}
                </p>
              </div>

              <Separator />

              {/* Trial Info */}
              {tier !== 'vip' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        {tier === 'basic' ? '7' : '14'}-Day Free Trial
                      </p>
                      <p className="text-blue-700 dark:text-blue-200">
                        You won't be charged until your trial ends. Cancel anytime.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
