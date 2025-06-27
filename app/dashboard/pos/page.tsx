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
import TotalsSummary from '../products/TotalsSummary'
import CustomerSearch from './CustomerSearch'
import Sidebar from '@/app/components/Sidebar'

interface Product {
  id: string
  name: string
  unit: string
  code: number
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
  // const [selectedClient, setSelectedClient] = useState<ClientTypes | null>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false)
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false);

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
    <div className="flex justify-center items-center max-w-[1800px] mt-6 ">
      <div className="flex flex-col h-full w-full  ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Package2 className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Sistema de Facturación</h2>
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
                      disabled={!!selectedCustomer}
                      value={selectedCustomer?.name || ''}
                      onChange={e => {
                        if (selectedCustomer) {
                          setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                        } else {
                          setSelectedCustomer({ id: '', name: e.target.value, document: '' })
                        }
                      }}
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
            <TotalsSummary totals={calculateTotals()} customer={selectedCustomer} />
            <div className="mt-4">
              <Select defaultValue="Pago">
                <SelectTrigger>
                  <SelectValue placeholder="Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contado">Pago</SelectItem>
                  <SelectItem value="BS">Credito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <Button className="w-full" onClick={() => setShowInvoice(true)}>
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

        {/* Invoice Preview Modal */}
        {showInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Factura Virtual</h2>
              <div className="mb-2">
                <span className="font-semibold">Cliente: </span>
                {selectedCustomer?.name || "No seleccionado"}
              </div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Producto</th>
                    <th className="text-center py-1">Cantidad</th>
                    <th className="text-right py-1">Precio</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="py-1">{p.name}</td>
                      <td className="text-center py-1">{p.quantity}</td>
                      <td className="text-right py-1">${p.price.toFixed(2)}</td>
                      <td className="text-right py-1">${(p.price * p.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Subtotal:</span>
                <span>
                  $
                  {selectedProducts
                    .reduce((sum, p) => sum + p.price * p.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IVA (16%):</span>
                <span>
                  $
                  {(
                    selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) *
                    0.16
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>
                  $
                  {(
                    selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) *
                      1.16
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowInvoice(false)}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

