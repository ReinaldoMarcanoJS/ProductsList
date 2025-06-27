"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Client, DolarQuery, Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import Sidebar from "../../components/Sidebar";
import { createClient } from "@/utils/supabase/client";

const EXCHANGE_RATE = 35.5; // Tasa de cambio ficticia

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dolarBcv, setDolarBcv] = useState<DolarQuery | null>(null);
  
  const toast = useToast();
  const router = useRouter();
  const supabase = createClient();

  // Estado para saber si se está borrando un producto
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Obtener productos de Supabase
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
    async function getProductList() {
      setIsLoading(true);
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
        console.error("Error fetching products:", error);
        toast.toast({
          title: "Error",
          description: "No se pudieron obtener los productos.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    getProductList();
  }, []);

  // Agregar producto a Supabase
  const addProduct = async (product: Product) => {
    const userId = Cookies.get("user_id");
    if (!userId) {
      toast.toast({
        title: "Error",
        description: "No se encontró el usuario.",
      });
      return;
    }
      // Genera un ID numérico aleatorio de 8 dígitos
    const generateRandomNumericId = () => Math.floor(10000000 + Math.random() * 90000000).toString();
    // Encuentra el valor más cercano a 0 que no exista en los códigos actuales
    const existingCodes = products.map(c => c.code);
    let code = 1;
    while (existingCodes.includes(code)) {
      code++;
    }

    const newProductData = {
      ...product,
      id: generateRandomNumericId(), // Genera un ID único
      userId,
      code: code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (newProductData && newProductData.name && newProductData.price) {
      try {
        const { error } = await supabase.from("products").insert([newProductData]);
        if (error) throw error;
        // Refresca la lista
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("userId", userId);
        setProducts(data || []);
        setNewProduct({
          id: "",
          name: "",
          userId: "",
          code: 0,
          price: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error) {
        toast.toast({
          title: "Error",
          description: "No se pudo agregar el producto.",
        });
      }
    }
  };

  // Eliminar producto de Supabase
  const deleteProduct = async (id: string) => {
    setDeletingId(id); // Mostrar "Borrando..." en la fila
    const userId = Cookies.get("user_id");
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      // Refresca la lista
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("userId", userId);
      setProducts(data || []);
    } catch (error) {
      toast.toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
      });
    } finally {
      setDeletingId(null); // Oculta "Borrando..." al terminar
    }
  };

  // Actualizar producto en Supabase
  const updateProduct = async (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const userId = Cookies.get("user_id");
    try {
      const { error } = await supabase
        .from("products")
        .update({
          ...product,
          updatedAt: new Date(),
        })
        .eq("id", product.id);
      if (error) throw error;
      // Refresca la lista
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("userId", userId);
      setProducts(data || []);
      setEditingProduct(null);
    } catch (error) {
      toast.toast({
        title: "Error",
        description: "No se pudo actualizar el producto.",
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
  };

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (newProduct) {
      if (editingProduct) {
        await updateProduct(newProduct, e);
      } else {
        await addProduct(newProduct);
      }
      setNewProduct({
        id: "",
        name: "",
        userId: "",
        code: 0,
        price: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  useEffect(() => {
    const filteredProducts =
      products.length > 0
        ? products
            .filter(
              (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.id && product.id.toString().includes(searchTerm)) ||
                product.code
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.code - b.code)
        : [];

    setFilteredProducts(filteredProducts);
  }, [products, searchTerm]);

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      <h3 className="pl-10 pt-2 text-2xl font-bold mb-2 text-gray-800">Productos</h3>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Input
          placeholder="Nombre del producto"
          value={newProduct?.name || ""}
          onChange={(e) =>
        setNewProduct({
          ...newProduct,
          name: e.target.value,
          code: newProduct?.code || 0,
          price: newProduct?.price || 0,
          createdAt: newProduct?.createdAt || new Date(),
          updatedAt: newProduct?.updatedAt || new Date(),
        })
          }
        />
        <Input
          type="number"
          placeholder="Precio (USD)"
          value={
        newProduct?.price !== undefined &&
        newProduct?.price !== null &&
        newProduct?.price !== 0
          ? newProduct.price
          : ""
          }
          min={0}
          max={999.99}
          step={0.01}
          onChange={(e) => {
        let value = e.target.value;
        // Limita a 3 enteros y 2 decimales
        if (value.match(/^\d{0,3}(\.\d{0,2})?$/)) {
          setNewProduct({
            ...newProduct,
            price: value === "" ? 0 : parseFloat(value),
            code: newProduct?.code || 0,
            name: newProduct?.name || "",
            createdAt: newProduct?.createdAt || new Date(),
            updatedAt: newProduct?.updatedAt || new Date(),
          });
        }
          }}
          onBlur={(e) => {
        // Corrige el valor si es mayor a 999.99
        let value = parseFloat(e.target.value);
        if (value > 999.99) {
          setNewProduct({
            ...newProduct,
            price: 999.99,
            code: newProduct?.code || 0,
            name: newProduct?.name || "",
            createdAt: newProduct?.createdAt || new Date(),
            updatedAt: newProduct?.updatedAt || new Date(),
          });
        }
          }}
        />
        <Button onClick={(e) => handleSaveClick(e)}>
          <Plus className="mr-2 h-4 w-4" />{" "}
          {editingProduct ? "Actualizar" : "Agregar"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nombre del Producto</TableHead>
            <TableHead>Precio (USD)</TableHead>
            <TableHead>Precio (BS)</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Mostrar efectos de carga mientras se obtienen los datos
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <TableCell>
                  <div className="h-10 w-16 bg-gray-300 animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-10 w-32 bg-gray-300 animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-10 w-24 bg-gray-300 animate-pulse rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-10 w-20 bg-gray-300 animate-pulse rounded"></div>
                </TableCell>
              </TableRow>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <TableRow
                key={product.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                {deletingId === product.id ? (
                  <>
                    <TableCell colSpan={5} className="text-center text-indigo-700 font-semibold animate-pulse">
                      Borrando...
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      Bs. {Math.ceil((product.price * (dolarBcv?.promedio ?? EXCHANGE_RATE)) / 5) * 5}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          product.id !== undefined && deleteProduct(product.id)
                        }
                        disabled={!!deletingId}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="mx-1"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                        disabled={!!deletingId}
                      >
                        <Pencil className="h-4 w-4 " />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay productos todavía.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
