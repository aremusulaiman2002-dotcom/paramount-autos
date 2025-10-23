import DashboardStats from '@/components/admin/dashboard-stats'
import RecentBookings from '@/components/admin/recent-bookings'
import { db } from '@/lib/db'
import { bookings, vehicles } from '@/lib/schema'
import { count, sql } from 'drizzle-orm'

// Define proper types that match your Drizzle schema AND component expectations
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

// Helper function to safely cast status to the expected enum type
function parseBookingStatus(status: string | null): 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null {
  if (!status) return null
  
  const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
  return validStatuses.includes(status) ? status as any : null
}

function parsePaymentStatus(status: string | null): 'PENDING' | 'VERIFIED' | 'FAILED' | null {
  if (!status) return null
  
  const validStatuses = ['PENDING', 'VERIFIED', 'FAILED']
  return validStatuses.includes(status) ? status as any : null
}

async function getDashboardData(): Promise<DashboardData> {
  try {
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
      db.select({ total: sql<number>`sum(${bookings.totalAmount})` })
        .from(bookings)
        .where(sql`${bookings.status} IN ('CONFIRMED', 'COMPLETED')`),
      db.select({ count: count() }).from(vehicles).where(sql`${vehicles.availability} = true`),
      db.select({
        id: bookings.id,
        refNumber: bookings.refNumber,
        customerName: bookings.customerName,
        phone: bookings.phone,
        email: bookings.email,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        createdAt: bookings.createdAt,
        vehicles: bookings.vehicles,
        securityPersonnel: bookings.securityPersonnel
      })
      .from(bookings)
      .orderBy(sql`${bookings.createdAt} DESC`)
      .limit(5)
    ])

    // Convert string total to number
    const revenueTotal = totalRevenueResult[0]?.total
    const totalRevenue = typeof revenueTotal === 'string' ? parseInt(revenueTotal) : (revenueTotal || 0)

    // Parse the recent bookings to ensure proper typing
    const parsedRecentBookings: DashboardBooking[] = recentBookingsResult.map(booking => ({
      ...booking,
      status: parseBookingStatus(booking.status),
      paymentStatus: parsePaymentStatus(booking.paymentStatus)
    }))

    return {
      totalBookings: totalBookingsResult[0]?.count || 0,
      pendingBookings: pendingBookingsResult[0]?.count || 0,
      confirmedBookings: confirmedBookingsResult[0]?.count || 0,
      completedBookings: completedBookingsResult[0]?.count || 0,
      totalRevenue,
      availableVehicles: availableVehiclesResult[0]?.count || 0,
      recentBookings: parsedRecentBookings
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
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

export default async function AdminDashboard() {
  const dashboardData = await getDashboardData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-600">
          Welcome to Paramount Autos Admin
        </div>
      </div>

      <DashboardStats data={dashboardData} />
      <RecentBookings bookings={dashboardData.recentBookings} />
    </div>
  )
}