'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, Users, Fuel, Calendar, MapPin, Shield, Star } from 'lucide-react'
import Link from 'next/link'

// This would normally fetch from your API
const mockVehicle = {
  id: '1',
  name: 'Toyota Land Cruiser 2023',
  type: 'SUV',
  pricePerDay: 75000,
  images: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ],
  features: ['AC', 'Bluetooth', 'Sunroof', '4x4', 'Leather Seats', 'Navigation', 'Premium Sound', 'Third Row Seating'],
  capacity: 7,
  availability: true,
  description: 'The Toyota Land Cruiser 2023 is a premium SUV that combines exceptional comfort with off-road capabilities. Perfect for family trips, corporate events, and adventurous journeys.',
  specifications: {
    transmission: 'Automatic',
    fuel: 'Diesel',
    year: 2023,
    color: 'White',
    engine: '3.3L V6 Turbo Diesel',
    drive: '4WD',
    mileage: '15,000 km'
  }
}

export default function VehicleDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const vehicle = mockVehicle // In real app, fetch by params.id

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{vehicle.name}</h1>
              <div className="flex items-center gap-4">
                <Badge className={vehicle.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {vehicle.availability ? 'Available' : 'Booked'}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">{vehicle.type}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-500">₦{vehicle.pricePerDay.toLocaleString()}</div>
              <div className="text-gray-300">per day</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img
                src={vehicle.images[selectedImage]}
                alt={vehicle.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${vehicle.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Info & Booking */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Quick Book</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                    <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                    <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                    <option>Kano</option>
                  </select>
                </div>

                <Link href={`/booking?vehicle=${vehicle.id}`} className="block">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 py-3 text-lg" disabled={!vehicle.availability}>
                    {vehicle.availability ? 'Book This Vehicle' : 'Currently Unavailable'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Features & Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-gray-600">{vehicle.capacity} seats</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Fuel className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Fuel Type</div>
                    <div className="text-gray-600">{vehicle.specifications.fuel}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Transmission</div>
                    <div className="text-gray-600">{vehicle.specifications.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Year</div>
                    <div className="text-gray-600">{vehicle.specifications.year}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Vehicle Description</h3>
          <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
        </div>

        {/* Trust Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Full Insurance', desc: 'Comprehensive coverage included' },
            { icon: MapPin, title: 'Nationwide', desc: 'Available across Nigeria' },
            { icon: Star, title: 'Premium Service', desc: '24/7 customer support' }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
              <item.icon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}