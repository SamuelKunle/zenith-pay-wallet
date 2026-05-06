import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 animate-skeleton bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

// Pre-built skeleton patterns for common fintech elements
function BalanceSkeleton() {
  return (
    <div className="balance-gradient rounded-[28px] p-7 pb-6 shadow-balance">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-7 w-20 rounded-full bg-white/[0.06]" />
        <Skeleton className="h-8 w-8 rounded-full bg-white/[0.06]" />
      </div>
      <Skeleton className="h-3 w-24 rounded bg-white/[0.06] mb-3" />
      <Skeleton className="h-10 w-52 rounded-lg bg-white/[0.06]" />
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/[0.04]">
        <Skeleton className="h-7 w-28 rounded-full bg-white/[0.06]" />
        <Skeleton className="h-4 w-24 rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}

function TransactionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="surface-content overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-3.5 px-4 py-3.5 ${
            i < count - 1 ? "border-b border-surface-border-subtle" : ""
          }`}
        >
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32 rounded" />
            <Skeleton className="h-2.5 w-20 rounded" />
          </div>
          <Skeleton className="h-3.5 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

function ActionsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2.5">
          <Skeleton className="h-[52px] w-[52px] rounded-2xl" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, BalanceSkeleton, TransactionSkeleton, ActionsSkeleton };
