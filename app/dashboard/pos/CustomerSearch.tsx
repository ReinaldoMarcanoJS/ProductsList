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
const mockCustomers = [
  { id: '1', name: 'Juan Pérez', document: 'V-12345678' },
  { id: '2', name: 'María García', document: 'V-87654321' },
  { id: '3', name: 'Carlos López', document: 'V-23456789' },
]

interface CustomerSearchProps {
  open: boolean
  onClose: () => void
  onSelect: (customer: any) => void
}

export default function CustomerSearch({ open, onClose, onSelect }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.document.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o documento..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Nombre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => {
                  onSelect(customer)
                  onClose()
                }}
              >
                <TableCell>{customer.document}</TableCell>
                <TableCell>{customer.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

