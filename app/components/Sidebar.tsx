"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    // Establecer la pestaña activa según la ruta actual usando window.location.pathname
    if (typeof window !== "undefined") {
      setActiveTab(window.location.pathname);
    }
  }, []);

  return (
    <div className="w-64 h-screen flex flex-col bg-white font-sans">
      <div className="p-4 text-lg font-bold">
        Panel de Control
      </div>
      <ul className="flex flex-col space-y-2 py-4 px-2">
        <li
          className={`${
            activeTab === "/estadisticas" ? "bg-gray-200 rounded" : ""
          }`}
        >
          <Link
            href="/estadisticas"
            className="block p-2 rounded hover:bg-gray-100"
          >
            Estadísticas
          </Link>
        </li>
        <li
          className={`${
            activeTab === "/clientes" ? "bg-gray-200 rounded" : ""
          }`}
        >
          <Link
            href="/clients"
            className="block p-2 rounded hover:bg-gray-100"
          >
            Clientes
          </Link>
        </li>
        <li
          className={`${
            activeTab === "/productos" ? "bg-gray-200 rounded" : ""
          }`}
        >
          <Link
            href="/products"
            className="block p-2 rounded hover:bg-gray-100"
          >
            Productos
          </Link>
        </li>
        <li
          className={`${
            activeTab === "/sistema-pos" ? "bg-gray-200 rounded" : ""
          }`}
        >
          <Link
            href="/sistema-pos"
            className="block p-2 rounded hover:bg-gray-100"
          >
            Sistema POS
          </Link>
        </li>
        <li
          className={`${
            activeTab === "/creditos" ? "bg-gray-200 rounded" : ""
          }`}
        >
          <Link
            href="/creditos"
            className="block p-2 rounded hover:bg-gray-100"
          >
            Créditos
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;