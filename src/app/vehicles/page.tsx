'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Grid, List, Car, Users, Fuel, Calendar, Loader } from 'lucide-react'
import Link from 'next/link'

interface Vehicle {
  id: string
  name: string
  type: 'SUV' | 'SEDAN' | 'LUXURY' | 'BUS' | 'SECURITY'
  pricePerDay: number
  image: string
  features: string[]
  capacity: number
  availability: boolean
  description: string
  specifications: {
    transmission: string
    fuel: string
    year: number
    color: string
  }
}

const vehicleTypes = ['ALL', 'SUV', 'SEDAN', 'LUXURY', 'BUS', 'SECURITY']
const priceRanges = [
  { label: 'Any', min: 0, max: 1000000 },
  { label: '₦20k - ₦50k', min: 20000, max: 50000 },
  { label: '₦50k - ₦75k', min: 50000, max: 75000 },
  { label: '₦75k+', min: 75000, max: 1000000 }
]

// Vehicle Card Component
function VehicleCard({ vehicle, view }: { vehicle: Vehicle; view: 'grid' | 'list' }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUV': return 'bg-blue-100 text-blue-800'
      case 'SEDAN': return 'bg-green-100 text-green-800'
      case 'LUXURY': return 'bg-purple-100 text-purple-800'
      case 'BUS': return 'bg-orange-100 text-orange-800'
      case 'SECURITY': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (view === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={vehicle.image || '/placeholder-vehicle.jpg'}
                alt={vehicle.name}
                className="w-64 h-48 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <Badge className={vehicle.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {vehicle.availability ? 'Available' : 'Booked'}
                    </Badge>
                  </div>
                  <Badge className={getTypeColor(vehicle.type)}>
                    {vehicle.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">₦{vehicle.pricePerDay.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">per day</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{vehicle.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {vehicle.features && vehicle.features.slice(0, 4).map((feature, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {feature}
                  </span>
                ))}
                {vehicle.features && vehicle.features.length > 4 && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    +{vehicle.features.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{vehicle.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    <span>{vehicle.specifications?.fuel || 'Petrol'}</span>
                  </div>
                  <div>{vehicle.specifications?.transmission || 'Automatic'}</div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/vehicles/${vehicle.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/booking?vehicle=${vehicle.id}`}>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700" disabled={!vehicle.availability}>
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid View
  return (
    <Card className="hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={vehicle.image || '/placeholder-vehicle.jpg'}
            alt={vehicle.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={vehicle.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {vehicle.availability ? 'Available' : 'Booked'}
            </Badge>
            <Badge className={getTypeColor(vehicle.type)}>
              {vehicle.type}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{vehicle.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{vehicle.description}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-orange-600">₦{vehicle.pricePerDay.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">per day</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {vehicle.features && vehicle.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
            {vehicle.features && vehicle.features.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{vehicle.features.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{vehicle.capacity} seats</span>
            </div>
            <div>{vehicle.specifications?.transmission || 'Automatic'}</div>
          </div>

          <div className="flex gap-2">
            <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={`/booking?vehicle=${vehicle.id}`} className="flex-1">
              <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" disabled={!vehicle.availability}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/vehicles')
        const result = await response.json()

        if (result.success) {
          setVehicles(result.data)
          setFilteredVehicles(result.data)
        } else {
          setError(result.error || 'Failed to fetch vehicles')
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        setError('Failed to load vehicles. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Filter vehicles based on search and filters
  useEffect(() => {
    let filtered = vehicles

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(vehicle => vehicle.type === selectedType)
    }

    // Price filter - FIXED: Check if selectedPriceRange exists
    if (selectedPriceRange) {
      filtered = filtered.filter(vehicle =>
        vehicle.pricePerDay >= selectedPriceRange.min &&
        vehicle.pricePerDay <= selectedPriceRange.max
      )
    }

    setFilteredVehicles(filtered)
  }, [searchTerm, selectedType, selectedPriceRange, vehicles])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Vehicles...</h2>
          <p className="text-gray-600">Fetching our premium fleet</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Vehicles</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Premium Fleet</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our collection of luxury vehicles for every occasion
          </p>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search vehicles by name or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Vehicle Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange?.label || ''}
                  onChange={(e) => {
                    const range = priceRanges.find(r => r.label === e.target.value)
                    if (range) setSelectedPriceRange(range)
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {priceRanges.map(range => (
                    <option key={range.label} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Available Now</option>
                  <option>All Vehicles</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedType('ALL')
                    setSelectedPriceRange(priceRanges[0])
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Type Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {vehicleTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <p className="text-gray-600">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>
      </section>

      {/* Vehicles Grid/List */}
      <section className="container mx-auto px-4 py-8">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} view="list" />
            ))}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Car, title: 'Premium Maintenance', desc: 'Regularly serviced and inspected' },
              { icon: Users, title: '24/7 Support', desc: 'Round-the-clock assistance' },
              { icon: Fuel, title: 'Full Insurance', desc: 'Comprehensive coverage included' },
              { icon: Calendar, title: 'Flexible Booking', desc: 'Easy reservation system' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Can't Find What You Need?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-orange-100">
            Contact us for custom vehicle solutions and special requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}