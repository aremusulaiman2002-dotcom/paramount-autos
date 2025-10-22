'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Car, 
  Shield, 
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Fuel,
  Cog,
  Wifi,
  Snowflake,
  Navigation,
  Music
} from 'lucide-react'

// Interfaces based on actual Prisma response
interface VehicleDetail {
  id: string
  name: string
  type: string
  category?: string
  quantity: number
  pricePerDay: number
  days: number
  subtotal: number
  image?: string
  features?: string[]
  capacity?: string
  transmission?: 'MANUAL' | 'AUTOMATIC'
  fuelType?: string
  insuranceIncluded?: boolean
  driverIncluded?: boolean
  mileage?: string
}

interface SecurityDetail {
  id: string
  count: number
  pricePerPerson: number
  days: number
  subtotal: number
  shiftType?: 'DAY' | 'NIGHT' | '24_HOURS'
  equipment?: string[]
  qualifications?: string[]
  notes?: string
  supervisorIncluded?: boolean
  armed?: boolean
}

interface Booking {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email?: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED'
  createdAt: string
  startDate: string
  endDate: string
  pickupLocation: string
  dropoffLocation: string
  vehicles: any[] // Could be JSON string or array
  securityPersonnel?: any // Could be JSON string or object
  notes?: string
}

interface ApiResponse {
  success?: boolean
  data?: Booking
  error?: string
}

export default function BookingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/bookings/${id}`)
        
        if (response.ok) {
          const result = await response.json()
          
          // Handle both response formats
          if (result.success && result.data) {
            // If API returns { success: true, data: booking }
            setBooking(result.data)
          } else if (result.id) {
            // If API returns booking directly
            setBooking(result)
          } else {
            console.error('Unexpected API response format:', result)
          }
        } else {
          console.error('Failed to fetch booking:', response.status)
        }
      } catch (error) {
        console.error('Error fetching booking:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [params])

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  // Parse vehicles and security data safely
  const parseBookingData = () => {
    if (!booking) return { vehicles: [], securityPersonnel: null, totalVehicles: 0, securityCount: 0 }
    
    try {
      // Parse vehicles - handle both string and array formats
      let vehicles: VehicleDetail[] = []
      if (typeof booking.vehicles === 'string') {
        vehicles = JSON.parse(booking.vehicles)
      } else if (Array.isArray(booking.vehicles)) {
        vehicles = booking.vehicles
      }

      // Parse security personnel - handle both string and object formats
      let securityPersonnel: SecurityDetail | null = null
      if (booking.securityPersonnel) {
        if (typeof booking.securityPersonnel === 'string') {
          securityPersonnel = JSON.parse(booking.securityPersonnel)
        } else {
          securityPersonnel = booking.securityPersonnel
        }
      }
      
      return {
        vehicles: Array.isArray(vehicles) ? vehicles : [],
        securityPersonnel,
        totalVehicles: vehicles.reduce((sum: number, vehicle: VehicleDetail) => sum + (vehicle.quantity || 0), 0),
        securityCount: securityPersonnel?.count || 0
      }
    } catch (error) {
      console.error('Error parsing booking data:', error)
      return {
        vehicles: [],
        securityPersonnel: null,
        totalVehicles: 0,
        securityCount: 0
      }
    }
  }

  const { vehicles, securityPersonnel, totalVehicles, securityCount } = parseBookingData()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const handleStatusUpdate = async (newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    if (!booking) return
    
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Handle both response formats
        if (result.id) {
          setBooking(result)
        } else if (result.success && result.data) {
          setBooking(result.data)
        } else {
          setBooking(prev => prev ? { ...prev, status: newStatus } : null)
        }
        
        alert(`Booking ${newStatus.toLowerCase()} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Error updating booking status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getFeatureIcon = (feature: string) => {
    const featureIcons: { [key: string]: JSX.Element } = {
      'air conditioning': <Snowflake className="w-3 h-3" />,
      'navigation': <Navigation className="w-3 h-3" />,
      'bluetooth': <Music className="w-3 h-3" />,
      'wifi': <Wifi className="w-3 h-3" />,
    }
    return featureIcons[feature.toLowerCase()] || <CheckCircle className="w-3 h-3" />
  }

  const VehicleCard = ({ vehicle, index }: { vehicle: VehicleDetail; index: number }) => (
    <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-lg">{vehicle.name || `Vehicle ${index + 1}`}</p>
                <Badge variant="outline" className="text-xs capitalize">
                  {vehicle.type || 'Standard'}
                </Badge>
                {vehicle.category && (
                  <Badge variant="secondary" className="text-xs">
                    {vehicle.category}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                {vehicle.capacity && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{vehicle.capacity}</span>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="flex items-center space-x-1">
                    <Cog className="w-3 h-3" />
                    <span className="capitalize">{vehicle.transmission.toLowerCase()}</span>
                  </div>
                )}
                {vehicle.fuelType && (
                  <div className="flex items-center space-x-1">
                    <Fuel className="w-3 h-3" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{vehicle.days || 1} day{(vehicle.days || 1) !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 4).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs flex items-center space-x-1">
                        {getFeatureIcon(feature)}
                        <span>{feature}</span>
                      </Badge>
                    ))}
                    {vehicle.features.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{vehicle.features.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 text-xs">
                {vehicle.insuranceIncluded && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Insurance Included</span>
                  </div>
                )}
                {vehicle.driverIncluded && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <User className="w-3 h-3" />
                    <span>Driver Included</span>
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="flex items-center space-x-1 text-purple-600">
                    <span>📊</span>
                    <span>{vehicle.mileage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right min-w-[120px]">
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              {formatPrice(vehicle.pricePerDay || 0)}/day
            </p>
            <p className="text-xs text-gray-500">
              {vehicle.quantity || 1} × {vehicle.days || 1} days
            </p>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {formatPrice(vehicle.subtotal || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Vehicle total
          </p>
        </div>
      </div>
    </div>
  )

  const SecurityCard = ({ security }: { security: SecurityDetail }) => (
    <div className="p-4 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <p className="font-semibold text-lg">Security Team</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {security.count} Personnel
                </Badge>
                {security.shiftType && (
                  <Badge variant="outline" className="capitalize">
                    {security.shiftType.toLowerCase().replace('_', ' ')}
                  </Badge>
                )}
                {security.armed && (
                  <Badge variant="destructive" className="text-xs">
                    Armed
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{security.count} personnel</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{security.days} day{security.days !== 1 ? 's' : ''}</span>
                </div>
                {security.shiftType && (
                  <div className="flex items-center space-x-1">
                    <span>🕒</span>
                    <span className="capitalize">
                      {security.shiftType.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {security.equipment && security.equipment.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {security.equipment.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-white">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {security.qualifications && security.qualifications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Qualifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {security.qualifications.map((qual, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mt-2 text-xs">
                {security.supervisorIncluded && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <User className="w-3 h-3" />
                    <span>Supervisor Included</span>
                  </div>
                )}
                {security.armed && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <Shield className="w-3 h-3" />
                    <span>Armed Personnel</span>
                  </div>
                )}
              </div>

              {security.notes && (
                <div className="mt-2 p-2 bg-yellow-50 rounded border">
                  <p className="text-xs text-yellow-800 flex items-start space-x-1">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{security.notes}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right min-w-[120px]">
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              {formatPrice(security.pricePerPerson)}/person
            </p>
            <p className="text-xs text-gray-500">
              {security.count} × {security.days} days
            </p>
          </div>
          <p className="text-lg font-bold text-blue-600">
            {formatPrice(security.subtotal)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Security total
          </p>
        </div>
      </div>
    </div>
  )

  const ServiceSummary = () => {
    const totalVehicles = vehicles.reduce((sum, vehicle) => sum + (vehicle.quantity || 1), 0)
    const totalSecurityPersonnel = securityPersonnel?.count || 0
    const vehicleTotal = vehicles.reduce((sum, vehicle) => sum + (vehicle.subtotal || 0), 0)
    const securityTotal = securityPersonnel?.subtotal || 0
    const differentVehicleTypes = vehicles.length

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-xl font-bold">{totalVehicles}</p>
                <p className="text-xs text-gray-500">{differentVehicleTypes} type(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {securityCount > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Team</p>
                  <p className="text-xl font-bold">{totalSecurityPersonnel}</p>
                  <p className="text-xs text-gray-500">Personnel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-xl font-bold">{calculateDays(booking!.startDate, booking!.endDate)}</p>
                <p className="text-xs text-gray-500">day{calculateDays(booking!.startDate, booking!.endDate) !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-xl font-bold">{formatPrice(booking!.totalAmount)}</p>
                <p className="text-xs text-gray-500">Final amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getActionButtons = () => {
    if (!booking) return null

    switch (booking.status) {
      case 'PENDING':
        return (
          <>
            <Button 
              onClick={() => handleStatusUpdate('CONFIRMED')}
              disabled={isUpdating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? 'Confirming...' : 'Confirm Booking'}
            </Button>
            <Button 
              onClick={() => handleStatusUpdate('CANCELLED')}
              disabled={isUpdating}
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700"
            >
              {isUpdating ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </>
        )
      case 'CONFIRMED':
        return (
          <>
            <Button 
              onClick={() => handleStatusUpdate('COMPLETED')}
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Completing...' : 'Mark as Completed'}
            </Button>
            <Button 
              onClick={() => handleStatusUpdate('CANCELLED')}
              disabled={isUpdating}
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700"
            >
              {isUpdating ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </>
        )
      case 'COMPLETED':
        return (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Badge className="bg-green-100 text-green-800 mb-2">Completed</Badge>
            <p className="text-sm text-green-700">This booking has been completed successfully.</p>
          </div>
        )
      case 'CANCELLED':
        return (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Badge className="bg-red-100 text-red-800 mb-2">Cancelled</Badge>
            <p className="text-sm text-red-700">This booking has been cancelled.</p>
          </div>
        )
      default:
        return null
    }
  }

  const calculateDays = (startDate: string, endDate: string): number => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    } catch {
      return 1
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bookings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-lg">Loading booking details...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bookings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
            <Link href="/admin/bookings">
              <Button>Back to Bookings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalDays = calculateDays(booking.startDate, booking.endDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bookings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 mt-1">Reference: {booking.refNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.toLowerCase()}
          </Badge>
          <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
            {booking.paymentStatus.toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg font-semibold">{booking.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-lg font-semibold flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{booking.phone}</span>
                  </p>
                </div>
                {booking.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-semibold flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{booking.email}</span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Trip Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Pickup Location</label>
                  <p className="text-lg font-semibold">{booking.pickupLocation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Dropoff Location</label>
                  <p className="text-lg font-semibold">{booking.dropoffLocation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date & Time</label>
                  <p className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDisplayDate(booking.startDate)}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date & Time</label>
                  <p className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDisplayDate(booking.endDate)}</span>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-lg font-semibold">
                    {totalDays} day{totalDays !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Vehicles & Security Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Services Summary</span>
              </CardTitle>
              <CardDescription>
                Detailed breakdown of all vehicles and security personnel for this booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceSummary />
              
              <div className="space-y-6">
                {/* Vehicles Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg flex items-center space-x-2">
                      <Car className="w-5 h-5" />
                      <span>Vehicles ({vehicles.reduce((sum, v) => sum + (v.quantity || 1), 0)})</span>
                    </h4>
                    <Badge variant="outline">
                      {vehicles.length} type{vehicles.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {vehicles.length > 0 ? (
                      vehicles.map((vehicle, index) => (
                        <VehicleCard key={`${vehicle.id || index}-${index}`} vehicle={vehicle} index={index} />
                      ))
                    ) : (
                      <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No vehicles booked</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Security Personnel Section */}
                {securityCount > 0 && securityPersonnel && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Security Personnel</span>
                      </h4>
                      <Badge variant="outline" className="bg-blue-50">
                        {securityPersonnel.count} personnel
                      </Badge>
                    </div>
                    
                    <SecurityCard security={securityPersonnel} />
                  </section>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">{booking.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Costs */}
              {vehicles.map((vehicle, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{vehicle.quantity || 1}x {vehicle.name || `Vehicle ${index + 1}`}:</span>
                  <span>{formatPrice(vehicle.subtotal || 0)}</span>
                </div>
              ))}
              
              {/* Security Cost */}
              {securityCount > 0 && securityPersonnel && (
                <div className="flex justify-between text-sm">
                  <span>Security ({securityPersonnel.count} personnel):</span>
                  <span>{formatPrice(securityPersonnel.subtotal)}</span>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">{formatPrice(booking.totalAmount)}</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2 text-sm text-gray-600 border-t">
                <div className="flex justify-between">
                  <span>Booking Date:</span>
                  <span>{formatDisplayDate(booking.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{booking.refNumber}</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getActionButtons()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}