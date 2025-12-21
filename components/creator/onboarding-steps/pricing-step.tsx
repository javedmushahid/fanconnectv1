'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, Plus, Trash2, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface PricingStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

interface Tier {
  name: string
  price: number
  description: string
}

export default function PricingStep({ data, onUpdate, onNext, onPrevious }: PricingStepProps) {
  const [tiers, setTiers] = useState<Tier[]>(data.tiers || [
    { name: 'Basic', price: 9.99, description: '' },
    { name: 'Premium', price: 19.99, description: '' },
    { name: 'VIP', price: 49.99, description: '' },
  ])
  const [showPreview, setShowPreview] = useState(false)

  const handleTierChange = (index: number, field: keyof Tier, value: string | number) => {
    const newTiers = [...tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setTiers(newTiers)
  }

  const addTier = () => {
    if (tiers.length < 5) {
      setTiers([...tiers, { name: '', price: 0, description: '' }])
    }
  }

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    onUpdate({ tiers })
    onNext()
  }

  const isValid = tiers.every(tier => tier.name && tier.price > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Subscription Tiers</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create subscription options for your subscribers. You can always change these later.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tiers */}
        {tiers.map((tier, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Tier {index + 1}</Badge>
                {tiers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tier Name */}
                <div className="space-y-2">
                  <Label htmlFor={`tier-name-${index}`}>Tier Name *</Label>
                  <Input
                    id={`tier-name-${index}`}
                    placeholder="e.g., Basic, Premium, VIP"
                    value={tier.name}
                    onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor={`tier-price-${index}`}>Monthly Price (USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id={`tier-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="9.99"
                      value={tier.price || ''}
                      onChange={(e) => handleTierChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`tier-desc-${index}`}>Benefits & Description</Label>
                <Textarea
                  id={`tier-desc-${index}`}
                  placeholder="Describe what subscribers get with this tier..."
                  value={tier.description}
                  onChange={(e) => handleTierChange(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Tier Button */}
        {tiers.length < 5 && (
          <Button
            variant="outline"
            onClick={addTier}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Tier
          </Button>
        )}

        {/* Preview Button */}
        <Button
          variant="secondary"
          onClick={() => setShowPreview(true)}
          className="w-full gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview Subscription Page
        </Button>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="ghost" onClick={onPrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="gap-2"
        >
          Save & Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription Tiers Preview</DialogTitle>
            <DialogDescription>
              This is how your tiers will appear to potential subscribers
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {tiers.map((tier, index) => (
              <Card key={index} className={index === 1 ? 'border-primary border-2' : ''}>
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {tier.description || 'No description provided'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
