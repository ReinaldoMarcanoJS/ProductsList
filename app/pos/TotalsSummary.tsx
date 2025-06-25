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
  }
  
  export default function TotalsSummary({ totals }: TotalsSummaryProps) {
    const [dolarBcv, setDolarBcv] = React.useState<null | DolarQuery>()
    useEffect(() => {
            fetch("https://ve.dolarapi.com/v1/dolares/oficial")
              .then((res) => res.json())
              .then((data) => {
                // Suponiendo que quieres el promedio del BCV
                
              setDolarBcv(data);
              console.log(data);
              
              Cookies.set("dolar", JSON.stringify(data), { expires: 1 });
                
              })
              .catch((error) => {
                console.error("Error fetching dolar data:", error);
              });
    }, []);


    return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
          <span className="text-sm">Cliente:</span>
          <span className="font-medium">algun cliente</span>
        </div>
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
  
  