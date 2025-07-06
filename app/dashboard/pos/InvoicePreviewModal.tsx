"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

type InvoicePreviewModalProps = {
  selectedProducts: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    unit?: string;
    code?: number;
  }[];
  selectedCustomer: {
    id?: string;
    name: string;
    document?: string;
  } | null;
  onClose: () => void;
  setShowInvoice: (show: boolean) => void;
  iscredit: "Credito" | "Pago";
  onClearForm: () => void;
  taxRate: number;
};

export default function InvoicePreviewModal({
  selectedProducts,
  selectedCustomer,
  onClose,
  setShowInvoice,
  iscredit,
  onClearForm,
  taxRate,
}: InvoicePreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast(); // <-- Aquí, al inicio del componente

  const handleProcesarVenta = async () => {
    setLoading(true);
    const supabase = createClient();
    const invoiceId = uuidv4();
    const userId = Cookies.get("user_id") || "";
    // Calcular totales
    const subtotal = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const tax = subtotal * (taxRate / 100); // Usar el IVA configurable
    const total = subtotal + tax;

    // Puedes obtener el user_id de cookies o contexto de sesión si lo necesitas
    if (!userId) {
      Cookies.remove("user_id");
      window.location.href = "/login";
      setLoading(false);
      return;
    }

    // 1. Insertar la factura
    const { error: invoiceError } = await supabase.from("invoices").insert([
      {
        id: invoiceId,
        customer_name: selectedCustomer?.name || "Consumidor final",
        customer_id: selectedCustomer?.id || null,
        payment_type: iscredit, // <-- Aquí se usa el parámetro
        subtotal,
        tax,
        total,
        user_id: userId,
      },
    ]);

    if (invoiceError) {
      toast.toast({
        title: "Error al guardar la factura",
        description: invoiceError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 2. Insertar los productos de la factura
    const items = selectedProducts.map((product) => ({
      invoice_id: invoiceId,
      product_id: product.id,
      product_name: product.name,
      unit: product.unit || "",
      quantity: product.quantity,
      price: product.price,
      total: product.price * product.quantity,
    }));

    const { error: itemsError } = await supabase.from("invoice_items").insert(items);

    if (itemsError) {
      toast.toast({
        title: "Error al guardar los productos de la factura",
        description: itemsError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 2. Si es crédito, insertar en credits
    if (iscredit === "Credito") {
      const { error: creditError } = await supabase.from("credits").insert([
        {
          invoice_id: invoiceId,
          customer_id: selectedCustomer?.id || null,
          customer_name: selectedCustomer?.name || "Consumidor final",
          total,
          pending_amount: total, // Al crear el crédito, el monto pendiente es el total
          status: "pendiente",
          user_id: userId,
          // due_date: "2024-12-31", // Puedes agregar una fecha de vencimiento si la tienes
        },
      ]);
      if (creditError) {
        toast.toast({
          title: "Error al guardar el crédito",
          description: creditError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    toast.toast({
      title: "Venta realizada",
      description: "La factura se guardó correctamente.",
      variant: "default",
    });

    setLoading(false);
    setShowInvoice(false);
    onClose();
    
    // Limpiar el formulario después de procesar la venta
    onClearForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Factura Virtual</h2>
        <div className="mb-2">
          <span className="font-semibold">Cliente: </span>
          {selectedCustomer?.name || "No seleccionado"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Tipo de pago: </span>
          {iscredit === "Credito" ? "Crédito" : "Pago"}
        </div>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Producto</th>
              <th className="text-center py-1">Cantidad</th>
              <th className="text-right py-1">Precio</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((p) => (
              <tr key={p.id}>
                <td className="py-1">{p.name}</td>
                <td className="text-center py-1">{p.quantity}</td>
                <td className="text-right py-1">${p.price.toFixed(2)}</td>
                <td className="text-right py-1">${(p.price * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Subtotal:</span>
          <span>
            $
            {selectedProducts
              .reduce((sum, p) => sum + p.price * p.quantity, 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>IVA ({taxRate}%):</span>
          <span>
            $
            {(
              selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) *
              (taxRate / 100)
            ).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>
            $
            {(
              selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) *
              (1 + taxRate / 100)
            ).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={() => setShowInvoice(false)}>
            Volver
          </Button>
          <Button onClick={handleProcesarVenta} disabled={loading}>
            {loading ? "Procesando..." : "Realizar venta"}
          </Button>
        </div>
      </div>
    </div>
  );
}