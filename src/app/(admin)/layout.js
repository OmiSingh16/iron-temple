import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/components/admin/shell/bottom-nav";
import Sidebar from "@/components/admin/shell/sidebar";
import TopBar from "@/components/admin/shell/top-bar";

async function AuthCheck({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("iron_admin");
  if (!session?.value) redirect("/login");
  return children;
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      <Suspense fallback={<div className="w-[232px] hidden md:block" />}>
        <Sidebar />
      </Suspense>
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">
          <div className="max-w-[1120px] mx-auto">
            <Suspense fallback={<div className="p-4 text-ink-muted">Loading...</div>}>
              <AuthCheck>{children}</AuthCheck>
            </Suspense>
          </div>
        </main>
      </div>

      <Suspense fallback={<div className="h-16 md:hidden" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}