"use client";

import dynamic from "next/dynamic";

const SuccessPage = dynamic(
  () => import("@/components/subscription/success-page"),
  { ssr: false }
);

export default function SuccessClientWrapper() {
  return <SuccessPage />;
}
