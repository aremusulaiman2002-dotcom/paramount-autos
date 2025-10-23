// src/app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings } from '@/lib/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    console.log('📖 Admin Bookings GET - Fetching bookings with status:', status)

    // Use the same approach as analytics - raw SQL queries
    let query = sql`SELECT * FROM bookings`
    
    if (status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      query = sql`SELECT * FROM bookings WHERE status = ${status}`
    }

    // Add ordering
    query = sql`${query} ORDER BY created_at DESC`

    const bookingsData = await db.execute(query)

    console.log('✅ Admin Bookings GET - Found bookings:', bookingsData.rows.length)

    // Parse the JSON strings into objects
    const parsedBookings = bookingsData.rows.map((booking: any) => ({
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