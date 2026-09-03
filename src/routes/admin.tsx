import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Car, Inbox, Calendar, MessageSquare, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Gearbox Autos" },
      { name: "description", content: "Gearbox Autos admin dashboard. Manage used car inventory, sell leads, test drive bookings, and customer messages for the Jamshedpur dealership." },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    checkIsAdmin().then((r) => setIsAdmin(r.isAdmin)).catch(() => setIsAdmin(false));
  }, [session, loading, navigate]);

  if (loading || isAdmin === null) {
    return <div className="container-page pt-12"><p className="text-muted-foreground">Loading…</p></div>;
  }

  if (!isAdmin) {
    return (
      <div className="container-page pt-12 pb-12">
        <div className="surface p-10 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            You're signed in as <span className="text-foreground">{session?.user?.email}</span> but don't have admin access.
          </p>
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))} className="btn-primary mt-6 rounded-md py-2 px-4 text-sm font-semibold">Sign out</button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
    { to: "/admin/cars", label: "Cars", Icon: Car },
    { to: "/admin/leads", label: "Sell Leads", Icon: Inbox },
    { to: "/admin/bookings", label: "Test Drives", Icon: Calendar },
    { to: "/admin/messages", label: "Messages", Icon: MessageSquare },
    { to: "/admin/inspection", label: "Inspection Tool", Icon: ClipboardCheck },
  ];

  return (
    <div className="container-page pt-28 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow">Admin</div>
          <h1 className="text-2xl font-bold mt-1">Gearbox Console</h1>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))} className="text-sm flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 hover:bg-card">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="surface p-3 h-fit">
          <nav className="grid gap-1">
            {nav.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-primary/15 text-primary" : "hover:bg-card text-muted-foreground"}`}>
                  <n.Icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
