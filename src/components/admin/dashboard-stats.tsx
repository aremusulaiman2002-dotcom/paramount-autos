import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Car, 
  DollarSign, 
  Users 
} from 'lucide-react'

interface DashboardStatsProps {
  data: {
    totalBookings: number
    pendingBookings: number
    confirmedBookings: number
    completedBookings: number
    totalRevenue: number
    availableVehicles: number
  }
}

interface StatConfig {
  title: string
  value: (data: DashboardStatsProps['data']) => string | number
  icon: React.ComponentType<any>
  color: string
}

const stats: StatConfig[] = [
  {
    title: 'Total Bookings',
    value: (data) => data.totalBookings,
    icon: Calendar,
    color: 'bg-blue-500'
  },
  {
    title: 'Pending Bookings',
    value: (data) => data.pendingBookings,
    icon: Clock,
    color: 'bg-orange-500'
  },
  {
    title: 'Confirmed Bookings',
    value: (data) => data.confirmedBookings,
    icon: CheckCircle,
    color: 'bg-green-500'
  },
  {
    title: 'Available Vehicles',
    value: (data) => data.availableVehicles,
    icon: Car,
    color: 'bg-purple-500'
  },
  {
    title: 'Total Revenue',
    value: (data) => formatPrice(data.totalRevenue),
    icon: DollarSign,
    color: 'bg-emerald-500'
  },
  {
    title: 'Completed Trips',
    value: (data) => data.completedBookings,
    icon: Users,
    color: 'bg-indigo-500'
  },
]

export default function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value(data)}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}