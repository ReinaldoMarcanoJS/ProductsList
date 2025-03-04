"use client";

import { useEffect, useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package2, BarChart3, ShoppingCart, Users } from "lucide-react";
import StatsCards from "../components/StatsCards";
import ProductList from "../components/ProductList";
import CreditList from "../components/CreditList";
import InvoiceSystem from "./pos/InvoiceSystem";
import Cookies from "js-cookie";
import { logoutQuery, verifyToken } from "../api/authquerys";
import { getDolarApi } from "../api/dolarCambio/page";
import { set } from "date-fns";
import { toast } from "@/hooks/use-toast";
import ClientList from "./clients/ClientsList";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [Token, setToken] = useState("");
  const router = useRouter();
  const handleVerifyToken = async (token: string) => {
    try {
      const res = await verifyToken(token);
      // Your token verification logic
      if (res.message === "error") {
        Cookies.remove("token");
        Cookies.remove("dolar");
        toast({
          variant: "destructive",
          title: "Error",
          description: res.type,
        });
        // Handle invalid token, e.g., redirect to login
        router.push("/login");
      }
      if (res.message === "ok") {
        setToken(token);
        toast({
          variant: "default",
          title: "Exitoso",
          description: res.type,
        });
      }
    } catch (error) {
      console.log("Token verification failed", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      // Handle missing token, e.g., redirect to login
      console.log("Token not found");
      router.push("/login");
      return;
    }

    // Verify the token here

    handleVerifyToken(token);

    // dolar cambio

    async function getdolar() {
      try {
        const dolar = await getDolarApi();
        console.log(await dolar);
        if (await dolar) {
          //
          Cookies.set("dolar", JSON.stringify(dolar));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("An unknown error occurred");
        }
      }
    }

    getdolar();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logoutQuery(Token);
      if (res.message === "ok") {
        Cookies.remove("token");
        Cookies.remove("dolar");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-xl font-bold p-4">Mi Tienda</h2>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 p-2">
              <Button
                variant={activeTab === "stats" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("stats")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Estadísticas
              </Button>
              <Button
                variant={activeTab === "products" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("products")}
              >
                <Package2 className="mr-2 h-4 w-4" />
                Productos
              </Button>
              <Button
                variant={activeTab === "clients" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("clients")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Clientes
              </Button>

              <Button
                variant={activeTab === "pos" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("pos")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Sistema POS
              </Button>
              <Button
                variant={activeTab === "credits" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("credits")}
              >
                <Users className="mr-2 h-4 w-4" />
                Créditos
              </Button>
            </nav>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto">
          <header className="w-full flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
            </div>
            <div>
              <h3
                className=" text-lg font-semibold cursor-pointer"
                onClick={() => handleLogout()}
              >
                {" "}
                log out{" "}
              </h3>
            </div>
          </header>
          <main className="p-6 w-full">
            {activeTab === "stats" && <StatsCards />}
            {activeTab === "products" && <ProductList />}
            {activeTab === "clients" && <ClientList />}
            {activeTab === "pos" && <InvoiceSystem />}
            {activeTab === "credits" && <CreditList />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
