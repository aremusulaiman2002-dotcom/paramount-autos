// src/app/api/populate-vehicles/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vehicles } from '@/lib/schema'

export async function GET() {
  try {
    const sampleVehicles = [
      {
        name: "Toyota Camry 2023",
        type: "Sedan",
        pricePerDay: 15000,
        description: "Comfortable and fuel-efficient sedan perfect for city driving and business trips",
        features: JSON.stringify(["Air Conditioning", "Bluetooth", "GPS Navigation", "Backup Camera", "Cruise Control"]),
        image: null,
        availability: true
      },
      {
        name: "Ford Explorer 2024",
        type: "SUV", 
        pricePerDay: 25000,
        description: "Spacious 7-seater SUV ideal for family trips and group travel",
        features: JSON.stringify(["Air Conditioning", "7 Seats", "GPS Navigation", "Sunroof", "Leather Seats", "Premium Sound"]),
        image: null,
        availability: true
      },
      {
        name: "Mercedes-Benz S-Class",
        type: "Luxury",
        pricePerDay: 50000,
        description: "Premium luxury sedan with advanced features for executive travel",
        features: JSON.stringify(["Premium Air Conditioning", "Massage Seats", "Panoramic Sunroof", "Advanced Safety", "Entertainment System"]),
        image: null,
        availability: true
      },
      {
        name: "Toyota Hiace Commuter",
        type: "Van",
        pricePerDay: 20000,
        description: "Reliable van for group transportation and corporate events",
        features: JSON.stringify(["Air Conditioning", "14 Seats", "Spacious Interior", "Reliable Engine"]),
        image: null,
        availability: true
      },
      {
        name: "Honda Civic 2023",
        type: "Compact",
        pricePerDay: 12000,
        description: "Economical and efficient compact car for daily commuting",
        features: JSON.stringify(["Air Conditioning", "Fuel Efficient", "Compact Size", "Easy Parking"]),
        image: null,
        availability: true
      },
      {
        name: "Range Rover Sport",
        type: "Premium SUV",
        pricePerDay: 45000,
        description: "Luxury SUV with premium features and excellent off-road capability",
        features: JSON.stringify(["4WD", "Premium Interior", "Advanced Tech", "Panoramic Roof", "Climate Control"]),
        image: null,
        availability: true
      }
    ]

    // Insert sample vehicles
    const result = await db.insert(vehicles).values(sampleVehicles).returning()

    return NextResponse.json({
      success: true,
      message: `Added ${result.length} sample vehicles`,
      vehicles: result
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}