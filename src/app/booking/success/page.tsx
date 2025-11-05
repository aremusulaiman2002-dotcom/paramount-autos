'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Copy, Download, ArrowLeft, Car, Shield, Calendar, MapPin } from 'lucide-react'

// Move the main content to a separate component that uses useSearchParams
function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const [bookingRef, setBookingRef] = useState('')
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    setBookingRef(searchParams.get('ref') || 'PMT-20241219-ABC1')
    setTotalAmount(parseInt(searchParams.get('amount') || '0'))
  }, [searchParams])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingRef)
    alert('Booking reference copied!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-8 sm:py-12 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 font-serif">Booking Confirmed!</h1>
            <p className="text-green-100 text-sm sm:text-lg px-4">
              Your premium vehicle booking has been received and is pending confirmation
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* What's Next */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">📋 What Happens Next?</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900 text-sm sm:text-base">Make Payment</div>
                        <div className="text-blue-700 text-xs sm:text-sm">Transfer using provided bank details below</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900 text-sm sm:text-base">Send Proof</div>
                        <div className="text-blue-700 text-xs sm:text-sm"><li>Send screenshot to (+234 916 892 3000) on whatsapp</li></div>
                        <div className="text-blue-700 text-xs sm:text-sm"><li>Or email receipt to Paramountautosabj@gmail.com</li></div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900 text-sm sm:text-base">Get Confirmation</div>
                        <div className="text-blue-700 text-xs sm:text-sm">Confirmed within 10 minutes of payment</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-orange-900 mb-3 sm:mb-4 flex items-center">
                    💳 Payment Instructions
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-orange-800 font-medium text-sm sm:text-base">Bank:</span>
                      <span className="font-semibold text-orange-900 text-sm sm:text-base text-right">opay (Paycom)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-orange-800 font-medium text-sm sm:text-base">Account Name:</span>
                      <span className="font-semibold text-orange-900 text-sm sm:text-base text-right">Adekunle Ademide David</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-orange-800 font-medium text-sm sm:text-base">Account Number:</span>
                      <span className="font-semibold text-orange-900 text-sm sm:text-base">8115925381</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-orange-800 font-medium text-sm sm:text-base">Amount:</span>
                      <span className="font-semibold text-orange-900 text-base sm:text-lg">₦{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-orange-800 font-medium text-sm sm:text-base">Reference:</span>
                      <span className="font-semibold text-orange-900 text-sm sm:text-base break-all text-right ml-2">{bookingRef}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Booking Reference */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Your Booking Reference
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl gap-3">
                    <code className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400 font-mono break-all text-center sm:text-left">
                      {bookingRef}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border-white/20 text-white w-full sm:w-auto"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>

                {/* Support Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">🛟 Need Help?</h3>
                  <div className="space-y-2 sm:space-y-3 text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm sm:text-base">Support:</span>
                      <span className="text-orange-600 font-semibold text-sm sm:text-base">+234 916 892 3000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm sm:text-base">Email:</span>
                      <span className="text-orange-600 font-semibold text-xs sm:text-sm break-all text-right">Paramountautosabj@gmail.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm sm:text-base">Response:</span>
                      <span className="text-green-600 font-semibold text-sm sm:text-base">15 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200">
              <Link href="/" className="w-full sm:w-auto order-2 sm:order-1">
                <Button 
                  variant="outline" 
                  className="w-full py-3 rounded-xl border-gray-300 flex items-center space-x-2 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <Link href="/track" className="w-full sm:w-auto order-1 sm:order-2">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3 rounded-xl text-base sm:text-lg font-semibold">
                  Track My Booking
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto py-3 rounded-xl border-gray-300 flex items-center space-x-2 text-sm sm:text-base order-3"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Success Message Footer */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Thank you for choosing <span className="font-semibold text-orange-600">Paramount Autos</span>. 
            We're excited to serve you!
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    </div>
  )
}

// Main export with Suspense boundary
export default function BookingSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingSuccessContent />
    </Suspense>
  )
}