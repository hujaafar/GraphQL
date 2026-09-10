"use client";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatXP, getTimeline, type Period, type Transaction } from "@/lib/dashboard";

const tooltipStyle = {
  background: "#232427",
  border: "1px solid #45464b",
  borderRadius: "10px",
  color: "#f3f2ec",
  fontSize: "13px",
};

export function XPChart({
  transactions,
  anchor,
  paused = false,
}: {
  transactions: Transaction[];
  anchor: string;
  paused?: boolean;
}) {
  const [period, setPeriod] = useState<Period>("6m");
  const systemReduce = useReducedMotion();
  const reduce = systemReduce || paused;
  const timeline = getTimeline(transactions, period, new Date(anchor));
  const earned = timeline.reduce((sum, point) => sum + point.earned, 0);
  return (
    <div className="panel growth-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">EXPERIENCE</p>
          <h2>Your growth over time</h2>
        </div>
        <div className="segmented" aria-label="XP time range">
          {(["3m", "6m", "all"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === period}
              onClick={() => setPeriod(value)}
            >
              {value === "all" ? "All" : value.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-summary">
        <strong>{formatXP(earned)}</strong>
        <span>
          <ArrowUpRight size={14} /> earned in this period
        </span>
      </div>
      {timeline.length ? (
        <>
          <div
            className="area-chart"
            role="img"
            aria-label={`Cumulative module XP. ${formatXP(earned)} earned in the selected period. Data table follows.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeline}
                margin={{ top: 12, right: 10, bottom: 3, left: 0 }}
                accessibilityLayer
              >
                <defs>
                  <linearGradient id="xp-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f6b85e" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#f6b85e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#303135" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#a7a8ad", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={22}
                  dy={8}
                />
                <YAxis
                  tickFormatter={(n) => formatXP(n, 0)}
                  tick={{ fill: "#a7a8ad", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={67}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#a7a8ad" }}
                  formatter={(value: number) => [formatXP(value), "Cumulative XP"]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#f6b85e"
                  strokeWidth={2.5}
                  fill="url(#xp-fill)"
                  isAnimationActive={!reduce}
                  activeDot={{ r: 5, strokeWidth: 4, stroke: "#3c3021", fill: "#f6b85e" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-footer">
            <span>
              <i className="legend-dot" /> Cumulative module XP
            </span>
            <details className="chart-data">
              <summary>View data</summary>
              <table>
                <caption>XP by month</caption>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Earned</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((point) => (
                    <tr key={point.month}>
                      <td>{point.label}</td>
                      <td>{formatXP(point.earned)}</td>
                      <td>{formatXP(point.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
        </>
      ) : (
        <div className="empty-state">Your first XP award will start this chart.</div>
      )}
    </div>
  );
}

export function SkillsChart({
  skills,
  paused = false,
}: {
  skills: { name: string; value: number }[];
  paused?: boolean;
}) {
  const systemReduce = useReducedMotion();
  const reduce = systemReduce || paused;
  if (!skills.length)
    return (
      <div className="empty-state">Skill milestones will appear as you complete your projects.</div>
    );
  return (
    <div className="skill-chart-wrap">
      <div
        className="radar-chart"
        role="img"
        aria-label="Your six strongest skills; exact values are listed alongside the chart."
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={skills.slice(0, 6)} outerRadius="66%">
            <PolarGrid stroke="#414246" />
            <PolarAngleAxis dataKey="name" tick={{ fill: "#b8b9bf", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke="#f6b85e"
              fill="#f6b85e"
              fillOpacity={0.17}
              strokeWidth={2}
              isAnimationActive={!reduce}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number) => [`${value}%`, "Highest attained"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <ol className="skill-list">
        {skills.slice(0, 6).map((skill) => (
          <li key={skill.name}>
            <span>{skill.name}</span>
            <div className="skill-track">
              <span style={{ width: `${skill.value}%` }} />
            </div>
            <strong>{skill.value}%</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
