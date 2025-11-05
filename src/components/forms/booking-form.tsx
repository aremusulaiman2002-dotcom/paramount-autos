'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vehicle, SelectedVehicle, SecurityPersonnel } from '@/types';
import { formatPrice, calculateDays, validateDateRange } from '@/lib/utils';
import { Car, Shield, Calculator, CheckCircle, MapPin, Clock, User, Phone, Mail, AlertCircle, Plus, Minus, ArrowRight, ArrowLeft, Calendar, Menu, X } from 'lucide-react';

interface BookingFormProps {
  vehicles: Vehicle[];
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`bg-white/95 backdrop-blur-sm border-b transition-all duration-300 sticky top-0 z-50 ${
      isScrolled ? 'border-gray-200 shadow-lg' : 'border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo with SVG */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="flex items-center space-x-2">
              {/* SVG Logo */}
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.svg"
                  alt="Paramount Autos Logo"
                  width={40}
                  height={40}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              
              {/* Brand Name */}
              <div className="text-left">
                <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                  PARAMOUNT
                </div>
                <div className="text-[10px] font-medium text-orange-600 tracking-wider leading-tight">PREMIUM AUTOS</div>
              </div>
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
                className="font-semibold text-gray-700 hover:text-orange-600 transition-all duration-300 text-sm uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2 rounded-full border border-orange-200">
              <Phone className="w-3 h-3 text-orange-600" />
              <span className="font-semibold text-orange-700 text-sm">+234 916 892 3000</span>
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
                  className="font-semibold text-gray-800 hover:text-orange-600 transition-all duration-300 py-4 text-base border-b border-gray-100 last:border-b-0 hover:bg-orange-50 rounded-lg px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-gray-700 mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">+234 916 892 3000</span>
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
  );
}

export default function BookingForm({ vehicles }: BookingFormProps) {
  const router = useRouter();
  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>([]);
  const [rentalDays, setRentalDays] = useState(1);
  const [securityCount, setSecurityCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    pickupLocation: '',
    dropoffLocation: '',
    startDate: '',
    endDate: '',
  });

  // Debug: Log vehicles data
  useEffect(() => {
    console.log('🔧 BookingForm - vehicles received:', vehicles);
    console.log('🔧 BookingForm - vehicles count:', vehicles?.length);
  }, [vehicles]);

  // Helper function to calculate vehicle subtotal
  const calculateVehicleSubtotal = (pricePerDay: number, quantity: number, days: number) => {
    return pricePerDay * quantity * days;
  };

  // Auto-calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      if (!validateDateRange(formData.startDate, formData.endDate)) {
        setDateError('End date cannot be before start date');
        setRentalDays(1);
      } else {
        setDateError('');
        const days = calculateDays(formData.startDate, formData.endDate);
        setRentalDays(days);
        
        setSelectedVehicles(prev => 
          prev.map(item => {
            const vehicle = vehicles.find(v => v.id === item.vehicleId);
            return vehicle ? { 
              ...item, 
              days,
              subtotal: calculateVehicleSubtotal(vehicle.pricePerDay, item.quantity, days)
            } : item;
          })
        );
      }
    }
  }, [formData.startDate, formData.endDate, vehicles]);

  // Calculate total price
  const calculateTotal = () => {
    const vehiclesTotal = selectedVehicles.reduce((sum, item) => sum + item.subtotal, 0);
    const securityTotal = securityCount * 30000 * rentalDays;
    return vehiclesTotal + securityTotal;
  };

  const totalPrice = calculateTotal();

  const handleVehicleSelect = (vehicleId: string, quantity: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    setSelectedVehicles(prev => {
      const existing = prev.find(item => item.vehicleId === vehicleId);
      
      if (existing) {
        if (quantity === 0) {
          return prev.filter(item => item.vehicleId !== vehicleId);
        }
        return prev.map(item => 
          item.vehicleId === vehicleId ? { 
            ...item, 
            quantity, 
            days: rentalDays,
            subtotal: calculateVehicleSubtotal(vehicle.pricePerDay, quantity, rentalDays)
          } : item
        );
      } else {
        if (quantity > 0) {
          return [...prev, { 
            vehicleId, 
            name: vehicle.name,
            type: vehicle.type,
            image: vehicle.image,
            quantity, 
            days: rentalDays,
            subtotal: calculateVehicleSubtotal(vehicle.pricePerDay, quantity, rentalDays)
          }];
        }
        return prev;
      }
    });
  };

  const getVehicleQuantity = (vehicleId: string) => {
    return selectedVehicles.find(item => item.vehicleId === vehicleId)?.quantity || 0;
  };

  const getMinEndDate = () => {
    if (!formData.startDate) return '';
    const start = new Date(formData.startDate);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.startDate && formData.endDate && !validateDateRange(formData.startDate, formData.endDate)) {
      setDateError('Please select valid dates');
      return;
    }

    if (!formData.customerName || !formData.phone || !formData.pickupLocation || !formData.dropoffLocation) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const securityData: SecurityPersonnel | undefined = securityCount > 0 ? {
        count: securityCount,
        rate: 30000,
        days: rentalDays,
        subtotal: securityCount * 30000 * rentalDays
      } : undefined;

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.customerName,
          phone: formData.phone,
          email: formData.email,
          pickup: formData.pickupLocation,
          destination: formData.dropoffLocation,
          startDate: formData.startDate,
          endDate: formData.endDate,
          vehicleIds: selectedVehicles.map(v => v.vehicleId),
          rentalDays: rentalDays,
          securityPersonnel: securityData,
          totalPrice: totalPrice.toString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/booking/success?ref=${result.bookingId}&amount=${totalPrice}`);
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Vehicles', icon: Car },
    { number: 2, title: 'Trip Details', icon: MapPin },
    { number: 3, title: 'Contact', icon: User },
    { number: 4, title: 'Confirm', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-700 bg-clip-text text-transparent">
              Book Your Premium Ride
            </h1>
            <p className="text-gray-600 mt-2">Experience luxury and security with Paramount Autos</p>
          </div>

          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-orange-500 text-white shadow-lg' 
                      : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block ${
                    currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Vehicle Selection */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-2xl py-6">
                <CardTitle className="flex items-center text-2xl">
                  <Car className="mr-3 w-6 h-6" />
                  Select Your Vehicles
                </CardTitle>
                <CardDescription className="text-orange-100 text-lg">
                  Choose from our premium fleet
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((vehicle) => {
                    const quantity = getVehicleQuantity(vehicle.id);
                    return (
                      <div 
                        key={vehicle.id} 
                        className={`border-2 rounded-2xl p-4 transition-all duration-300 ${
                          quantity > 0 
                            ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' 
                            : 'border-gray-200 bg-white hover:shadow-md hover:border-orange-300'
                        }`}
                      >
                        {/* Vehicle Image */}
                        <div className="relative mb-4">
                          {vehicle.image ? (
                            <img 
                              src={vehicle.image} 
                              alt={vehicle.name}
                              className="w-full h-40 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                              <Car className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          {quantity > 0 && (
                            <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                              {quantity}
                            </div>
                          )}
                        </div>
                        
                        {/* Vehicle Info */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{vehicle.name}</h3>
                              <p className="text-gray-600 text-sm capitalize">{vehicle.type}</p>
                            </div>
                            <span className="text-2xl font-bold text-orange-600">
                              {formatPrice(vehicle.pricePerDay)}
                              <span className="text-sm font-normal text-gray-500">/day</span>
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2">{vehicle.description}</p>
                          
                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-gray-600 font-medium">Select quantity:</span>
                            <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-2 py-1">
                              <button
                                type="button"
                                onClick={() => handleVehicleSelect(vehicle.id, quantity - 1)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-bold text-lg text-gray-900">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleVehicleSelect(vehicle.id, quantity + 1)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
                  <Link href="/vehicles" className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Fleet
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      Selected: <span className="font-bold text-orange-600">
                        {selectedVehicles.reduce((sum, item) => sum + item.quantity, 0)} vehicle(s)
                      </span>
                    </span>
                    <Button 
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={selectedVehicles.length === 0}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Trip Details */}
          {currentStep === 2 && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <Card className="lg:col-span-2 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-2xl">
                    <MapPin className="mr-3 w-6 h-6" />
                    Trip Details
                  </CardTitle>
                  <CardDescription className="text-orange-100 text-lg">
                    Specify your travel requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Dates Section */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                      Rental Period
                    </Label>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="font-semibold">Start Date *</Label>
                        <Input
                          type="date"
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          min={getTodayDate()}
                          className="text-lg py-3 rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="font-semibold">End Date *</Label>
                        <Input
                          type="date"
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          min={getMinEndDate()}
                          className="text-lg py-3 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Days Display */}
                    {(formData.startDate || formData.endDate) && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-6 h-6 text-blue-600" />
                            <div>
                              <div className="font-semibold text-blue-900">Rental Duration</div>
                              {formData.startDate && formData.endDate && (
                                <div className="text-sm text-blue-700">
                                  {new Date(formData.startDate).toLocaleDateString()} → {new Date(formData.endDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">{rentalDays}</div>
                            <div className="text-sm text-blue-700">day{rentalDays !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date Error */}
                    {dateError && (
                      <div className="flex items-center space-x-2 text-red-600 mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{dateError}</span>
                      </div>
                    )}
                  </div>

                  {/* Security Personnel */}
                  <div>
                    <Label htmlFor="security" className="text-lg font-semibold mb-2 block flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-orange-500" />
                      Security Officers (₦30,000/day each)
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        id="security"
                        min="0"
                        max="50"
                        value={securityCount}
                        onChange={(e) => setSecurityCount(parseInt(e.target.value) || 0)}
                        className="text-lg py-3 rounded-xl flex-1"
                      />
                      {securityCount > 0 && (
                        <div className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-2 rounded-lg">
                          {formatPrice(securityCount * 30000 * rentalDays)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup" className="font-semibold">Pickup Location *</Label>
                      <Input
                        id="pickup"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                        placeholder="Enter pickup address"
                        className="py-3 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="font-semibold">Destination *</Label>
                      <Input
                        id="destination"
                        value={formData.dropoffLocation}
                        onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                        placeholder="Enter destination"
                        className="py-3 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Sidebar */}
              <Card className="border-0 shadow-xl h-fit sticky top-24">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-xl">
                    <Calculator className="mr-2 w-5 h-5" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Selected Vehicles */}
                    {selectedVehicles.map((item) => (
                      <div key={item.vehicleId} className="flex justify-between items-start pb-3 border-b border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} × {item.days} day{item.days !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <span className="font-semibold text-orange-600">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    
                    {/* Security Cost */}
                    {securityCount > 0 && (
                      <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Security Officers</div>
                          <div className="text-sm text-gray-600">
                            {securityCount} × {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <span className="font-semibold text-orange-600">
                          {formatPrice(securityCount * 30000 * rentalDays)}
                        </span>
                      </div>
                    )}
                    
                    {/* Total */}
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-3 rounded-xl border-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!!dateError || !formData.startDate || !formData.endDate || !formData.pickupLocation || !formData.dropoffLocation}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3 rounded-xl"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Contact Form */}
              <Card className="lg:col-span-2 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-2xl">
                    <User className="mr-3 w-6 h-6" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-orange-100 text-lg">
                    We'll use this to confirm your booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        placeholder="Enter your full name"
                        className="py-3 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234 XXX XXX XXXX"
                        className="py-3 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="py-3 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Final Summary */}
              <Card className="border-0 shadow-xl h-fit sticky top-24">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-xl">
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Final Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Trip Details */}
                    <div className="bg-orange-50 rounded-xl p-4">
                      <h4 className="font-semibold text-orange-900 mb-2">Trip Details</h4>
                      <div className="text-sm text-orange-800 space-y-1">
                        <div>From: {formData.pickupLocation}</div>
                        <div>To: {formData.dropoffLocation}</div>
                        <div>Duration: {rentalDays} day{rentalDays !== 1 ? 's' : ''}</div>
                        {securityCount > 0 && <div>Security: {securityCount} personnel</div>}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      {selectedVehicles.map((item) => (
                        <div key={item.vehicleId} className="flex justify-between text-sm">
                          <span>{item.name} (x{item.quantity})</span>
                          <span className="font-medium">{formatPrice(item.subtotal)}</span>
                        </div>
                      ))}
                      
                      {securityCount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Security (x{securityCount})</span>
                          <span className="font-medium">{formatPrice(securityCount * 30000 * rentalDays)}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total</span>
                          <span className="text-xl font-bold text-orange-600">
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-3 rounded-xl border-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting || !!dateError}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-3 rounded-xl text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>Creating Booking...</>
                      ) : (
                        <>
                          Confirm Booking
                          <CheckCircle className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}