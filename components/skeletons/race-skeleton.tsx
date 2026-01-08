import { Skeleton } from "@/components/ui/skeleton";

export function RaceSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <Skeleton className="h-6 w-1/2 max-w-sm" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
