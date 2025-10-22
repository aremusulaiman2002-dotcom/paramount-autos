import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where = status ? { status } : {}

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        refNumber: true,
        customerName: true,
        phone: true,
        email: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        pickupDate: true,
        dropoffDate: true,
        pickupLocation: true,
        dropoffLocation: true,
        vehicles: true,
        securityPersonnel: true,
        additionalNotes: true,
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate a unique reference number
    const refNumber = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const booking = await prisma.booking.create({
      data: {
        ...body,
        refNumber,
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}