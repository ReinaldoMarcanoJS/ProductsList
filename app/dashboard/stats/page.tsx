'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Calendar, Package, Users, CreditCard } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { getDolarApi } from '@/lib/getDolarApi'
import { DolarQuery } from '@/types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface StatsData {
  monthlySales: number
  dailySales: number
  dollarRate: DolarQuery | null
  totalProducts: number
  totalCustomers: number
  totalPendingCredits: number
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    monthlySales: 0,
    dailySales: 0,
    dollarRate: null,
    totalProducts: 0,
    totalCustomers: 0,
    totalPendingCredits: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const { userId, loading: authLoading } = useAuth()

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Función para obtener las ventas del mes actual
  const getMonthlySales = async (userId: string): Promise<number> => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const { data, error } = await supabase
      .from('invoices')
      .select('total')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString())

    if (error) {
      console.error('Error fetching monthly sales:', error)
      return 0
    }

    return data?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0
  }

  // Función para obtener las ventas del día actual
  const getDailySales = async (userId: string): Promise<number> => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    const { data, error } = await supabase
      .from('invoices')
      .select('total')
      .eq('user_id', userId)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())

    if (error) {
      console.error('Error fetching daily sales:', error)
      return 0
    }

    return data?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0
  }

  // Función para obtener el cambio del dólar
  const getDollarRate = async (): Promise<DolarQuery | null> => {
    try {
      const data = await getDolarApi()
      // Validar que los datos sean válidos
      if (data && typeof data.venta === 'number' && typeof data.compra === 'number') {
        return data
      }
      console.error('Invalid dollar rate data:', data)
      return null
    } catch (error) {
      console.error('Error fetching dollar rate:', error)
      return null
    }
  }

  // Función para obtener el total de productos
  const getTotalProducts = async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)

    if (error) {
      console.error('Error fetching total products:', error)
      return 0
    }

    return count || 0
  }

  // Función para obtener el total de clientes
  const getTotalCustomers = async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)

    if (error) {
      console.error('Error fetching total customers:', error)
      return 0
    }

    return count || 0
  }

  // Función para obtener el total de créditos pendientes
  const getTotalPendingCredits = async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('credits')
      .select('pending_amount')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching total pending credits:', error)
      return 0
    }

    return data?.reduce((sum, credit) => sum + (credit.pending_amount || 0), 0) || 0
  }

  // Función para formatear la fecha de actualización del dólar
  const formatDollarUpdateTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('es-VE', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  // Cargar todas las estadísticas
  const loadStats = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const [
        monthlySales,
        dailySales,
        dollarRate,
        totalProducts,
        totalCustomers,
        totalPendingCredits
      ] = await Promise.all([
        getMonthlySales(userId),
        getDailySales(userId),
        getDollarRate(),
        getTotalProducts(userId),
        getTotalCustomers(userId),
        getTotalPendingCredits(userId)
      ])

      setStats({
        monthlySales,
        dailySales,
        dollarRate,
        totalProducts,
        totalCustomers,
        totalPendingCredits
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && userId) {
      loadStats()
    }
  }, [userId, authLoading])

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="w-full py-6 gap-4">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  // Redirigir si no hay usuario autenticado
  if (!userId) {
    return (
      <div className="w-full py-6 gap-4">
        <div className="text-center">No autorizado</div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h3 className="pl-10 pt-6 text-2xl font-bold mb-4 text-gray-800">Estadísticas</h3>
        {/* Botón para refrescar datos */}
        <div className="mt-6 pl-10">
          <button
            onClick={loadStats}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Actualizar Estadísticas'}
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-center">

        {/* Ventas del Mes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Cargando...' : formatCurrency(stats.monthlySales)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de ventas del mes actual
            </p>
          </CardContent>
        </Card>

        {/* Ventas del Día */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Cargando...' : formatCurrency(stats.dailySales)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de ventas de hoy
            </p>
          </CardContent>
        </Card>

        {/* Cambio del Dólar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cambio del Dólar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Cargando...</div>
            ) : stats.dollarRate ? (
              <>
                <div className="text-2xl font-bold">
                  ${stats.dollarRate.promedio.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Actualizado: {formatDollarUpdateTime(stats.dollarRate.fechaActualizacion)}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-500">
                  Error
                </div>
                <p className="text-xs text-muted-foreground">
                  No se pudo obtener el cambio del dólar
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total de Productos */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/products')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Cargando...' : stats.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos en inventario
            </p>
          </CardContent>
        </Card>

        {/* Total de Clientes */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/clients')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Cargando...' : stats.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>

        {/* Total de Créditos Pendientes */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/credits')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Pendientes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Cargando...' : formatCurrency(stats.totalPendingCredits)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monto por cobrar
            </p>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
