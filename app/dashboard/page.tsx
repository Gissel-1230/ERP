// app/dashboard/page.tsx

// highlight-start
import { Bell, CheckCircle, FilePlus, ArrowRight, Warehouse, Settings } from 'lucide-react';
// highlight-end
import Link from 'next/link';

// Componente para las tarjetas de información del usuario
const UserInfoCard = ({ icon: Icon, title, value, color }: any) => (
  <div className="flex items-center rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
    <div className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// Componente para las tarjetas de acciones rápidas
const ActionCard = ({ icon: Icon, title, description, href }: any) => (
  <Link href={href}>
    <div className="group flex items-center rounded-lg bg-white p-5 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-indigo-500 dark:bg-slate-800">
      <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
);


export default function DashboardPage() {
  const userName = "Ana López"; // Esto vendría de los datos de sesión del usuario

  return (
    <div className="flex flex-col gap-8">
      {/* -- Sección de Bienvenida -- */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Bienvenida de nuevo, {userName}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Aquí tienes un resumen de tu actividad y accesos rápidos.
        </p>
      </div>

      {/* -- Sección de Información Personalizada -- */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <UserInfoCard
          icon={Bell}
          title="Notificaciones sin leer"
          value="3"
          color="bg-red-500"
        />
        <UserInfoCard
          icon={CheckCircle}
          title="Tareas completadas (semana)"
          value="12"
          color="bg-emerald-500"
        />
        <UserInfoCard
          icon={FilePlus}
          title="Requisiciones en aprobación"
          value="2"
          color="bg-amber-500"
        />
      </section>

      {/* -- Sección de Acciones Rápidas -- */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ActionCard
            href="/dashboard/requisicion/nueva"
            icon={FilePlus}
            title="Crear Nueva Requisición"
            description="Inicia un nuevo pedido de compra o servicio."
          />
          <ActionCard
            href="/dashboard/almacenes"
            icon={Warehouse}
            title="Consultar Inventario"
            description="Revisa el stock disponible en los almacenes."
          />
          <ActionCard
            href="/dashboard/rrhh/tareas"
            icon={CheckCircle}
            title="Ver Mis Tareas"
            description="Consulta tus asignaciones y pendientes."
          />
          <ActionCard
            href="/dashboard/configuracion"
            icon={Settings}
            title="Ajustes de Perfil"
            description="Modifica tus datos personales y contraseña."
          />
        </div>
      </div>
    </div>
  );
}