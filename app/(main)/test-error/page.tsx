'use client'

import { Button } from '@/components/ui/button'

export default function TestErrorPage() {
  const throwError = () => {
    throw new Error('This is a test error!')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Test Error Page</h1>
      <Button onClick={throwError}>Trigger Error</Button>
    </div>
  )
}
