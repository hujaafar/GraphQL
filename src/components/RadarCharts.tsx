"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SKILL_TRANSACTIONS } from "@/graphql/queries";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const processSkillTransactions = (transactions: { type: string; amount: number }[]) => {
  const skillData: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
    const skillName = transaction.type.replace("skill_", "").replace("-", " ").toUpperCase();
    skillData[skillName] = (skillData[skillName] || 0) + transaction.amount;
  });

  return Object.entries(skillData).map(([name, value]) => ({ name, value }));
};

const CrazyRadarChart = () => {
  const { data, loading, error } = useQuery(GET_SKILL_TRANSACTIONS);

  if (loading) return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "#f44336", textAlign: "center" }}>Error fetching data</p>;

  const skillTransactions = data?.skillTransactions || [];
  const radarData = processSkillTransactions(skillTransactions);

  return (
    <div
      style={{
        padding: "50px",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        borderRadius: "25px",
        boxShadow: "0px 20px 50px rgba(0, 0, 0, 0.5)",
        maxWidth: "700px",
        margin: "50px auto",
        color: "#fff",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Background Animation */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "pulse 8s infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "250px",
          height: "250px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "pulse 10s infinite reverse",
        }}
      />

      {/* Title */}
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "30px",
          textShadow: "0px 10px 20px rgba(0,0,0,0.5)",
        }}
      >
        Highest Skills
      </h2>

      {/* Radar Chart */}
      <div style={{ width: "100%", height: "400px", marginTop: "30px" }}>
        <ResponsiveContainer>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
            <PolarAngleAxis
              dataKey="name"
              tick={{
                fill: "#fff",
                fontSize: 14,
                fontWeight: "bold",
              }}
            />
            <Radar
              dataKey="value"
              stroke="#00f260"
              fill="url(#gradient)"
              fillOpacity={0.7}
              isAnimationActive
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f260" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0575E6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrazyRadarChart;

/* Add animations for glowing effects */
<style jsx global>{`
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }
`}</style>
