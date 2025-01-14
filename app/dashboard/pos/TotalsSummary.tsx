interface TotalsSummaryProps {
    totals: {
      subtotal: number
      tax: number
      total: number
    }
  }
  
  export default function TotalsSummary({ totals }: TotalsSummaryProps) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Gravable:</span>
          <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Exento:</span>
          <span className="font-medium">$0.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Bruto:</span>
          <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Impuestos:</span>
          <span className="font-medium">${totals.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Neto:</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>
    )
  }
  
  