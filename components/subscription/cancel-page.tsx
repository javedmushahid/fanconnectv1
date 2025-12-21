'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { XCircle, RotateCcw, Search, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const CANCELLATION_REASONS = [
  'Changed my mind',
  'Too expensive',
  'Found another creator',
  'Payment method issue',
  'Just browsing',
  'Other',
]

export default function CancelPage() {
  const searchParams = useSearchParams()
  const [selectedReason, setSelectedReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const tier = searchParams.get('tier') || 'Premium'
  const creator = searchParams.get('creator') || 'janedoe'

  const handleSubmitFeedback = () => {
    // Mock feedback submission
    console.log('Feedback:', { reason: selectedReason, feedback })
    setSubmitted(true)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8">
          {/* Cancel Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20" />
              <XCircle className="relative h-24 w-24 text-orange-500" strokeWidth={1.5} />
            </div>
          </div>

          {!submitted ? (
            <>
              {/* Cancellation Message */}
              <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl font-bold">Payment Cancelled</h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Your payment was not processed. No charges have been made to your account.
                </p>
              </div>

              {/* Cancelled Details */}
              <div className="mb-8 p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription Tier</span>
                    <span className="font-semibold capitalize">{tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creator</span>
                    <span className="font-semibold">@{creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-orange-600">Cancelled</span>
                  </div>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="max-w-md mx-auto space-y-6 mb-8">
                <div>
                  <h3 className="font-semibold mb-3">
                    Help us improve (Optional)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    What made you cancel? Your feedback helps us serve you better.
                  </p>
                  
                  <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                    <div className="space-y-2">
                      {CANCELLATION_REASONS.map((reason) => (
                        <div key={reason} className="flex items-center space-x-2">
                          <RadioGroupItem value={reason} id={reason} />
                          <Label htmlFor={reason} className="cursor-pointer">
                            {reason}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {selectedReason && (
                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      Additional feedback (Optional)
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="Tell us more..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {selectedReason && (
                  <Button
                    onClick={handleSubmitFeedback}
                    variant="outline"
                    className="w-full"
                  >
                    Submit Feedback
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-2xl font-bold">Thank You!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We appreciate your feedback and will use it to improve our service.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/subscribe/${creator}`}>
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Search className="h-4 w-4" />
                Browse Other Creators
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-8 border-t text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Need Help?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              If you experienced an issue during checkout, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/support">
                <Button variant="ghost" size="sm">
                  Contact Support
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" size="sm">
                  View FAQ
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
