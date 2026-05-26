import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login — Gearbox Autos" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const signIn = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) {
      toast.error("Sign in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <section className="container-page pt-32 pb-12 min-h-screen flex items-center justify-center">
      <div className="surface p-10 max-w-md w-full text-center">
        <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
        <h1 className="text-2xl font-bold mt-4">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to manage inventory, leads, and bookings.
        </p>
        <button
          onClick={signIn}
          disabled={busy}
          className="btn-primary mt-8 w-full rounded-md py-3 font-semibold disabled:opacity-60"
        >
          {busy ? "Redirecting…" : "Continue with Google"}
        </button>
      </div>
    </section>
  );
}
