'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Shield, Star, MapPin, CheckCircle, Phone, Mail, Clock, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`bg-white/95 backdrop-blur-sm border-b transition-all duration-300 sticky top-0 z-50 ${
      isScrolled ? 'border-gray-200 shadow-lg' : 'border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo with SVG */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="flex items-center space-x-2">
              {/* SVG Logo - Replace /logo.svg with your actual logo path */}
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.svg" // Change this to your SVG logo path
                  alt="Paramount Autos Logo"
                  width={40}
                  height={40}
                  className="object-contain"
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
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                {/* Footer Logo */}
                <div className="w-10 h-10 relative">
                  <Image
                    src="/logo.svg" // Same SVG logo in footer
                    alt="Paramount Autos Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">PARAMOUNT</div>
                  <div className="text-xs font-medium text-orange-400 tracking-wider">PREMIUM AUTOS</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Experience unparalleled luxury and security with our premium fleet of vehicles 
                and professional security personnel.
              </p>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="text-base font-bold mb-4 text-white border-l-4 border-orange-500 pl-2">Our Services</h3>
              <div className="space-y-2">
                {[
                  'Luxury Vehicle Rental',
                  'Executive Security',
                  'Corporate Transportation',
                  'Airport Transfers'
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-2 group cursor-pointer">
                    <div className="w-1 h-1 bg-orange-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span className="text-gray-300 group-hover:text-white transition-colors text-xs font-medium">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-base font-bold mb-4 text-white border-l-4 border-orange-500 pl-2">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { name: 'Book Now', href: '/booking' },
                  { name: 'Track', href: '/track'},
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors text-xs font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-base font-bold mb-4 text-white border-l-4 border-orange-500 pl-2">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-400" />
                  <div>
                    <div className="text-white font-semibold text-sm">+234 800 000 0000</div>
                    <div className="text-orange-400 text-xs">24/7 Service</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <div>
                    <div className="text-white font-semibold text-sm">info@paramount.com</div>
                    <div className="text-orange-400 text-xs">Email Support</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <div>
                    <div className="text-white font-semibold text-sm">24/7 Available</div>
                    <div className="text-orange-400 text-xs">Always Ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-4">
          <div className="flex flex-col items-center justify-between space-y-3 text-center">
            <div className="text-gray-400 text-xs">
              <p>&copy; 2025 Paramount Autos. All rights reserved.</p>
            </div>
            <div className="text-orange-400 text-xs font-semibold tracking-wide">
              DRIVE SAFE • BOOK SMART • TRAVEL CONFIDENTLY
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-900 overflow-hidden px-4">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
            }}
          />
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto w-full">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-serif tracking-tight leading-tight">
              PARAMOUNT
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 text-orange-300 font-light tracking-wide">
              Premium Vehicle Rentals & Executive Security
            </p>
            <p className="text-base sm:text-lg mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              Experience unparalleled luxury and security with our premium fleet of vehicles 
              and professional security personnel for your most important journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Link href="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 text-base font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300">
                  Explore Our Fleet
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-4 text-base font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Paramount Autos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Unmatched excellence in vehicle rental and security services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Car icon replaced with logo in header, keeping icon here for features */}
                  <div className="w-7 h-7 relative">
                    <Image
                      src="/logo.svg"
                      alt="Premium Fleet"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Fleet</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Carefully maintained luxury vehicles from top brands including Mercedes-Benz, 
                  BMW, Toyota, and more for your comfort and style.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Executive Security</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Professional security personnel trained to ensure your safety and peace of mind 
                  throughout your journey.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Luxury Experience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  From booking to drop-off, experience seamless service with attention to every detail 
                  for an unforgettable journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Services</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Luxury Vehicle Rental</h4>
                      <p className="text-gray-600 text-sm">
                        From executive sedans to premium SUVs, choose from our diverse fleet 
                        of meticulously maintained vehicles.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Security Personnel</h4>
                      <p className="text-gray-600 text-sm">
                        Professional security teams available for personal protection, 
                        corporate events, and high-profile transportation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Nationwide Coverage</h4>
                      <p className="text-gray-600 text-sm">
                        Available across major cities and regions with reliable service 
                        wherever your journey takes you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-orange-600 mr-2" />
                    <h3 className="text-xl font-semibold">Service Areas</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Kaduna', 'Benin'].map((city) => (
                      <div key={city} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 text-sm">{city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Experience Luxury?</h2>
            <p className="text-lg mb-6 text-gray-300 max-w-2xl mx-auto">
              Book your premium vehicle and security services today. Drive with confidence, travel in style.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-base">
                  Book Now
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 text-base border border-gray-600">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-800 text-white px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">50+</div>
                <div className="text-gray-300 text-sm">Premium Vehicles</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">100+</div>
                <div className="text-gray-300 text-sm">Security Personnel</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">24/7</div>
                <div className="text-gray-300 text-sm">Customer Support</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">15+</div>
                <div className="text-gray-300 text-sm">Cities Covered</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}