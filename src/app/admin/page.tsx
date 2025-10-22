import DashboardStats from '@/components/admin/dashboard-stats'
import RecentBookings from '@/components/admin/recent-bookings'
import { prisma } from '@/lib/db'

async function getDashboardData() {
  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue,
      availableVehicles,
      recentBookings
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
      }),
      prisma.vehicle.count({ where: { availability: true } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          refNumber: true,
          customerName: true,
          phone: true,
          email: true,
          totalAmount: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          vehicles: true,
          securityPersonnel: true
        }
      })
    ])

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      availableVehicles,
      recentBookings
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Return mock data if database fails
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