"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setActiveTab(pathname);
    setLoading(false); // Oculta el cargando cuando cambia la ruta
  }, [pathname]);

  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    if (href !== activeTab) {
      setLoading(true);
      setActiveTab(href);
    }
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-white font-sans">
      <div className="p-4 text-lg font-bold">
        Panel de Control
      </div>
      <ul className="flex flex-col space-y-2 py-4 px-2">
        <li className={`${activeTab === "/stats" ? "bg-gray-200 rounded" : ""}`}>
          {loading && activeTab === "/stats" ? (
            <div className="block p-2 rounded text-indigo-600 font-semibold animate-pulse">
              Cargando...
            </div>
          ) : (
            <Link
              href="/stats"
              className="block p-2 rounded hover:bg-gray-100"
              onClick={handleLinkClick("/stats")}
            >
              Estadísticas
            </Link>
          )}
        </li>
        <li className={`${activeTab === "/clients" ? "bg-gray-200 rounded" : ""}`}>
          {loading && activeTab === "/clients" ? (
            <div className="block p-2 rounded text-indigo-600 font-semibold animate-pulse">
              Cargando...
            </div>
          ) : (
            <Link
              href="/clients"
              className="block p-2 rounded hover:bg-gray-100"
              onClick={handleLinkClick("/clients")}
            >
              Clientes
            </Link>
          )}
        </li>
        <li className={`${activeTab === "/products" ? "bg-gray-200 rounded" : ""}`}>
          {loading && activeTab === "/products" ? (
            <div className="block p-2 rounded text-indigo-600 font-semibold animate-pulse">
              Cargando...
            </div>
          ) : (
            <Link
              href="/products"
              className="block p-2 rounded hover:bg-gray-100"
              onClick={handleLinkClick("/products")}
            >
              Productos
            </Link>
          )}
        </li>
        <li className={`${activeTab === "/pos" ? "bg-gray-200 rounded" : ""}`}>
          {loading && activeTab === "/pos" ? (
            <div className="block p-2 rounded text-indigo-600 font-semibold animate-pulse">
              Cargando...
            </div>
          ) : (
            <Link
              href="/pos"
              className="block p-2 rounded hover:bg-gray-100"
              onClick={handleLinkClick("/pos")}
            >
              Sistema POS
            </Link>
          )}
        </li>
        <li className={`${activeTab === "/credits" ? "bg-gray-200 rounded" : ""}`}>
          {loading && activeTab === "/credits" ? (
            <div className="block p-2 rounded text-indigo-600 font-semibold animate-pulse">
              Cargando...
            </div>
          ) : (
            <Link
              href="/credits"
              className="block p-2 rounded hover:bg-gray-100"
              onClick={handleLinkClick("/credits")}
            >
              Créditos
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;