import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Factura } from '@/app/types/credits'

interface CustomerInvoicesModalProps {
  isOpen: boolean
  onClose: () => void
  customer: { id?: string, name: string } | null
  invoices: Factura[]
  loading: boolean
  onViewInvoice: (invoiceId: string) => void
}

// Utility function
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

export default function CustomerInvoicesModal({
  isOpen,
  onClose,
  customer,
  invoices,
  loading,
  onViewInvoice
}: CustomerInvoicesModalProps) {
  if (!isOpen || !customer) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Facturas de {customer?.name || 'Cliente'}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="overflow-y-auto max-h-[60vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay facturas a crédito.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((factura) => (
                      <TableRow key={factura.id}>
                        <TableCell>{formatCurrency(factura.total)}</TableCell>
                        <TableCell>{factura.status || "pendiente"}</TableCell>
                        <TableCell>{factura.products || "-"}</TableCell>
                        <TableCell>
                          {factura.created_at
                            ? new Date(factura.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewInvoice(factura.invoice_id || factura.id)}
                          >
                            Ver factura
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 