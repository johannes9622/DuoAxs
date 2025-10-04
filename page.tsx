"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "../components/ui/Skeleton";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t=setTimeout(()=>setLoading(false), 700); return ()=>clearTimeout(t) }, []);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>

      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : (
        <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div>
              <div className="text-lg font-semibold">Demo User</div>
              <div className="text-sm text-gray-500">client@duoaxs.com</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Goals: Fitness, Nutrition
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({length:3}).map((_,i)=>(
              <div key={i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="font-medium">Great session with Alex</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clear guidance and form corrections. 5/5</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
