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
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

// Mock data - replace with your actual data source


interface CustomerSearchProps {
  open: boolean
  onClose: () => void
  onSelect: (customer: any) => void
}

export default function CustomerSearch({ open, onClose, onSelect }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setclients] = useState<Client[]>([])
  const [clientSelected, setClientSelected] = useState<Client | undefined>(undefined)
  const router = useRouter();

  useEffect(() => {
    async function getProductList() {
      const token = Cookies.get("token");
      console.log("clientList" , token);
      
      if (!token) {
        router.push("/login");
      } else {
        const clients = await getClientsQuery(token as string);
        setclients(clients);
        console.log(clients);
        
      }
    }
    getProductList();
  }, []);

  const filteredCustomers = clients.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClientClick = (client: Client) => {
    setClientSelected(client);
    onClose(); // Close the dialog after selecting a client
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            className="pl-10 pr-4 py-2 w-full border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Telefono</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} onClick={() => handleClientClick(customer)}>
                <TableCell>{customer.code}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
