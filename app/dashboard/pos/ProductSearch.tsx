"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Product {
  id: string;
  name: string;
  unit: string;
  code: number;
  price: number;
  quantity: number;
}

interface ProductSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export default function ProductSearch({
  open,
  onClose,
  onSelect,
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const supabase = createClient();
  const { userId, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && userId) {
      getProductList();
    }
  }, [userId, authLoading]);

  async function getProductList() {
    if (!userId) return;
    
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

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.id && product.id.toString().includes(searchTerm)) ||
        product.code.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.code - b.code);

  if (!Array.isArray(products)) {
    console.error("Expected an array of products");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Buscar Productos</DialogTitle>
        </DialogHeader>
        {open && (
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código o descripción..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <div className="overflow-y-auto max-h-[60vh] border rounded">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow>
                  <TableHead className="bg-white">Código</TableHead>
                  <TableHead className="bg-white">Producto</TableHead>
                  <TableHead className="bg-white">Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No se encontraron productos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => {
                        onSelect({ ...product, quantity: 1 });
                        onClose();
                      }}
                    >
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
