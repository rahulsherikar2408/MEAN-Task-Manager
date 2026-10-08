# TaskFlow — Modern MEAN Stack Task Management Platform

[![Angular](https://img.shields.io/badge/Angular-16.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

**TaskFlow** is a modern, production-grade **MEAN (MongoDB, Express, Angular, Node.js)** full-stack task management platform. Designed with a clean SaaS aesthetic inspired by products like Linear and Notion, it provides an intuitive interface for managing individual and team workloads through interactive Kanban boards, advanced filtering, and analytics dashboards.

---

## 🌟 Key Features

### 📊 Executive Analytics Dashboard
- **Dynamic Contextual Greeting**: Time-aware greetings (`Good morning`, `Good afternoon`, `Good evening`) personalized with user profile details.
- **Key Task Metrics**: Instant overview of Total Tasks, To Do, In Progress, and Completed counts with visual indicators.
- **Smart Health Signals**: Real-time alerts for Overdue Tasks, Due Today deadlines, and an overall Completion Rate progress indicator.
- **Priority Distribution**: Visual progress breakdown tracking High and Urgent priority workloads.
- **Activity Streams**: Scannable sections for Recent Tasks and Upcoming Deadlines with single-click navigation.

### 📌 Interactive Drag-and-Drop Kanban Board
- **Three-Column Workflow**: Smooth pipeline across `To Do`, `In Progress`, and `Completed` stages.
- **Angular CDK Drag & Drop**: Visual drag previews, glowing drop placeholders, and animated list transitions.
- **Live State Synchronization**: Dragging a card between columns updates the backend database status immediately with automatic error rollback.
- **Card Metadata**: Displays priority badge, category folder, due date alerts, tag chips, and quick action controls.

### 📋 Advanced Task Management (`My Tasks`)
- **Debounced Search**: Fast full-text search across titles, descriptions, and tags.
- **Multi-Parameter Filtering**: Filter simultaneously by Status, Priority, Category, and Date Ranges (`Due From` / `Due To`).
- **Overdue Quick Toggle**: Instant filter isolating past-due tasks requiring immediate attention.
- **Flexible Sorting**: Sort by Creation Date, Updated Date, Due Date, Title, or Priority in Ascending or Descending order.
- **One-Click Completion**: Checkbox circle allowing instant status toggle between Completed and Incomplete.
- **Responsive Pagination**: Server-side pagination controls with dynamic page sizing and counter info.

### 📝 Task Creation & Editing
- **Structured SaaS Form Card**: Centered layout organized into *Task Information* and *Classification & Schedule*.
- **Live Validation & Counters**: Real-time character counters for titles (`max 100`) and descriptions (`max 1000`).
- **Flexible Metadata**: Custom category dropdown, calendar date picker, and comma-separated tags.
- **Safe Submissions**: Button loading spinners that prevent accidental double submissions.

### 🔍 Comprehensive Task Details
- **Two-Column Overview**: Focused content view for description and tags alongside a dedicated metadata properties sidebar.
- **Quick Status Switcher**: One-click toolbar to transition tasks between `To Do`, `In Progress`, and `Completed`.
- **Audit Metadata**: Clear timestamps showing exactly when each task was created and last updated.
- **Destructive Action Safeguards**: Confirmation prompts preventing accidental task deletion.

### 🔐 Authentication & Session Security
- **JWT-Protected REST APIs**: Secure token generation and storage via `localStorage`.
- **Angular HTTP Interceptor**: Automatically injects `Bearer` authorization headers and gracefully handles `401 Unauthorized` session expirations with redirect to login.
- **Route Guards**: Angular functional `authGuard` shielding all private application routes.
- **Password Visibility Toggles**: Interactive show/hide toggles on both login and registration forms.

### 🎨 Design System & Accessibility
- **Design Tokens**: Standardized CSS variables for consistent neutral slates, modern indigo brand accents, elevation shadows, and rounded radii.
- **Typography**: Clean, readable sans-serif typography powered by Google Fonts **Inter**.
- **Responsive Layout**: Designed for seamless experiences across desktop (1920px, 1440px), tablet (1024px, 768px), and mobile (375px+).
- **Navigation**: Frosted glass sticky navbar with user initials avatar, profile dropdown, and a mobile hamburger drawer.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Angular 16, TypeScript, Angular CDK (Drag & Drop), Bootstrap 5, ngx-toastr, FontAwesome 6, Google Fonts Inter |
| **Backend** | Node.js (ES Modules), Express.js 5, Mongoose 9, jsonwebtoken, bcryptjs, cors, dotenv |
| **Database** | MongoDB (Local instance or MongoDB Atlas) |
| **Architecture** | RESTful API, Component-Driven Frontend, Service-Oriented Architecture, Interceptor Pattern |

---

## 📁 Project Structure

```text
MEAN-Task-Manager/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # Signup & login logic
│   │   ├── dashboardController.js# Aggregated metrics & dashboard queries
│   │   └── taskController.js     # Full Task CRUD, search & pagination logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── Task.js               # Task Mongoose schema & validation
│   │   └── User.js               # User Mongoose schema & password hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── dashboardRoutes.js    # /api/dashboard routes
│   │   └── taskRoutes.js         # /api/tasks routes
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator utility
│   ├── .env                      # Environment variables
│   ├── index.js                  # Express application entrypoint
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── add-task/     # New task creation page
│   │   │   │   ├── edit-task/    # Task update page
│   │   │   │   ├── kanban/       # Drag-and-drop Kanban board
│   │   │   │   ├── login/        # User authentication login
│   │   │   │   ├── navbar/       # Global header & user menu
│   │   │   │   ├── signup/       # User registration
│   │   │   │   ├── task-details/ # Full task detail & status switcher
│   │   │   │   ├── task-item/    # Task card row component
│   │   │   │   └── task-list/    # Task list with filters & pagination
│   │   │   ├── environments/     # Environment configurations
│   │   │   ├── guards/           # Angular route authGuard
│   │   │   ├── interceptors/     # Angular HTTP JWT interceptor
│   │   │   ├── models/           # TypeScript interfaces (Task, User, Stats)
│   │   │   ├── pages/
│   │   │   │   └── dashboard/    # Main analytics dashboard
│   │   │   ├── services/         # Angular injectable services (API clients)
│   │   │   ├── app-routing.module.ts
│   │   │   ├── app.component.*
│   │   │   └── app.module.ts
│   │   ├── index.html            # HTML shell with Google Fonts & FontAwesome
│   │   └── styles.css            # Global CSS variables & SaaS design system
│   ├── angular.json
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or later)
- **npm** (v9.x or later)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://localhost:27017` or a MongoDB Atlas cluster URI)
- **Angular CLI** (optional, recommended: `npm install -g @angular/cli@16`)

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/MEAN-Task-Manager.git
cd MEAN-Task-Manager
```

---

### 2. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Ensure a `.env` file exists in the `Backend` directory with the following variables:
   ```env
   PORT=8000
   MONGODB_URL="mongodb://localhost:27017/task-manager"
   JWT_SECRET="your_secure_jwt_secret_key_here"
   ```

4. Start the backend server:
   ```bash
   # Development mode with nodemon
   npm run dev

   # Or standard production mode
   npm start
   ```
   The backend API will run on **`http://localhost:8000`**.

---

### 3. Frontend Setup

1. In a new terminal window, navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration:
   Check `src/app/environments/environment.ts` to ensure it points to your backend URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8000'
   };
   ```

4. Start the Angular development server:
   ```bash
   npm start
   # or
   ng serve
   ```

5. Open your browser and navigate to:
   ```text
   http://localhost:4200
   ```

---

## 📡 API Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user and return JWT | No |

### Dashboard Endpoints (`/api/dashboard`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard` | Retrieve stats, recent, upcoming & overdue tasks | Yes |

### Task Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Get paginated tasks with search & filter queries | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks/:id` | Fetch specific task by ID | Yes |
| `PUT` | `/api/tasks/:id` | Update task details or status | Yes |
| `DELETE`| `/api/tasks/:id` | Delete a task by ID | Yes |

#### Query Parameters for `GET /api/tasks`:
- `search`: Full-text search keyword
- `status`: `TODO`, `IN_PROGRESS`, `COMPLETED`
- `priority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `category`: `Work`, `Study`, `Personal`, `Project`, `Other`
- `dueFrom`, `dueTo`: ISO date range filters
- `overdue`: `true` to filter overdue tasks only
- `sortBy`: `createdAt`, `updatedAt`, `dueDate`, `title`, `priority`, `status`
- `sortOrder`: `asc` or `desc`
- `page`: Page number (default: `1`)
- `limit`: Items per page (default: `10`)

---

## 🧪 Testing & Quality Assurance

### Run Frontend Unit Tests
```bash
cd Frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

### Build for Production
To compile an optimized production distribution:
```bash
cd Frontend
npm run build
```
The compiled output will be generated in `Frontend/dist/angular-todo-app/`.
