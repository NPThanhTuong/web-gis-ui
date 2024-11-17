import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import HomePage from "@/pages/HomePage";
import { AuthProvider } from "@/context/AuthContext";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route element={<ProtectedRoute />} path="/admin">
            <Route path="" element={<AdminPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
