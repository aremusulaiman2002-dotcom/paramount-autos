// src/app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    console.log('📖 Admin Bookings GET - Fetching bookings with status:', status)

    // Get all bookings
    let bookingsData = await db.select().from(bookings).orderBy(desc(bookings.createdAt))

    // Filter by status if needed
    if (status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      bookingsData = bookingsData.filter(booking => booking.status === status)
    }

    console.log('✅ Admin Bookings GET - Found bookings:', bookingsData.length)

    // Parse the JSON strings into objects for the admin portal
    const parsedBookings = bookingsData.map(booking => ({
      ...booking,
      vehicles: JSON.parse(booking.vehicles),
      securityPersonnel: booking.securityPersonnel ? JSON.parse(booking.securityPersonnel) : null
    }))

    // Return the parsed data
    return NextResponse.json(parsedBookings)

  } catch (error) {
    console.error('❌ Admin Bookings GET - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}