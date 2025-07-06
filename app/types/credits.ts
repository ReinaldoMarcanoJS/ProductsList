export interface Credit {
  customer_id?: string
  customer_name: string
  total: number
  status?: string
  pending_amount?: number
}

export interface Factura {
  id: string
  customer_id?: string
  customer_name: string
  total: number
  products?: string
  status?: string
  created_at?: string
  invoice_id?: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  product_name: string
  unit: string
  quantity: number
  price: number
  total: number
}

export interface NewCredit {
  name: string
  amount: string
  products: string
} 