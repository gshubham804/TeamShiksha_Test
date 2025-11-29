"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/signin");
    }, 2000); // redirect after 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-red-300 bg-red-50 p-6 text-center shadow-sm">
        <p className="text-sm text-red-700">
          ⚠️ <span className="font-semibold">Note:</span> Our backend is hosted on a free server.
          The first request may take{" "}
          <span className="font-semibold">40–60 seconds</span> due to cold start.
          Please wait and do not refresh.
        </p>

        <p className="mt-4 text-xs text-gray-600">
          Redirecting to sign in…
        </p>
      </div>
    </div>
  );
}
