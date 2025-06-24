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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Client, Client as clientType } from "@/types";
import Sidebar from "../components/Sidebar";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const supabase = createClient();

 const fetchSupabaseClients = async () => {
      setIsLoading(true);
      try {
        // Obtener el userId de las cookies
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_id="))
          ?.split("=")[1];

        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("userId", userId);

        if (error) throw error;
        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error("Error fetching clients from Supabase:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los clientes desde Supabase.",
        });
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    // Cargar los clientes desde Supabase al montar el componente
    fetchSupabaseClients();

  }, []);

  const addProduct = async (client: Client) => {
    const userId = Cookies.get("user_id");
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener el ID de usuario.",
      });
      return;
    }

    // Genera un ID numérico aleatorio de 8 dígitos
    const generateRandomNumericId = () => Math.floor(10000000 + Math.random() * 90000000).toString();
    // Encuentra el valor más cercano a 0 que no exista en los códigos actuales
    const existingCodes = clients.map(c => c.code);
    let code = 1;
    while (existingCodes.includes(code)) {
      code++;
    }
    const newClientData = {
      ...client,
      id: generateRandomNumericId(),
      userId,
      code, // Asigna el código más bajo disponible
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log(newClientData);
    
    if (newClientData && newClientData.name && newClientData.phone ) {
      try {
        const { data, error } = await supabase.from("clients").insert([newClientData]);
        if (error) {
          console.log("Error adding client to Supabase:", error);
          
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo agregar el cliente.",
          });
        } else {
         fetchSupabaseClients()
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al agregar el cliente.",
        });
      }
    }
  };

  const deleteClient = async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (!error) {
        fetchSupabaseClients();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el cliente.",
        });
      }
  };

  const updateProduct = async (
    client: Client,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .update({
          ...client,
          updatedAt: new Date(),
        })
        .eq("id", client.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo actualizar el cliente.",
        });
        return;
      }

      // Refrescar la lista de clientes
      fetchSupabaseClients()
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el cliente.",
      });
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setNewClient(client);
  };

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (newClient) {
      if (editingClient) {
        await updateProduct(newClient, e);
      } else {
        await addProduct(newClient);
      }
      setNewClient({
        id: "",
        name: "",
        userId: "",
        code: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  useEffect(() => {
    const filteredClients =
      clients.length > 0
        ? clients
          .filter(
            (client) =>
              client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (client.id && client.id.toString().includes(searchTerm)) ||
              client.code
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => a.code - b.code)
        : [];

    console.log(filteredClients);
    setFilteredClients(filteredClients);
  }, [clients, searchTerm]);
  return (

      <div className="w-full py-4 gap-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Lista de Clientes</h1>

        <div className="flex my-2">
          <Input
            placeholder="Buscar Clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Nombre del Cliente"
            value={newClient?.name || ""}
            onChange={(e) =>
              setNewClient({
                ...newClient,
                name: e.target.value,
                code: newClient?.code || 0,
                phone: newClient?.phone || "",
                userId: newClient?.userId || "",
                createdAt: newClient?.createdAt || new Date(),
                updatedAt: newClient?.updatedAt || new Date(),
              })
            }
          />
          <Input
            type="text"
            placeholder="Telefono"
            value={newClient?.phone || ""}
            onChange={(e) =>
              setNewClient({
                ...newClient,
                code: newClient?.code || 0,
                name: newClient?.name || "",
                phone: e.target.value,
                userId: newClient?.userId || "",
                createdAt: newClient?.createdAt || new Date(),
                updatedAt: newClient?.updatedAt || new Date(),
              })
            }
          />
          <Button onClick={(e) => handleSaveClick(e)}>
            <Plus className="mr-2 h-4 w-4" />{" "}
            {editingClient ? "Actualizar" : "Agregar"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nombre del Cliente</TableHead>
              <TableHead>Teléfono</TableHead>
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
            ) : filteredClients.length > 0 ? (
              // Mostrar los datos reales cuando se hayan cargado
              filteredClients.map((client, index) => (
                <TableRow
                  key={client.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <TableCell>{client.code}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteClient(client.id?.toString() || "")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Mostrar un mensaje si no hay clientes
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay clientes disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </div>
  );
};

