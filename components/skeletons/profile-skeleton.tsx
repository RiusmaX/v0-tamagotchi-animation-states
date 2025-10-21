import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-64 mx-auto mb-3" />
        <Skeleton className="h-6 w-48 mx-auto" />
      </div>

      <div className="grid gap-6">
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <Skeleton className="h-8 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200 shadow-lg">
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 shadow-lg">
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
