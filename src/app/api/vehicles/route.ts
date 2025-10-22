import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { availability: true },
      orderBy: { pricePerDay: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: vehicles
    })
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vehicle = await prisma.vehicle.create({
      data: {
        name: body.name,
        type: body.type,
        pricePerDay: body.pricePerDay,
        description: body.description,
        features: body.features,
        image: body.image,
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Failed to create vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}