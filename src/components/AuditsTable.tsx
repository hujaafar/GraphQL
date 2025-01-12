"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_AUDITS } from "@/graphql/queries";
import { motion } from "framer-motion";

const CrazyAuditsTable = () => {
  const { data, loading, error } = useQuery(GET_AUDITS);
  const [filter, setFilter] = useState("");
  const [auditType, setAuditType] = useState("all"); // Options: all, valid, failed

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "#f44336" }}>Error fetching data</p>
    );

  const validAudits = data?.user[0]?.validAudits?.nodes || [];
  const failedAudits = data?.user[0]?.failedAudits?.nodes || [];

  // Filter data based on audit type
  const auditsToDisplay =
    auditType === "valid"
      ? validAudits
      : auditType === "failed"
      ? failedAudits
      : [...validAudits, ...failedAudits];

  const filteredAudits = auditsToDisplay.filter((audit: any) =>
    audit.group.captainLogin.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "20px auto",
        background:
          "linear-gradient(135deg, #1a237e, #512da8, #673ab7, #7b1fa2)",
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

      <h2 style={{ textAlign: "center", fontSize: "2.2rem", marginBottom: "20px" }}>
        Crazy Audits Table
      </h2>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter captain login..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "none",
          fontSize: "1rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Toggle Buttons */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => setAuditType("all")}
          style={{
            background: auditType === "all" ? "#673ab7" : "transparent",
            color: auditType === "all" ? "#fff" : "#673ab7",
            padding: "10px 20px",
            borderRadius: "25px",
            border: "2px solid #673ab7",
            cursor: "pointer",
            marginRight: "10px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          All Audits
        </button>
        <button
          onClick={() => setAuditType("valid")}
          style={{
            background: auditType === "valid" ? "#4caf50" : "transparent",
            color: auditType === "valid" ? "#fff" : "#4caf50",
            padding: "10px 20px",
            borderRadius: "25px",
            border: "2px solid #4caf50",
            cursor: "pointer",
            marginRight: "10px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          Valid Audits
        </button>
        <button
          onClick={() => setAuditType("failed")}
          style={{
            background: auditType === "failed" ? "#f44336" : "transparent",
            color: auditType === "failed" ? "#fff" : "#f44336",
            padding: "10px 20px",
            borderRadius: "25px",
            border: "2px solid #f44336",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          Failed Audits
        </button>
      </div>

      {/* Scrollable Dynamic Table */}
      <motion.div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          maxHeight: "400px", // Set a fixed height
          overflowY: "auto", // Add vertical scrolling
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "#673ab7",
                color: "#fff",
              }}
            >
              <th style={{ padding: "10px" }}>Captain Login</th>
              <th style={{ padding: "10px" }}>Audit Date</th>
              <th style={{ padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit: any, index: number) => (
                <motion.tr
                  key={index}
                  style={{
                    textAlign: "center",
                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                    color: "#000",
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(103, 58, 183, 0.2)",
                  }}
                >
                  <td style={{ padding: "10px" }}>{audit.group.captainLogin}</td>
                  <td style={{ padding: "10px" }}>
                    {new Date(audit.group.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      style={{
                        display: "inline-block",
                        padding: "5px 15px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: validAudits.includes(audit)
                          ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                          : "linear-gradient(90deg, #f44336, #e57373)",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {validAudits.includes(audit) ? "✔ Passed" : "✘ Failed"}
                    </motion.div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "10px" }}>
                  No audits found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default CrazyAuditsTable;
