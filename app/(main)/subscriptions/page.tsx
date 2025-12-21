"use client";

import { Heart, Plus } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";

export default function SubscriptionsPage() {
  const router = useRouter();
  const hasSubscriptions = false; // Set to true when user has subscriptions

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Subscriptions
        </h1>
        <p className="text-muted-foreground">
          Manage your creator subscriptions
        </p>
      </div>

      {!hasSubscriptions && (
        <EmptyState
          icon={Heart}
          title="No Subscriptions Yet"
          description="You haven't subscribed to any creators yet. Explore and find creators you love to support their exclusive content!"
          actionLabel="Explore Creators"
          onAction={() => router.push("/explore")}
          gradient="from-pink-500 to-red-500"
        />
      )}
    </div>
  );
}
