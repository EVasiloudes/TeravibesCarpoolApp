import { Suspense } from 'react'
import TripsPageContent from '@/components/TripsPageContent'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Trips() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner className="py-12" size="lg" />
      </div>
    }>
      <TripsPageContent />
    </Suspense>
  )
}