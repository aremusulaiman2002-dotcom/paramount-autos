import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vehicles } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const vehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1)

    if (vehicle.length === 0 || !vehicle[0]) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Parse features from JSON string to array
    const vehicleWithParsedFeatures = {
      ...vehicle[0],
      features: vehicle[0].features ? JSON.parse(vehicle[0].features) : []
    }

    return NextResponse.json(vehicleWithParsedFeatures)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const existingVehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1)

    if (existingVehicle.length === 0 || !existingVehicle[0]) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Update vehicle
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        name: body.name,
        type: body.type,
        pricePerDay: body.pricePerDay,
        description: body.description,
        image: body.image,
        availability: body.availability,
        features: JSON.stringify(body.features),
      })
      .where(eq(vehicles.id, id))
      .returning()

    if (!updatedVehicle) {
      return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 })
    }

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}