"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  ChevronDown,
  Code2,
  Fingerprint,
  Github,
  LayoutDashboard,
  LogOut,
  Network,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { ProjectTable } from "./ProjectTable";
import { AuditHistory } from "./AuditHistory";
import { ProfileCard } from "./ProfileCard";
import { Brand } from "./Brand";
import { XPChart, SkillsChart } from "./Charts";
import { JourneyHeader, Reveal } from "./Motion";
import {
  amountOf,
  formatXP,
  getAudits,
  getProjects,
  getRank,
  getSkills,
  userAttrs,
  type DashboardData,
} from "@/lib/dashboard";

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "skills", label: "Skills & level", icon: Sparkles },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "audits", label: "Peer audits", icon: Users },
  { id: "account", label: "My profile", icon: Fingerprint },
];
function dateLabel(date: string) {
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? "—"
    : value.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
}

export function Dashboard({
  data,
  demo = false,
  anchor,
  onLogout,
  onRefresh,
  refreshing = false,
  refreshError = false,
}: {
  data: DashboardData;
  demo?: boolean;
  anchor: string;
  onLogout?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  refreshError?: boolean;
}) {
  const [active, setActive] = useState("overview");
  const [paused, setPaused] = useState(false);
  const systemReduce = useReducedMotion();
  const reduced = paused || !!systemReduce;
  const user = data.user[0];
  const attrs = userAttrs(user);
  const firstName =
    typeof attrs.firstName === "string" && attrs.firstName.trim() ? attrs.firstName : user.login;
  const level = data.currentLevel[0]?.amount || 0;
  const rank = getRank(level);
  const projects = useMemo(() => getProjects(data), [data]);
  const skills = useMemo(() => getSkills(data.skillTransactions), [data.skillTransactions]);
  const audits = useMemo(() => getAudits(user), [user]);
  const passed = projects.filter((project) => project.status === "Passed").length;
  const totalXP = amountOf(data.moduleXP);
  const projectXP = amountOf(data.projectXP);
  const exerciseXP = amountOf(data.exerciseXP);
  const otherXP = Math.max(0, totalXP - projectXP - exerciseXP);
  const ratio =
    user.totalDown > 0 && user.auditRatio !== null && Number.isFinite(user.auditRatio)
      ? user.auditRatio
      : null;
  const validCount = user.validAudits?.nodes.length || 0;
  const auditTotal = validCount + (user.failedAudits?.nodes.length || 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    for (const section of nav) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div className={`workspace ${reduced ? "motion-paused" : ""}`}>
        <aside className="sidebar">
          <Brand href={demo ? "/demo" : "/profile"} />
          <p className="nav-label">YOUR WORKSPACE</p>
          <nav aria-label="Workspace">
            {nav.map((item) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                className={active === item.id ? "active" : ""}
                aria-current={active === item.id ? "location" : undefined}
                onClick={() => setActive(item.id)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.id === "projects" && <span className="nav-count">{projects.length}</span>}
              </a>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-note">
              <Network size={24} />
              <p>
                One journey.
                <br />
                <span>Every connection counts.</span>
              </p>
            </div>
            <a
              className="source-link"
              href="https://github.com/hujaafar/GraphQL"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} /> Project on GitHub <ArrowUpRight size={14} />
            </a>
            <div className="sidebar-user">
              <span className="avatar">{firstName.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{user.login}</strong>
                <span>{demo ? "Sample account" : "Reboot01 student"}</span>
              </div>
              {demo ? (
                <Link className="icon-button" href="/login" aria-label="Go to sign in">
                  <LogOut size={18} />
                </Link>
              ) : (
                <button className="icon-button" onClick={onLogout} aria-label="Sign out">
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </aside>
        <div className="workspace-body">
          <header className="topbar">
            <div className="breadcrumb">
              <span>Workspace</span>
              <span>/</span>
              <strong>{nav.find((item) => item.id === active)?.label}</strong>
            </div>
            <div className="topbar-right">
              <span className="connection-label">
                <span className="status-dot" />
                {demo ? "Sample workspace" : "Reboot01 connected"}
              </span>
              <span className="topbar-date">{dateLabel(anchor)}</span>
              <button
                className="icon-button"
                onClick={() => setPaused(!paused)}
                aria-label={
                  systemReduce
                    ? "Motion reduced by device setting"
                    : paused
                      ? "Resume motion"
                      : "Pause motion"
                }
                aria-pressed={reduced}
                disabled={!!systemReduce}
                title={
                  systemReduce
                    ? "Reduced motion follows your device setting"
                    : paused
                      ? "Resume motion"
                      : "Pause motion"
                }
              >
                {reduced ? <Play size={16} /> : <Pause size={16} />}
              </button>
              {!demo && onLogout && (
                <button
                  className="icon-button mobile-session-action"
                  onClick={onLogout}
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </header>
          <main id="main" tabIndex={-1} className="dashboard-main">
            {demo && (
              <div className="demo-banner">
                <span>
                  <span className="outline-label">DEMO</span> You’re exploring fictional sample
                  data.
                </span>
                <Link href="/login">
                  Connect your account <ArrowRight size={15} />
                </Link>
              </div>
            )}
            {refreshError && (
              <p className="form-error" role="alert">
                Couldn’t refresh your data. Showing your last loaded results; try refreshing again.
              </p>
            )}
            <section id="overview" tabIndex={-1} className="overview-section">
              <div className="section-topline">
                <span className="eyebrow">OVERVIEW</span>
                {onRefresh && (
                  <button className="text-button" disabled={refreshing} onClick={onRefresh}>
                    <RefreshCw size={14} className={refreshing ? "spin" : ""} />
                    {refreshing ? "Refreshing…" : "Refresh data"}
                  </button>
                )}
                <span className="section-topline-note">A little more perspective.</span>
              </div>
              <JourneyHeader
                paused={reduced}
                name={firstName}
                level={level}
                rank={rank.current.name}
              />
              <div className="stat-grid">
                <Stat
                  icon={TrendingUp}
                  label="Total module XP"
                  value={formatXP(totalXP)}
                  note="Your cumulative experience"
                  accent
                />
                <Stat
                  icon={Code2}
                  label="Projects passed"
                  value={String(passed).padStart(2, "0")}
                  note={`${projects.length} projects in your record`}
                />
                <Stat
                  icon={Users}
                  label="Audit ratio"
                  value={ratio === null ? "—" : ratio.toFixed(2)}
                  note={
                    ratio === null
                      ? "No received audit XP yet"
                      : ratio >= 1
                        ? "Giving back to the community"
                        : "Room to give more feedback"
                  }
                />
                <Stat
                  icon={Award}
                  label="Current level"
                  value={String(level).padStart(2, "0")}
                  note={rank.current.name}
                />
              </div>
              <div className="overview-grid">
                <XPChart paused={reduced} transactions={data.transactions} anchor={anchor} />
                <div className="panel xp-breakdown">
                  <div className="panel-heading">
                    <div>
                      <p className="panel-kicker">THE BREAKDOWN</p>
                      <h2>Where it adds up</h2>
                    </div>
                    <Activity size={18} className="muted" />
                  </div>
                  <p className="breakdown-total">
                    {formatXP(totalXP)}
                    <span>MODULE EXPERIENCE</span>
                  </p>
                  <div className="stacked-bar" role="img" aria-label="XP sources, detailed below">
                    <span style={{ flex: projectXP || 0.01 }} />
                    <span style={{ flex: exerciseXP || 0.01 }} />
                    {otherXP > 0 && <span style={{ flex: otherXP }} />}
                  </div>
                  <div className="breakdown-row">
                    <span>
                      <i className="legend-dot" /> Projects
                    </span>
                    <strong>{formatXP(projectXP)}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>
                      <i className="legend-dot pale" /> Exercises
                    </span>
                    <strong>{formatXP(exerciseXP)}</strong>
                  </div>
                  {otherXP > 0 && (
                    <div className="breakdown-row">
                      <span>Other module XP</span>
                      <strong>{formatXP(otherXP)}</strong>
                    </div>
                  )}
                  <div className="piscine-breakdown">
                    <p>BEFORE THE MODULE</p>
                    <div>
                      <span>Piscine Go</span>
                      <strong>{formatXP(amountOf(data.piscineGoXP))}</strong>
                    </div>
                    <div>
                      <span>Piscine JS</span>
                      <strong>{formatXP(amountOf(data.piscineJsXP))}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Reveal id="skills" className="dashboard-section">
              <SectionTitle
                number="02"
                title="Built, one skill at a time."
                subtitle="The strengths you’ve earned along the way."
              />
              <div className="skills-grid">
                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <p className="panel-kicker">YOUR TOOLKIT</p>
                      <h2>Strongest connections</h2>
                    </div>
                    <span className="outline-label">{skills.length} SKILLS</span>
                  </div>
                  <SkillsChart paused={reduced} skills={skills} />
                  {skills.length > 6 && (
                    <details className="additional-skills">
                      <summary>
                        View all {skills.length} skills <ChevronDown size={16} />
                      </summary>
                      <div>
                        {skills.map((skill) => (
                          <span key={skill.name}>
                            {skill.name}
                            <strong>{skill.value}%</strong>
                          </span>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
                <div className="panel level-panel">
                  <span className="eyebrow">THE NEXT CHAPTER</span>
                  <div className="level-display">
                    <span>LEVEL</span>
                    <strong>{level}</strong>
                    <Award size={34} />
                  </div>
                  <h2>{rank.current.name}</h2>
                  <p>
                    {rank.next
                      ? `${rank.remaining} more levels to ${rank.next.name}.`
                      : "You’ve reached the highest milestone in this workspace."}
                  </p>
                  <div
                    className="level-progress"
                    role="progressbar"
                    aria-label="Progress to next rank"
                    aria-valuenow={Math.round(rank.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: `${rank.percentage}%` }} />
                  </div>
                  <div className="level-endpoints">
                    <span>Level {rank.current.level}</span>
                    <span>{rank.next ? `Level ${rank.next.level}` : "Milestone reached"}</span>
                  </div>
                  <div className="rank-footnote">
                    <BookOpen size={17} />
                    <span>Progress through practice.</span>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal id="projects" className="dashboard-section">
              <SectionTitle
                number="03"
                title="The work speaks."
                subtitle="Projects, progress, and the experience behind them."
              />
              <ProjectTable projects={projects} />
            </Reveal>
            <Reveal id="audits" className="dashboard-section">
              <SectionTitle
                number="04"
                title="Better, together."
                subtitle="The feedback that moves everyone forward."
              />
              <div className="audits-grid">
                <div className="panel audit-balance">
                  <div className="panel-heading">
                    <div>
                      <p className="panel-kicker">GIVE & RECEIVE</p>
                      <h2>A healthy balance</h2>
                    </div>
                    <Users size={20} />
                  </div>
                  <div className="audit-ratio">
                    {ratio === null ? "—" : ratio.toFixed(2)}
                    <span>AUDIT RATIO</span>
                  </div>
                  <div className="audit-meter" aria-hidden="true">
                    <span
                      style={{
                        width: `${user.totalUp + user.totalDown > 0 ? (user.totalUp / (user.totalUp + user.totalDown)) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="audit-amount">
                    <span>
                      <ArrowUpRight size={17} /> Given
                    </span>
                    <strong>{formatXP(user.totalUp)}</strong>
                  </div>
                  <div className="audit-amount">
                    <span>
                      <ArrowDownLeft size={17} /> Received
                    </span>
                    <strong>{formatXP(user.totalDown)}</strong>
                  </div>
                  <p className="audit-caption">
                    {auditTotal
                      ? `${validCount} of ${auditTotal} recorded audits passed.`
                      : "Your completed peer audits will appear here."}
                  </p>
                </div>
                <AuditHistory audits={audits} />
              </div>
            </Reveal>
            <Reveal id="account" className="dashboard-section">
              <ProfileCard user={user} />
            </Reveal>
            <footer className="dashboard-footer">
              <Brand href="#overview" />
              <p>Made for the journey. Built with GraphQL.</p>
              <span>
                <ShieldCheck size={14} />
                {demo ? "Fictional sample data" : "Your data stays yours"}
              </span>
            </footer>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  note,
  accent = false,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div className={`stat-card ${accent ? "accent" : ""}`}>
      <div>
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  );
}
function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-title">
      <div>
        <span className="section-number">{number}</span>
        <h2>{title}</h2>
      </div>
      <p>{subtitle}</p>
    </div>
  );
}
