// app/dashboard/layout.tsx

import {
  LayoutDashboard,
  Warehouse,
  ArrowRightLeft,
  ShoppingCart,
  Users,
  ClipboardList, 
  Settings,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

// Array de navegación actualizado
const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/almacenes', icon: Warehouse, label: 'Almacenes' },
  { href: '/dashboard/traspasos', icon: ArrowRightLeft, label: 'Traspasos' },
  { href: '/dashboard/ventas', icon: ShoppingCart, label: 'Ventas' },
  // highlight-start
  { href: '/dashboard/requisicion', icon: ClipboardList, label: 'Requisición' },
  // highlight-end
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <button className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-slate-300 transition-colors hover:bg-slate-700 hover:text-white">
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-white px-6 dark:bg-slate-800">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}