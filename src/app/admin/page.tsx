// src/app/admin/page.tsx
import DashboardStats from '@/components/admin/dashboard-stats'
import RecentBookings from '@/components/admin/recent-bookings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface DashboardBooking {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email: string | null
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | null
  createdAt: Date | null
  vehicles: string
  securityPersonnel: string | null
}

interface DashboardData {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  totalRevenue: number
  availableVehicles: number
  recentBookings: DashboardBooking[]
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    console.log('🔄 Dashboard - Fetching fresh data...')
    
    // Use the same API approach as analytics
    const baseUrl = process.env.NEXTAUTH_URL || 'https://paramount-autos.vercel.app'
    
    // Fetch from analytics API for stats
    const analyticsResponse = await fetch(`${baseUrl}/api/admin/analytics`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })

    // Fetch from bookings API for recent bookings
    const bookingsResponse = await fetch(`${baseUrl}/api/admin/bookings`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })

    if (!analyticsResponse.ok || !bookingsResponse.ok) {
      throw new Error('Failed to fetch dashboard data')
    }

    const analyticsData = await analyticsResponse.json()
    const allBookings = await bookingsResponse.json()

    console.log('✅ Dashboard - Analytics data:', analyticsData.data)
    console.log('✅ Dashboard - Bookings count:', allBookings.length)

    // Get recent 5 bookings
    const recentBookings = allBookings.slice(0, 5).map((booking: any) => ({
      ...booking,
      // Ensure proper typing
      status: booking.status || null,
      paymentStatus: booking.paymentStatus || null,
      createdAt: booking.createdAt ? new Date(booking.createdAt) : null
    }))

    return {
      totalBookings: analyticsData.data.totalBookings || 0,
      pendingBookings: analyticsData.data.pendingBookings || 0,
      confirmedBookings: analyticsData.data.confirmedBookings || 0,
      completedBookings: analyticsData.data.completedBookings || 0,
      totalRevenue: analyticsData.data.totalRevenue || 0,
      availableVehicles: analyticsData.data.totalVehicles || 0, // Using totalVehicles from analytics
      recentBookings
    }
  } catch (error) {
    console.error('❌ Dashboard - Error fetching data:', error)
    
    // Fallback: Try direct database queries as backup
    try {
      const { db } = await import('@/lib/db')
      const { bookings, vehicles } = await import('@/lib/schema')
      const { count, sql } = await import('drizzle-orm')

      const [
        totalBookingsResult,
        pendingBookingsResult,
        confirmedBookingsResult,
        completedBookingsResult,
        totalRevenueResult,
        availableVehiclesResult,
        recentBookingsResult
      ] = await Promise.all([
        db.select({ count: count() }).from(bookings),
        db.select({ count: count() }).from(bookings).where(sql`${bookings.status} = 'PENDING'`),
        db.select({ count: count() }).from(bookings).where(sql`${bookings.status} = 'CONFIRMED'`),
        db.select({ count: count() }).from(bookings).where(sql`${bookings.status} = 'COMPLETED'`),
        db.select({ total: sql<number>`sum(${bookings.totalAmount})` }).from(bookings),
        db.select({ count: count() }).from(vehicles).where(sql`${vehicles.availability} = true`),
        db.select().from(bookings).orderBy(sql`${bookings.createdAt} DESC`).limit(5)
      ])

      const revenueTotal = totalRevenueResult[0]?.total
      const totalRevenue = typeof revenueTotal === 'string' ? parseInt(revenueTotal) : (revenueTotal || 0)

      return {
        totalBookings: totalBookingsResult[0]?.count || 0,
        pendingBookings: pendingBookingsResult[0]?.count || 0,
        confirmedBookings: confirmedBookingsResult[0]?.count || 0,
        completedBookings: completedBookingsResult[0]?.count || 0,
        totalRevenue,
        availableVehicles: availableVehiclesResult[0]?.count || 0,
        recentBookings: recentBookingsResult as DashboardBooking[]
      }
    } catch (fallbackError) {
      console.error('❌ Dashboard - Fallback also failed:', fallbackError)
      return {
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        availableVehicles: 0,
        recentBookings: []
      }
    }
  }
}

export default async function AdminDashboard() {
  const dashboardData = await getDashboardData()

  console.log('📊 Dashboard - Rendering with data:', {
    totalBookings: dashboardData.totalBookings,
    recentBookings: dashboardData.recentBookings.length
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <DashboardStats data={dashboardData} />
      <RecentBookings bookings={dashboardData.recentBookings} />
    </div>
  )
}