import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDisplayDate } from '@/lib/utils'
import { Eye, Filter, Download } from 'lucide-react'
import { db } from '@/lib/db'
import { bookings } from '@/lib/schema'
import { desc } from 'drizzle-orm'

interface Booking {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email: string | null // Updated to match Drizzle
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null // Added null
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | null // Added null
  createdAt: Date | null // Added null
  pickupLocation: string
  dropoffLocation: string
  vehicles: string
  securityPersonnel: string | null // Updated to match Drizzle
}

async function getBookings(): Promise<Booking[]> {
  try {
    const allBookings = await db
      .select({
        id: bookings.id,
        refNumber: bookings.refNumber,
        customerName: bookings.customerName,
        phone: bookings.phone,
        email: bookings.email,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        createdAt: bookings.createdAt,
        pickupLocation: bookings.pickupLocation,
        dropoffLocation: bookings.dropoffLocation,
        vehicles: bookings.vehicles,
        securityPersonnel: bookings.securityPersonnel
      })
      .from(bookings)
      .orderBy(desc(bookings.createdAt))

    return allBookings as Booking[]
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  const getStatusColor = (status: string | null) => { // Allow null
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const getPaymentStatusColor = (status: string | null) => { // Allow null
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const parseBookingData = (booking: Booking) => {
    try {
      const vehicles = JSON.parse(booking.vehicles)
      const securityPersonnel = booking.securityPersonnel ? JSON.parse(booking.securityPersonnel) : null
      
      const totalVehicles = Array.isArray(vehicles) 
        ? vehicles.reduce((sum: number, vehicle: any) => sum + (vehicle.quantity || 0), 0)
        : 0

      const securityCount = securityPersonnel?.count || 0

      return {
        totalVehicles,
        securityCount,
        vehicleNames: Array.isArray(vehicles) ? vehicles.map((v: any) => v.name).join(', ') : ''
      }
    } catch (error) {
      return {
        totalVehicles: 0,
        securityCount: 0,
        vehicleNames: ''
      }
    }
  }

  // Count bookings by status
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b: Booking) => b.status === 'PENDING').length
  const confirmedBookings = bookings.filter((b: Booking) => b.status === 'CONFIRMED').length
  const completedBookings = bookings.filter((b: Booking) => b.status === 'COMPLETED').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1">Manage all customer bookings and reservations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{pendingBookings}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{completedBookings}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Recent customer bookings and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings found</p>
              <p className="text-sm mt-1">Customer bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: Booking) => {
                const { totalVehicles, securityCount } = parseBookingData(booking)
                
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {booking.customerName}
                          </h3>
                          <p className="text-sm text-gray-600">{booking.phone}</p>
                          {booking.email && (
                            <p className="text-sm text-gray-500">{booking.email}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status?.toLowerCase() || 'unknown'}
                          </Badge>
                          <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                            {booking.paymentStatus?.toLowerCase() || 'unknown'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Reference:</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                            {booking.refNumber}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Vehicles:</span>
                          <span className="ml-2">
                            {totalVehicles} vehicle{totalVehicles !== 1 ? 's' : ''}
                            {securityCount > 0 && ` + ${securityCount} security`}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Booked:</span>
                          <span className="ml-2">
                            {booking.createdAt ? formatDisplayDate(booking.createdAt) : 'Unknown date'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Route:</span>
                          <span className="ml-2">
                            {booking.pickupLocation} → {booking.dropoffLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {formatPrice(booking.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      
                      <Link href={`/admin/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}