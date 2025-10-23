import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";

const RootRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType === "Professor")
    return <Navigate to="/professor/dashboard" replace />;
  else if (user.accountType === "Student")
    return <Navigate to="/student/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Professor"]}>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ErrorPage
            title="Page Not Found"
            message="The page you're looking for doesn't exist."
            showHomeButton={true}
          />
        }
      />
    </Routes>
  );
};

export default App;
