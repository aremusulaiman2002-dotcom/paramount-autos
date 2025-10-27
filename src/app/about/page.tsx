'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Target, Award, Globe, Car, Shield, Phone, Menu, X } from 'lucide-react'

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
                className={`font-semibold transition-all duration-300 text-sm uppercase tracking-wide ${
                  item.name === 'About' 
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
                    item.name === 'About' 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-800 hover:text-orange-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.name === 'About' ? 'bg-orange-500' : 'bg-gray-400'
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

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide premium vehicle rental and security services that ensure our clients travel safely and in comfort.'
    },
    {
      icon: Users,
      title: 'Our Vision',
      description: 'To be the most trusted luxury vehicle rental and security service provider in Nigeria.'
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'Safety, reliability, luxury, and exceptional customer service guide everything we do.'
    }
  ]

  const stats = [
    { number: '50+', label: 'Premium Vehicles' },
    { number: '100+', label: 'Security Personnel' },
    { number: '15+', label: 'Cities Covered' },
    { number: '24/7', label: 'Customer Support' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-serif">About Paramount Autos</h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Leading the way in premium vehicle rental and security services with 
              uncompromising commitment to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Founded with a vision to redefine luxury transportation in Nigeria, 
                  Paramount Autos has grown from a small fleet of premium vehicles to 
                  a comprehensive service provider offering both luxury transportation 
                  and executive security solutions.
                </p>
                <p>
                  Our journey began with a simple belief: everyone deserves to travel 
                  in comfort and safety. This belief has guided our expansion and 
                  continues to drive our commitment to excellence in every service we provide.
                </p>
                <p>
                  Today, we serve individuals, corporations, and government agencies 
                  across multiple states, maintaining our reputation for reliability, 
                  professionalism, and uncompromising quality.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-orange-900 mb-6 text-center">Our Impact</h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{stat.number}</div>
                    <div className="text-gray-700 text-sm sm:text-base font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Our Core Values</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our operations and service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">{value.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">What We Do</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your transportation and security needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Car className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Luxury Vehicle Rental</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Our fleet includes the latest models from top luxury brands, meticulously 
                  maintained to ensure your comfort and safety. From executive sedans for 
                  business meetings to spacious SUVs for family trips, we have the perfect 
                  vehicle for every occasion.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Executive Security</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Our professional security personnel are trained to provide comprehensive 
                  protection services. Whether you need personal security, event security, 
                  or corporate protection, our team ensures your safety and peace of mind 
                  throughout your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-gray-900 to-black text-white px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-serif">Ready to Experience Excellence?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who trust Paramount Autos for their transportation and security needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Book Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Button component since it's not imported
function Button({ children, className = '', variant = 'default', ...props }: any) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantClasses = variant === 'secondary' 
    ? 'border border-input hover:bg-accent hover:text-accent-foreground' 
    : 'bg-primary text-primary-foreground hover:bg-primary/90'
  
  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}