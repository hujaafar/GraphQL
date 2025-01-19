"use client";
import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const basicAuth = btoa(`${identifier}:${password}`);
      const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials. Please try again.");
      }

      const token = await response.json();
      localStorage.setItem("authToken", token);
      window.location.href = "/profile";
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <motion.div
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 10, repeat: Infinity }}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(120deg, #ffafbd, #ffc3a0, #2193b0, #6dd5ed)",
        backgroundSize: "200% 200%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", padding: 2 }}>
        <Card
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          sx={{ width: 360, borderRadius: 3, boxShadow: 6 }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Welcome Back Rebooter!
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Username or Email"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
                >
                  Log In
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
}
