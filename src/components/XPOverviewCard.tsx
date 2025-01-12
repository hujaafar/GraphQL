"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_AND_BREAKDOWN_XP } from "@/graphql/queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";

interface XPData {
  name: string;
  value: number;
  color: string;
  percentage?: string;
}

const SidebarXPChart = () => {
  const { data, loading, error } = useQuery(GET_TOTAL_AND_BREAKDOWN_XP);

  if (loading) {
    return <p style={{ color: "#fff" }}>Loading...</p>;
  }
  if (error) {
    return <p style={{ color: "#f00" }}>Error: {error.message}</p>;
  }

  // 1) Extract XP amounts (in kB)
  const totalXP = (data?.totalXP?.aggregate?.sum?.amount || 0) / 1000;
  const piscineGoXP = (data?.piscineGoXP?.aggregate?.sum?.amount || 0) / 1000;
  const piscineJsXP = (data?.piscineJsXP?.aggregate?.sum?.amount || 0) / 1000;
  const projectXP = (data?.projectXP?.aggregate?.sum?.amount || 0) / 1000;
  const exerciseXP = (data?.exerciseXP?.aggregate?.sum?.amount || 0) / 1000;

  // 2) Create data array
  const chartDataRaw: XPData[] = [
    { name: "Piscine Go", value: piscineGoXP, color: "#ff6b6b" },
    { name: "Piscine JS", value: piscineJsXP, color: "#51cf66" },
    { name: "Projects", value: projectXP, color: "#339af0" },
    { name: "Exercises", value: exerciseXP, color: "#ffa94d" },
  ];

  // 3) Sort so largest XP is at the bottom
  chartDataRaw.sort((a, b) => a.value - b.value);

  // 4) Sum for percentage
  const totalAllXP = piscineGoXP + piscineJsXP + projectXP + exerciseXP;

  // 5) Append percentage
  const chartData = chartDataRaw.map((item) => {
    const percent = totalAllXP
      ? ((item.value / totalAllXP) * 100).toFixed(1)
      : "0.0";
    return { ...item, percentage: percent };
  });

  // 6) Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const dataItem: XPData = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#2d3748",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #4a5568",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: 4 }}>{dataItem.name}</p>
          <p>{dataItem.value.toFixed(1)} kB ({dataItem.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      style={{
        borderRadius: "12px",
        padding: "20px",
        position: "relative",
        overflow: "hidden",

        // Fancy background
        backgroundImage:
          "linear-gradient(90deg, #6a11cb, #2575fc, #ff6b6b, #51cf66, #ffd700)",
        backgroundSize: "600% 600%",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        border: "2px solid rgba(255,255,255,0.2)",
      }}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Title */}
      <h2 style={{ color: "#ffd700", textAlign: "center", marginBottom: "10px" }}>
        Total XP (KB)
      </h2>

      {/* XP Value */}
      <div style={{ textAlign: "center", fontSize: "2rem", marginBottom: "10px", color: "#fff" }}>
        {totalXP.toFixed(0)} <span style={{ color: "#ffd700" }}>kB</span>
      </div>

      {/* Chart Container */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: "#fff" }}
              axisLine={{ stroke: "#fff" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              <LabelList
                dataKey="value"
                position="right"
                formatter={(val: number, item: any) => {
                  if (!item?.payload) return `${val.toFixed(1)} kB`;
                  const { percentage } = item.payload as XPData;
                  if (!percentage) return `${val.toFixed(1)} kB`;
                  return `${val.toFixed(1)} kB (${percentage}%)`;
                }}
                fill="#fff"
                style={{ fontSize: 12, fontWeight: "bold" }}
              />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SidebarXPChart;
