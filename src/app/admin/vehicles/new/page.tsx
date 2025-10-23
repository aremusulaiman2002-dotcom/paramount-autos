'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewVehiclePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>(['AC', 'Bluetooth'])
  const [newFeature, setNewFeature] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // FIX: Ensure availability is always true for new vehicles
    const availability = formData.get('availability') === 'on'
    
    const vehicleData = {
      name: formData.get('name'),
      type: formData.get('type'),
      pricePerDay: parseInt(formData.get('pricePerDay') as string),
      description: formData.get('description'),
      image: formData.get('image') || null,
      availability: true, // FIX: Always set to true for new vehicles
      features: JSON.stringify(features), // This is correct - it should be a JSON string
    }

    console.log('🆕 Creating vehicle with data:', vehicleData) // Debug log

    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()
      console.log('✅ Vehicle creation response:', result) // Debug log

      if (response.ok) {
        router.push('/admin/vehicles')
        router.refresh()
      } else {
        alert(result.error || 'Failed to create vehicle')
      }
    } catch (error) {
      console.error('Error creating vehicle:', error)
      alert('Error creating vehicle')
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="text-gray-600 mt-1">Add a new vehicle to your fleet</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>
            Enter the details for your new vehicle
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
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder="e.g., SUV, Sedan, Bus"
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
                    required
                  />
                </div>
                
                {/* FIX: Remove the availability switch since it's always true for new vehicles */}
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <Label className="text-base text-green-800">Available for Booking</Label>
                      <p className="text-sm text-green-600">New vehicles are automatically available to customers</p>
                    </div>
                  </div>
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
                {isLoading ? 'Creating Vehicle...' : 'Create Vehicle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}