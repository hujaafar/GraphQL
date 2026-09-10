"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApolloClient, useQuery } from "@apollo/client";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { Brand } from "@/components/Brand";
import { GET_DASHBOARD, MODULE_PATH } from "@/graphql/dashboard-query";
import { clearSession, getSession } from "@/lib/auth";
import type { DashboardData } from "@/lib/dashboard";

export default function ProfilePage() {
  const router = useRouter();
  const client = useApolloClient();
  const [ready, setReady] = useState(false);
  const [anchor, setAnchor] = useState("");
  const { data, previousData, loading, error, refetch } = useQuery<DashboardData>(GET_DASHBOARD, {
    skip: !ready,
    variables: { modulePath: MODULE_PATH, modulePattern: `${MODULE_PATH}%` },
    notifyOnNetworkStatusChange: true,
  });
  const logout = useCallback(() => {
    setReady(false);
    clearSession();
    void client.clearStore();
    router.replace("/login");
  }, [client, router]);
  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    setReady(true);
    const check = () => {
      if (!getSession()) logout();
    };
    const timer = window.setInterval(check, 30000);
    window.addEventListener("graphite:session-expired", logout);
    window.addEventListener("focus", check);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("graphite:session-expired", logout);
      window.removeEventListener("focus", check);
    };
  }, [logout, router]);
  useEffect(() => {
    // Keep the previous timestamp when a refresh fails or is still in flight.
    if (data && !loading && !error) setAnchor(new Date().toISOString());
  }, [data, loading, error]);
  async function refresh() {
    try {
      await refetch();
    } catch {
      /* The query error is presented in the workspace. */
    }
  }
  const current = data || previousData;
  if (!ready || (loading && !current) || (current && !anchor && !error))
    return (
      <main id="main" tabIndex={-1} className="route-state">
        <Brand />
        <LoaderCircle size={30} className="spin" />
        <h1>Connecting your learning.</h1>
        <p role="status">Loading your Reboot01 workspace…</p>
      </main>
    );
  if (!current || !current.user.length)
    return (
      <main id="main" tabIndex={-1} className="route-state">
        <Brand />
        <h1>{error ? "We couldn’t load your workspace." : "No learner profile was returned."}</h1>
        <p>
          {error
            ? "Check your connection and try again. If your session has ended, sign in again."
            : "Try signing in with your Reboot01 student account."}
        </p>
        <div className="state-actions">
          <button className="button button-primary" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} /> Try again
          </button>
          <button className="button button-secondary" onClick={logout}>
            Back to sign in
          </button>
        </div>
      </main>
    );
  return (
    <Dashboard
      data={current}
      anchor={anchor}
      onLogout={logout}
      onRefresh={refresh}
      refreshing={loading}
      refreshError={!!error}
    />
  );
}
