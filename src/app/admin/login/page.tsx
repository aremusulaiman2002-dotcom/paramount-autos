'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Shield, Eye, EyeOff } from 'lucide-react'

// Main login component that uses useSearchParams
function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        const callbackUrl = searchParams.get('callbackUrl') || '/admin'
        router.push(callbackUrl)
      }
    }
    checkSession()
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (loginAttempts >= 5) {
      setError('Too many failed attempts. Please try again in 15 minutes.')
      return
    }

    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Login attempt:', { email, password })

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password: password,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        setLoginAttempts(prev => prev + 1)
        
        // More specific error messages
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please check your credentials.')
        } else {
          setError(`Authentication failed: ${result.error}`)
        }
      } else if (result?.ok) {
        // Successful login
        setLoginAttempts(0)
        console.log('✅ Login successful, redirecting...')
        const callbackUrl = searchParams.get('callbackUrl') || '/admin'
        router.push(callbackUrl)
        // Force a refresh to ensure session is loaded
        setTimeout(() => {
          window.location.href = callbackUrl
        }, 100)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
      setLoginAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                PARAMOUNT
              </div>
              <div className="text-xs font-medium text-orange-600 tracking-wider">ADMIN PORTAL</div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure access to the administration dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-2xl">
            <CardTitle className="flex items-center text-xl">
              <Shield className="w-5 h-5 mr-2" />
              Administrator Access
            </CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {loginAttempts > 0 && (
                <div className="text-sm text-orange-600 text-center bg-orange-50 p-2 rounded-lg">
                  Attempt {loginAttempts} of 5
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="rounded-lg"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="rounded-lg pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || loginAttempts >= 5}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in to Dashboard'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo Credentials:</strong><br />
                Email: admin@paramountautos.com<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
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
        <p className="text-gray-600">Loading login page...</p>
      </div>
    </div>
  )
}

// Main export with Suspense boundary
export default function AdminLogin() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminLoginContent />
    </Suspense>
  )
}