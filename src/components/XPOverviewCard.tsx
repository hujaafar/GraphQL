import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_AND_BREAKDOWN_XP } from "@/graphql/queries";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SidebarXPChart = () => {
  const { data, loading, error } = useQuery(GET_TOTAL_AND_BREAKDOWN_XP);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  // Extract and calculate XP in kB
  const totalXP = (data?.totalXP?.aggregate?.sum?.amount || 0) / 1000;
  const piscineGoXP = (data?.piscineGoXP?.aggregate?.sum?.amount || 0) / 1000;
  const piscineJsXP = (data?.piscineJsXP?.aggregate?.sum?.amount || 0) / 1000;
  const projectXP = (data?.projectXP?.aggregate?.sum?.amount || 0) / 1000;
  const exerciseXP = (data?.exerciseXP?.aggregate?.sum?.amount || 0) / 1000;

  // Data for Recharts
  const chartData = [
    { name: "Piscine Go", value: piscineGoXP, color: "#ff6b6b" },
    { name: "Piscine JS", value: piscineJsXP, color: "#51cf66" },
    { name: "Projects", value: projectXP, color: "#339af0" },
    { name: "Exercises", value: exerciseXP, color: "#ffa94d" },
  ];

  return (
    <div
      className="relative bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-700 p-6 rounded-lg shadow-2xl w-72 space-y-6 border border-gray-200 hover:scale-105 transform transition-transform duration-300"
      style={{
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        backgroundImage: "linear-gradient(145deg, #6a11cb, #2575fc)",
      }}
    >
      <h2 className="text-3xl font-extrabold text-center text-yellow-400 animate-bounce">
Total XP(KB):      </h2>
      <div className="text-center text-5xl font-bold text-white drop-shadow-lg">
        <h2>{totalXP.toFixed(0)} <span className="text-yellow-300">kB</span></h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fill: "#fff", fontSize: 14 }}
            axisLine={{ stroke: "#fff" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2d3748",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid #4a5568",
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg pointer-events-none"
        style={{
          boxShadow: "0px 0px 30px 10px rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      ></div>
    </div>
  );
};

export default SidebarXPChart;
