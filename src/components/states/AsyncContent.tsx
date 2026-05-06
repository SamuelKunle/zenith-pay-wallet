import { ReactNode } from "react";
import { ShimmerBlock } from "@/components/states/StateUI";

/** Dense list skeletons aligned with transaction / notification rows. */
export function ListRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0" aria-busy aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3.5 ${i < rows - 1 ? "border-b border-surface-border-subtle" : ""}`}
        >
          <ShimmerBlock className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <ShimmerBlock className="h-3 w-[55%] max-w-[200px]" />
            <ShimmerBlock className="h-2.5 w-28" />
          </div>
          <ShimmerBlock className="h-4 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** Card-stack skeleton for insights / rewards panels. */
export function CardStackSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <div className="space-y-4 px-5 py-2" aria-busy aria-label="Loading">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 p-5 space-y-3">
          <ShimmerBlock className="h-4 w-32" />
          <ShimmerBlock className="h-20 w-full rounded-xl" />
          <ShimmerBlock className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function InlineQueryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-4 text-center space-y-2 mx-5 mt-4">
      <p className="text-sm text-foreground">{message}</p>
      <button
        type="button"
        className="text-sm font-semibold text-primary underline-offset-2 hover:underline rounded-md px-2 py-1.5 min-h-[44px] interactive-focus"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

export function LoadingListHint({ label = "Loading…" }: { label?: string }) {
  return (
    <p className="text-sm text-muted-foreground text-center py-10 px-4" aria-busy>
      {label}
    </p>
  );
}

/** Shared wrapper for list-style demo queries */
export function AsyncListBody({
  isPending,
  isError,
  errorMessage,
  onRetry,
  empty,
  children,
  skeletonRows = 5,
}: {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  empty: ReactNode;
  children: ReactNode;
  skeletonRows?: number;
}) {
  if (isPending) {
    return (
      <div className="surface-content overflow-hidden">
        <ListRowSkeleton rows={skeletonRows} />
      </div>
    );
  }
  if (isError) {
    return <InlineQueryError message={errorMessage} onRetry={onRetry} />;
  }
  return <>{children}</>;
}
