import { User } from "@/types";

interface UserRegisterQueryType {
  message: string;
  type?: string;
  user?: User;
  token?: string;
}

export const registerQuery = async (
  email: string,
  password: string,
  name: string
): Promise<UserRegisterQueryType> => {
  const response = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });
  return await response.json();
};

export const loginQuery = async (
  email: string,
  password: string
): Promise<UserRegisterQueryType> => {
  const response = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await response.json();
};

export const verifyToken = async (token: string) => {
  const response = await fetch("http://localhost:3001/api/auth/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const data = await response.json();
  return data;
};


export const logoutQuery = async (token: string) => {
  const response = await fetch("http://localhost:3001/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return await response.json();
};