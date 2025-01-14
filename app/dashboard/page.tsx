"use client";

import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Package2, BarChart3, ShoppingCart, Users } from "lucide-react";
import StatsCards from "../components/StatsCards";
import ProductList from "../components/ProductList";
import CreditList from "../components/CreditList";
import InvoiceSystem from "./pos/InvoiceSystem";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stats");

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
          <header className="flex items-center p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
          </header>
          <main className="p-6 w-full">
            {activeTab === "stats" && <StatsCards />}
            {activeTab === "products" && <ProductList />}
            {activeTab === "pos" && <InvoiceSystem />}
            {activeTab === "credits" && <CreditList />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
