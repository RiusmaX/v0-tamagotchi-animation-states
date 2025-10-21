import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MonsterCardSkeleton() {
  return (
    <Card className="p-6 border-4 border-gray-200 bg-card/95 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-200">
          <Skeleton className="w-48 h-48 mx-auto rounded-lg" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto rounded-full" />
        </div>
      </div>
    </Card>
  )
}
