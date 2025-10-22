import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Booking {
  id: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  phone: string
  email: string | null
  customerName: string
  createdAt: Date
  vehicles: string
  securityPersonnel: string | null
}

interface VehicleData {
  name?: string
  quantity?: number
  subtotal?: number
}

interface VehicleRevenue {
  bookings: number
  revenue: number
}

export async function GET(request: NextRequest) {
  try {
    // Get COMPLETED bookings from the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const bookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED', // Only confirmed bookings
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        phone: true,
        email: true,
        customerName: true,
        createdAt: true,
        vehicles: true,
        securityPersonnel: true
      }
    }) as Booking[]

    // Calculate basic stats with proper typing
    const totalRevenue = bookings.reduce((sum: number, booking: Booking) => sum + booking.totalAmount, 0)
    const totalBookings = bookings.length
    
    // Get unique customers from completed bookings
    const uniqueCustomers = new Set(bookings.map((b: Booking) => b.phone)).size

    // Generate revenue data for last 6 months (only completed bookings)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    const revenueData = months.slice(currentMonth - 5, currentMonth + 1).map((month: string, index: number) => {
      const targetMonth = (currentMonth - 5 + index + 12) % 12
      const monthRevenue = bookings
        .filter((booking: Booking) => new Date(booking.createdAt).getMonth() === targetMonth)
        .reduce((sum: number, booking: Booking) => sum + booking.totalAmount, 0)
      
      return { month, revenue: monthRevenue }
    })

    // Booking trends (only completed bookings)
    const bookingTrends = months.slice(currentMonth - 5, currentMonth + 1).map((month: string, index: number) => {
      const targetMonth = (currentMonth - 5 + index + 12) % 12
      const monthBookings = bookings.filter((booking: Booking) => new Date(booking.createdAt).getMonth() === targetMonth).length
      return { month, bookings: monthBookings }
    })

    // Parse vehicles data to get utilization from completed bookings
    const vehicleBookings: Record<string, number> = {}
    
    bookings.forEach((booking: Booking) => {
      try {
        if (booking.vehicles) {
          const vehicles = JSON.parse(booking.vehicles) as VehicleData[]
          if (Array.isArray(vehicles)) {
            vehicles.forEach((vehicle: VehicleData) => {
              const vehicleName = vehicle.name || 'Unknown Vehicle'
              vehicleBookings[vehicleName] = (vehicleBookings[vehicleName] || 0) + (vehicle.quantity || 1)
            })
          }
        }
      } catch (error) {
        console.error('Error parsing vehicles:', error)
      }
    })

    // Calculate vehicle utilization (percentage of completed bookings)
    const totalVehicleBookings = Object.values(vehicleBookings).reduce((sum: number, count: number) => sum + count, 0)
    const vehicleUtilization = Object.entries(vehicleBookings)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        value: totalVehicleBookings > 0 ? Math.round((count / totalVehicleBookings) * 100) : 0
      }))

    // Get overall status distribution (all bookings for context)
    const allBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        status: true
      }
    })

    // Status distribution (all bookings for comparison)
    const statusDistribution = [
      { name: 'Completed', value: bookings.length },
      { name: 'Pending', value: allBookings.filter((b: { status: string }) => b.status === 'PENDING').length },
      { name: 'Confirmed', value: allBookings.filter((b: { status: string }) => b.status === 'CONFIRMED').length },
      { name: 'Cancelled', value: allBookings.filter((b: { status: string }) => b.status === 'CANCELLED').length }
    ]

    // Top vehicles by revenue (from completed bookings)
    const vehicleRevenue: Record<string, VehicleRevenue> = {}
    
    bookings.forEach((booking: Booking) => {
      try {
        if (booking.vehicles) {
          const vehicles = JSON.parse(booking.vehicles) as VehicleData[]
          if (Array.isArray(vehicles)) {
            vehicles.forEach((vehicle: VehicleData) => {
              const vehicleName = vehicle.name || 'Unknown Vehicle'
              if (!vehicleRevenue[vehicleName]) {
                vehicleRevenue[vehicleName] = { bookings: 0, revenue: 0 }
              }
              vehicleRevenue[vehicleName].bookings += (vehicle.quantity || 1)
              vehicleRevenue[vehicleName].revenue += (vehicle.subtotal || 0)
            })
          }
        }
      } catch (error) {
        console.error('Error parsing vehicles for revenue:', error)
      }
    })

    const topVehicles = Object.entries(vehicleRevenue)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        bookings: data.bookings,
        revenue: data.revenue
      }))

    const analyticsData = {
      totalRevenue,
      totalBookings: bookings.length, // Only completed bookings
      completedBookings: bookings.length, // Same as totalBookings now
      pendingBookings: allBookings.filter((b: { status: string }) => b.status === 'PENDING').length,
      totalCustomers: uniqueCustomers,
      revenueData,
      bookingTrends,
      vehicleUtilization,
      statusDistribution,
      topVehicles
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    })
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}