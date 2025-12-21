import SubscriptionTiers from '@/components/subscription/subscription-tiers'

export default function SubscribePage({ params }: { params: { creatorId: string } }) {
  return <SubscriptionTiers creatorId={params.creatorId} />
}
