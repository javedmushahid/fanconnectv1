"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: backend login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/feed");
    }, 1000);
  };

  const handleOAuth = (provider: "google" | "facebook" | "apple") => {
    // TODO: redirect to backend OAuth
    console.log(`OAuth with ${provider}`);
  };

  return (
    <div className=" items-center justify-center px-4">
      <Card className="w-full max-w-md backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Social Auth */}
          <div className="space-y-2">
            <SocialLoginButton
              label="Continue with Google"
              onClick={() => handleOAuth("google")}
              icon={<FaGoogle className="h-4 w-4 text-[#DB4437]" />}
            />

            <SocialLoginButton
              label="Continue with Facebook"
              onClick={() => handleOAuth("facebook")}
              icon={<FaFacebookF className="h-4 w-4 text-[#1877F2]" />}
            />

            <SocialLoginButton
              label="Continue with Apple"
              onClick={() => handleOAuth("apple")}
              icon={<FaApple className="h-4 w-4 text-black dark:text-white" />}
            />
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className=" px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
