import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MonsterDetailSkeleton() {
  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header buttons skeleton */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
          <Skeleton className="h-10 w-full sm:w-24" />
          <div className="flex gap-2 sm:ml-auto">
            <Skeleton className="h-10 flex-1 sm:w-32" />
            <Skeleton className="h-10 w-32 sm:flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Monster name skeleton */}
        <div className="text-center mb-6">
          <Skeleton className="h-10 w-48 mx-auto" />
        </div>

        {/* Status card skeleton */}
        <Card className="mb-6 p-4">
          <div className="text-center">
            <Skeleton className="h-12 w-12 mx-auto mb-2 rounded-full" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
        </Card>

        {/* Monster display skeleton */}
        <div className="flex justify-center mb-6">
          <Skeleton className="h-64 w-64 rounded-lg" />
        </div>

        {/* Action buttons skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </main>
  )
}
