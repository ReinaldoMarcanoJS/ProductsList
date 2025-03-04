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
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { addProductQuery, deleteProductQuery, getProductsQuery, updateProductQuery } from '../api/products/productsquery'
import { Product } from '@/types'
import { useToast } from '@/hooks/use-toast'
import Cookies from 'js-cookie';
import { log } from 'console';


const EXCHANGE_RATE = 35.5 // Tasa de cambio ficticia, deberías usar una API para obtener la tasa real

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Product>()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toast = useToast()
  const router = useRouter();
  useEffect(() => {
    async function getProductList() {
        const token = Cookies.get("token");
         if (!token) {
           router.push("/login");
         } else {
           const products = await getProductsQuery(token as string);
           setProducts(products);
          }
        }
    getProductList()
  }, [])

 

  const addProduct = async (product: Product) => {
    const newProduct = {
      ...product,
      userId : "0d8bdd00-a799-4b47-a46f-0503adb080c6"
    }
      if (newProduct && newProduct.name && newProduct.price) {
        const res = await addProductQuery(newProduct)
        console.log("res",res);
        if (res.message === "ok") {
          const updatedProducts = await getProductsQuery(Cookies.get("token") as string);
          console.log("updatedProducts",updatedProducts);
          setProducts(updatedProducts);
          setNewProduct({
            id: "",
            name: '',
            userId: '',
            code: 0,
            price: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } else {
          toast.toast({
            description: res.type,
            title: res.message
          })
          
        }
      }
  }

  const deleteProduct = async (id: string) => {
    try {
      const deletedProduct = await deleteProductQuery(id)
      console.log(deletedProduct);
      
      if (deletedProduct.message === "ok") {
        setProducts(products.filter(product => product.id !== id))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateProduct = async (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    
    try {
      const updatedProduct = await updateProductQuery(product)
      if (updatedProduct.message === "ok") {
        setProducts(products.map(p => p.id === product.id ? product : p))
        setEditingProduct(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setNewProduct(product)
  }

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (newProduct) {
      if (editingProduct) {
        await updateProduct(newProduct, e)
      } else {
        await addProduct(newProduct)
      }
      setNewProduct({
        id: "",
        name: '',
        userId: '',
        code: 0,
        price: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  useEffect(() => {
    const filteredProducts = products.length > 0 ? products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.id && product.id.toString().includes(searchTerm)) ||
      product.code.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.code - b.code) : []

    console.log(filteredProducts);
    setFilteredProducts(filteredProducts)
  }, [products])

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
          value={newProduct?.name || ''}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value, code: newProduct?.code || 0, price: newProduct?.price || 0, createdAt: newProduct?.createdAt || new Date(), updatedAt: newProduct?.updatedAt || new Date() })}
        />
        <Input
          type="number"
          placeholder="Precio (USD)"
          value={newProduct?.price || 0}
          onChange={(e) => setNewProduct({ ...newProduct,price: parseFloat(e.target.value), code: newProduct?.code || 0, name: newProduct?.name || '', createdAt: newProduct?.createdAt || new Date(), updatedAt: newProduct?.updatedAt || new Date() })}
        />
        <Button onClick={(e) => handleSaveClick(e)}>
          <Plus className="mr-2 h-4 w-4" /> {editingProduct ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nombre del Producto</TableHead>
            <TableHead>Precio (USD)</TableHead>
            <TableHead>Precio (BS)</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>Bs. {(product.price * EXCHANGE_RATE).toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => product.id !== undefined && deleteProduct(product.id)}>
                <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" className='mx-1' size="sm" onClick={() => handleEditClick(product)}>
                <Pencil className="h-4 w-4 " />
                </Button>
              </TableCell>
              </TableRow>
            ))
            ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
              No hay productos todavía.
              </TableCell>
            </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  )
}
