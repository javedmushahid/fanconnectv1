'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  gradient?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  gradient = 'from-blue-500 to-purple-500'
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
        {/* Animated Icon */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} blur-2xl opacity-20 animate-pulse`}></div>
          <div className={`relative p-6 bg-gradient-to-r ${gradient} rounded-full animate-float`}>
            <Icon className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className={`bg-gradient-to-r ${gradient} hover:opacity-90 shadow-lg hover:shadow-xl transition-all`}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}
