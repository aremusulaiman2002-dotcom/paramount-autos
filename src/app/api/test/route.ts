// src/app/api/test/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 Test API: Checking basic API functionality...')
    
    // Just return a simple success message
    return NextResponse.json({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Test API failed:', error)
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    )
  }
}