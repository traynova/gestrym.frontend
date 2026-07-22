# Gestrym - Client & Trainer Frontend Web Application

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand_4.5-orange)
![React Query](https://img.shields.io/badge/Data_Fetching-React_Query_v5-FF4154?logo=reactquery&logoColor=white)

Frontend web application for **Gestrym**, an all-in-one platform for trainers and athletes. This repository provides a modern, responsive user interface to manage training plans, nutrition programs, client progress tracking, and integration with Gestrym microservices and AI suggestions.

---

## 🛠️ Tech Stack & Dependencies

- **Core**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations), [Lucide React](https://lucide.dev/) (Icons)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Caching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## ⚡ Core Features & Modules

### 1. 🏋️‍♂️ Training Module (`/src/components/training`, `/src/pages/training`)
- **Exercises Catalog**: Search, filter, and paginate exercises with category/muscle group filters.
- **Training Plans Management**: List, view details, and track completion progress for workout plans.
- **Training Detail View**: Interactive workouts, day expandable cards, set details, and AI plan adaptation feedback.

### 2. 🥗 Nutrition Module (`/src/components/nutrition`)
- **Nutrition Dashboard**: Macro distribution (Protein, Carbs, Fats), caloric target tracking, and meal plans.
- **Plan Creator & Food Search**: Create customized meal plans and search foods.
- **AI Adjustment Panel**: Dynamic suggestions to balance diet and adapt macronutrients.
- **Trainer Nutrition View**: Specialized dashboard for trainers to assign and monitor client meal plans.

### 3. 📈 Progress & Metrics Module (`/src/components/progress`)
- **Metrics Dashboard & Charts**: Visualize body weight, fat percentage, muscle mass, and measurements over time using Recharts.
- **Comparison & Photos**: Side-by-side photo comparison for visual progress tracking.
- **Modals**: Add body metrics, upload progress photos, and add trainer feedback notes.

### 4. 🔑 Authentication & User Roles (`/src/pages/auth`, `/src/components/layout`)
- **Auth Flow**: Login, Registration, Forgot Password, Reset Password, and Email Confirmation.
- **Role-Based Access Control**: Protected routes and custom navigation layout based on roles (Client vs. Trainer/Coach).
- **Branding Setup**: Onboarding flow to set up custom branding for trainers.

---

## 📂 Repository Structure

```text
gestrym.frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # Axios instance, interceptors, and service endpoints
│   │   ├── auth.endpoints.ts
│   │   ├── exercises.endpoints.ts
│   │   ├── nutrition.endpoints.ts
│   │   ├── progress.endpoints.ts
│   │   └── trainingPlans.endpoints.ts
│   ├── components/         # Reusable UI components by feature domain
│   │   ├── forms/          # Form inputs (PhoneInput, etc.)
│   │   ├── layout/         # Navbar, Footer, AuthLayout, DashboardLayout, RoleRoute
│   │   ├── nutrition/      # Meal plan cards, Macro cards, Food search, AI panel
│   │   ├── progress/       # Progress charts, metric modals, comparison cards
│   │   └── training/       # Exercise cards, filters, skeletons, day cards
│   ├── lib/                # Error handlers and utility configurations
│   ├── pages/              # Page components & routing views
│   ├── store/              # Zustand global state (auth, training, etc.)
│   ├── types/              # TypeScript types & DTO definitions
│   ├── App.tsx             # Main routing setup
│   └── main.tsx            # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Environment Setup
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server with Vite
npm run dev
```

The application will be running at `http://localhost:5173`.

### Build & Production

```bash
# Run TypeScript check and build production output
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License
This project is proprietary and confidential. All rights reserved.
