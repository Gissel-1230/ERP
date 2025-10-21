// app/dashboard/layout.tsx
"use client";

import {
  LayoutDashboard,
  Warehouse,
  ArrowRightLeft,
  ShoppingCart,
  Users,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

// Array de navegación actualizado
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: [1, 2, 3] },
  { href: "/dashboard/almacenes", icon: Warehouse, label: "Almacenes", roles: [1, 2] },
  { href: "/dashboard/traspasos", icon: ArrowRightLeft, label: "Traspasos", roles: [1, 2] },
  { href: "/dashboard/ventas", icon: ShoppingCart, label: "Ventas", roles: [1] },
  { href: "/dashboard/requisicion", icon: ClipboardList, label: "Requisición", roles: [1, 2, 3] },
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true); //Evita redirección antes de cargar
  const [localUser, setLocalUser] = useState<any>(null);

  // Cargar sesión desde localStorage en caso de recargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, [user]);

  // Redirigir solo cuando ya terminó de cargar y no hay usuario
  useEffect(() => {
    if (!isLoading && !user && !localUser) {
      router.push("/");
    }
  }, [user, localUser, isLoading]);

  //  Mientras carga, muestra pantalla de espera
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-600 dark:text-slate-300">
        Cargando sesión...
      </div>
    );
  }

  //  Si no hay sesión, no muestra nada (evita parpadeo)
  if (!user && !localUser) return null;

  const currentUser = user || localUser;

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("menuOptions");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900">
      {/* Barra Lateral */}
      <aside className="hidden w-64 flex-col border-r bg-slate-800 text-white sm:flex">
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-700">
          <Link href="/dashboard" className="text-xl font-bold">
            <span className="text-indigo-400">ERP</span> PEC
          </Link>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-700 p-4">
          <Link
            href="/dashboard/configuracion"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            <span>Configuración</span>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-white px-6 dark:bg-slate-800">
          <h1 className="text-lg font-semibold">
            Bienvenido, {currentUser?.full_name || "Usuario"}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
