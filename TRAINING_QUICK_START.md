/**
 * GUÍA RÁPIDA DE INTEGRACIÓN - MÓDULO ENTRENAMIENTO
 * 
 * 1. AGREGAR RUTAS EN App.tsx / Router
 * 2. CREAR PAGES FALTANTES
 * 3. INICIALIZAR STORE EN COMPONENTES
 */

// ============================================================
// 1️⃣ RUTAS A AGREGAR EN App.tsx O ROUTER CONFIG
// ============================================================

/*
import { ExercisesPage, TrainingPlansPage, TrainingDetailPage } from "@/pages/training";

<Routes>
  {/* Público - Catálogo de ejercicios *\/}
  <Route path="/training/exercises" element={<ExercisesPage />} />
  
  {/* Privado - Planes del usuario *\/}
  <Route element={<ProtectedRoute />}>
    <Route path="/training/plans" element={<TrainingPlansPage />} />
    <Route path="/training/:planId" element={<TrainingDetailPage />} />
  </Route>
  
  {/* Privado - Crear/Editar (PENDIENTE) *\/}
  <Route element={<RoleRoute requiredRole={["trainer", "gym"]} />}>
    <Route path="/training/create" element={<CreateTrainingPlanPage />} />
    <Route path="/training/:planId/edit" element={<EditTrainingPlanPage />} />
  </Route>
</Routes>
*/

// ============================================================
// 2️⃣ PÁGINAS QUE NECESITAN CREARSE TODAVÍA
// ============================================================

/*
ARCHIVOS A CREAR:

1. src/pages/training/CreateTrainingPlanPage.tsx
   - Formulario para crear plan
   - Constructor visual de días/ejercicios
   - Preview del plan
   
2. src/pages/training/EditTrainingPlanPage.tsx
   - Editar plan existente
   - Mismo formulario que Create

3. src/pages/training/AssignPlanModal.tsx
   - Modal para asignar plan a usuario
   - Seleccionar cliente, fecha inicio
   - Validaciones

PARA GENERAR LAS PÁGINAS, SIGUE ESTE PATRÓN:

import { useNavigate } from "react-router-dom";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingLoadingSpinner } from "@/components/training";

export function CreateTrainingPlanPage() {
  const navigate = useNavigate();
  const { createTrainingPlan, isLoading } = useTrainingStore();
  
  // Tu implementación aquí...
}
*/

// ============================================================
// 3️⃣ USO DEL STORE EN COMPONENTES
// ============================================================

/*
import { useTrainingStore } from "@/store/useTrainingStore";

function MyComponent() {
  const {
    // Planes
    trainingPlans,
    currentPlan,
    isLoadingPlans,
    errorPlans,
    
    // Ejercicios
    exercises,
    currentExercise,
    isLoadingExercises,
    errorExercises,
    totalExercises,
    currentPage,
    
    // Estado general
    isLoading,
    error,
    
    // Acciones
    fetchTrainingPlans,
    fetchTrainingPlanById,
    createTrainingPlan,
    updateTrainingPlan,
    deleteTrainingPlan,
    assignTrainingPlan,
    completeTrainingDay,
    adaptTrainingPlan,
    fetchExercises,
    fetchExerciseById,
    searchExercises,
    getFilterOptions,
    clearError,
  } = useTrainingStore();
  
  // Usar en el componente...
}
*/

// ============================================================
// 4️⃣ EJEMPLO COMPLETO: CARGAR PLANES DEL USUARIO
// ============================================================

/*
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingLoadingSpinner, TrainingNotification } from "@/components/training";

function MyPlansComponent() {
  const user = useAuthStore((state) => state.user);
  const {
    trainingPlans,
    isLoadingPlans,
    errorPlans,
    fetchTrainingPlans,
    clearError,
  } = useTrainingStore();

  useEffect(() => {
    if (user?.id) {
      fetchTrainingPlans(user.id);
    }
  }, [user?.id, fetchTrainingPlans]);

  if (isLoadingPlans) {
    return <TrainingLoadingSpinner message="Cargando planes..." />;
  }

  if (errorPlans) {
    return (
      <TrainingNotification
        type="error"
        title="Error"
        message={errorPlans}
        onClose={clearError}
      />
    );
  }

  return (
    <div>
      {trainingPlans.map((plan) => (
        <div key={plan.id}>{plan.name}</div>
      ))}
    </div>
  );
}
*/

// ============================================================
// 5️⃣ EJEMPLO: MARCAR DÍA COMO COMPLETADO (OPTIMISTIC)
// ============================================================

/*
async function handleCompleteDay(planId: string, dayId: string) {
  // El store actualiza el estado inmediatamente
  // (optimistic update)
  try {
    await completeTrainingDay(planId, dayId);
    
    // Éxito - mostrar notificación
    showNotification({
      type: "success",
      title: "Día completado",
      message: "¡Excelente trabajo!",
    });
  } catch (error) {
    // Error - el store automáticamente revierte el cambio
    showNotification({
      type: "error",
      title: "Error",
      message: error.message,
    });
  }
}
*/

// ============================================================
// 6️⃣ EJEMPLO: BUSCAR EJERCICIOS CON FILTROS
// ============================================================

/*
import { ExerciseFilters } from "@/types/training";
import { useTrainingStore } from "@/store/useTrainingStore";

function ExerciseSearchComponent() {
  const { exercises, fetchExercises } = useTrainingStore();

  const handleSearch = (filters: ExerciseFilters) => {
    // Parámetros aceptados:
    // - bodyPart: string
    // - equipment: string
    // - target: string
    // - difficulty: "beginner" | "intermediate" | "advanced"
    // - page: number (default 1)
    // - pageSize: number (default 20)
    
    fetchExercises({
      bodyPart: "upper body",
      equipment: "dumbbells",
      page: 1,
      pageSize: 20,
    });
  };

  return (
    <div>
      {exercises.map((ex) => (
        <div key={ex.id}>{ex.name}</div>
      ))}
    </div>
  );
}
*/

// ============================================================
// 7️⃣ API ENDPOINTS DISPONIBLES
// ============================================================

/*
EJERCICIOS (Público)
- GET /public/exercises                    ✅ getExercises(filters?)
- GET /public/exercises/:id                ✅ getExerciseById(id)
- GET /public/exercises/search             ✅ searchExercises(query)
- GET /public/exercises/filters/options    ✅ getFilterOptions()

PLANES (Privado)
- GET /private/training-plans/user/:userId         ✅ getTrainingPlansByUser(userId)
- GET /private/training-plans/:id                  ✅ getTrainingPlanById(id)
- POST /private/training-plans                     ✅ createTrainingPlan(data)
- PUT /private/training-plans/:id                  ✅ updateTrainingPlan(id, data)
- DELETE /private/training-plans/:id               ✅ deleteTrainingPlan(id)
- POST /private/training-plans/:id/assign          ✅ assignTrainingPlan(id, data)
- PATCH /private/training-plans/:id/days/:dayId/complete  ✅ completeTrainingDay(planId, dayId)
- POST /private/training-plans/adapt               ✅ adaptTrainingPlan(planId, userId)
*/

// ============================================================
// 8️⃣ TIPOS PRINCIPALES
// ============================================================

/*
import {
  Exercise,
  TrainingPlan,
  TrainingDay,
  Workout,
  WorkoutExercise,
  Set,
  ExerciseFilters,
  CreateTrainingPlanDTO,
  AssignTrainingPlanDTO,
} from "@/types/training";

// Ejemplo de uso de tipos
const plan: TrainingPlan = {
  id: "1",
  name: "Mi Plan",
  durationDays: 30,
  days: [],
  assignedTo: "userId",
  createdBy: "trainerId",
  createdAt: new Date().toISOString(),
  startDate: new Date().toISOString(),
};

const exercise: Exercise = {
  id: "1",
  name: "Flexiones",
  target: "chest",
  bodyPart: "upper body",
  equipment: "bodyweight",
  gifUrl: "https://example.com/flexiones.gif",
  difficulty: "beginner",
};
*/

// ============================================================
// 9️⃣ COMPONENTES DISPONIBLES PARA USAR
// ============================================================

/*
TARJETAS
- ExerciseCard: Muestra un ejercicio individual
- TrainingPlanCard: Muestra un plan
- TrainingDayCard: Muestra un día del plan

FILTROS
- ExerciseFilters: Panel de filtros para ejercicios

CARGA
- TrainingLoadingSpinner: Spinner normal o para IA
- ExerciseSkeletonGrid: Skeletons mientras cargan ejercicios
- MiniSpinner: Pequeño spinner para botones

NOTIFICACIONES
- TrainingNotification: Notificación individual
- NotificationContainer: Contenedor para apilar notificaciones

IMPORTAR:
import {
  ExerciseCard,
  TrainingPlanCard,
  TrainingDayCard,
  ExerciseFilters,
  TrainingLoadingSpinner,
  MiniSpinner,
  ExerciseSkeletonGrid,
  TrainingNotification,
  NotificationContainer,
} from "@/components/training";
*/

// ============================================================
// 🔟 CHECKLIST DE IMPLEMENTACIÓN
// ============================================================

/*
[ ] 1. Crear archivo de rutas (o agregar a router existente)
[ ] 2. Importar páginas de entrenamiento
[ ] 3. Agregar rutas en Router
[ ] 4. Crear CreateTrainingPlanPage
[ ] 5. Crear EditTrainingPlanPage
[ ] 6. Crear AssignPlanModal (u otra forma de asignación)
[ ] 7. Agregar navegación hacia /training/exercises
[ ] 8. Agregar navegación hacia /training/plans
[ ] 9. Actualizar navbar/menú con links de training
[ ] 10. Probar flujos: buscar → crear → asignar → completar
[ ] 11. Configurar permisos de rol (trainer, gym, client)
[ ] 12. Agregar integraciones con sistema de notificaciones global
[ ] 13. Configurar persistencia de datos (si aplica)
[ ] 14. Agregar logging/analytics para seguimiento
*/

// ============================================================
// SOPORTE Y DEBUGGING
// ============================================================

/*
Si algo no funciona:

1. Verifica que el usuario esté autenticado (useAuthStore)
2. Revisa la consola para errores de API (Network tab)
3. Asegúrate de que los endpoints existen en el backend
4. Valida que el token JWT esté presente en headers
5. Comprueba que los tipos coincidan con la respuesta del servidor
6. Usa Redux DevTools o React DevTools para inspeccionar store
7. Revisa los interceptores de Axios en src/api/axios.config.ts

ERRORES COMUNES:
- 401: Token expirado → Login requerido
- 403: Rol insuficiente → Verificar RoleRoute
- 404: Endpoint no existe → Confirmar con backend
- 500: Error del servidor → Ver logs del backend
*/

export {};
