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

interface Product {
  id: number
  name: string
  priceUSD: number
}

const EXCHANGE_RATE = 35.5 // Tasa de cambio ficticia, deberías usar una API para obtener la tasa real

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Producto A', priceUSD: 19.99 },
    { id: 2, name: 'Producto B', priceUSD: 29.99 },
    { id: 3, name: 'Producto C', priceUSD: 15.99 },
  ])
  const [newProduct, setNewProduct] = useState({ name: '', priceUSD: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const addProduct = () => {
    if (newProduct.name && newProduct.priceUSD) {
      setProducts([...products, { 
        id: products.length + 1, 
        name: newProduct.name, 
        priceUSD: parseFloat(newProduct.priceUSD) 
      }])
      setNewProduct({ name: '', priceUSD: '' })
    }
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Input
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Precio (USD)"
          value={newProduct.priceUSD}
          onChange={(e) => setNewProduct({ ...newProduct, priceUSD: e.target.value })}
        />
        <Button onClick={addProduct}>
          <Plus className="mr-2 h-4 w-4" /> Agregar
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre del Producto</TableHead>
            <TableHead>Precio (USD)</TableHead>
            <TableHead>Precio (BS)</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.priceUSD.toFixed(2)}</TableCell>
              <TableCell>Bs. {(product.priceUSD * EXCHANGE_RATE).toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
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

