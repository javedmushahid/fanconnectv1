'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PaymentStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export default function PaymentStep({ data, onUpdate, onNext, onPrevious }: PaymentStepProps) {
  const [stripeConnected, setStripeConnected] = useState(data.stripeConnected || false)
  const [bankAccount, setBankAccount] = useState(data.bankAccount || '')
  const [taxId, setTaxId] = useState(data.taxInfo || '')

  const handleConnectStripe = () => {
    // Mock Stripe connection
    setTimeout(() => {
      setStripeConnected(true)
      setBankAccount('****1234')
    }, 1500)
  }

  const handleSkip = () => {
    onUpdate({ stripeConnected: false, bankAccount: '', taxInfo: '' })
    onNext()
  }

  const handleSubmit = () => {
    onUpdate({ stripeConnected, bankAccount, taxInfo: taxId })
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Payments</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect your payment method to start receiving earnings. You can skip this step and set it up later.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stripe Connection */}
        <Card className={stripeConnected ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stripeConnected ? 'bg-green-500' : 'bg-primary/10'
              }`}>
                {stripeConnected ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CreditCard className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">Stripe Account</h3>
                  {stripeConnected && (
                    <Badge className="bg-green-500">Connected</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {stripeConnected
                    ? 'Your Stripe account is connected and ready to receive payments.'
                    : 'Connect with Stripe to receive payments from your subscribers.'
                  }
                </p>
                {!stripeConnected ? (
                  <Button onClick={handleConnectStripe} className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Connect Stripe Account
                  </Button>
                ) : (
                  <div className="p-3 bg-background rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Bank Account</span>
                      <span className="text-sm text-muted-foreground">{bankAccount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        {stripeConnected && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Tax Information Required
                  </p>
                  <p className="text-blue-700 dark:text-blue-200">
                    We need your tax information for IRS compliance. This is required to withdraw earnings.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / SSN (Optional for now)</Label>
                <Input
                  id="taxId"
                  placeholder="XXX-XX-XXXX"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  type="password"
                />
                <p className="text-xs text-muted-foreground">
                  Your information is encrypted and secure. You can add this later in settings.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Payment Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You keep 85% of subscription revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Payments are processed securely through Stripe</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Earnings are paid out monthly to your account</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>No setup fees or monthly charges</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="ghost" onClick={onPrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSkip}>
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            {stripeConnected ? 'Save & Continue' : 'Skip & Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
