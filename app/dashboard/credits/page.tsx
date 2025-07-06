'use client'

import { useState, useEffect } from 'react'
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
import { createClient } from '@/utils/supabase/client'
import Cookies from 'js-cookie'
import InvoiceItemsModal from '@/app/components/InvoiceItemsModal'
import PaymentModal from '@/app/components/PaymentModal'
import CustomerInvoicesModal from '@/app/components/CustomerInvoicesModal'
import { Credit, Factura, InvoiceItem, NewCredit } from '@/app/types/credits'

// Constants
const DECIMAL_TOLERANCE = 0.01

// Utility functions
const isApproximatelyEqual = (a: number, b: number, tolerance: number = DECIMAL_TOLERANCE): boolean => {
  return Math.abs(a - b) <= tolerance
}

const isApproximatelyZero = (value: number, tolerance: number = DECIMAL_TOLERANCE): boolean => {
  return Math.abs(value) <= tolerance
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

const getPendingAmount = (credit: Credit): number => {
  return credit.pending_amount ?? credit.total
}

const isCreditPaid = (credit: Credit): boolean => {
  return isApproximatelyZero(getPendingAmount(credit))
}

export default function CreditList() {
  // State
  const [credits, setCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [newCredit, setNewCredit] = useState<NewCredit>({ name: '', amount: '', products: '' })
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCredits, setModalCredits] = useState<Factura[]>([])
  const [modalCustomer, setModalCustomer] = useState<{ id?: string, name: string } | null>(null)
  const [modalCreditsLoading, setModalCreditsLoading] = useState(false)
  
  const [invoiceItemsModalOpen, setInvoiceItemsModalOpen] = useState(false)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('')
  const [invoiceItemsLoading, setInvoiceItemsLoading] = useState(false)
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)

  const supabase = createClient()

  // Helper functions
  const getUserId = (): string | undefined => {
    return Cookies.get("user_id")
  }

  const groupCreditsByCustomer = (credits: any[]): Credit[] => {
    return credits.reduce((acc: Credit[], credit) => {
      const existingCredit = acc.find(c => 
        (credit.customer_id && c.customer_id === credit.customer_id) || 
        (!credit.customer_id && c.customer_name === credit.customer_name)
      )
      
      if (existingCredit) {
        existingCredit.total += credit.total
        existingCredit.pending_amount = (existingCredit.pending_amount ?? 0) + (credit.pending_amount ?? 0)
      } else {
        acc.push({
          customer_id: credit.customer_id,
          customer_name: credit.customer_name,
          total: credit.total,
          pending_amount: credit.pending_amount ?? 0,
          status: credit.status
        })
      }
      return acc
    }, [])
  }

  const deleteInvoiceItemsForCredits = async (creditIds: string[]): Promise<void> => {
    if (creditIds.length === 0) return
    
    // Obtener los invoice_ids de los créditos que se van a eliminar
    const { data: creditsData } = await supabase
      .from("credits")
      .select("id, invoice_id")
      .in("id", creditIds)
    
    if (!creditsData || creditsData.length === 0) return
    
    // Extraer los invoice_ids únicos
    const invoiceIds = creditsData
      .map(credit => credit.invoice_id)
      .filter((id): id is string => id !== null && id !== undefined)
    
    if (invoiceIds.length === 0) return
    
    // Eliminar todos los invoice_items asociados
    const { error: deleteItemsError } = await supabase
      .from("invoice_items")
      .delete()
      .in("invoice_id", invoiceIds)
    
    if (deleteItemsError) {
      console.error("Error deleting invoice items:", deleteItemsError)
    }
  }

  const cleanupZeroCredits = async (userId: string): Promise<void> => {
    const { data: creditsToDelete } = await supabase
      .from("credits")
      .select("id")
      .eq("user_id", userId)
      .lte("pending_amount", DECIMAL_TOLERANCE)

    if (creditsToDelete && creditsToDelete.length > 0) {
      const idsToDelete = creditsToDelete.map(credit => credit.id)
      
      // Primero eliminar los invoice_items asociados
      await deleteInvoiceItemsForCredits(idsToDelete)
      
      // Luego eliminar los créditos
      await supabase
        .from("credits")
        .delete()
        .in("id", idsToDelete)
    }
  }

  const fetchAndGroupCredits = async (userId: string): Promise<Credit[]> => {
    const { data, error } = await supabase
      .from("credits")
      .select("customer_id, customer_name, total, pending_amount, status")
      .eq("user_id", userId)
      .order("customer_name")

    if (error) return []
    return groupCreditsByCustomer(data || [])
  }

  // Main functions
  const fetchCredits = async (): Promise<void> => {
    setLoading(true)
    const userId = getUserId()
    
    if (!userId) {
      setCredits([])
      setLoading(false)
      return
    }

    await cleanupZeroCredits(userId)
    const groupedCredits = await fetchAndGroupCredits(userId)
    setCredits(groupedCredits)
    setLoading(false)
  }

  const addCredit = async (): Promise<void> => {
    const userId = getUserId()
    if (!userId || !newCredit.name || !newCredit.amount) return

    const { error } = await supabase.from("credits").insert([{
      customer_name: newCredit.name,
      total: Number(newCredit.amount),
      pending_amount: Number(newCredit.amount),
      products: newCredit.products,
      status: "pendiente",
      user_id: userId,
    }])

    if (!error) {
      setNewCredit({ name: '', amount: '', products: '' })
      
      // Limpiar créditos con pending_amount = 0 y sus invoice_items
      await cleanupZeroCredits(userId)
      
      // Refrescar la lista
      const groupedCredits = await fetchAndGroupCredits(userId)
      setCredits(groupedCredits)
    }
  }

  const handleViewFacturas = async (customer_id: string | undefined, customer_name: string): Promise<void> => {
    if (!customer_id && !customer_name) return
    
    setModalOpen(true)
    setModalCustomer({ id: customer_id, name: customer_name })
    setModalCreditsLoading(true)
    
    const userId = getUserId()
    if (!userId) return

    let query = supabase.from("credits").select("*").eq("user_id", userId)
    if (customer_id) {
      query = query.eq("customer_id", customer_id)
    } else {
      query = query.eq("customer_name", customer_name)
    }
    
    const { data } = await query
    setModalCredits(data || [])
    setModalCreditsLoading(false)
  }

  const handleViewInvoiceItems = async (invoiceId: string): Promise<void> => {
    setSelectedInvoiceId(invoiceId)
    setInvoiceItemsModalOpen(true)
    setInvoiceItemsLoading(true)
    
    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
    
    if (error) {
      console.error("Error fetching invoice items:", error)
      setInvoiceItems([])
    } else {
      setInvoiceItems(data || [])
    }
    setInvoiceItemsLoading(false)
  }

  const handlePayment = (credit: Credit): void => {
    setSelectedCredit(credit)
    setPaymentAmount('')
    setPaymentModalOpen(true)
  }

  const handleProcessPayment = async (): Promise<void> => {
    if (!selectedCredit || !paymentAmount || parseFloat(paymentAmount) <= 0) return
    
    setPaymentLoading(true)
    const userId = getUserId()
    if (!userId) return

    const paymentValue = parseFloat(paymentAmount)
    
    try {
      // Fetch customer credits
      const { data: creditData, error: fetchError } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", userId)
        .eq("customer_id", selectedCredit.customer_id)
        .eq("customer_name", selectedCredit.customer_name)
        .order("created_at", { ascending: true })

      if (fetchError || !creditData || creditData.length === 0) {
        console.error("Error fetching credits:", fetchError)
        setPaymentLoading(false)
        return
      }

      // Validate payment amount
      const totalPending = creditData.reduce((sum, c) => sum + (c.pending_amount ?? 0), 0)
      if (paymentValue > totalPending + DECIMAL_TOLERANCE) {
        alert(`El monto a pagar (${formatCurrency(paymentValue)}) no puede ser mayor al monto pendiente total (${formatCurrency(totalPending)})`)
        setPaymentLoading(false)
        return
      }

      // Process payment distribution
      let remainingPayment = paymentValue
      const updates: any[] = []
      const toDelete: string[] = []
      
      for (const credit of creditData) {
        if (remainingPayment <= DECIMAL_TOLERANCE) break
        
        const currentPendingAmount = credit.pending_amount ?? credit.total
        if (currentPendingAmount <= DECIMAL_TOLERANCE) continue
        
        const paymentForThisCredit = Math.min(remainingPayment, currentPendingAmount)
        const newPendingAmount = Math.max(0, currentPendingAmount - paymentForThisCredit)
        const newStatus = newPendingAmount <= DECIMAL_TOLERANCE ? "pagado" : "pendiente"
        
        if (newPendingAmount <= DECIMAL_TOLERANCE) {
          toDelete.push(credit.id)
        } else {
          updates.push({
            id: credit.id,
            pending_amount: newPendingAmount,
            status: newStatus
          })
        }
        
        remainingPayment -= paymentForThisCredit
      }
      
      // Update credits
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from("credits")
          .update({
            pending_amount: update.pending_amount,
            status: update.status
          })
          .eq("id", update.id)
        
        if (updateError) {
          console.error("Error updating credit:", updateError)
          setPaymentLoading(false)
          return
        }
      }
      
      // Delete paid credits and their invoice_items
      if (toDelete.length > 0) {
        // Primero eliminar los invoice_items asociados
        await deleteInvoiceItemsForCredits(toDelete)
        
        // Luego eliminar los créditos
        const { error: deleteError } = await supabase
          .from("credits")
          .delete()
          .in("id", toDelete)
        
        if (deleteError) {
          console.error("Error deleting credits:", deleteError)
          setPaymentLoading(false)
          return
        }
      }
      
      // Refresh credits list
      await fetchCredits()
      
      // Reset payment modal
      setPaymentModalOpen(false)
      setSelectedCredit(null)
      setPaymentAmount('')
      
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setPaymentLoading(false)
    }
  }



  // Effects
  useEffect(() => {
    fetchCredits()
  }, [])



  return (
    <div className="">
      <h3 className="pl-10 pt-6 text-2xl font-bold mb-6 text-gray-800">Créditos</h3>
      
     

      {/* Credits Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Cliente</TableHead>
            <TableHead>Monto Total (USD)</TableHead>
            <TableHead>Monto Pendiente (USD)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
            </TableRow>
          ) : credits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No hay créditos registrados.</TableCell>
            </TableRow>
          ) : (
            credits.map((credit) => (
              <TableRow key={credit.customer_id || credit.customer_name}>
                <TableCell>{credit.customer_name}</TableCell>
                <TableCell>{formatCurrency(credit.total)}</TableCell>
                <TableCell>{formatCurrency(getPendingAmount(credit))}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCreditPaid(credit) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isCreditPaid(credit) ? 'Pagado' : 'Pendiente'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewFacturas(credit.customer_id, credit.customer_name)}
                    >
                      Ver facturas
                    </Button>
                    {!isCreditPaid(credit) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePayment(credit)}
                      >
                        Pagar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Customer Invoices Modal */}
      <CustomerInvoicesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={modalCustomer}
        invoices={modalCredits}
        loading={modalCreditsLoading}
        onViewInvoice={handleViewInvoiceItems}
      />

            {/* Invoice Items Modal */}
      <InvoiceItemsModal
        isOpen={invoiceItemsModalOpen}
        onClose={() => setInvoiceItemsModalOpen(false)}
        invoiceItems={invoiceItems}
        loading={invoiceItemsLoading}
      />


      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        credit={selectedCredit}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={setPaymentAmount}
        onProcessPayment={handleProcessPayment}
        loading={paymentLoading}
      />
    </div>
  )
}

