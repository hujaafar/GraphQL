"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "@/graphql/queries";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CrazyProgressChart = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "#f44336" }}>
        Error fetching data
      </p>
    );

  const transactions = data?.transaction || [];

  // Process data for the line chart
  const chartData = transactions.map((transaction: any) => ({
    name: transaction.object.name,
    xp: transaction.amount,
    date: new Date(transaction.createdAt).toLocaleDateString(),
  }));

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "20px auto",
        background: "linear-gradient(135deg, #1a237e, #673ab7, #7b1fa2)",
        borderRadius: "15px",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.4)",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      {/* Glowing Animation */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(103, 58, 183, 0.5)",
          borderRadius: "50%",
          filter: "blur(100px)",
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(103, 58, 183, 0.5)",
          borderRadius: "50%",
          filter: "blur(100px)",
          zIndex: -1,
        }}
      ></div>

      <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "20px" }}>
        Progress Over Time
      </h2>

      {/* Responsive Line Chart */}
      <div style={{ width: "100%", height: "400px", marginTop: "30px" }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#fff", fontSize: 12, fontWeight: "bold" }}
              tickLine={{ stroke: "#fff" }}
              axisLine={{ stroke: "#fff" }}
            />
            <YAxis
              tick={{ fill: "#fff", fontSize: 12, fontWeight: "bold" }}
              tickLine={{ stroke: "#fff" }}
              axisLine={{ stroke: "#fff" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#673ab7",
                color: "#fff",
                borderRadius: "10px",
                border: "none",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              }}
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="url(#colorXp)"
              strokeWidth={3}
              dot={{ r: 5, fill: "#fff" }}
              activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
            />
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4caf50" stopOpacity={1} />
                <stop offset="100%" stopColor="#673ab7" stopOpacity={1} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrazyProgressChart;
