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
import { Pencil, Plus, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
import {
  createClientQuery,
  deleteClientQuery,
  getClientsQuery,
  updateClientQuery,
} from "@/app/api/clients/clientsquery";
import { Client, Client as clientType } from "@/types";
import Sidebar from "../components/Sidebar";
import { log } from "console";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]); 
   const [newClient, setNewClient] = useState<Client>();
   const [searchTerm, setSearchTerm] = useState("");
    const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para controlar la carga

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true); // Inicia el estado de carga
      const token = Cookies.get("token");
      try {
        const clientsList = await getClientsQuery(token as string);
        setClients(clientsList);
        setClients(clientsList); // Puedes aplicar filtros aquí si es necesario
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los clientes.",
        });
      } finally {
        setIsLoading(false); // Finaliza el estado de carga
      }
    };
    fetchClients();
  }, []);

   const addProduct = async (client: Client) => {
      const userId = Cookies.get("id_userLogged");
      
      const newProduct = {
        ...client,
        userId
      };
      console.log(newProduct);
      
      if (newProduct && newProduct.name && newProduct.phone) {
        const res = await createClientQuery(newProduct);
  
        if (res.message === "ok") {
          const updatedProducts = await getClientsQuery(
            Cookies.get("token") as string
          );
          setClients(updatedProducts);
          setNewClient({
            id: "",
            name: "",
            userId: "",
            code: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          toast({
            description: res.type,
            title: res.message,
          });
        }
      }
    };

  const deleteClient = async (id: string) => {
    try {
      const deletedClient = await deleteClientQuery(id);
      if (deletedClient.message === "ok") {
        setClients((prevClients) => prevClients.filter((client) => client.id !== id));
        setFilteredClients((prevClients) => prevClients.filter((client) => client.id !== id));
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

    const updateProduct = async (
      client: Client,
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      try {
        const updatedProduct = await updateClientQuery(client);
        console.log(updatedProduct);
        if (updatedProduct.message === "ok") {
          setClients(clients.map((p) => (p.id === client.id ? client : p)));
          setEditingClient(null);
        }
      } catch (error) {
        console.log(error);
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
    <div className="flex w-full justify-start items-start mt-5">
      <Sidebar/>
      
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
    </div>
  );
};

