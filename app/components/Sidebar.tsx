"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";
import { DolarQuery } from "@/types";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://ve.dolarapi.com/v1/dolares/oficial")
      .then((res) => res.json())
      .then((data: DolarQuery) => {
        Cookies.set("dolar", JSON.stringify(data), { expires: 1 });
        
      })
      .catch((error) => {
        console.error("Error fetching dolar data:", error);
      });
    // Verifica la validez de la sesión con Supabase cada vez que cambia la ruta
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // window.location.href = "/login";
        return;
      }
    };

    checkSession();
    setActiveTab(pathname);
    setLoading(false); // Oculta el cargando cuando cambia la ruta
  }, [pathname]);

  const handleLinkClick = (href: string) => () => {
    if (href !== activeTab) {
      setLoading(true);
      setActiveTab(href);
    }
  };

  return (
    <aside
      ref={myRef}
      className="w-72 min-h-screen flex flex-col bg-white border-r border-gray-200 text-gray-800 shadow-lg font-sans"
    >
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-200 tracking-wide bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800">
        Panel de Control
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col space-y-2 py-8 px-4">
          <li>
            {loading && activeTab === "/dashboard/stats" ? (
              <div className="block p-3 rounded bg-indigo-100 text-indigo-700 font-semibold animate-pulse text-center">
                Cargando...
              </div>
            ) : (
              <Link
                href="/dashboard/stats"
                className={`block p-3 rounded transition-all ${activeTab === "/dashboard/stats"
                  ? "bg-indigo-50 text-indigo-700 font-bold shadow"
                  : "hover:bg-indigo-100 hover:text-indigo-900"
                  }`}
                onClick={handleLinkClick("/dashboard/stats")}
              >
                Estadísticas
              </Link>
            )}
          </li>
          <li>
            {loading && activeTab === "/dashboard/clients" ? (
              <div className="block p-3 rounded bg-indigo-100 text-indigo-700 font-semibold animate-pulse text-center">
                Cargando...
              </div>
            ) : (
              <Link
                href="/dashboard/clients"
                className={`block p-3 rounded transition-all ${activeTab === "/dashboard/clients"
                  ? "bg-indigo-50 text-indigo-700 font-bold shadow"
                  : "hover:bg-indigo-100 hover:text-indigo-900"
                  }`}
                onClick={handleLinkClick("/dashboard/clients")}
              >
                Clientes
              </Link>
            )}
          </li>
          <li>
            {loading && activeTab === "/dashboard/products" ? (
              <div className="block p-3 rounded bg-indigo-100 text-indigo-700 font-semibold animate-pulse text-center">
                Cargando...
              </div>
            ) : (
              <Link
                href="/dashboard/products"
                className={`block p-3 rounded transition-all ${activeTab === "/dashboard/products"
                  ? "bg-indigo-50 text-indigo-700 font-bold shadow"
                  : "hover:bg-indigo-100 hover:text-indigo-900"
                  }`}
                onClick={handleLinkClick("/dashboard/products")}
              >
                Productos
              </Link>
            )}
          </li>
          <li>
            {loading && activeTab === "/dashboard/pos" ? (
              <div className="block p-3 rounded bg-indigo-100 text-indigo-700 font-semibold animate-pulse text-center">
                Cargando...
              </div>
            ) : (
              <Link
                href="/dashboard/pos"
                className={`block p-3 rounded transition-all ${activeTab === "/dashboard/pos"
                  ? "bg-indigo-50 text-indigo-700 font-bold shadow"
                  : "hover:bg-indigo-100 hover:text-indigo-900"
                  }`}
                onClick={handleLinkClick("/dashboard/pos")}
              >
                Sistema POS
              </Link>
            )}
          </li>
          <li>
            {loading && activeTab === "/dashboard/credits" ? (
              <div className="block p-3 rounded bg-indigo-100 text-indigo-700 font-semibold animate-pulse text-center">
                Cargando...
              </div>
            ) : (
              <Link
                href="/dashboard/credits"
                className={`block p-3 rounded transition-all ${activeTab === "/dashboard/credits"
                  ? "bg-indigo-50 text-indigo-700 font-bold shadow"
                  : "hover:bg-indigo-100 hover:text-indigo-900"
                  }`}
                onClick={handleLinkClick("/dashboard/credits")}
              >
                Créditos
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <div className="px-4 pb-6 mt-auto">
        <button
          className="w-full block p-3 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;