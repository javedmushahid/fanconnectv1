'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { followsAPI, SuggestedUser } from '@/lib/api/endpoints/follows'

function Avatar({ user }: { user: SuggestedUser }) {
  if (user.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-full object-cover flex-shrink-0"
      />
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
      {user.name.charAt(0).toUpperCase()}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-2.5 bg-muted rounded w-16" />
      </div>
      <div className="h-7 w-14 bg-muted rounded" />
    </div>
  )
}

export default function SuggestedUsers() {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    followsAPI.getSuggestions(5)
      .then(setSuggestions)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleFollow = async (userId: string) => {
    // Optimistic update
    setFollowed((prev) => new Set(prev).add(userId))
    try {
      await followsAPI.followUser(userId)
    } catch {
      // Revert on failure
      setFollowed((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Suggested Creators</h3>
      <div className="space-y-4">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suggestions yet</p>
        ) : (
          suggestions.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Link href={`/${user.username}`} className="flex-shrink-0">
                <Avatar user={user} />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/${user.username}`} className="hover:underline">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                </Link>
                <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                {user.followersCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {user.followersCount.toLocaleString()} followers
                  </p>
                )}
              </div>

              <Button
                size="sm"
                variant={followed.has(user.id) ? 'secondary' : 'default'}
                className="flex-shrink-0 text-xs h-7 px-3"
                onClick={() => handleFollow(user.id)}
                disabled={followed.has(user.id)}
              >
                {followed.has(user.id) ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
