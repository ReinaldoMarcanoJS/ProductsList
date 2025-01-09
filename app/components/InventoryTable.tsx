import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  
  const inventoryData = [
    { id: 1, name: 'Producto A', stock: 100, price: 19.99 },
    { id: 2, name: 'Producto B', stock: 50, price: 29.99 },
    { id: 3, name: 'Producto C', stock: 75, price: 15.99 },
    { id: 4, name: 'Producto D', stock: 200, price: 9.99 },
    { id: 5, name: 'Producto E', stock: 30, price: 39.99 },
  ]
  
  export default function InventoryTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre del Producto</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  