"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_LEVEL_PROGRESS } from "@/graphql/queries";
import { motion } from "framer-motion";

const ranks = [
  { name: "Aspiring Developer", level: 0 },
  { name: "Beginner Developer", level: 10 },
  { name: "Apprentice Developer", level: 20 },
  { name: "Assistant Developer", level: 30 },
  { name: "Basic Developer", level: 40 },
  { name: "Junior Developer", level: 50 },
  { name: "Confirmed Developer", level: 55 },
  { name: "Full-Stack Developer", level: 60 },
];

const RankDisplay = () => {
  const { data, loading, error } = useQuery(GET_LEVEL_PROGRESS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  const currentLevel = data?.currentLevel[0]?.amount || 0;

  const currentRankIndex = ranks.findIndex((rank) => rank.level > currentLevel) - 1;
  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];
  const levelsToNextRank = nextRank ? nextRank.level - currentLevel : 0;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ff6f61, #ffa177)",
        borderRadius: "25px",
        padding: "40px",
        maxWidth: "500px",
        margin: "20px auto",
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Floating Neon Rings */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          left: "-40px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          border: "3px dashed rgba(255, 255, 255, 0.3)",
          animation: "spin 10s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          border: "3px dashed rgba(255, 255, 255, 0.3)",
          animation: "spin-reverse 10s linear infinite",
        }}
      />

      {/* Title */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          letterSpacing: "1px",
          color: "#fff",
          marginBottom: "30px",
          textShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        Current Rank
      </motion.h2>

      {/* Rank and Level Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          display: "inline-block",
          padding: "20px 30px",
          borderRadius: "50px",
          background: "linear-gradient(90deg, #f79d00, #f84d00)",
          color: "#fff",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
          marginBottom: "30px",
        }}
      >
        <span style={{ fontSize: "2.2rem", fontWeight: "bold" }}>{currentLevel}</span>
        <span style={{ fontSize: "1rem", marginLeft: "10px" }}>
          {currentRank?.name || "Unranked"}
        </span>
      </motion.div>

      {/* Progress Bar */}
      {nextRank && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentLevel / nextRank.level) * 100}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            background: "linear-gradient(90deg, #ffd700, #ff8c00)",
            height: "12px",
            borderRadius: "6px",
            margin: "20px 0",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
          }}
        />
      )}

      {/* Next Rank Info */}
      {nextRank && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: "1.1rem",
            margin: "10px 0",
            color: "#fff",
          }}
        >
          Next level in <strong>{levelsToNextRank}</strong> levels to unlock{" "}
          <span style={{ color: "#ffd700", fontWeight: "bold" }}>{nextRank.name}</span>!
        </motion.p>
      )}

      {/* Interactive Neon Arrow */}
      {nextRank && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: "30px",
            cursor: "pointer",
            display: "inline-block",
            padding: "10px 20px",
            background: "linear-gradient(90deg, #ff6f61, #ffa177)",
            borderRadius: "25px",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          🚀 YOU CAN DO IT
        </motion.div>
      )}
    </div>
  );
};

export default RankDisplay;
