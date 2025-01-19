"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PROJECT_TRANSACTIONS } from "@/graphql/queries";
import { motion } from "framer-motion";

interface ProjectTransaction {
  object: { name: string };
  amount: number;
  createdAt: string;
}

const CrazyProjectCards = () => {
  const { data, loading, error } = useQuery(GET_PROJECT_TRANSACTIONS);
  const [filter, setFilter] = useState("");

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "#f44336" }}>
        Error fetching data
      </p>
    );

  // Cast to ProjectTransaction[]
  const transactions = (data?.transaction as ProjectTransaction[]) || [];

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction: ProjectTransaction) =>
    transaction.object.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "20px auto",
        background:
          "linear-gradient(135deg, #ff7eb3, #ff758c, #ff6b77, #ffa177)",
        borderRadius: "15px",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      {/* Glowing Animation */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          width: "250px",
          height: "250px",
          background: "rgba(255, 105, 135, 0.5)",
          borderRadius: "50%",
          filter: "blur(150px)",
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          right: "-60px",
          width: "250px",
          height: "250px",
          background: "rgba(255, 105, 135, 0.5)",
          borderRadius: "50%",
          filter: "blur(150px)",
          zIndex: -1,
        }}
      ></div>

      <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "20px" }}>
        Project Transactions
      </h2>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Search projects..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "none",
          fontSize: "1rem",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Scrollable Cards */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "10px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction: ProjectTransaction, index: number) => {
            const amount = transaction.amount;
            const size =
              amount < 1000
                ? `${amount} B`
                : `${Math.ceil(amount / 1000)} kB`;

            return (
              <motion.div
                key={index}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 105, 135, 0.2)",
                  boxShadow: "0 10px 20px rgba(255, 105, 135, 0.3)",
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: "0",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#ff758c",
                    }}
                  >
                    🔗 {transaction.object.name}
                  </h4>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#6c757d",
                    }}
                  >
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#673ab7",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {size} <span>📈 XP</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p style={{ textAlign: "center", color: "#fff" }}>
            No project transactions found!
          </p>
        )}
      </div>
    </div>
  );
};

export default CrazyProjectCards;
