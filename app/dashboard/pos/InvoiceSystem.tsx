'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Search, Users, Calculator, ShoppingCart, Package2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProductSearch from './ProductSearch'
import InvoiceTable from './InvoiceTable'
import TotalsSummary from './TotalsSummary'
import CustomerSearch from './CustomerSearch'

interface Product {
  id: string
  code: string
  description: string
  unit: string
  price: number
  quantity: number
}

interface Customer {
  id: string
  name: string
  document: string
}

export default function InvoiceSystem() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false)
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

  const addProduct = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id)
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id 
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ))
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === productId ? { ...p, quantity } : p
    ))
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    )
    const tax = subtotal * 0.16 // 16% tax rate
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Package2 className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Sistema de Facturación</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {format(new Date(), 'dd/MM/yyyy')}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Invoice Details */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            {/* Customer Selection */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Cliente"
                    value={selectedCustomer?.name || ''}
                    readOnly
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsCustomerSearchOpen(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Buscar Cliente
                </Button>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => setIsProductSearchOpen(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar Productos
              </Button>
              <Button variant="outline" className="flex-1">
                <Calculator className="h-4 w-4 mr-2" />
                Calculadora
              </Button>
              <Button variant="outline" className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito
              </Button>
            </div>

            {/* Products Table */}
            <InvoiceTable
              products={selectedProducts}
              onUpdateQuantity={updateQuantity}
              onRemoveProduct={removeProduct}
            />
          </div>
        </div>

        {/* Right Side - Totals */}
        <div className="w-80 bg-white border-l p-4 overflow-auto">
          <TotalsSummary totals={calculateTotals()} />
          <div className="mt-4">
            <Select defaultValue="USD">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar Moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">Dólares ($)</SelectItem>
                <SelectItem value="BS">Bolívares (Bs.)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button className="w-full">
              Procesar Venta
            </Button>
          </div>
        </div>
      </div>

      {/* Product Search Modal */}
      <ProductSearch
        open={isProductSearchOpen}
        onClose={() => setIsProductSearchOpen(false)}
        onSelect={addProduct}
      />

      {/* Customer Search Modal */}
      <CustomerSearch
        open={isCustomerSearchOpen}
        onClose={() => setIsCustomerSearchOpen(false)}
        onSelect={setSelectedCustomer}
      />
    </div>
  )
}

