'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { authAPI } from '@/lib/api/endpoints/auth'

const RESEND_COOLDOWN = 60

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const { verifyOTP, isLoading } = useAuth()

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN)
  const [isResending, setIsResending] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!email) {
      router.push('/signup')
    }
  }, [email, router])

  // Start countdown on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [])

  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN)
    clearInterval(timerRef.current!)
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    try {
      await verifyOTP(email, otp)
      // verifyOTP in use-auth redirects to /feed on success
    } catch (err: any) {
      const message = err.response?.data?.message || 'Verification failed'
      setError(message)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return
    setError('')
    setIsResending(true)
    try {
      await authAPI.resendOTP(email)
      toast.success('New verification code sent!')
      setOtp('')
      startCooldown()
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to resend code'
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }

  if (!email) return null

  return (
    <Card className="w-full max-w-md shadow-2xl border-0">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
          <MailCheck className="h-8 w-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-3xl font-bold">Verify your email</CardTitle>
          <CardDescription className="text-base mt-2">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setError('')
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }}
              disabled={isLoading}
              className="text-center text-2xl tracking-[0.5em] font-mono h-14"
              autoComplete="one-time-code"
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            size="lg"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            {resendCooldown > 0 ? (
              <span className="text-muted-foreground">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
