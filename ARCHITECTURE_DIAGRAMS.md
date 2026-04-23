/**
 * ARQUITECTURA VISUAL - MÓDULO DE ENTRENAMIENTO
 * 
 * Este documento muestra la relación entre capas y flujos de datos
 */

// ==============================================================
// DIAGRAMA 1: ARQUITECTURA DE CAPAS
// ==============================================================

/*
┌─────────────────────────────────────────────────────────────┐
│                    PÁGINAS (UI LAYER)                        │
├─────────────────────────────────────────────────────────────┤
│ ExercisesPage    │ TrainingPlansPage    │ TrainingDetailPage │
│  (Catálogo)      │  (Mis planes)        │  (Detalle + track) │
└────────┬──────────┴──────────┬──────────┴─────────┬──────────┘
         │                     │                    │
         └─────────────────────┼────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            COMPONENTES REUTILIZABLES (COMPONENT LAYER)      │
├─────────────────────────────────────────────────────────────┤
│ ExerciseCard │ TrainingPlanCard │ TrainingDayCard           │
│ ExerciseFilters                                             │
│ TrainingLoadingSpinner │ TrainingNotifications              │
│ ExerciseSkeletons                                           │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              STORE GLOBAL (STATE MANAGEMENT)                │
├─────────────────────────────────────────────────────────────┤
│ useTrainingStore (Zustand)                                  │
│                                                             │
│ State:                      Actions:                        │
│ - trainingPlans            - fetchTrainingPlans()          │
│ - exercises                - createTrainingPlan()          │
│ - currentPlan              - completeTrainingDay()         │
│ - isLoading, errors        - adaptTrainingPlan()           │
│ - currentPage, total       - searchExercises()             │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│             SERVICIOS API (DATA LAYER)                      │
├─────────────────────────────────────────────────────────────┤
│ exercisesService          │ trainingPlansService            │
│                                                             │
│ - getExercises()          │ - getTrainingPlansByUser()      │
│ - searchExercises()       │ - createTrainingPlan()          │
│ - getFilterOptions()      │ - completeTrainingDay()        │
│                           │ - adaptTrainingPlan()          │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    AXIOS INSTANCES                          │
├─────────────────────────────────────────────────────────────┤
│ axiosPublic (no JWT)      │ axios (con JWT + interceptors)  │
│                                                             │
│ Interceptors:                                               │
│ - Request: Agregar JWT bearer token                        │
│ - Response: Validar status, manejar 401, throw ApiError    │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API BACKEND                            │
├─────────────────────────────────────────────────────────────┤
│ GET /public/exercises                                       │
│ POST /private/training-plans                               │
│ PATCH /private/training-plans/:id/days/:dayId/complete     │
│ POST /private/training-plans/adapt                         │
└─────────────────────────────────────────────────────────────┘
*/

// ==============================================================
// DIAGRAMA 2: FLUJO DE DATOS (MARCAR DÍA COMPLETADO)
// ==============================================================

/*
┌─────────────────────────────────────────────────────────────┐
│          USER CLICKS "COMPLETAR DÍA" BUTTON                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ TrainingDayCard component  │
        │ onComplete(dayId)          │
        └────────────┬───────────────┘
                     │
                     ▼ handleCompleteDay(planId, dayId)
        ┌────────────────────────────────────────┐
        │ useTrainingStore                       │
        │ setIsCompletingDay = dayId             │
        │ [OPTIMISTIC UPDATE]                    │
        │ currentPlan.days[x].isCompleted = true │
        └────────────┬───────────────────────────┘
                     │
        ┌────────────▼────────────────────────────┐
        │ UI ACTUALIZA INMEDIATAMENTE             │
        │ - Checkbox marca como ✓                │
        │ - Barra de progreso avanza             │
        │ - MiniSpinner aparece en botón         │
        └────────────┬────────────────────────────┘
                     │
                     ▼ completeTrainingDay(planId, dayId)
        ┌────────────────────────────────────────┐
        │ trainingPlansService                   │
        │ PATCH /private/training-plans/{id}     │
        │        /days/{dayId}/complete          │
        └────────────┬────────────────────────────┘
                     │
            ┌────────┴────────┐
            │                 │
            ▼                 ▼
      ✅ SUCCESS         ❌ ERROR
            │                 │
            ▼                 ▼
    Notificación:   [ROLLBACK]
    "¡Día         currentPlan.days[x]
    completado!"  .isCompleted = false
                  UI revierte
                  Error toast

    Flujo: 100ms   1-2s API   0ms UI revert
*/

// ==============================================================
// DIAGRAMA 3: FLUJO DE BÚSQUEDA Y FILTROS
// ==============================================================

/*
┌──────────────────────────────────────────┐
│     ExercisesPage (inicial)              │
│     mountEffect → fetchExercises()       │
│     sin filtros, página 1                │
└───────────────┬──────────────────────────┘
                │
                ▼
    [ExerciseSkeletonGrid] ← mientras isLoadingExercises
                │
                ▼
┌──────────────────────────────────────────┐
│ ExerciseFilters component                │
│ dropdown: bodyPart, equipment, etc.      │
└───────────┬───────────────────────────────┘
            │
            ├─ onFiltersChange()
            │
            ▼
┌──────────────────────────────────────────────┐
│ handleFiltersChange(newFilters)              │
│ setFilters(newFilters)                       │
│ fetchExercises(newFilters)                   │
└───────────┬──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│ useTrainingStore                             │
│ isLoadingExercises = true                    │
└───────────┬──────────────────────────────────┘
            │
            ▼
    Grid muestra [Skeletons]
            │
            ▼
┌──────────────────────────────────────────────┐
│ exercisesService.getExercises(filters)       │
│ GET /public/exercises?bodyPart=chest&...     │
└───────────┬──────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│ store actualiza:                             │
│ - exercises = response.data                  │
│ - totalExercises = response.total            │
│ - isLoadingExercises = false                 │
└───────────┬──────────────────────────────────┘
            │
            ▼
    [Grid de ExerciseCard] con animaciones
*/

// ==============================================================
// DIAGRAMA 4: FLUJO DE ADAPTACIÓN DE PLAN (IA)
// ==============================================================

/*
┌──────────────────────────────────────────────┐
│ TrainingDetailPage                           │
│ Progreso >= 80% && < 100%                    │
│ Banner: "¿Listo para el siguiente nivel?"    │
│ Button: "Adaptar Plan"                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼ handleAdaptPlan()
           ┌─────────────────────┐
           │ isLoading = true    │
           │ Spinner con IA      │
           │ "Nuestra IA está    │
           │  optimizando..."    │
           └────────┬────────────┘
                    │
                    ▼
    POST /private/training-plans/adapt
    { planId, userId }
                    │
           ┌────────┴────────┐
           │                 │
           ▼                 ▼
    ✅ SUCCESS          ❌ ERROR
           │                 │
           ▼                 ▼
    trainingPlansService
    .adaptTrainingPlan()
           │
           ▼
    store.trainingPlans
    .push(newAdaptedPlan)
           │
           ▼
    Notification:
    "✓ Plan adaptado exitosamente
     Tu nuevo plan ha sido creado"
           │
           ▼
    Usuario puede ir a
    /training/plans para verlo

    Tiempo estimado: 3-5 segundos
*/

// ==============================================================
// DIAGRAMA 5: JERARQUÍA DE COMPONENTES
// ==============================================================

/*
App
 └── Router
     ├── ExercisesPage
     │   ├── Header
     │   ├── SearchForm
     │   ├── ExerciseFilters
     │   │   ├── Select (bodyPart)
     │   │   ├── Select (equipment)
     │   │   └── Button (Limpiar)
     │   ├── {isLoading ? <Skeletons/> : <Grid/>}
     │   │   └── ExerciseCard x N
     │   │       ├── Image
     │   │       ├── Text
     │   │       └── BadgeDificultad
     │   └── Pagination
     │
     ├── TrainingPlansPage
     │   ├── Header (Stats)
     │   │   ├── PlanesActivos
     │   │   ├── DíasCompletados
     │   │   └── Progreso%
     │   ├── FilterButtons
     │   ├── {isLoading ? <Spinner/> : <Grid/>}
     │   │   └── TrainingPlanCard x N
     │   │       ├── Title
     │   │       ├── Metadata
     │   │       ├── ProgressBar
     │   │       └── Actions
     │   └── NotFound (si vacío)
     │
     └── TrainingDetailPage
         ├── Header (Volver, Descargar, Compartir)
         ├── PlanInfo
         │   ├── Title
         │   ├── Badges
         │   └── Stats (4 cards)
         ├── AdaptBanner (condicional)
         ├── TrainingDayCard x N
         │   ├── Checkbox
         │   ├── DayNumber
         │   ├── {expanded && <Details>}
         │   │   ├── ExerciseDetails x M
         │   │   │   ├── Name
         │   │   │   └── Sets
         │   │   └── Notes
         │   └── Status badge
         └── NotificationContainer

TrainingNotification (global en cada página)
 └── Toast con tipo (success/error/warning/info)
*/

// ==============================================================
// DIAGRAMA 6: FLUJO DE AUTENTICACIÓN Y ROLES
// ==============================================================

/*
┌─────────────────────────────────────┐
│ Browser                             │
│ /training/exercises (PÚBLICO) ✅   │
│ → Cualquiera puede entrar          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Browser                             │
│ /training/plans (PROTEGIDO)         │
│ → ProtectedRoute (checkSession)     │
│   ↓ No autenticado → /login         │
│   ✅ Autenticado → TrainingPlansPage│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Browser                             │
│ /training/create (RESTRICTO)        │
│ → ProtectedRoute → RoleRoute        │
│   ↓ role_id ≠ 2,3 → /dashboard     │
│   ✅ role_id = 2 (trainer) → OK    │
│   ✅ role_id = 3 (gym) → OK        │
│   ❌ role_id = 1 (client) → denied │
└─────────────────────────────────────┘

JWT Flow:
1. Login → Token en localStorage
2. Cada request → axios interceptor agrega
   Header: "Authorization: Bearer {token}"
3. 401 → Auto-logout + redirect /login
4. Token refresh en: authService (ya existe)
*/

// ==============================================================
// DIAGRAMA 7: MANEJO DE ERRORES
// ==============================================================

/*
Error en cualquier layer:
        │
        ▼
try { await api.get(...) }
catch (error) {
  throw errorHandler(error)
}
        │
        ▼
┌─────────────────────────────────────────┐
│ errorHandler (lib/errors/)              │
│                                         │
│ 1. Detecta tipo de error                │
│    - Axios error? → Extract status, msg │
│    - Network error? → Offline message   │
│    - Unknown error? → Default msg       │
│                                         │
│ 2. Retorna ApiError customizado         │
│    { message: string, status?: number } │
│                                         │
│ 3. NUNCA retorna null/undefined         │
└────────────┬────────────────────────────┘
             │
             ▼
Store captura:
  try {
    await action()
  } catch(error) {
    set({ error: error.message })
  }
             │
             ▼
Component muestra:
  <TrainingNotification
    type="error"
    title="Error al cargar"
    message={error.message}
  />

Códigos HTTP:
- 400 → Validación → Mostrar msg del servidor
- 401 → Token expirado → Auto-logout
- 403 → Forbidden → Mostrar "Acceso Denegado"
- 404 → Not found → Mostrar "No encontrado"
- 500 → Server error → Mostrar genérico
*/

// ==============================================================
// DIAGRAMA 8: TIMELINE DE CARGAS
// ==============================================================

/*
FAST PATH (Cached Data):
├─ 0ms: User clicks
├─ 10ms: API request (cached locally)
└─ 50ms: UI updates (✅ instant)

MEDIUM PATH (Network OK):
├─ 0ms: User clicks
├─ 100ms: Show skeleton
├─ 500-800ms: API response
├─ 50ms: Store update
└─ 100ms: UI renders

SLOW PATH (Network slow):
├─ 0ms: User clicks
├─ 100ms: Show skeleton
├─ 2-5s: API response (IA, adapt)
├─ 50ms: Store update
└─ 100ms: UI renders + notification

ERROR PATH:
├─ 0ms: User clicks
├─ 100ms: Show skeleton
├─ 1-2s: API error
├─ 50ms: Store.error = message
└─ 100ms: UI shows error notification

OPTIMISTIC PATH (Mark complete):
├─ 0ms: User clicks
├─ 10ms: UI updates immediately (✅)
├─ 50ms: Store optimistic update
├─ 100-200ms: API request
├─ 500ms-1s: Confirm or revert
└─ Result: Instant feedback to user
*/

export {};
