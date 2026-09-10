"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LoaderCircle,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { getSession, signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => {
    if (getSession()) router.replace("/profile");
    return () => {
      activeRequest.current?.abort();
    };
  }, [router]);
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (activeRequest.current) return;
    const request = new AbortController();
    activeRequest.current = request;
    setPending(true);
    setError("");
    try {
      await signIn(identifier, password, request.signal);
      setPassword("");
      router.replace("/profile");
    } catch (cause) {
      if (request.signal.aborted) return;
      setError(
        cause instanceof TypeError
          ? "Couldn’t connect to Reboot01. Check your connection and try again."
          : cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name)
            ? "The connection took too long. Please try again."
            : cause instanceof Error
              ? cause.message
              : "Sign-in failed. Please try again.",
      );
    } finally {
      if (activeRequest.current === request) activeRequest.current = null;
      if (!request.signal.aborted) setPending(false);
    }
  }
  return (
    <main id="main" className="login-page">
      <section className="login-editorial" aria-labelledby="editorial-title">
        <div className="login-art" aria-hidden="true" />
        <div className="editorial-top">
          <Brand />
          <span className="eyebrow">THE LEARNING GRAPH</span>
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">
            <span className="status-dot" /> CONNECT THE DOTS
          </span>
          <h1 id="editorial-title">
            Small steps.
            <br />
            <em>Extraordinary</em>
            <br />
            progress.
          </h1>
          <p>
            Every project, every skill, every breakthrough.
            <br />
            See how far you’ve come.
          </p>
        </div>
        <div className="editorial-bottom">
          <span>01 / YOUR NEXT CHAPTER</span>
          <Network size={26} />
          <span>POWERED BY GRAPHQL</span>
        </div>
      </section>
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-panel-top">
          <span>Made for Reboot01</span>
          <span className="outline-label">STUDENT WORKSPACE</span>
        </div>
        <div className="login-form-wrap">
          <span className="login-icon">
            <ArrowUpRight size={28} />
          </span>
          <p className="eyebrow">WELCOME BACK</p>
          <h2 id="login-title">
            Your journey,
            <br />
            in perspective.
          </h2>
          <p className="muted">Sign in with your Reboot01 account.</p>
          <form
            onSubmit={handleSubmit}
            className="login-form"
            aria-busy={pending}
            aria-labelledby="login-title"
          >
            <label htmlFor="identifier">Username or email</label>
            <input
              id="identifier"
              autoComplete="username"
              autoCapitalize="none"
              aria-describedby={error ? "login-error" : undefined}
              spellCheck={false}
              placeholder="Your Reboot01 username"
              value={identifier}
              onChange={(event) => {
                setIdentifier(event.target.value);
                setError("");
              }}
              required
              disabled={pending}
            />
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                aria-describedby={error ? "login-error" : undefined}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                required
                disabled={pending}
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                aria-controls="password"
              >
                {visible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {error && (
              <p id="login-error" className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-primary" type="submit" disabled={pending}>
              {pending ? "Signing in…" : "Open my workspace"}
              {pending ? <LoaderCircle size={19} className="spin" /> : <ArrowRight size={19} />}
            </button>
          </form>
          <p className="login-security">
            <LockKeyhole size={15} /> Your password is sent only to Reboot01.
          </p>
          <div className="login-divider">
            <span>TAKE A LOOK AROUND</span>
          </div>
          <Link href="/demo" className="button button-secondary">
            Explore the sample workspace <ArrowUpRight size={18} />
          </Link>
          <p className="demo-note">Sample data. No account needed.</p>
        </div>
        <footer className="login-footer">
          <span>
            <ShieldCheck size={16} /> A private view of your progress
          </span>
          <a href="https://github.com/hujaafar/GraphQL" target="_blank" rel="noreferrer">
            View source <ArrowUpRight size={14} />
          </a>
        </footer>
      </section>
    </main>
  );
}
