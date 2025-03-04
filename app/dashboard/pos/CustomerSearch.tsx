'use client'

import { useEffect, useState } from 'react'
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
import { createClientQuery, getClientsQuery } from '@/app/api/clients/clientsquery'
import { Client } from '@/types'

// Mock data - replace with your actual data source


interface CustomerSearchProps {
  open: boolean
  onClose: () => void
  onSelect: (customer: any) => void
}

export default function CustomerSearch({ open, onClose, onSelect }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setclients] = useState<Client[]>([])

  useEffect(() => {
      async function getProductList() {
          const clients = await getClientsQuery();
          setclients(clients);
        }
      getProductList();
    }, []);

  const filteredCustomers = clients.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredCustomers.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => {
                  onSelect(client)
                  onClose()
                }}
              >
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

