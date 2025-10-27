'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Send, Menu, X } from 'lucide-react'

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
                  src="/logo.svg" // Your SVG logo path
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
                className={`font-semibold transition-all duration-300 text-sm uppercase tracking-wide ${
                  item.name === 'Contact' 
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
                    item.name === 'Contact' 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-800 hover:text-orange-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.name === 'Contact' ? 'bg-orange-500' : 'bg-gray-400'
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your message. We will get back to you soon!')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+234 800 000 0000',
      description: 'Available 24/7 for emergencies'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@paramountautos.com',
      description: 'We respond within 2 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Lagos, Nigeria',
      description: 'Multiple locations nationwide'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: '24/7 Service',
      description: 'Available round the clock'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 font-serif">Contact Us</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with our team for premium vehicle rental and security services
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">Get In Touch</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Have questions about our services? Need a quote? Our team is here to help 
                you find the perfect solution for your transportation and security needs.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{method.title}</h3>
                      <p className="text-gray-900 font-medium text-base sm:text-lg">{method.details}</p>
                      <p className="text-gray-600 text-sm sm:text-base">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Areas */}
              <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-900 mb-4">Service Areas</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Kaduna', 'Benin City'].map((city) => (
                    <div key={city} className="flex items-center text-orange-800 text-sm sm:text-base">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="vehicle-rental">Vehicle Rental Inquiry</option>
                      <option value="security-services">Security Services</option>
                      <option value="corporate-services">Corporate Services</option>
                      <option value="general-inquiry">General Inquiry</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-gray-900 to-black text-white px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-serif">Ready to Get Started?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your vehicle rental and security needs. We're here to help 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+2348000000000" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
            <Link href="/booking">
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}