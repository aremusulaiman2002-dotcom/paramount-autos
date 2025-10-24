export interface Vehicle {
  id: string
  name: string
  type: string
  pricePerDay: number
  availability: boolean
  image?: string
  description: string
  features: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface SelectedVehicle {
  vehicleId: string
  name: string
  quantity: number
  days: number
  subtotal: number
}

export interface SecurityPersonnel {
  count: number
  rate: number
  days: number
  subtotal: number
}

export interface BookingFormData {
  customerName: string
  phone: string
  email: string
  pickupLocation: string
  dropoffLocation: string
  startDate: string
  endDate: string
  vehicles: SelectedVehicle[]
  securityPersonnel?: SecurityPersonnel
}

export interface Booking {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email?: string
  pickupLocation: string
  dropoffLocation: string
  startDate: Date
  endDate: Date
  vehicles: SelectedVehicle[]
  securityPersonnel?: SecurityPersonnel
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'VERIFIED' | 'FAILED'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateBookingRequest {
  customerName: string
  phone: string
  email: string
  pickupLocation: string
  dropoffLocation: string
  startDate: string
  endDate: string
  vehicles: SelectedVehicle[]
  securityPersonnel?: SecurityPersonnel
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface DateRange {
  startDate: string
  endDate: string
  days: number
}

// Admin Types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  totalRevenue: number
  availableVehicles: number
}

export interface BookingUpdateRequest {
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  paymentStatus?: 'PENDING' | 'VERIFIED' | 'FAILED'
  notes?: string
}

// Vehicle Management Types
export interface CreateVehicleRequest {
  name: string
  type: string
  pricePerDay: number
  description: string
  features: string[]
  image?: string
  availability?: boolean
}

export interface UpdateVehicleRequest {
  name?: string
  type?: string
  pricePerDay?: number
  description?: string
  features?: string[]
  image?: string
  availability?: boolean
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
  error?: string
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filter Types
export interface BookingFilters {
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface VehicleFilters {
  type?: string
  availability?: boolean
  minPrice?: number
  maxPrice?: number
  search?: string
}

// Chart/Stats Types
export interface RevenueData {
  date: string
  revenue: number
  bookings: number
}

export interface VehicleStats {
  vehicleId: string
  name: string
  totalBookings: number
  totalRevenue: number
  utilizationRate: number
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf'
  startDate?: string
  endDate?: string
  includeFields?: string[]
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Settings Types
export interface AppSettings {
  securityRate: number
  businessName: string
  contactEmail: string
  contactPhone: string
  bankDetails: {
    bankName: string
    accountName: string
    accountNumber: string
  }
  businessHours: {
    open: string
    close: string
    timezone: string
  }
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean
  url?: string
  error?: string
}

// Search Types
export interface SearchResult<T> {
  results: T[]
  total: number
  query: string
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox'
  required: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

// API Response Wrapper
export interface ApiWrapper<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// Cache Types
export interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number
}

// Feature Flags
export interface FeatureFlags {
  adminDashboard: boolean
  vehicleManagement: boolean
  bookingManagement: boolean
  reports: boolean
  multiLanguage: boolean
  darkMode: boolean
}