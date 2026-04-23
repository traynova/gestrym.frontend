/**
 * EJEMPLO DE INTEGRACIÓN EN App.tsx
 * 
 * Este archivo muestra cómo agregar las rutas del módulo de entrenamiento
 * al enrutador existente de la aplicación.
 */

// ==============================================================
// OPCIÓN 1: Si usas React Router v6 con Routes en App.tsx
// ==============================================================

/*
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RoleRoute } from "@/components/layout/RoleRoute";

// Importar las páginas de entrenamiento
import {
  ExercisesPage,
  TrainingPlansPage,
  TrainingDetailPage,
} from "@/pages/training";

// Importar otras páginas
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
// ... otras imports

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas *\/}
        <Route path="/" element={<Home />} />
        <Route path="/training/exercises" element={<ExercisesPage />} />
        
        {/* Rutas protegidas - Usuario autenticado *\/}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas de entrenamiento - Todos los usuarios autenticados *\/}
          <Route path="/training/plans" element={<TrainingPlansPage />} />
          <Route path="/training/:planId" element={<TrainingDetailPage />} />
          
          {/* Rutas de creación/edición - Solo entrenador y gym *\/}
          <Route element={<RoleRoute requiredRole={[2, 3]} />}>
            {/* Crear plan - PENDIENTE IMPLEMENTAR CreateTrainingPlanPage *\/}
            {/* <Route path="/training/create" element={<CreateTrainingPlanPage />} /> *\/}
            
            {/* Editar plan - PENDIENTE IMPLEMENTAR EditTrainingPlanPage *\/}
            {/* <Route path="/training/:planId/edit" element={<EditTrainingPlanPage />} /> *\/}
          </Route>
        </Route>
        
        {/* Ruta 404 *\/}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
*/

// ==============================================================
// OPCIÓN 2: Si tienes un archivo de rutas separado (router.tsx)
// ==============================================================

/*
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RoleRoute } from "@/components/layout/RoleRoute";
import {
  ExercisesPage,
  TrainingPlansPage,
  TrainingDetailPage,
} from "@/pages/training";

export const trainingRoutes: RouteObject[] = [
  // Públicas
  {
    path: "/training/exercises",
    element: <ExercisesPage />,
  },
  
  // Protegidas
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/training/plans",
        element: <TrainingPlansPage />,
      },
      {
        path: "/training/:planId",
        element: <TrainingDetailPage />,
      },
      
      // Solo entrenador y gym
      {
        element: <RoleRoute requiredRole={[2, 3]} />,
        children: [
          // {
          //   path: "/training/create",
          //   element: <CreateTrainingPlanPage />,
          // },
          // {
          //   path: "/training/:planId/edit",
          //   element: <EditTrainingPlanPage />,
          // },
        ],
      },
    ],
  },
];

// En App.tsx o main router:
// const appRoutes = [
//   ...publicRoutes,
//   ...trainingRoutes,
//   ...otherRoutes,
// ];
*/

// ==============================================================
// OPCIÓN 3: Agregar links de navegación en Navbar
// ==============================================================

/*
// En src/components/layout/Navbar.tsx

import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo *\/}
          <Link to="/" className="text-white font-bold">
            Gestrym
          </Link>

          {/* Links *\/}
          <div className="flex gap-4">
            {/* Catálogo de ejercicios - Público *\/}
            <Link
              to="/training/exercises"
              className="text-slate-300 hover:text-white transition"
            >
              🏋️ Ejercicios
            </Link>

            {/* Mis planes - Privado *\/}
            {isAuthenticated && (
              <Link
                to="/training/plans"
                className="text-slate-300 hover:text-white transition"
              >
                📋 Mis Planes
              </Link>
            )}

            {/* Crear plan - Solo entrenador/gym *\/}
            {isAuthenticated && [2, 3].includes(user?.role_id || 0) && (
              <Link
                to="/training/create"
                className="text-slate-300 hover:text-white transition"
              >
                ➕ Nuevo Plan
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
*/

// ==============================================================
// OPCIÓN 4: Agregar en menú del Dashboard
// ==============================================================

/*
// En src/components/layout/DashboardLayout.tsx

import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Dumbbell, BookOpen, Plus } from "lucide-react";

export function DashboardLayout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  
  const isTrainer = [2, 3].includes(user?.role_id || 0);

  const trainingMenuItems = [
    {
      label: "📋 Mis Planes",
      path: "/training/plans",
      icon: Dumbbell,
    },
    {
      label: "🏋️ Explorar Ejercicios",
      path: "/training/exercises",
      icon: BookOpen,
    },
    ...(isTrainer
      ? [
          {
            label: "➕ Crear Plan",
            path: "/training/create",
            icon: Plus,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700">
      <nav className="space-y-2 p-4">
        {/* Otros items del menú *\/}
        
        {/* Sección de Entrenamiento *\/}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase mb-4">
            Entrenamiento
          </h3>
          
          {trainingMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${
                  location.pathname.startsWith(
                    item.path.split("/")[1]
                  )
                    ? "bg-red-600/20 text-red-400"
                    : "text-slate-300 hover:bg-slate-700"
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
*/

// ==============================================================
// OPCIONALES: Configuraciones adicionales
// ==============================================================

/*
// 1. Agregar meta tags para SEO
// En src/pages/training/ExercisesPage.tsx:
useEffect(() => {
  document.title = "Catálogo de Ejercicios | Gestrym";
  // Agregar meta description si usas react-helmet
}, []);

// 2. Agregar breadcrumbs
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
<Breadcrumbs
  items={[
    { label: "Inicio", path: "/" },
    { label: "Entrenamiento", path: "/training/plans" },
    { label: "Mi Primer Plan", path: "/training/123" },
  ]}
/>

// 3. Agregar protección de rutas por rol
// En RoleRoute.tsx (ya existe, solo confirmar):
interface RoleRouteProps {
  requiredRole?: number[] | number;
  children?: React.ReactNode;
}

export function RoleRoute({ requiredRole }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!user || !roles.includes(user.role_id)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
}

// 4. Agregar animaciones de transición entre páginas
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
  {/* Contenido de la página *\/}
</motion.div>
*/

// ==============================================================
// ESTRUCTURA FINAL RECOMENDADA
// ==============================================================

/*
App Structure:
├── App.tsx (punto de entrada)
├── main.tsx (Vite entry)
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ...
│   └── training/
│       ├── ExercisesPage.tsx ✅ (IMPLEMENTADO)
│       ├── TrainingPlansPage.tsx ✅ (IMPLEMENTADO)
│       ├── TrainingDetailPage.tsx ✅ (IMPLEMENTADO)
│       ├── CreateTrainingPlanPage.tsx ❌ (PENDIENTE)
│       ├── EditTrainingPlanPage.tsx ❌ (PENDIENTE)
│       └── index.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx (agregar links)
│   │   ├── DashboardLayout.tsx (agregar menú)
│   │   ├── ProtectedRoute.tsx (ya existe)
│   │   └── RoleRoute.tsx (ya existe)
│   └── training/
│       ├── ExerciseCard.tsx ✅
│       ├── ExerciseFilters.tsx ✅
│       ├── TrainingPlanCard.tsx ✅
│       ├── TrainingDayCard.tsx ✅
│       ├── TrainingLoadingSpinner.tsx ✅
│       ├── TrainingNotifications.tsx ✅
│       ├── ExerciseSkeletons.tsx ✅
│       └── index.ts ✅
├── store/
│   ├── useAuthStore.ts (ya existe)
│   └── useTrainingStore.ts ✅ (IMPLEMENTADO)
├── api/
│   ├── axios.ts (ya existe)
│   ├── axios.config.ts (ya existe)
│   ├── auth*.ts (ya existe)
│   ├── exercises*.ts ✅ (IMPLEMENTADO)
│   └── trainingPlans*.ts ✅ (IMPLEMENTADO)
├── types/
│   └── training.ts ✅ (IMPLEMENTADO)
├── lib/
│   └── errors/
│       └── errorHandler.ts (ya existe)
└── ...
*/

export {};
