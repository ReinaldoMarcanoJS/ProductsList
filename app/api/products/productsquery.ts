import { Product } from "@/types";
import { log } from "console";

interface productQueryType {
  message: string;
  type?: string;
  product?: Product;
}
// Get

export const getProductsQuery = async (token : string): Promise<Product[]> => {
  const response = await fetch("http://localhost:3001/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return await response.json();
};

// ADD PRODUCT

export const addProductQuery = async (
  product: Product
): Promise<productQueryType> => {
  const response = await fetch("http://localhost:3001/api/products/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  body: JSON.stringify(product),
  });

  return await response.json();
};

// DELETE

export const deleteProductQuery = async (
  id: string
): Promise<productQueryType> => {
  const deletedProduct = await fetch(
    `http://localhost:3001/api/products/${id}`,
    {
      method: "DELETE",
    }
  );

  return await deletedProduct.json();
};

//

export const updateProductQuery = async (
  product: Product
): Promise<productQueryType> => {
  const updatedProduct = await fetch(`http://localhost:3001/api/products/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });    

  return await updatedProduct.json();
};
