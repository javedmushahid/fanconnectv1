'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useNotificationStore } from '@/store/notification.store'
import { NotificationPreferenceKey } from '@/types/notification.types'

const PREFERENCE_LABELS: Record<NotificationPreferenceKey, { label: string; description: string }> = {
  follow: {
    label: 'New followers',
    description: 'When someone starts following you',
  },
  like: {
    label: 'Likes',
    description: 'When someone likes your post or moment',
  },
  comment: {
    label: 'Comments',
    description: 'When someone comments on your content',
  },
  mention: {
    label: 'Mentions',
    description: 'When someone mentions you in a post or comment',
  },
  subscriber: {
    label: 'New subscribers',
    description: 'When someone subscribes to your channel',
  },
  message: {
    label: 'Direct messages',
    description: 'When someone sends you a message',
  },
}

const PREFERENCE_KEYS: NotificationPreferenceKey[] = [
  'follow',
  'like',
  'comment',
  'mention',
  'subscriber',
  'message',
]

export default function NotificationSettings() {
  const { preferences, isLoadingPreferences, fetchPreferences, updatePreferences } =
    useNotificationStore()

  useEffect(() => {
    if (!preferences) {
      fetchPreferences()
    }
  }, [])

  if (isLoadingPreferences || !preferences) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {PREFERENCE_KEYS.map((key, index) => {
        const { label, description } = PREFERENCE_LABELS[key]
        return (
          <div key={key}>
            <div className="flex items-center justify-between py-4">
              <div className="space-y-0.5">
                <Label htmlFor={`pref-${key}`} className="text-sm font-medium cursor-pointer">
                  {label}
                </Label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch
                id={`pref-${key}`}
                checked={preferences[key]}
                onCheckedChange={(checked) => updatePreferences({ [key]: checked })}
              />
            </div>
            {index < PREFERENCE_KEYS.length - 1 && <Separator />}
          </div>
        )
      })}
    </div>
  )
}
