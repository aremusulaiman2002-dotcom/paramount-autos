import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Parse features from JSON string to array
    const vehicleWithParsedFeatures = {
      ...vehicle,
      features: vehicle.features ? JSON.parse(vehicle.features) : []
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        pricePerDay: body.pricePerDay,
        description: body.description,
        image: body.image,
        availability: body.availability,
        features: JSON.stringify(body.features),
      }
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}