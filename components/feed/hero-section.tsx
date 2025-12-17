"use client";

import { Sparkles, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 sm:mb-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient" />

      {/* Content */}
      <div className="relative p-4 sm:p-6 md:p-8 text-white">
        {/* Header */}
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            Welcome Back!
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl">
            Discover amazing content from your favorite creators
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">1.2K</p>
                <p className="text-xs text-blue-100">Creators</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">45K</p>
                <p className="text-xs text-blue-100">Posts Today</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">New</p>
                <p className="text-xs text-blue-100">Updates</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
