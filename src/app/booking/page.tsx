// src/app/booking/page.tsx
import BookingForm from '@/components/forms/booking-form'

// TEMPORARY: Use your actual vehicle data while AWS is down
const temporaryVehicles = [
  {
    id: '5e1ddba1-dbe7-4ffa-946c-e8b301889a67',
    name: 'Toyota Land Cruiser',
    type: 'SUV',
    pricePerDay: 219999,
    availability: true,
    image: null,
    description: 'Very luxurious SUV',
    features: '["AC", "Bluetooth"]',
    createdAt: '2025-10-23T08:44:53.619Z',
    updatedAt: '2025-10-23T08:44:53.619Z'
  },
  // Add more of your actual vehicles here if you have them
  // {
  //   id: 'another-vehicle-id',
  //   name: 'Another Vehicle',
  //   type: 'sedan', 
  //   pricePerDay: 50000,
  //   availability: true,
  //   image: null,
  //   description: 'Another vehicle description',
  //   features: '["AC", "GPS"]',
  //   createdAt: '2025-10-23T00:00:00.000Z',
  //   updatedAt: '2025-10-23T00:00:00.000Z'
  // }
]

async function getVehicles() {
  try {
    const url = '/api/vehicles'
    
    console.log('🔧 Fetching vehicles from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    console.log('🔧 Response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('🔧 API Response received, success:', data.success)

      if (data.success && data.data && data.data.length > 0) {
        console.log('🔧 Vehicles data received successfully from database:', data.data.length)
        return data.data
      }
    }
    
    // If API fails or returns no data, use temporary vehicles
    console.log('🔧 Using temporary vehicle data (AWS outage)')
    return temporaryVehicles
    
  } catch (error) {
    console.error('🔧 Network error fetching vehicles:', error)
    console.log('🔧 Using temporary vehicle data due to network error')
    return temporaryVehicles
  }
}

export default async function BookingPage() {
  const vehicles = await getVehicles()

  console.log('🔧 Booking page - Final vehicles count:', vehicles.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      {/* Debug info */}
      <div className={`fixed top-4 right-4 p-3 rounded-lg z-50 text-sm ${
        vehicles.length > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          <span>Vehicles: {vehicles.length}</span>
          {vehicles[0]?.id === '5e1ddba1-dbe7-4ffa-946c-e8b301889a67' && (
            <span className="text-xs bg-blue-500 px-1 rounded">Real Data</span>
          )}
        </div>
      </div>
      
      <BookingForm vehicles={vehicles} />
    </div>
  )
}