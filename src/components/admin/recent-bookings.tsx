// src/components/admin/recent-bookings.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '../../components/ui/badge'
import { formatPrice, formatDisplayDate, debugBooking, safeNumber } from '@/lib/utils'
import { Calendar, ArrowRight, Eye, Car, MapPin, DollarSign, User, Phone } from 'lucide-react'

// Updated interface to match actual API response
interface Booking {
  id: string
  ref_number?: string // API returns ref_number
  refNumber?: string // Some might use refNumber
  customer_name?: string // API returns customer_name
  customerName?: string // Some might use customerName
  phone: string
  email: string | null
  total_amount?: number // API returns total_amount
  totalAmount?: number // Some might use totalAmount
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null
  payment_status?: string // API returns payment_status
  paymentStatus?: string // Some might use paymentStatus
  created_at?: string | Date // API returns created_at
  createdAt?: string | Date // Some might use createdAt
  pickup_location?: string // API returns pickup_location
  pickupLocation?: string // Some might use pickupLocation
  dropoff_location?: string // API returns dropoff_location
  dropoffLocation?: string // Some might use dropoffLocation
  vehicles: any
  security_personnel?: any // API returns security_personnel
  securityPersonnel?: any // Some might use securityPersonnel
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200'
    }
  }

  // Helper function to get field values safely
  const getBookingField = (booking: Booking) => {
    return {
      refNumber: booking.ref_number || booking.refNumber || 'No Ref',
      customerName: booking.customer_name || booking.customerName || 'No Name',
      phone: booking.phone || 'No Phone',
      email: booking.email,
      totalAmount: safeNumber(booking.total_amount || booking.totalAmount),
      status: booking.status,
      paymentStatus: booking.payment_status || booking.paymentStatus,
      createdAt: booking.created_at || booking.createdAt,
      pickupLocation: booking.pickup_location || booking.pickupLocation || 'No pickup',
      dropoffLocation: booking.dropoff_location || booking.dropoffLocation || 'No dropoff',
      vehicles: booking.vehicles,
      securityPersonnel: booking.security_personnel || booking.securityPersonnel
    }
  }

  const parseBookingData = (booking: Booking) => {
    const fields = getBookingField(booking)
    
    console.log('🔧 DEBUG - Normalized booking data:', fields)

    let vehiclesData = fields.vehicles
    let totalVehicles = 0
    let rentalDays = 1

    // Handle different data structures
    if (typeof vehiclesData === 'string') {
      try {
        vehiclesData = JSON.parse(vehiclesData)
      } catch (e) {
        console.error('Failed to parse vehicles string:', e)
      }
    }

    if (vehiclesData) {
      if (vehiclesData.vehicleIds && Array.isArray(vehiclesData.vehicleIds)) {
        totalVehicles = vehiclesData.vehicleIds.length
        rentalDays = vehiclesData.rentalDays || 1
      } else if (Array.isArray(vehiclesData)) {
        totalVehicles = vehiclesData.length
        rentalDays = vehiclesData[0]?.days || vehiclesData[0]?.rentalDays || 1
      }
    }

    // Ensure at least 1 vehicle
    totalVehicles = Math.max(1, totalVehicles)

    // Handle security personnel
    let securityData = fields.securityPersonnel
    if (typeof securityData === 'string') {
      try {
        securityData = JSON.parse(securityData)
      } catch (e) {
        console.error('Failed to parse security string:', e)
      }
    }

    const securityCount = securityData?.count || 0

    return {
      totalVehicles,
      rentalDays,
      securityCount,
      ...fields
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
              const { 
                totalVehicles, 
                rentalDays, 
                securityCount,
                refNumber,
                customerName,
                phone,
                totalAmount,
                createdAt,
                pickupLocation,
                dropoffLocation,
                status
              } = parseBookingData(booking)
              
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    {/* Customer Info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {customerName}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-blue-500" />
                        <span>
                          <strong>{totalVehicles}</strong> vehicle{totalVehicles !== 1 ? 's' : ''}
                          {rentalDays > 1 && ` for ${rentalDays} days`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>
                          {pickupLocation} → {dropoffLocation}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>
                             {formatDisplayDate(createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Status & Reference */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(status)}>
                          {status?.toLowerCase() || 'unknown'}
                        </Badge>
                        {securityCount > 0 && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            +{securityCount} security
                          </Badge>
                        )}
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {refNumber}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-4">
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