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
import { Plus, Trash2 } from 'lucide-react'

interface Credit {
  id: number
  name: string
  amount: number
  products: string
}

export default function CreditList() {
  const [credits, setCredits] = useState<Credit[]>([
    { id: 2, name: 'María García', amount: 150, products: 'Producto C' },
  ])
  const [newCredit, setNewCredit] = useState({ name: '', amount: '', products: '' })

  const addCredit = () => {
    if (newCredit.name && newCredit.amount && newCredit.products) {
      setCredits([...credits, { 
        id: credits.length + 1, 
        name: newCredit.name, 
        amount: parseFloat(newCredit.amount),
        products: newCredit.products
      }])
      setNewCredit({ name: '', amount: '', products: '' })
    }
  }

  const deleteCredit = (id: number) => {
    setCredits(credits.filter(credit => credit.id !== id))
  }

  return (
    <div className="">
      <h3 className="pl-10 text-2xl font-bold mb-6 text-gray-800">Créditos</h3>
      <div className="flex gap-4">
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
            <TableHead>ID</TableHead>
            <TableHead>Nombre del Cliente</TableHead>
            <TableHead>Monto Adeudado (USD)</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credits.map((credit) => (
            <TableRow key={credit.id}>
              <TableCell>{credit.id}</TableCell>
              <TableCell>{credit.name}</TableCell>
              <TableCell>${credit.amount.toFixed(2)}</TableCell>
              <TableCell>{credit.products}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => deleteCredit(credit.id)}>
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

