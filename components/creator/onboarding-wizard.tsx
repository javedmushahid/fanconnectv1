'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import WelcomeStep from './onboarding-steps/welcome-step'
import ProfileStep from './onboarding-steps/profile-step'
import PricingStep from './onboarding-steps/pricing-step'
import PaymentStep from './onboarding-steps/payment-step'
import CompleteStep from './onboarding-steps/complete-step'

const STEPS = [
  { id: 1, title: 'Welcome', description: 'Get started as a creator' },
  { id: 2, title: 'Profile', description: 'Set up your profile' },
  { id: 3, title: 'Pricing', description: 'Configure subscription tiers' },
  { id: 4, title: 'Payment', description: 'Connect payment method' },
  { id: 5, title: 'Complete', description: 'All set!' },
]

export default function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [formData, setFormData] = useState({
    // Profile data
    avatar: '',
    banner: '',
    displayName: '',
    bio: '',
    category: '',
    // Pricing data
    tiers: [
      { name: 'Basic', price: 9.99, description: '' },
      { name: 'Premium', price: 19.99, description: '' },
      { name: 'VIP', price: 49.99, description: '' },
    ],
    // Payment data
    stripeConnected: false,
    bankAccount: '',
    taxInfo: '',
  })

  const progress = (currentStep / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      // Save progress to localStorage
      saveProgress()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleExit = () => {
    setShowExitDialog(true)
  }

  const confirmExit = () => {
    saveProgress()
    router.push('/creator/dashboard')
  }

  const saveProgress = () => {
    localStorage.setItem('onboarding-progress', JSON.stringify({
      currentStep,
      formData,
      timestamp: new Date().toISOString(),
    }))
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />
      case 2:
        return (
          <ProfileStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <PricingStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <PaymentStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 5:
        return <CompleteStep data={formData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Onboarding</h1>
          <p className="text-muted-foreground">
            Set up your creator profile in just a few steps
          </p>
        </div>
        {currentStep < 5 && (
          <Button variant="ghost" size="icon" onClick={handleExit}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {currentStep < 5 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Step Indicator */}
              <div className="flex justify-between mb-2">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center gap-2 ${
                      index < STEPS.length - 1 ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.id}
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs font-medium">{step.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Step {currentStep} of {STEPS.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      {renderStep()}

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Onboarding?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved. You can resume onboarding anytime from your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Setup</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit}>
              Save & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
