import BookingForm from '@/components/forms/booking-form'
import { prisma } from '@/lib/db'

async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { availability: true },
      orderBy: { pricePerDay: 'asc' }
    })
    
    return vehicles
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return []
  }
}

export default async function BookingPage() {
  const vehicles = await getVehicles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      <BookingForm vehicles={vehicles} />
    </div>
  )
}