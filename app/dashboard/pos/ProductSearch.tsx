"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createClient } from "@/utils/supabase/client";

interface ProductSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: any) => void;
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        {open && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code or description..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    onSelect(product);
                    onClose();
                  }}
                >
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
