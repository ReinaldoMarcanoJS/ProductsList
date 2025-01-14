'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data - replace with your actual data source
const mockProducts = [
  { id: '1', code: 'P001', description: 'Producto 1', unit: 'UND', price: 10.99 },
  { id: '2', code: 'P002', description: 'Producto 2', unit: 'UND', price: 20.99 },
  { id: '3', code: 'P003', description: 'Producto 3', unit: 'UND', price: 15.99 },
]

interface ProductSearchProps {
  open: boolean
  onClose: () => void
  onSelect: (product: any) => void
}

export default function ProductSearch({ open, onClose, onSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = mockProducts.filter(product =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Buscar Productos</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o descripción..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => {
                  onSelect(product)
                  onClose()
                }}
              >
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

