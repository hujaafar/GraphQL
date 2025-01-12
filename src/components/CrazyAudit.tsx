"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_AUDIT_STATS } from "@/graphql/queries";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const formatSize = (size: number) => {
  if (size >= 1000000) return `${Math.round((size / 1000000) * 100) / 100} MB`;
  return `${Math.round(size / 1000)} kB`; // Proper rounding
};

const CrazyAuditStats = () => {
  const { data, loading, error } = useQuery(GET_AUDIT_STATS);

  if (loading)
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ color: "#f44336", textAlign: "center" }}>Error fetching data</p>;

  const auditStats = data?.user[0];
  const totalUp = auditStats?.totalUp || 0;
  const totalDown = auditStats?.totalDown || 0;
  const auditRatio = auditStats?.auditRatio || 0;

  const ratioStyle =
    auditRatio < 1.0
      ? { color: "#f44336", message: "Careful buddy! 🔴" }
      : auditRatio < 1.5
      ? { color: "#ff9800", message: "You can do better! 🟡" }
      : { color: "#4caf50", message: "You're good! 🟢" };

  const chartData = [
    { name: "Total Up", value: totalUp, color: "#4caf50" },
    { name: "Total Down", value: totalDown, color: "#f44336" },
  ];

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top, #1a237e, #0d47a1, #311b92, #512da8)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4)",
        maxWidth: "600px",
        margin: "20px auto",
        position: "relative",
        color: "#fff",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Glowing Orb */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "150px",
          height: "150px",
          background: ratioStyle.color,
          borderRadius: "50%",
          filter: "blur(70px)",
          animation: "pulse 3s infinite",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          right: "-50px",
          width: "150px",
          height: "150px",
          background: ratioStyle.color,
          borderRadius: "50%",
          filter: "blur(70px)",
          animation: "pulse 3s infinite reverse",
        }}
      ></div>

      {/* Title */}
      <h2
        style={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          textShadow: "0 4px 10px rgba(0,0,0,0.5)",
          marginBottom: "20px",
        }}
      >
        Audit Statistics
      </h2>

      {/* Audit Ratio */}
      <div
        style={{
          fontSize: "3.5rem",
          fontWeight: "bold",
          color: ratioStyle.color,
          textShadow: `0 0 20px ${ratioStyle.color}`,
        }}
      >
        {auditRatio.toFixed(1)}
      </div>
      <p
        style={{
          marginTop: "10px",
          fontSize: "1.2rem",
          color: ratioStyle.color,
        }}
      >
        {ratioStyle.message}
      </p>

      {/* Pie Chart */}
      <div style={{ width: "100%", height: "300px", marginTop: "30px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={450}
              isAnimationActive
              paddingAngle={5}
              cornerRadius={5} // Smooth corners for chart
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total Up and Total Down */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "1.2rem",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div style={{ color: "#4caf50" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {formatSize(totalUp)}
          </p>
          <p>Total Up</p>
        </div>
        <div style={{ color: "#f44336" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {formatSize(totalDown)}
          </p>
          <p>Total Down</p>
        </div>
      </div>
    </div>
  );
};

export default CrazyAuditStats;

/* Add animations for glow effect */
<style jsx global>{`
  @keyframes pulse {
    0% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 0.8;
      transform: scale(1);
    }
  }
`}</style>
