import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { InvoiceItem } from '@/app/types/credits'

interface InvoiceItemsModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceItems: InvoiceItem[]
  loading: boolean
}

// Utility function
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

export default function InvoiceItemsModal({ 
  isOpen, 
  onClose, 
  invoiceItems, 
  loading 
}: InvoiceItemsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">
          Productos de la Factura
        </h2>
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No hay productos en esta factura.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoiceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="mt-4 text-right">
              <div className="text-lg font-bold">
                Total: {formatCurrency(invoiceItems.reduce((sum, item) => sum + item.total, 0))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 