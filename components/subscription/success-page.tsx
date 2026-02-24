"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Sparkles, User, Check } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { subscriptionsAPI } from "@/lib/api/endpoints/subscriptions";
import { format } from "date-fns";
import { toast } from "sonner";

interface VerifiedSub {
  status: string;
  currentPeriodEnd: string;
  creator: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  };
  tier: { name: string; price: string; benefits: string[] };
}

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sub, setSub] = useState<VerifiedSub | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const verifiedRef = useRef(false);

  /* --------------------------------------------------
     Get session_id from URL (Stripe redirect safe)
  -------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");

    console.log("✅ sessionId:", id);
    setSessionId(id);
  }, []);

  /* --------------------------------------------------
     Confetti animation
  -------------------------------------------------- */
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    };

    const interval = setInterval(() => {
      const timeLeft = end - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const count = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: Math.random() * 0.3 + 0.7, y: Math.random() - 0.2 },
      });
    }, 250);

    setTimeout(() => setShowContent(true), 500);

    return () => clearInterval(interval);
  }, []);

  /* --------------------------------------------------
     Verify Stripe Checkout Session
  -------------------------------------------------- */
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const verifySubscription = async () => {
      try {
        const { subscription } = await subscriptionsAPI.verifyCheckout(
          sessionId
        );

        setSub(subscription);
      } catch (err: any) {
        console.error("verifyCheckout failed:", err?.response?.data || err);
        toast.error(
          "Could not confirm subscription. Please check your subscriptions page."
        );
        setSub(null);
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div
              className={`relative transition-all duration-1000 ${
                showContent ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
              <CheckCircle2
                className="relative h-32 w-32 text-green-500"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Heading */}
          <div
            className={`space-y-4 transition-all duration-1000 delay-300 ${
              showContent
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Payment Successful
              </span>
            </div>

            <h1 className="text-4xl font-bold">Welcome to the Community!</h1>

            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your subscription is now active. Enjoy exclusive content from your
              favourite creator!
            </p>
          </div>

          {/* Subscription Details */}
          <div className="mt-8">
            <Card className="bg-muted/50 border-2">
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-center">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div className="space-y-1.5 text-left">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                ) : sub ? (
                  <>
                    {/* Creator */}
                    <div className="flex items-center gap-3 justify-center mb-5">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarImage src={sub.creator.avatar || undefined} />
                        <AvatarFallback>
                          {sub.creator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-left">
                        <p className="font-bold text-base">
                          {sub.creator.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{sub.creator.username}
                        </p>
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-semibold">
                          {sub.tier.name} — $
                          {parseFloat(sub.tier.price).toFixed(2)}/mo
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-semibold text-green-600">
                          {sub.status}
                        </span>
                      </div>

                      {sub.currentPeriodEnd && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Next billing
                          </span>
                          <span className="font-semibold">
                            {format(
                              new Date(sub.currentPeriodEnd),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    {sub.tier.benefits?.length > 0 && (
                      <div className="mt-4 pt-4 border-t text-sm text-left">
                        <p className="text-muted-foreground mb-2 font-medium">
                          What you get
                        </p>
                        <ul className="space-y-1.5">
                          {sub.tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Subscription confirmed. Details will appear shortly.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {sub && (
              <Link href={`/${sub.creator.username}`}>
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <User className="h-4 w-4" />
                  View Profile
                </Button>
              </Link>
            )}

            <Link href="/subscriptions">
              <Button variant="outline" size="lg">
                Manage Subscriptions
              </Button>
            </Link>
          </div>

          <Separator className="my-6" />

          <Link href="/feed">
            <Button variant="ghost" size="sm">
              Go to Feed
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
