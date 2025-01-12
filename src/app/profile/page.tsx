"use client";

import React from "react";
import { motion } from "framer-motion";
import CrazyAuditsTable from "@/components/AuditsTable";
import CrazyAuditStats from "@/components/CrazyAudit";
import RankDisplay from "@/components/LevelProgressChart";
import CrazyProgressChart from "@/components/ProgressChart";
import CrazyRadarChart from "@/components/RadarCharts";
import CrazyProjectCards from "@/components/TransactionList";
import UserInfo from "@/components/UserInfo";
import SidebarXPChart from "@/components/XPOverviewCard";

const ProfilePage = () => {
  const handleLogout = () => {
    // Example logout logic
    console.log("User logged out");
    window.location.href = "/login"; // Replace with your logout logic
  };

  return (
    <motion.div
      /**
       * Animate the same gradient background as LoginPage
       */
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 10, repeat: Infinity }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        // Same gradient as login:
        backgroundImage:
          "linear-gradient(120deg, #ffafbd, #ffc3a0, #2193b0, #6dd5ed)",
        backgroundSize: "200% 200%",
        padding: "20px",
        color: "#fff", // light text for clarity on bright background
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Logout Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(90deg, #ff6b6b, #f7797d)",
            borderRadius: "30px",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1.0)")
          }
        >
          Logout
        </button>
      </div>

      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>User Profile</h1>
        <p style={{ fontSize: "1.2rem" }}>
          Explore your progress, audits, and achievements.
        </p>
      </div>

      {/* User Info Section */}
      <div style={{ marginBottom: "40px" }}>
        <UserInfo />
      </div>

      {/* XP Overview and Audit Stats Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <SidebarXPChart />
        <CrazyAuditStats />
      </div>

      {/* Level Progress and Skill Radar Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <RankDisplay />
        <CrazyRadarChart />
      </div>

      {/* Progress Chart and Audits Table Section */}
      <div style={{ marginBottom: "40px" }}>
        <CrazyProgressChart />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <CrazyAuditsTable />
      </div>

      {/* Project Transactions Section */}
      <div>
        <CrazyProjectCards />
      </div>
    </motion.div>
  );
};

export default ProfilePage;
