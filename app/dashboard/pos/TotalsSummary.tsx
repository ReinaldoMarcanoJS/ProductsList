import { get } from "http"
import React, { useEffect } from "react"
import Cookies from "js-cookie"
import { DolarQuery } from "@/types"
interface TotalsSummaryProps {
    totals: {
      subtotal: number
      tax: number
      total: number
    }
  }
  
  export default function TotalsSummary({ totals }: TotalsSummaryProps) {
    const [dolarBcv, setDolarBcv] = React.useState<null | DolarQuery>()
    useEffect(() => {
      const dolarCookie = Cookies.get("dolar");
      if (dolarCookie) {
        try {
          const dolar: DolarQuery = JSON.parse(dolarCookie);
          setDolarBcv(dolar)
        } catch (error) {
          console.error("Error parsing dolar cookie:", error);
        }
      }
    }, []);


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
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Bolivares:</span>
            <span>{dolarBcv ? (totals.total * dolarBcv.promedio).toFixed(2) : "Cargando..."}</span>
        </div>
      </div>
    )
  }
  
  