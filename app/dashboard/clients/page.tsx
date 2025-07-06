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
import { toast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>({
    id: "",
    name: "",
    userId: "",
    code: 0,
    phone: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();
  const { userId, loading: authLoading } = useAuth();

  // Cargar clientes desde Supabase
  const fetchClients = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("userId", userId)
        .order("code", { ascending: true });
      if (error) throw error;
      setClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los clientes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userId) {
      fetchClients();
    }
  }, [userId, authLoading]);

  // Filtrar clientes por búsqueda
  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toString().includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  // Agregar o actualizar cliente
  const saveClient = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se encontró el usuario.",
      });
      return;
    }

    if (!newClient.name || !newClient.phone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nombre y teléfono son requeridos.",
      });
      return;
    }

    // Generar código único
    const existingCodes = clients.map(c => c.code);
    let code = 1;
    while (existingCodes.includes(code)) code++;

    const clientData = {
      ...newClient,
      userId,
      code: editingClient ? newClient.code : code,
      createdAt: editingClient ? newClient.createdAt : new Date(),
      updatedAt: new Date(),
    };

    try {
      if (editingClient) {
        // Actualizar
        const { error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", editingClient.id)
          .eq("userId", userId); // Asegurar que solo actualice clientes del usuario
        if (error) throw error;
        toast({ title: "Cliente actualizado" });
      } else {
        // Agregar
        const id = Math.floor(10000000 + Math.random() * 90000000).toString();
        const { error } = await supabase
          .from("clients")
          .insert([{ ...clientData, id }]);
        if (error) throw error;
        toast({ title: "Cliente agregado" });
      }
      setNewClient({ id: "", name: "", userId: "", code: 0, phone: "", createdAt: new Date(), updatedAt: new Date() });
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el cliente.",
      });
    }
  };

  // Eliminar cliente
  const deleteClient = async (id: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)
        .eq("userId", userId); // Asegurar que solo elimine clientes del usuario
      if (error) throw error;
      toast({ title: "Cliente eliminado" });
      fetchClients();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el cliente.",
      });
    }
  };

  // Editar cliente
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setNewClient(client);
  };

  // Formatear teléfono
  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 4) digits = digits.slice(0, 4) + "-" + digits.slice(4);
    if (digits.length > 8) digits = digits.slice(0, 8) + "-" + digits.slice(8);
    return digits;
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="w-full py-6 gap-4">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  // Redirigir si no hay usuario autenticado
  if (!userId) {
    return (
      <div className="w-full py-6 gap-4">
        <div className="text-center">No autorizado</div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 gap-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Lista de Clientes</h1>
      <div className="flex my-2">
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Nombre del cliente"
          value={newClient.name}
          onChange={e => setNewClient({ ...newClient, name: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Teléfono (04**-***-****)"
          maxLength={13}
          value={newClient.phone}
          onChange={e => setNewClient({ ...newClient, phone: formatPhone(e.target.value) })}
        />
        <Button onClick={saveClient}>
          <Plus className="mr-2 h-4 w-4" />
          {editingClient ? "Actualizar" : "Agregar"}
        </Button>
        {editingClient && (
          <Button
            variant="outline"
            onClick={() => {
              setEditingClient(null);
              setNewClient({ id: "", name: "", userId: "", code: 0, phone: "", createdAt: new Date(), updatedAt: new Date() });
            }}
          >
            Cancelar
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.code}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(client)}
                  >
                                            <Pencil className="h-4 w-4 " />
                    
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteClient(client.id?.toString() || "")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No hay clientes disponibles.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

