// src/app/booking/page.tsx
import BookingForm from '@/components/forms/booking-form'

async function getVehicles() {
  try {
    // Use absolute URL for server components
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/vehicles`
    
    console.log('🔧 Fetching vehicles from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Remove cache: 'no-store' as it can cause issues in server components
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    console.log('🔧 Response status:', response.status)

    if (!response.ok) {
      console.error('🔧 API returned error status:', response.status)
      return []
    }

    const data = await response.json()
    console.log('🔧 API Response received, success:', data.success)
    console.log('🔧 Data source:', data.source)
    console.log('🔧 Vehicles count:', data.data?.length)

    if (data.success) {
      return data.data || []
    } else {
      console.error('🔧 API returned success: false')
      return []
    }
  } catch (error) {
    console.error('🔧 Error fetching vehicles:', error)
    return []
  }
}

export default async function BookingPage() {
  const vehicles = await getVehicles()

  console.log('🔧 Booking page - Final vehicles count:', vehicles.length)
  
  if (vehicles.length > 0) {
    console.log('🔧 Vehicle names:', vehicles.map((v: any) => v.name))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      {/* Debug info REMOVED - Clean version */}
      <BookingForm vehicles={vehicles} />
    </div>
  )
}