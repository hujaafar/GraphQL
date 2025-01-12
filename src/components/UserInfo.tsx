"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { GET_USER_INFO } from "@/graphql/queries";

interface UserAttrs {
  firstName?: string;
  lastName?: string;
  country?: string;
  addressCity?: string;
  dateOfBirth?: string;
  PhoneNumber?: string;
  qualification?: string;
  employment?: string;
  placeOfBirth?: string;
  addressStreet?: string;
  emergencyTel?: string;
  emergencyFirstName?: string;
  emergencyLastName?: string;
}

const UserInfo = () => {
  const { data, loading, error } = useQuery(GET_USER_INFO);

  if (loading) {
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;
  }
  if (error) {
    return (
      <p style={{ textAlign: "center", color: "#f44336" }}>
        Error: {error.message}
      </p>
    );
  }

  const user = data?.user?.[0] || {};
  const { id, login, email, attrs } = user;
  const parsedAttrs: UserAttrs = typeof attrs === "object" ? attrs : {};

  // We'll define some random comets that drift across the screen
  const comets = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    top: Math.random() * 80, // random vertical position
    delay: Math.random() * 3, // random start delay
  }));

  return (
    /**
     * We animate a conic gradient for the "vortex"
     * plus additional swirling orbs, plus comets crossing the screen.
     */
    <motion.div
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        // Use longhand background properties to avoid React warnings:
        backgroundImage:
          "conic-gradient(from 0deg at 50% 50%, #060d1f, #51237a, #0d47a1, #00695c, #5d4037, #4e342e, #51237a, #060d1f)",
        backgroundSize: "200% 200%",
        backgroundRepeat: "no-repeat",
      }}
      // We'll rotate the conic gradient
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    >
      {/* Swirling Orbs */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 80%)",
          filter: "blur(200px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)",
          filter: "blur(120px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      {/* Additional swirl orbs */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 0, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Comets crossing the screen */}
      {comets.map((comet) => (
        <motion.div
          key={comet.id}
          style={{
            position: "absolute",
            top: `${comet.top}%`,
            left: "-100px",
            width: "100px",
            height: "2px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
            boxShadow: "0 0 10px rgba(255,255,255,0.5)",
          }}
          initial={{ x: -150 }}
          animate={{ x: "120vw" }} // move across the screen
          transition={{
            duration: 15 + Math.random() * 5,
            repeat: Infinity,
            repeatDelay: 2,
            delay: comet.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* The main card with user info */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "90%",
          maxWidth: "700px",
          padding: "30px",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 15px rgba(255,255,255,0.2)",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
            textShadow: "0 0 5px rgba(255, 255, 255, 0.6)",
          }}
        >
        User Info
        </h1>
        {/* Basic info */}
        <p style={{ marginBottom: "8px" }}>
          <strong>ID:</strong> {id || "N/A"}
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong>Login:</strong> {login || "N/A"}
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong>Email:</strong> {email || "N/A"}
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong>Name:</strong> {parsedAttrs.firstName || login}{" "}
          {parsedAttrs.lastName || ""}
        </p>

        <hr style={{ margin: "20px 0", borderColor: "rgba(255,255,255,0.2)" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <p>
              <strong>Country:</strong> {parsedAttrs.country || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {parsedAttrs.addressCity || "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {parsedAttrs.dateOfBirth
                ? new Date(parsedAttrs.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {parsedAttrs.PhoneNumber || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Qualification:</strong>{" "}
              {parsedAttrs.qualification || "N/A"}
            </p>
            <p>
              <strong>Employment:</strong> {parsedAttrs.employment || "N/A"}
            </p>
            <p>
              <strong>Place of Birth:</strong>{" "}
              {parsedAttrs.placeOfBirth || "N/A"}
            </p>
            <p>
              <strong>Street:</strong> {parsedAttrs.addressStreet || "N/A"}
            </p>
          </div>
        </div>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
            textShadow: "0 0 5px rgba(255, 255, 255, 0.6)",
          }}
        >
          Emergency Contact
        </h2>
        <p style={{ marginBottom: "8px" }}>
          <strong>Name:</strong> {parsedAttrs.emergencyFirstName || "N/A"}{" "}
          {parsedAttrs.emergencyLastName || ""}
        </p>
        <p>
          <strong>Phone:</strong> {parsedAttrs.emergencyTel || "N/A"}
        </p>
      </div>
    </motion.div>
  );
};

export default UserInfo;
