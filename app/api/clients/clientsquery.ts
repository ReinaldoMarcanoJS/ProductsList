import { User } from "@/types";

interface UserRegisterQueryType {
  message: string;
  type?: string;
  user?: User;
  token?: string;
}

export const createClientQuery = async (
  email: string,
  name: string
): Promise<UserRegisterQueryType> => {
  const response = await fetch("http://localhost:3001/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name }),
  });
  return await response.json();
};

export const getClientsQuery = async () => {
  const response = await fetch("http://localhost:3001/api/clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};