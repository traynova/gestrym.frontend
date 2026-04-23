# 📚 Documentación: Módulo de Entrenamiento (Gestrym Frontend)

Este documento proporciona una guía completa para implementar y utilizar el módulo de entrenamiento en el frontend de Gestrym.

## 📁 Estructura de Archivos

```
src/
├── api/
│   ├── exercises.endpoints.ts          # Definiciones de endpoints para ejercicios
│   ├── exercisesService.ts             # Servicio de ejercicios (capa de lógica)
│   ├── trainingPlans.endpoints.ts      # Definiciones de endpoints para planes
│   └── trainingPlansService.ts         # Servicio de planes (capa de lógica)
│
├── store/
│   └── useTrainingStore.ts             # Store Zustand global para training
│
├── types/
│   └── training.ts                     # Tipos TypeScript para el módulo
│
├── components/training/
│   ├── ExerciseCard.tsx                # Tarjeta individual de ejercicio
│   ├── ExerciseFilters.tsx             # Panel de filtros para ejercicios
│   ├── ExerciseSkeletons.tsx           # Skeletons de carga para ejercicios
│   ├── TrainingPlanCard.tsx            # Tarjeta de plan de entrenamiento
│   ├── TrainingDayCard.tsx             # Tarjeta de día de entrenamiento
│   ├── TrainingLoadingSpinner.tsx      # Componentes de carga
│   ├── TrainingNotifications.tsx       # Sistema de notificaciones
│   └── index.ts                        # Índice de exportaciones
│
└── pages/training/
    ├── ExercisesPage.tsx               # Página de catálogo de ejercicios
    ├── TrainingPlansPage.tsx           # Página de planes del usuario
    ├── TrainingDetailPage.tsx          # Página de detalle de plan
    └── index.ts                        # Índice de exportaciones
```

---

## 🏗️ Arquitectura

### 1. **Capa de Tipos (`types/training.ts`)**

Define todas las interfaces TypeScript para el módulo:

```typescript
// Ejercicio del catálogo
Exercise {
  id: string;
  name: string;
  target: string;           // biceps, chest, etc.
  bodyPart: string;         // upper body, lower body
  equipment: string;        // dumbbells, barbell, etc.
  gifUrl: string;           // Animación demostrativa
  difficulty?: "beginner" | "intermediate" | "advanced";
}

// Conjunto de repeticiones
Set {
  id: string;
  reps: number;
  weight?: number;          // en kg
  duration?: number;        // en segundos
  restTime?: number;        // descanso en segundos
  completed?: boolean;
}

// Plan de entrenamiento
TrainingPlan {
  id: string;
  name: string;
  durationDays: number;     // 7, 30, 90, etc.
  days: TrainingDay[];
  assignedTo: string;
  createdBy: string;
  goal?: string;            // muscle_gain, fat_loss, etc.
  difficulty?: string;
}

// Día de entrenamiento
TrainingDay {
  id: string;
  dayNumber: number;
  workout?: Workout;
  isCompleted: boolean;
  completedAt?: string;
}
```

### 2. **Capa de API (`api/`)**

Dos archivos por grupo de endpoints:

#### **Endpoints** (`*.endpoints.ts`)
Define rutas y estructuras de solicitud/respuesta:

```typescript
export const exercisesEndpoints = {
  getExercises: {
    method: "GET",
    url: "/public/exercises",
  },
  searchExercises: {
    method: "GET",
    url: "/public/exercises/search",
  },
}
```

#### **Servicios** (`*Service.ts`)
Implementa la lógica de llamadas API con manejo de errores:

```typescript
export const exercisesService = {
  async getExercises(filters?: ExerciseFilters): Promise<ExercisesResponse> {
    try {
      const response = await axiosPublic.get("/public/exercises", {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw errorHandler(error);  // Centralizado en lib/errors/
    }
  }
}
```

### 3. **Store Global (`store/useTrainingStore.ts`)**

Zustand store que gestiona:
- Lista de planes del usuario
- Planes actual seleccionado
- Lista de ejercicios disponibles
- Estados de carga y errores
- Acciones (fetch, create, update, delete, adapt)

```typescript
const store = useTrainingStore();

// Lectura
store.trainingPlans
store.isLoadingPlans
store.errorPlans

// Acciones
await store.fetchTrainingPlans(userId)
await store.completeTrainingDay(planId, dayId)
await store.adaptTrainingPlan(planId, userId)
```

### 4. **Componentes (`components/training/`)**

#### **ExerciseCard**
Muestra un ejercicio individual con:
- Imagen/GIF
- Nombre y metadatos
- Badge de dificultad
- Animaciones hover

```tsx
<ExerciseCard
  exercise={exercise}
  onClick={handleClick}
  isSelected={false}
  isAddable={true}
/>
```

#### **ExerciseFilters**
Panel de filtros con:
- Filtros por parte del cuerpo, equipo, objetivo, dificultad
- Carga de opciones dinámicas desde API
- Botón para limpiar filtros

```tsx
<ExerciseFilters
  onFiltersChange={(filters) => fetchExercises(filters)}
  isLoading={isLoading}
/>
```

#### **TrainingPlanCard**
Tarjeta de plan con:
- Nombre, descripción, dificultad
- Barra de progreso
- Acciones (editar, eliminar, asignar)

```tsx
<TrainingPlanCard
  plan={plan}
  onClick={() => navigate(`/training/${plan.id}`)}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onAssign={handleAssign}
/>
```

#### **TrainingDayCard**
Día de entrenamiento con:
- Checkbox para marcar completado
- Detalles expandibles de ejercicios
- Información de sets y descanso

```tsx
<TrainingDayCard
  day={day}
  dayNumber={1}
  totalDays={30}
  onComplete={handleComplete}
  isCompletingDay={isCompletingDay}
/>
```

#### **TrainingLoadingSpinner**
Indicadores de carga:
- Spinner normal para carga general
- Spinner especial para adaptación de IA

```tsx
<TrainingLoadingSpinner
  message="Cargando..."
  isAdapting={true}
/>
```

#### **TrainingNotification**
Sistema de notificaciones con:
- Tipos: success, error, info, warning
- Auto-cerrado configurable
- Contenedor para apilar notificaciones

```tsx
<TrainingNotification
  type="success"
  title="Día completado"
  message="¡Excelente trabajo!"
  autoClose={5000}
/>
```

### 5. **Páginas (`pages/training/`)**

#### **ExercisesPage** (`/training/exercises`)
- Catálogo de ejercicios públicos
- Búsqueda y filtros
- Grid de tarjetas con paginación
- Skeletons durante carga

#### **TrainingPlansPage** (`/training/plans`)
- Lista de planes del usuario
- Filtros por estado (todos, activos, completados)
- Estadísticas generales
- Botones para crear y gestionar planes

#### **TrainingDetailPage** (`/training/:planId`)
- Detalle completo del plan
- Barra de progreso general
- Lista de días con detalles expandibles
- Opción para adaptar plan (>80% completado)
- Botones para descargar/compartir

---

## 🔌 Flujos Principales

### 1. **Exploración de Ejercicios**

```typescript
// Usuario entra en /training/exercises
1. ExercisesPage monta
2. useEffect → fetchExercises() (sin filtros)
3. ExerciseSkeletons se muestran mientras carga
4. API retorna ejercicios públicos
5. Grid de ExerciseCard se renderiza
6. Usuario puede filtrar, paginar, buscar
```

### 2. **Crear Plan de Entrenamiento**

```typescript
// Usuario (entrenador) crea plantilla
1. Click en "Nuevo Plan"
2. Abre formulario con:
   - Nombre, descripción, duración
   - Constructor visual de días/ejercicios
3. Selecciona ejercicios del catálogo
4. Define sets/reps para cada ejercicio
5. POST /private/training-plans
6. Plan guardado como plantilla (isTemplate: true)
```

### 3. **Asignar Plan a Cliente**

```typescript
// Entrenador asigna plan a cliente
1. Selecciona plan template
2. Click en "Asignar"
3. Modal para elegir usuario y fecha inicio
4. POST /private/training-plans/:id/assign
5. Se crea instancia del plan para ese usuario
6. Cliente ve plan en su lista
```

### 4. **Completar Día de Entrenamiento**

```typescript
// Cliente completa un día
1. TrainingDetailPage muestra plan
2. TrainingDayCard para cada día
3. Click en checkbox/botón "Completar"
4. Optimistic update: isCompleted = true inmediatamente
5. PATCH /private/training-plans/:id/days/:dayId/complete
6. Toast success "¡Excelente trabajo!"
7. Si error, revertir cambio + Toast error
```

### 5. **Adaptar Plan con IA**

```typescript
// Cliente al 80%+ de progreso
1. TrainingDetailPage muestra banner "¿Listo para el siguiente nivel?"
2. Click en "Adaptar Plan"
3. Spinner especial: "Nuestra IA está optimizando..."
4. POST /private/training-plans/adapt
5. IA clona y modifica based on progress
6. Nuevo plan creado y asignado
7. Usuario notificado
```

---

## 📊 Estados de Carga Recomendados

### **Skeletons**
Usar para operaciones de lectura sin datos previos:
```tsx
{isLoading && !data ? <ExerciseSkeletonGrid /> : <Content />}
```

### **Spinners**
- Normal: Lectura/actualización general
- Con mensaje especial: Adaptación de plan (IA)

### **Optimistic Updates**
- Marcar día como completado: Actualizar UI inmediatamente
- Si falla API: Revertir y mostrar error

---

## ⚠️ Manejo de Errores

El módulo sigue el patrón existente con `errorHandler`:

```typescript
// Centralizado en lib/errors/errorHandler.ts
try {
  const response = await api.get(url)
  return response.data
} catch (error) {
  throw errorHandler(error)  // Retorna ApiError con mensaje limpio
}

// En componentes/store:
try {
  await action()
} catch (error) {
  const message = error instanceof Error ? error.message : "Error"
  showNotification(message)
}
```

### **Códigos HTTP**

| Código | Acción en Frontend |
|--------|-------------------|
| 400 | Validación: mostrar mensaje del servidor |
| 401 | Redirigir a login (manejado por interceptor) |
| 403 | Mostrar "Acceso Denegado" |
| 404 | Mostrar "Recurso no encontrado" |
| 500 | Mostrar "Algo salió mal, intenta más tarde" |

---

## 🎨 Diseño y Estilos

- **Tema**: Dark (slate-950 a slate-900) con accent rojo (#red-600)
- **Animaciones**: Framer Motion para transiciones suaves
- **Componentes**: Basados en Lucide React para iconos
- **Clases**: Tailwind CSS + clsx para composición segura
- **Breakpoints**: Mobile-first (sm, md, lg, xl)

---

## 🔑 Importaciones Principales

```typescript
// Tipos
import { TrainingPlan, Exercise, TrainingDay } from "@/types/training"

// Servicios
import { trainingPlansService } from "@/api/trainingPlansService"
import { exercisesService } from "@/api/exercisesService"

// Store
import { useTrainingStore } from "@/store/useTrainingStore"

// Componentes
import { 
  ExerciseCard,
  TrainingPlanCard,
  TrainingDayCard,
  TrainingLoadingSpinner,
  TrainingNotification
} from "@/components/training"

// Páginas
import { 
  ExercisesPage,
  TrainingPlansPage,
  TrainingDetailPage
} from "@/pages/training"
```

---

## 🚀 Rutas Recomendadas (React Router)

```typescript
// En App.tsx o router config
<Routes>
  {/* Público */}
  <Route path="/training/exercises" element={<ExercisesPage />} />
  
  {/* Privado - Usuario */}
  <Route element={<ProtectedRoute />}>
    <Route path="/training/plans" element={<TrainingPlansPage />} />
    <Route path="/training/:planId" element={<TrainingDetailPage />} />
  </Route>
  
  {/* Privado - Entrenador */}
  <Route element={<RoleRoute requiredRole="trainer" />}>
    <Route path="/training/create" element={<CreatePlanPage />} />
    <Route path="/training/:planId/edit" element={<EditPlanPage />} />
  </Route>
</Routes>
```

---

## 💡 Tips y Best Practices

1. **Reutiliza el Store**: No hagas llamadas API directas en componentes, usa `useTrainingStore()`

2. **Validaciones Frontend**: Usa Zod para validar antes de enviar datos

3. **Manejo de Loading**: Siempre muestra indicadores visuales (skeleton > spinner > content)

4. **Optimistic Updates**: Actualiza UI inmediatamente para marcar día como completado

5. **Error Boundaries**: Envuelve páginas con error boundaries para fallos inesperados

6. **Accesibilidad**: Asegura alt text en imágenes, labels en inputs, navegación por teclado

7. **Performance**: Lazy load páginas de training, memoriza componentes de lista grandes

---

## 🧪 Pruebas Sugeridas

```typescript
// Unit tests
- exercisesService.getExercises()
- trainingPlansService.completeTrainingDay()
- errorHandler edge cases

// Component tests
- ExerciseCard interactivity
- ExerciseFilters filter changes
- TrainingDayCard complete action

// Integration tests
- ExercisesPage load → filter → search
- TrainingPlansPage → TrainingDetailPage → complete day
- Adapt plan flow
```

---

## 📝 Próximos Pasos

1. **Crear Rutas**: Integrar páginas en App.tsx/router
2. **Formularios**: Crear `CreateTrainingPlanPage` y `EditTrainingPlanPage`
3. **Modal Asignación**: Implementar modal para asignar planes a clientes
4. **Reports**: Dashboard con estadísticas de progreso
5. **Sincronización**: Websockets para actualizaciones en tiempo real
6. **Offline Support**: Service Worker para caché de ejercicios

---

**Última actualización**: Abril 2026  
**Versión**: 1.0.0
