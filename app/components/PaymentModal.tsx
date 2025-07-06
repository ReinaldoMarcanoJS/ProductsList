import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Credit } from '@/app/types/credits'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  credit: Credit | null
  paymentAmount: string
  onPaymentAmountChange: (amount: string) => void
  onProcessPayment: () => void
  loading: boolean
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

const getPendingAmount = (credit: Credit): number => {
  return credit.pending_amount ?? credit.total
}

export default function PaymentModal({
  isOpen,
  onClose,
  credit,
  paymentAmount,
  onPaymentAmountChange,
  onProcessPayment,
  loading
}: PaymentModalProps) {
  if (!isOpen || !credit) return null

  const pendingAmount = getPendingAmount(credit)

  const setExactPaymentAmount = (): void => {
    onPaymentAmountChange(pendingAmount.toString())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">
          Registrar Pago
        </h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Cliente: <span className="font-semibold">{credit.customer_name}</span>
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Monto total: <span className="font-semibold">{formatCurrency(credit.total)}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Monto pendiente: <span className="font-semibold">{formatCurrency(pendingAmount)}</span>
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto del pago (USD)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max={pendingAmount}
            placeholder="0.00"
            value={paymentAmount}
            onChange={(e) => onPaymentAmountChange(e.target.value)}
          />
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={setExactPaymentAmount}
              disabled={loading}
            >
              Pagar monto exacto ({formatCurrency(pendingAmount)})
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onProcessPayment}
            disabled={loading || !paymentAmount || parseFloat(paymentAmount) <= 0}
          >
            {loading ? "Procesando..." : "Registrar Pago"}
          </Button>
        </div>
      </div>
    </div>
  )
} 