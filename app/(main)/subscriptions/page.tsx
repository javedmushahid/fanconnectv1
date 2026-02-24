"use client";

import { useEffect, useState } from "react";
import { Heart, ExternalLink, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import {
  subscriptionsAPI,
  Subscription,
} from "@/lib/api/endpoints/subscriptions";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);

  useEffect(() => {
    subscriptionsAPI
      .getMySubscriptions()
      .then(setSubscriptions)
      .catch(() => toast.error("Failed to load subscriptions"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (subId: string) => {
    setCanceling(subId);
    try {
      const { endsAt } = await subscriptionsAPI.cancelSubscription(subId);
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === subId
            ? { ...s, cancelAtPeriodEnd: true, currentPeriodEnd: endsAt }
            : s
        )
      );
      toast.success(
        `Subscription will end on ${format(new Date(endsAt), "MMM d, yyyy")}`
      );
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setCanceling(null);
    }
  };

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

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Subscriptions Yet"
          description="You haven't subscribed to any creators yet. Explore and find creators you love to support their exclusive content!"
          actionLabel="Explore Creators"
          onAction={() => router.push("/explore")}
          gradient="from-pink-500 to-red-500"
        />
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Creator info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar
                      className="h-12 w-12 flex-shrink-0 cursor-pointer"
                      onClick={() => router.push(`/${sub.creator.username}`)}
                    >
                      <AvatarImage src={sub.creator.avatar || undefined} />
                      <AvatarFallback>
                        {sub.creator.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="min-w-0 cursor-pointer"
                      onClick={() => router.push(`/${sub.creator.username}`)}
                    >
                      <p className="font-semibold truncate">
                        {sub.creator.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{sub.creator.username}
                      </p>
                    </div>
                  </div>

                  {/* Tier + billing + actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                    <div className="text-sm">
                      <p className="font-medium">
                        {sub.tier.name} — $
                        {parseFloat(sub.tier.price).toFixed(2)}/mo
                      </p>
                      <p className="text-muted-foreground">
                        {sub.cancelAtPeriodEnd
                          ? `Ends ${format(
                              new Date(sub.currentPeriodEnd),
                              "MMM d, yyyy"
                            )}`
                          : `Renews ${format(
                              new Date(sub.currentPeriodEnd),
                              "MMM d, yyyy"
                            )}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          !sub.cancelAtPeriodEnd && sub.status === "ACTIVE"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {sub.cancelAtPeriodEnd ? "Canceling" : sub.status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => router.push(`/${sub.creator.username}`)}
                        title="View profile"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>

                      {!sub.cancelAtPeriodEnd && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleCancel(sub.id)}
                          disabled={canceling === sub.id}
                          title="Cancel subscription"
                        >
                          {canceling === sub.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
