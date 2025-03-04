'use client'

import { useEffect, useState } from 'react'
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
import { Pencil, Plus, Trash2 } from 'lucide-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { getClientsQuery } from '@/app/api/clients/clientsquery'
import { Client as clientType } from '@/types'




export default function ClientList() {


  const [Clients, setClients] = useState<clientType[]>([])

  const [newClient, setNewClient] = useState<clientType[]>([])
 const router = useRouter();
   useEffect(() => {
      async function getProductList() {
          const token = Cookies.get("token");
           if (!token) {
             router.push("/login");
           } else {
             const clients = await getClientsQuery();
             setClients(clients);
             console.log(clients);
             
            }
          }
      getProductList()
    }, [])
    const addCredit = () => {
    }

  const deleteClient = (id: string) => {
    setClients(Clients.filter(Client => {
        return Client.id !== id
    }))
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex gap-4">
        <Input
          placeholder="Nombre del cliente"
          value={newCredit.name}
          onChange={(e) => setNewCredit({ ...newCredit, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Monto adeudado"
          value={newCredit.amount}
          onChange={(e) => setNewCredit({ ...newCredit, amount: e.target.value })}
        />
        <Input
          placeholder="Productos (separados por coma)"
          value={newCredit.products}
          onChange={(e) => setNewCredit({ ...newCredit, products: e.target.value })}
        />
        <Button onClick={addCredit}>
          <Plus className="mr-2 h-4 w-4" /> Agregar
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nombre del Cliente</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => deleteClient(client.id?.toString() || '')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" className='mx-1' size="sm" onClick={() => handleEditClick(product)}>
                <Pencil className="h-4 w-4 " />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  )
}

