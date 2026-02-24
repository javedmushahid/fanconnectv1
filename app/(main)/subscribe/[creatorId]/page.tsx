import SubscriptionTiers from "@/components/subscription/subscription-tiers";

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  const { creatorId } = await params;
  return <SubscriptionTiers creatorId={creatorId} />;
}
