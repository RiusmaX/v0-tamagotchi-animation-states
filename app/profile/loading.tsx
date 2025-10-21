import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"

export default function ProfileLoading() {
  return (
    <main className="min-h-screen p-4 pb-24 lg:pb-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <ProfileSkeleton />
    </main>
  )
}
