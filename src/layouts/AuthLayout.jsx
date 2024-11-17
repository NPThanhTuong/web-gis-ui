import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <section className="w-full">
      <div className="h-screen flex items-center justify-center bg-gradient-to-bl from-gray-50 via-slate-300 to-gray-100">
        <Outlet />
      </div>
    </section>
  );
}

export default AuthLayout;
