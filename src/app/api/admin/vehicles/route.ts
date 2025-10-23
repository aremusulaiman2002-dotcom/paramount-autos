// src/app/api/admin/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vehicles } from '@/lib/schema'
import { desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🆕 ADMIN: Creating vehicle with data:', body)
    
    // FIX: Ensure availability is always true for new vehicles
    const availability = body.availability !== undefined ? body.availability : true
    
    const [vehicle] = await db.insert(vehicles).values({
      name: body.name,
      type: body.type,
      pricePerDay: parseInt(body.pricePerDay),
      description: body.description,
      image: body.image || null,
      availability: true, // FIX: Force true for new vehicles
      features: typeof body.features === 'string' ? body.features : JSON.stringify(body.features || []),
    }).returning()

    if (!vehicle) {
      console.error('❌ ADMIN: Failed to create vehicle - no vehicle returned')
      return NextResponse.json(
        { success: false, error: 'Failed to create vehicle' },
        { status: 500 }
      )
    }

    console.log('✅ ADMIN: Vehicle created successfully:', {
      id: vehicle.id,
      name: vehicle.name,
      availability: vehicle.availability
    })

    return NextResponse.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('❌ ADMIN: Failed to create vehicle:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create vehicle',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const allVehicles = await db
      .select()
      .from(vehicles)
      .orderBy(desc(vehicles.createdAt))

    console.log('📋 ADMIN: Fetched all vehicles:', allVehicles.length)

    return NextResponse.json({
      success: true,
      data: allVehicles
    })
  } catch (error) {
    console.error('❌ ADMIN: Failed to fetch vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}