// src/app/admin/bookings/bookings-content.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDisplayDate } from '@/lib/utils'
import { Eye, Filter, Download, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Booking {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email: string | null
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | null
  createdAt: Date | null
  pickupLocation: string
  dropoffLocation: string
  vehicles: string
  securityPersonnel: string | null
}

export default function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchBookings = async () => {
    try {
      console.log('🔄 Fetching bookings...')
      const response = await fetch('/api/admin/bookings?t=' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      console.log('✅ Bookings fetched:', data.length)
      setBookings(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('❌ Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchBookings()
  }, [])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings()
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const getPaymentStatusColor = (status: string | null) => {
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
      
      let totalVehicles = 0
      let vehicleNames = ''

      if (vehicles && vehicles.vehicleIds && Array.isArray(vehicles.vehicleIds)) {
        totalVehicles = vehicles.vehicleIds.length
        vehicleNames = `${vehicles.vehicleIds.length} vehicle${vehicles.vehicleIds.length !== 1 ? 's' : ''}`
      } else if (Array.isArray(vehicles)) {
        totalVehicles = vehicles.reduce((sum: number, vehicle: any) => sum + (vehicle.quantity || 1), 0)
        vehicleNames = vehicles.map((v: any) => v.name || 'Vehicle').join(', ')
      } else {
        vehicleNames = 'No vehicles'
      }

      const securityCount = securityPersonnel?.count || 0

      return {
        totalVehicles,
        securityCount,
        vehicleNames
      }
    } catch (error) {
      console.error('Error parsing booking data:', error)
      return {
        totalVehicles: 0,
        securityCount: 0,
        vehicleNames: 'Error parsing vehicles'
      }
    }
  }

  // Count bookings by status
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b: Booking) => b.status === 'PENDING').length
  const confirmedBookings = bookings.filter((b: Booking) => b.status === 'CONFIRMED').length
  const completedBookings = bookings.filter((b: Booking) => b.status === 'COMPLETED').length
  const cancelledBookings = bookings.filter((b: Booking) => b.status === 'CANCELLED').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1">
            Auto-refreshing • Total: {totalBookings} • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={fetchBookings} 
            variant="outline" 
            className="flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <div className="text-sm text-gray-600">Total</div>
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
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{cancelledBookings}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({totalBookings})</CardTitle>
          <CardDescription>
            Real-time updates • Auto-refreshes every 10 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings found</p>
              <p className="text-sm mt-1">Customer bookings will appear here automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: Booking) => {
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