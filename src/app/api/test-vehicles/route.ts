// src/app/api/test-vehicles/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vehicles } from '@/lib/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    console.log('Testing vehicles API...')
    
    const allVehicles = await db.select().from(vehicles)
    const availableVehicles = await db
      .select()
      .from(vehicles)
      .where(sql`${vehicles.availability} = true`)

    return NextResponse.json({ 
      success: true, 
      totalVehicles: allVehicles.length,
      availableVehicles: availableVehicles.length,
      allVehicles: allVehicles,
      availableVehiclesList: availableVehicles
    })
  } catch (error: any) {
    console.error('Vehicles API test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}