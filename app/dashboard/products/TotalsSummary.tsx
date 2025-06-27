import { get } from "http"
import React, { useEffect } from "react"
import Cookies from "js-cookie"
import { DolarQuery } from "@/types"

// import { getDolarApi } from "@/lib/getDolarApi";
interface TotalsSummaryProps {
    totals: {
      subtotal: number
      tax: number
      total: number
    };
    customer?: {
      id: string;
      name: string;
      document: string;
    } | null;
  }
  
  export default function TotalsSummary({ totals, customer }: TotalsSummaryProps) {
    const [dolarBcv, setDolarBcv] = React.useState<null | DolarQuery>()
    useEffect(() => {
          try {
            const dolarCookie = Cookies.get("dolar");
            if (dolarCookie) {
              const dolarData: DolarQuery = JSON.parse(dolarCookie);
              setDolarBcv(dolarData);
            } else {
              fetch("https://ve.dolarapi.com/v1/dolares/oficial")
                .then((res) => res.json())
                .then((data) => {
                  setDolarBcv(data);
                  Cookies.set("dolar", JSON.stringify(data), { expires: 1 });
                })
                .catch((error) => {
                  console.error("Error fetching dolar data:", error);
                });
            }
          } catch (error) {
            console.error("Error in useEffect:", error);
          }
    }, []);


    return (
      <div className="space-y-2">
        {customer && (
          <div className="mb-2 p-2 rounded bg-indigo-50 text-indigo-900">
            <div className="font-semibold">Cliente:</div>
            <div>{customer.name}</div>
            {customer.document && (
              <div className="text-xs text-gray-500">Documento: {customer.document}</div>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (16%):</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Bolivares:</span>
            <span>{dolarBcv ? (totals.total * dolarBcv.promedio).toFixed(2) : "Cargando..."}</span>
        </div>
      </div>
    )
  }

