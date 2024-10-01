import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./store"; // Import the Zustand store
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

// Protect routes based on authentication
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();

  // Original authentication check (commented out)

  return isAuthenticated ? element : <Navigate to="/login" />;

  // Hardcoded authentication for testing
  // return isAuthenticated ? element : <Navigate to="/login" />;
};
const App = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
      </Routes>
    </main>
  );
};

export default App;
