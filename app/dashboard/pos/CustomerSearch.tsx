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
import { toast } from "@/hooks/use-toast";
import {createClient} from '@/utils/supabase/client'
import { useAuth } from '@/hooks/use-auth'

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
  const supabase = createClient();
  const { userId, loading: authLoading } = useAuth();

  const fetchSupabaseClients = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("userId", userId);

      if (error) throw error;
      setclients(data || []);
    } catch (error) {
      console.error("Error fetching clients from Supabase:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los clientes desde Supabase.",
      });
    } 
  };

  useEffect(() => {
    if (!authLoading && userId) {
      fetchSupabaseClients()
    }
  }, [userId, authLoading]);

  const filteredCustomers = clients.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClientClick = (client: Client) => {
    setClientSelected(client);
    // Guarda el cliente seleccionado en las cookies
    Cookies.set('selected_client', JSON.stringify(client), { expires: 1 });
    onSelect(client); // Notifica al componente padre
    onClose(); // Cierra el diálogo después de seleccionar un cliente
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            className="pl-10 pr-4 py-2 w-full border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="overflow-y-auto max-h-[60vh] border rounded">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow>
                  <TableHead className="bg-white">Código</TableHead>
                  <TableHead className="bg-white">Nombre</TableHead>
                  <TableHead className="bg-white">Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No se encontraron clientes.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow 
                      key={customer.id} 
                      onClick={() => handleClientClick(customer)}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <TableCell>{customer.code}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
