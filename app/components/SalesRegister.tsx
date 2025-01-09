'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'

interface Sale {
  id: number
  customer: string
  product: string
  amount: number
  paymentMethod: 'Crédito' | 'Débito'
  date: string
}

export default function SalesRegister() {
  const [sales, setSales] = useState<Sale[]>([])
  const [newSale, setNewSale] = useState({
    customer: '',
    product: '',
    amount: '',
    paymentMethod: 'Débito' as 'Crédito' | 'Débito'
  })

  const addSale = () => {
    if (newSale.customer && newSale.product && newSale.amount) {
      setSales([...sales, {
        id: sales.length + 1,
        customer: newSale.customer,
        product: newSale.product,
        amount: parseFloat(newSale.amount),
        paymentMethod: newSale.paymentMethod,
        date: new Date().toLocaleString()
      }])
      setNewSale({
        customer: '',
        product: '',
        amount: '',
        paymentMethod: 'Débito'
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Input
          placeholder="Nombre del cliente"
          value={newSale.customer}
          onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
        />
        <Input
          placeholder="Producto"
          value={newSale.product}
          onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Monto"
          value={newSale.amount}
          onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })}
        />
        <Select
          value={newSale.paymentMethod}
          onValueChange={(value: 'Crédito' | 'Débito') => setNewSale({ ...newSale, paymentMethod: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Método de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Crédito">Crédito</SelectItem>
            <SelectItem value="Débito">Débito</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addSale}>
          <Plus className="mr-2 h-4 w-4" /> Registrar Venta
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método de Pago</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell>{sale.product}</TableCell>
              <TableCell>${sale.amount.toFixed(2)}</TableCell>
              <TableCell>{sale.paymentMethod}</TableCell>
              <TableCell>{sale.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

