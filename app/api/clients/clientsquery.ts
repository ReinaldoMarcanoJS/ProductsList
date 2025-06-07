import { User } from "@/types";
import {Client} from "@/types.d";
import React from "react";
interface UserQueryType {
  message: string;
  type?: string;
  user?: User;
  token?: string;
}

export const createClientQuery = async (
  client: Client
): Promise<UserQueryType> => {
  const response = await fetch("http://localhost:3001/api/clients/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });
  return await response.json();
};

export const getClientsQuery = async (token : string) => {
  const response = await fetch("http://localhost:3001/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({token}),
  });
  return await response.json();
};

export const updateClientQuery = async (
  client: Client,
) => {
  const updatedClient = await fetch(`http://localhost:3001/api/clients/${client.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });    

  return await updatedClient.json();
};

// DELETE

export const deleteClientQuery = async (
  id: string
) => {
  const deletedProduct = await fetch(
    `http://localhost:3001/api/clients/${id}`,
    {
      method: "DELETE",
    }
  );

  return await deletedProduct.json();
};
