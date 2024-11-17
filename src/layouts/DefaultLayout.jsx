import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function DefaultLayout() {
  return (
    <div className="w-full min-h-screen">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default DefaultLayout;
