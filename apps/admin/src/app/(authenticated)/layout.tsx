import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Toaster } from "sonner";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
