'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface Vehicle {
  id: string
  name: string
  type: string
  pricePerDay: number
  description: string
  image: string
  availability: boolean
  features: string[]
}

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`)
        if (response.ok) {
          const vehicleData = await response.json()
          setVehicle(vehicleData)
          // Parse features from JSON string if needed
          setFeatures(Array.isArray(vehicleData.features) ? vehicleData.features : [])
        } else {
          alert('Failed to fetch vehicle data')
          router.push('/admin/vehicles')
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        alert('Error fetching vehicle data')
      } finally {
        setIsLoadingVehicle(false)
      }
    }

    fetchVehicle()
  }, [vehicleId, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const vehicleData = {
      name: formData.get('name'),
      type: formData.get('type'),
      pricePerDay: parseInt(formData.get('pricePerDay') as string),
      description: formData.get('description'),
      image: formData.get('image'),
      availability: formData.get('availability') === 'on',
      features: features,
    }

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      if (response.ok) {
        router.push('/admin/vehicles')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update vehicle')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Error updating vehicle')
    } finally {
      setIsLoading(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove))
  }

  if (isLoadingVehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading vehicle data...</div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Vehicle not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/vehicles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
          <p className="text-gray-600 mt-1">Update vehicle details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>
            Update the details for {vehicle.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Vehicle Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Toyota Hilux"
                    defaultValue={vehicle.name}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder="e.g., SUV, Sedan, Bus"
                    defaultValue={vehicle.type}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pricePerDay">Price Per Day (₦) *</Label>
                  <Input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    placeholder="50000"
                    min="0"
                    defaultValue={vehicle.pricePerDay}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/vehicle.jpg"
                    defaultValue={vehicle.image || ''}
                  />
                </div>
              </div>

              {/* Features & Availability */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the vehicle features and comfort..."
                    rows={4}
                    defaultValue={vehicle.description}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="availability" className="text-base">Available for Booking</Label>
                    <p className="text-sm text-gray-600">Make this vehicle available to customers</p>
                  </div>
                  <Switch 
                    id="availability" 
                    name="availability" 
                    defaultChecked={vehicle.availability}
                  />
                </div>
              </div>
            </div>

            {/* Features Management */}
            <div>
              <Label>Features</Label>
              <div className="space-y-3 mt-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a feature (e.g., Sunroof)"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} className="flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/admin/vehicles">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
                {isLoading ? 'Updating Vehicle...' : 'Update Vehicle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}