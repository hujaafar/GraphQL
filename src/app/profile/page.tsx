"use client";

import React from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import CrazyAuditsTable from "@/components/AuditsTable";
import CrazyAuditStats from "@/components/CrazyAudit";
import RankDisplay from "@/components/LevelProgressChart";
import CrazyProgressChart from "@/components/ProgressChart";
import CrazyRadarChart from "@/components/RadarCharts";
import CrazyProjectCards from "@/components/TransactionList";
import UserInfo from "@/components/UserInfo";
import SidebarXPChart from "@/components/XPOverviewCard";

const ProfilePage = () => {
  const logoutUser = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <AnimatedBackground
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        color: "#fff",
      }}
    >
      {/* Logout Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          onClick={logoutUser}
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
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          Logout
        </button>
      </div>

      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>User Profile</h1>
        <p style={{ fontSize: "1.2rem" }}>Explore your progress, audits, and achievements.</p>
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
    </AnimatedBackground>
  );
};

export default ProfilePage;
