import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Plus, Car, Edit, Trash2, Eye } from 'lucide-react'
import { prisma } from '@/lib/db'

interface Vehicle {
  id: string
  name: string
  type: string
  pricePerDay: number
  availability: boolean
  image?: string
  description: string
  features: string
  createdAt: Date
  updatedAt: Date
}

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return vehicles as Vehicle[]
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  const parseFeatures = (featuresString: string): string[] => {
    try {
      return JSON.parse(featuresString)
    } catch {
      return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600 mt-1">Manage your fleet of premium vehicles</p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{vehicles.length}</div>
                <div className="text-sm text-gray-600">Total Vehicles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.availability).length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => !v.availability).length}
                </div>
                <div className="text-sm text-gray-600">Unavailable</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>
            All vehicles in your Paramount Autos fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles yet</h3>
              <p className="text-gray-600 mb-6">Add your first vehicle to get started</p>
              <Link href="/admin/vehicles/new">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Vehicle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => {
                const features = parseFeatures(vehicle.features)
                
                return (
                  <div
                    key={vehicle.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Vehicle Image */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 h-48">
                      {vehicle.image ? (
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Car className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {vehicle.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
                        </div>
                        <Badge 
                          className={vehicle.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        >
                          {vehicle.availability ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {vehicle.description}
                      </p>

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                            {features.length > 3 && (
                              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                +{features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {formatPrice(vehicle.pricePerDay)}
                          </div>
                          <div className="text-xs text-gray-500">per day</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/vehicles/${vehicle.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
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