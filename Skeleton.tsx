import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="border rounded-2xl p-4 space-y-3 border-gray-200 dark:border-gray-800">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-2">
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
}
