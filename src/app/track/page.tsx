'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Search, Clock, CheckCircle, XCircle, AlertCircle, Car, Shield, MapPin, Calendar, User, Phone, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className={`bg-white/95 backdrop-blur-sm border-b transition-all duration-300 sticky top-0 z-50 ${
      isScrolled ? 'border-gray-200 shadow-lg' : 'border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                PARAMOUNT
              </div>
              <div className="text-[10px] font-medium text-orange-600 tracking-wider leading-tight">PREMIUM AUTOS</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {[
              { name: 'Home', href: '/' },
              { name: 'Track', href: '/track' },
              { name: 'Services', href: '/services' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-semibold transition-all duration-300 text-sm uppercase tracking-wide ${
                  item.name === 'Track' 
                    ? 'text-orange-600' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2 rounded-full border border-orange-200">
              <Phone className="w-3 h-3 text-orange-600" />
              <span className="font-semibold text-orange-700 text-sm">+234 800 000 0000</span>
            </div>
            <Link
              href="/booking"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 pt-4 pb-6 bg-white/95 backdrop-blur-sm shadow-2xl rounded-b-2xl mx-2 mb-2">
            <nav className="flex flex-col space-y-1 px-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Track', href: '/track' },
                { name: 'Services', href: '/services' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-semibold transition-all duration-300 py-4 text-base border-b border-gray-100 last:border-b-0 hover:bg-orange-50 rounded-lg px-4 ${
                    item.name === 'Track' 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-800 hover:text-orange-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.name === 'Track' ? 'bg-orange-500' : 'bg-gray-400'
                    }`}></div>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-gray-700 mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">+234 800 000 0000</span>
                </div>
                <Link
                  href="/booking"
                  className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default function TrackBooking() {
  const [refNumber, setRefNumber] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const response = await fetch(`/api/bookings?ref=${refNumber.trim()}`);
      const result = await response.json();

      if (result.success) {
        setBooking(result.data);
      } else {
        setError(result.error || 'Booking not found');
      }
    } catch (err) {
      setError('Failed to fetch booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-br from-gray-50 to-orange-50/30 py-4 sm:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-700 bg-clip-text text-transparent font-serif mb-2 sm:mb-3">
              Track Your Booking
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg">
              Enter your booking reference number to check status and details
            </p>
          </div>

          {/* Search Form */}
          <Card className="border-0 shadow-xl mb-6 sm:mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-2xl py-6">
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Find Your Booking
              </CardTitle>
              <CardDescription className="text-orange-100 text-sm sm:text-base">
                Enter your reference number to track booking status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refNumber" className="block text-base sm:text-lg font-semibold text-gray-700">
                    Booking Reference Number
                  </Label>
                  <Input
                    type="text"
                    id="refNumber"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                    placeholder="PMT-20241219-ABC1"
                    className="w-full px-4 py-3 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {loading ? 'Searching...' : 'Track Booking'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-0 shadow-lg mb-6 sm:mb-8 border-red-200 bg-red-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 text-base sm:text-lg">Booking Not Found</h3>
                    <p className="text-red-700 mt-1 text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Details */}
          {booking && (
            <div className="space-y-4 sm:space-y-6">
              {/* Status Card */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-xl sm:text-2xl">
                    📋 Booking Status & Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-700">Reference Number</span>
                        <code className="text-base sm:text-lg font-mono font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg text-center sm:text-left">
                          {booking.refNumber}
                        </code>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-700">Booking Status</span>
                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="font-medium text-sm sm:text-base capitalize">{booking.status.toLowerCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-700">Total Amount</span>
                        <span className="text-xl sm:text-2xl font-bold text-orange-600">
                          {formatPrice(booking.totalAmount)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-700">Booking Date</span>
                        <span className="text-base sm:text-lg text-gray-700">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer & Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Customer Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-2xl py-4 sm:py-6">
                    <CardTitle className="flex items-center text-lg sm:text-xl text-blue-900">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <Label className="text-xs text-gray-500">Full Name</Label>
                        <p className="font-medium text-sm sm:text-base">{booking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <Label className="text-xs text-gray-500">Phone Number</Label>
                        <p className="font-medium text-sm sm:text-base">{booking.phone}</p>
                      </div>
                    </div>
                    {booking.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div>
                          <Label className="text-xs text-gray-500">Email</Label>
                          <p className="font-medium text-sm sm:text-base break-all">{booking.email}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trip Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-2xl py-4 sm:py-6">
                    <CardTitle className="flex items-center text-lg sm:text-xl text-green-900">
                      <MapPin className="w-5 h-5 mr-2" />
                      Trip Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Label className="text-xs text-gray-500">Pickup Location</Label>
                        <p className="font-medium text-sm sm:text-base">{booking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Label className="text-xs text-gray-500">Destination</Label>
                        <p className="font-medium text-sm sm:text-base">{booking.dropoffLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Label className="text-xs text-gray-500">Rental Period</Label>
                        <div className="text-sm sm:text-base font-medium">
                          {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vehicles & Security */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-xl sm:text-2xl">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {/* Vehicles */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-lg sm:text-xl mb-3 flex items-center text-gray-900">
                      <Car className="w-5 h-5 mr-2 text-orange-500" />
                      Vehicles
                    </h4>
                    <div className="space-y-3">
                      {Array.isArray(booking.vehicles) && booking.vehicles.map((vehicle: any, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200 gap-2">
                          <div className="flex-1">
                            <span className="font-medium text-base sm:text-lg text-gray-900">{vehicle.name}</span>
                            <span className="text-gray-600 ml-2 text-sm sm:text-base">(x{vehicle.quantity})</span>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                              {vehicle.days} day{vehicle.days !== 1 ? 's' : ''} • {formatPrice(vehicle.subtotal)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-base sm:text-lg text-orange-600">{formatPrice(vehicle.subtotal)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Personnel */}
                  {booking.securityPersonnel && (
                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-semibold text-lg sm:text-xl mb-3 flex items-center text-gray-900">
                        <Shield className="w-5 h-5 mr-2 text-blue-500" />
                        Security Personnel
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                        <div className="flex-1">
                          <span className="font-medium text-base sm:text-lg text-gray-900">{booking.securityPersonnel.count} personnel</span>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            {booking.securityPersonnel.days} day{booking.securityPersonnel.days !== 1 ? 's' : ''} • ₦15,000/day each
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-base sm:text-lg text-orange-600">{formatPrice(booking.securityPersonnel.subtotal)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t-2 border-orange-200 gap-2">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl sm:text-2xl font-bold text-orange-600">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {booking.notes && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-t-2xl py-4 sm:py-6">
                    <CardTitle className="flex items-center text-lg sm:text-xl text-yellow-900">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Admin Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{booking.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Support Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Need Assistance?</h3>
                    <p className="text-gray-300 text-sm sm:text-base mb-4">
                      Our support team is here to help you 24/7
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm sm:text-base">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-orange-400" />
                        <span>+234 800 000 0000</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-orange-400" />
                        <span>support@paramountautos.com</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}