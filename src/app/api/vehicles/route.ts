// src/app/api/vehicles/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vehicles } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'

// Fallback data
const fallbackVehicles = [
  {
    id: 'fallback-1',
    name: 'Toyota Camry',
    type: 'sedan',
    pricePerDay: 25000,
    availability: true,
    image: null,
    description: 'Comfortable sedan for city driving',
    features: '["AC", "Bluetooth", "GPS"]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET() {
  try {
    console.log('🚗 Vehicles API: Starting request...')
    
    try {
      // Try to get vehicles from database
      const availableVehicles = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.availability, true))
        .orderBy(asc(vehicles.pricePerDay))

      console.log(`🚗 Vehicles API: Successfully found ${availableVehicles.length} vehicles`)
      
      return NextResponse.json({
        success: true,
        data: availableVehicles,
        count: availableVehicles.length,
        source: 'database'
      })
      
    } catch (dbError) {
      console.error('🚗 Vehicles API: Database error, using fallback:', dbError)
      
      // Use fallback data if database fails
      return NextResponse.json({
        success: true,
        data: fallbackVehicles,
        count: fallbackVehicles.length,
        source: 'fallback',
        note: 'Using fallback data due to database connection issues'
      })
    }

  } catch (error) {
    console.error('❌ Vehicles API: Critical error:', error)
    
    // Final fallback - always return some data
    return NextResponse.json({
      success: true,
      data: fallbackVehicles,
      count: fallbackVehicles.length,
      source: 'error-fallback',
      note: 'Using fallback data due to critical error'
    })
  }
}