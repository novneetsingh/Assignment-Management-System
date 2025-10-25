# 📚 Assignment Management System

A comprehensive full-stack web application for managing academic assignments, designed for both students and professors. The system enables seamless assignment creation, submission tracking, group management, and analytics.

## 🌐 Live Demo

https://assignment-management-system-j79h.onrender.com

## 🌟 Features

### 👨‍🏫 For Professors

- **Create & Manage Assignments**: Create assignments with descriptions, due dates, and OneDrive links
- **View All Assignments**: Access all assignments created across the platform
- **Submission Management**: View all submissions for their assignments
- **Confirmation System**: Confirm student submissions with one-click approval
- **Analytics Dashboard**: Comprehensive analytics with submission statistics
- **Assignment Analytics**: Track total submissions, confirmed submissions, and group vs individual submissions

### 👨‍🎓 For Students

- **View Assignments**: Browse all available assignments in the system
- **Group Management**: Create and manage study groups
- **Assignment Submission**: Submit assignments individually or as part of a group
- **Member Management**: Add other students to groups by email
- **Submission Tracking**: View submission status for each assignment

### 🔐 Authentication & Security

- **Role-based Access**: Separate interfaces for students and professors
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware-protected API endpoints
- **Password Hashing**: Bcrypt encryption for secure password storage

## 🏗️ Technology Stack

### Frontend

- **React 19.1.1** - Modern React with hooks and functional components
- **React Router DOM 7.9.4** - Client-side routing
- **TailwindCSS 4.1.15** - Utility-first CSS framework
- **React Hook Form 7.65.0** - Form validation and management
- **React Hot Toast 2.6.0** - Toast notifications
- **React Icons 5.5.0** - Feather icons library
- **Axios 1.12.2** - HTTP client for API calls
- **Vite 7.1.7** - Fast build tool and dev server

### Backend

- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **Prisma 6.18.0** - Database ORM and migrations
- **PostgreSQL 15+** - Primary database
- **JWT 9.0.2** - JSON Web Token authentication
- **Bcrypt.js 3.0.2** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment variable management

### Database Schema

- **Users**: Account management with role-based access (Student/Professor)
- **Assignments**: Assignment details with creator relationship
- **Groups**: Student groups with membership management
- **Submissions**: Assignment submissions with status tracking
- **Group Members**: Many-to-many relationship between users and groups

## 📁 Project Structure

```
Assignment Management System/
├── 📂 src/                          # Frontend React Application
│   ├── 📂 components/               # Reusable React Components
│   │   ├── 📂 common/               # Common UI Components
│   │   │   ├── Header.jsx           # App header with user info
│   │   │   ├── Loading.jsx          # Loading spinner
│   │   │   ├── Modal.jsx            # Modal dialog wrapper
│   │   │   ├── Card.jsx             # Card container
│   │   │   ├── TabNavigation.jsx    # Tab navigation
│   │   │   └── EmptyState.jsx       # Empty state display
│   │   ├── 📂 forms/                # Form Components
│   │   │   ├── AssignmentForm.jsx   # Create/Edit assignments
│   │   │   ├── GroupForm.jsx        # Create groups
│   │   │   ├── SubmissionForm.jsx   # Submit assignments
│   │   │   └── AddMemberForm.jsx    # Add group members
│   │   ├── 📂 lists/                # List/Display Components
│   │   │   ├── AssignmentCard.jsx   # Assignment display
│   │   │   ├── StudentAssignmentCard.jsx # Student assignment view
│   │   │   ├── GroupCard.jsx        # Group display
│   │   │   └── SubmissionCard.jsx   # Submission display
│   │   ├── 📂 analytics/            # Analytics Components
│   │   │   ├── StatCard.jsx         # Statistic cards
│   │   │   └── AnalyticsDashboard.jsx # Analytics overview
│   │   └── ProtectedRoute.jsx       # Route protection component
│   ├── 📂 context/                  # React Context
│   │   └── AuthContext.jsx          # Authentication state management
│   ├── 📂 pages/                    # Page Components
│   │   ├── 📂 student/              # Student Pages
│   │   │   ├── StudentDashboardNew.jsx # Main student dashboard
│   │   │   ├── AssignmentsPage.jsx # Standalone assignments page
│   │   │   └── GroupsPage.jsx       # Standalone groups page
│   │   ├── 📂 professor/            # Professor Pages
│   │   │   ├── ProfessorDashboardNew.jsx # Main professor dashboard
│   │   │   ├── ManageAssignmentsPage.jsx # Assignment management
│   │   │   └── AnalyticsPage.jsx   # Analytics page
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   └── ErrorPage.jsx            # 404 error page
│   ├── 📂 services/                 # API Service Layer
│   │   └── api.js                   # Centralized API calls
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # React entry point
│   ├── index.css                     # Global styles
│   ├── index.html                    # HTML template
│   └── tailwind.config.js           # Tailwind configuration
├── 📂 server/                       # Backend Node.js Application
│   ├── 📂 config/                   # Configuration Files
│   │   └── prisma.js                # Prisma client configuration
│   ├── 📂 controllers/              # Request Handlers
│   │   ├── auth.controller.js       # Authentication logic
│   │   ├── assignment.controller.js # Assignment operations
│   │   ├── group.controller.js      # Group management
│   │   ├── submission.controller.js # Submission handling
│   │   └── user.controller.js       # User operations
│   ├── 📂 middlewares/              # Express Middleware
│   │   └── auth.js                  # Authentication middleware
│   ├── 📂 routes/                   # API Routes
│   │   ├── auth.routes.js           # Auth routes
│   │   ├── assignment.routes.js     # Assignment routes
│   │   ├── group.routes.js          # Group routes
│   │   ├── submission.routes.js     # Submission routes
│   │   └── user.routes.js           # User routes
│   ├── 📂 utils/                    # Utility Functions
│   │   └── errorResponse.js         # Error response handler
│   ├── 📂 prisma/                   # Database Schema & Migrations
│   │   ├── migrations/              # Database migrations
│   │   └── schema.prisma            # Database schema
│   ├── 📂 generated/                # Prisma Generated Client
│   │   └── prisma/                  # Generated Prisma client
│   ├── index.js                     # Server entry point
│   ├── .env                         # Environment variables
│   ├── package.json                 # Dependencies
│   └── package-lock.json            # Dependency lock file
├── 📂 public/                       # Static Assets
│   └── vite.svg                     # Vite logo
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # This file
├── 📄 package.json                 # Frontend dependencies
├── 📄 package-lock.json            # Frontend dependency lock
├── 📄 vite.config.js               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind configuration
├── 📄 index.html                   # Main HTML file
└── 📄 jsconfig.json                # JavaScript configuration
```

## 🚀 API Endpoints

### Authentication APIs

| Method | Endpoint         | Description       | Auth Required | Role |
| ------ | ---------------- | ----------------- | ------------- | ---- |
| POST   | `/auth/register` | Register new user | ❌            | -    |
| POST   | `/auth/login`    | User login        | ❌            | -    |

**Request Body (Register):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "accountType": "Student" // or "Professor"
}
```

**Request Body (Login):**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "accountType": "Student"
    },
    "token": "jwt_token_here"
  }
}
```

### User APIs

| Method | Endpoint          | Description              | Auth Required | Role    |
| ------ | ----------------- | ------------------------ | ------------- | ------- |
| GET    | `/users/me`       | Get current user profile | ✅            | All     |
| GET    | `/users/students` | Get all students         | ✅            | Student |

**Response (Profile):**

```json
{
  "success": true,
  "message": "User found",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "accountType": "Student"
  }
}
```

### Assignment APIs

| Method | Endpoint                 | Description                 | Auth Required | Role              |
| ------ | ------------------------ | --------------------------- | ------------- | ----------------- |
| POST   | `/assignments`           | Create new assignment       | ✅            | Professor         |
| GET    | `/assignments`           | Get all assignments         | ✅            | Student           |
| GET    | `/assignments/professor` | Get professor's assignments | ✅            | Professor         |
| GET    | `/assignments/:id`       | Get single assignment       | ✅            | All               |
| PUT    | `/assignments/:id`       | Update assignment           | ✅            | Professor (owner) |
| GET    | `/assignments/analytics` | Get assignment analytics    | ✅            | Professor         |

**Request Body (Create/Update):**

```json
{
  "title": "Data Structures Assignment",
  "description": "Implement binary search tree",
  "dueDate": "2025-01-15T23:59:59.000Z",
  "oneDriveLink": "https://onedrive.live.com/example"
}
```

**Response (Analytics):**

```json
{
  "success": true,
  "message": "Assignment analytics fetched successfully",
  "data": {
    "totalAssignments": 5,
    "totalSubmissions": 25,
    "confirmedSubmissions": 20,
    "pendingSubmissions": 5,
    "groupSubmissions": 15,
    "individualSubmissions": 10,
    "percentageConfirmed": 80
  }
}
```

### Group APIs

| Method | Endpoint                           | Description         | Auth Required | Role              |
| ------ | ---------------------------------- | ------------------- | ------------- | ----------------- |
| POST   | `/groups`                          | Create new group    | ✅            | Student           |
| GET    | `/groups/my-groups`                | Get user's groups   | ✅            | Student           |
| GET    | `/groups/:id`                      | Get group details   | ✅            | Student (member)  |
| POST   | `/groups/:groupId/members/:userId` | Add member to group | ✅            | Student (creator) |

**Request Body (Create Group):**

```json
{
  "name": "Study Group A",
  "members": ["user-id-1", "user-id-2", "user-id-3"]
}
```

**Response (Group Details):**

```json
{
  "success": true,
  "message": "Group fetched successfully",
  "data": {
    "id": "group-uuid",
    "name": "Study Group A",
    "creatorId": "creator-user-id",
    "members": [
      {
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  }
}
```

### Submission APIs

| Method | Endpoint                     | Description                    | Auth Required | Role      |
| ------ | ---------------------------- | ------------------------------ | ------------- | --------- |
| POST   | `/submissions`               | Submit assignment              | ✅            | Student   |
| PATCH  | `/submissions/confirm`       | Confirm submission             | ✅            | Professor |
| GET    | `/submissions/:assignmentId` | Get submissions for assignment | ✅            | Professor |

**Request Body (Submit):**

```json
{
  "assignmentId": "assignment-uuid",
  "groupId": "group-uuid" // optional, null for individual
}
```

**Request Body (Confirm):**

```json
{
  "submissionId": "submission-uuid",
  "assignmentId": "assignment-uuid"
}
```

**Response (Submissions):**

```json
{
  "success": true,
  "message": "Submissions fetched successfully",
  "count": 5,
  "data": [
    {
      "id": "submission-uuid",
      "status": "Confirmed",
      "createdAt": "2025-01-10T10:00:00.000Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "group": {
        "name": "Study Group A"
      }
    }
  ]
}
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** 15+ database
- **npm** or **yarn** package manager

### 1. Clone the Repository

```bash
git clone https://github.com/novneetsingh/Assignment-Management-System.git
cd Assignment-Management-System
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Create frontend environment file
echo "VITE_BACKEND_URL=http://localhost:3000" > .env
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file
cat > .env << EOL
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@localhost:5432/assignment_management_system
EOL
```

### 4. Database Setup

```bash
# Generate Prisma client
cd server
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
# npx prisma db seed
```

### 5. Start the Application

```bash
# From the root directory
npm start

# This will start both frontend (port 5173) and backend (port 3000)
```

### 6. Alternative: Start Separately

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

## 🌐 Environment Variables

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (server/.env)

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@host:port/database
```
