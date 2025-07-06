'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { format } from 'date-fns'
import { Search, Users, Calculator, ShoppingCart, Package2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProductSearch from './ProductSearch'
import InvoicePreviewModal from './InvoicePreviewModal'
import InvoiceTable from './InvoiceTable'
import TotalsSummary from './TotalsSummary'
import CustomerSearch from './CustomerSearch'
import Sidebar from '@/app/components/Sidebar'
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string
  name: string
  unit: string
  code: number
  price: number
  quantity: number
}

// Asegúrate de que Customer pueda ser null o un objeto, pero no el string "Contado"
interface Customer {
  id: string
  name: string
  document: string
}

interface isCredit {

}

export default function InvoiceSystem() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [productCode, setProductCode] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentType, setPaymentType] = useState<"Pago" | "Credito">('Pago');
  const [taxRate, setTaxRate] = useState<number>(0); // IVA configurable, inicialmente en 0%

  const productInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const toast = useToast();

  useEffect(() => {
    async function getProductList() {
      const userId = Cookies.get("user_id");
      if (!userId) {
        router.push("/login");
        return;
      }
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("userId", userId);
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        setProducts([]);
      }
    }
    getProductList();
  }, []);

  const addProduct = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === product.id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === productId ? { ...p, quantity } : p
    ));
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, product) =>
      sum + (product.price * product.quantity), 0
    );
    const tax = subtotal * (taxRate / 100); // Usar el IVA configurable
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const findProductByCode = (code: string): Product | undefined => {
    const product = products.find(p => p.code.toString() === code);
    if (product) {
      addProduct(product);
      return product;
    }
    return undefined;
  };

  const handleProductCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && productCode.trim() !== "") {
      const product = findProductByCode(productCode.trim());
      if (product) {
        addProduct(product);
        setProductCode('');
        productInputRef.current?.focus();
      } else {
        toast.toast({
          title: "Producto no encontrado",
          description: `No se encontró un producto con el código ${productCode.trim()}`,
          variant: "destructive",
        });
      }
    }
  };

  const clearForm = () => {
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setProductCode('');
    setPaymentType('Pago');
    // Enfocar el input del código del producto para la siguiente venta
    productInputRef.current?.focus();
  };

  return (
    <div className="flex justify-center items-center max-w-[1800px] mt-6 ">
      <div className="flex flex-col h-full w-full  ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Package2 className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Sistema de Facturación</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {format(new Date(), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Invoice Details */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid gap-4">
              {/* Customer Selection */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Cliente"
                      disabled={!!selectedCustomer}
                      value={selectedCustomer?.name || ''}
                      onChange={e => {
                        if (selectedCustomer) {
                          setSelectedCustomer({ ...selectedCustomer, name: e.target.value });
                        } else {
                          setSelectedCustomer({ id: '', name: e.target.value, document: '' });
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomerSearchOpen(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Buscar Cliente
                  </Button>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => setIsProductSearchOpen(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Productos
                </Button>
                <Input
                  ref={productInputRef}
                  className="flex-1"
                  type='number'
                  placeholder="Código del producto"
                  value={productCode}
                  onChange={e => setProductCode(e.target.value)}
                  onKeyDown={handleProductCodeKeyDown}
                />
              </div>

              {/* Products Table */}
              <InvoiceTable
                products={selectedProducts}
                onUpdateQuantity={updateQuantity}
                onRemoveProduct={removeProduct}
              />
            </div>
          </div>

          {/* Right Side - Totals */}
          <div className="w-80 bg-white border-l p-4 overflow-auto">
            {/* Tax Rate Configuration */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje de IVA
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 100) {
                      setTaxRate(value);
                    } else if (e.target.value === '') {
                      setTaxRate(0);
                    }
                  }}
                  className="flex-1"
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTaxRate(0)}
                  className="flex-1 text-xs"
                >
                  0%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTaxRate(16)}
                  className="flex-1 text-xs"
                >
                  16%
                </Button>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Ingresa el porcentaje de IVA (0-100%)
              </div>
            </div>
            
            <TotalsSummary totals={calculateTotals()} customer={selectedCustomer} taxRate={taxRate} />
            <div className="mt-4">
              <Select value={paymentType} onValueChange={(value) => setPaymentType(value as "Pago" | "Credito")}>
                <SelectTrigger>
                  <SelectValue placeholder="Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Credito">Credito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <Button
                className="w-full"
                onClick={() => {
                  if (selectedProducts.length === 0) {
                    toast.toast({
                      title: "No hay productos",
                      description: "Debes agregar al menos un producto para procesar la venta.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setShowInvoice(true);
                }}
              >
                Procesar Venta
              </Button>
            </div>
          </div>
        </div>

        {/* Product Search Modal */}
        <ProductSearch
          open={isProductSearchOpen}
          onClose={() => setIsProductSearchOpen(false)}
          onSelect={addProduct}
        />

        {/* Customer Search Modal */}
        <CustomerSearch
          open={isCustomerSearchOpen}
          onClose={() => setIsCustomerSearchOpen(false)}
          onSelect={setSelectedCustomer}
        />

        {/* Invoice Preview Modal */}
        {showInvoice &&
          <InvoicePreviewModal
            selectedProducts={selectedProducts}
            selectedCustomer={selectedCustomer}
            onClose={() => setShowInvoice(false)}
            setShowInvoice={setShowInvoice}
            iscredit={paymentType}
            onClearForm={clearForm}
            taxRate={taxRate}
          />
        }
      </div>
    </div>
  )
}

