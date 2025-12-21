'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DollarSign, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface SuperChatModalProps {
  open: boolean
  onClose: () => void
  creatorName: string
}

const TIP_AMOUNTS = [5, 10, 25, 50, 100]

export default function SuperChatModal({
  open,
  onClose,
  creatorName,
}: SuperChatModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0

  const handleSendTip = async () => {
    if (finalAmount < 1) {
      toast.error('Minimum tip amount is $1')
      return
    }

    if (!message.trim()) {
      toast.error('Please add a message with your tip')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success(
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-yellow-500" />
        <span>Tip sent successfully! ${finalAmount}</span>
      </div>
    )

    setIsProcessing(false)
    setSelectedAmount(null)
    setCustomAmount('')
    setMessage('')
    onClose()
  }

  const getHighlightColor = () => {
    if (finalAmount >= 100) return 'from-purple-500 to-pink-500'
    if (finalAmount >= 50) return 'from-orange-500 to-red-500'
    if (finalAmount >= 25) return 'from-yellow-500 to-orange-500'
    if (finalAmount >= 10) return 'from-blue-500 to-cyan-500'
    return 'from-green-500 to-emerald-500'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            Send Super Chat
          </DialogTitle>
          <DialogDescription>
            Send a highlighted message to {creatorName} during the stream
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Amount Selection */}
          <div className="space-y-2">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-5 gap-2">
              {TIP_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  className="h-12"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="customAmount"
                type="number"
                min="1"
                max="500"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
                placeholder="Enter amount"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: $1 • Maximum: $500
            </p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something nice..."
              className="min-h-[100px] resize-none"
              maxLength={200}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Your message will be highlighted in chat</span>
              <span>{200 - message.length} characters left</span>
            </div>
          </div>

          {/* Preview */}
          {finalAmount > 0 && message && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className={`p-4 rounded-lg bg-gradient-to-r ${getHighlightColor()} bg-opacity-10 border-2 border-current`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`px-2 py-1 rounded bg-gradient-to-r ${getHighlightColor()} text-white text-xs font-bold`}
                  >
                    ${finalAmount}
                  </div>
                  <span className="font-semibold">Jane Doe</span>
                </div>
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">${finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee (5%)</span>
              <span className="font-semibold">${(finalAmount * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleSendTip}
            disabled={finalAmount < 1 || !message.trim() || isProcessing}
            className={`bg-gradient-to-r ${getHighlightColor()}`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Send ${finalAmount} Tip
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
