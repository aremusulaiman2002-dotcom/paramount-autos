import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '../../components/ui/badge'
import { formatPrice, formatDisplayDate } from '@/lib/utils'
import { Calendar, ArrowRight, Eye } from 'lucide-react'

interface Booking {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email: string | null // Updated to match Drizzle schema
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null // Added null
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | null // Added null
  createdAt: Date | null // Added null
  vehicles: string
  securityPersonnel: string | null // Updated to match Drizzle schema
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  const getStatusColor = (status: string | null) => { // Allow null
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-orange-100 text-orange-800'
    }
  }

  const getPaymentStatusColor = (status: string | null) => { // Allow null
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-orange-100 text-orange-800'
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Calendar className="w-5 h-5 mr-2 text-orange-500" />
              Recent Bookings
            </CardTitle>
            <CardDescription>
              Latest booking requests from customers
            </CardDescription>
          </div>
          <Link href="/admin/bookings">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>No bookings yet</p>
            <p className="text-sm">Customer bookings will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const { totalVehicles, securityCount, vehicleNames } = parseBookingData(booking)
              
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                    </div>

                    {vehicleNames && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 truncate">
                          {vehicleNames}
                        </p>
                      </div>
                    )}
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
  )
}