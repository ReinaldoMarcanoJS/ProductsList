'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Product {
  id: string
  code: string
  description: string
  unit: string
  price: number
  quantity: number
}

interface InvoiceTableProps {
  products: Product[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveProduct: (productId: string) => void
}

export default function InvoiceTable({
  products,
  onUpdateQuantity,
  onRemoveProduct,
}: InvoiceTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  className="w-20"
                  value={product.quantity}
                  onChange={(e) => onUpdateQuantity(product.id, parseInt(e.target.value) || 0)}
                />
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

