"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Transaction {
  amount: number;
  createdAt: string;
  object: {
    name: string;
    type: string;
  };
}

export const CrazyTable = ({ transactions }: { transactions: Transaction[] }) => {
  const [filter, setFilter] = useState("");

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) =>
      transaction.object.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-white text-center mb-6">
        Crazy Animated Table
      </h2>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter projects..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto"
      >
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Name</th>
              <th className="py-3 px-6 text-left font-semibold">Type</th>
              <th className="py-3 px-6 text-left font-semibold">XP</th>
              <th className="py-3 px-6 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <motion.tbody
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTransactions.map((transaction, index) => {
              const amount = transaction.amount;
              const size =
                amount < 1000
                  ? `${amount} B` // Display in bytes
                  : `${Math.ceil(amount / 1000)} kB`; // Convert bytes to kB for larger amounts

              return (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="py-3 px-6 border-b">{transaction.object.name}</td>
                  <td className="py-3 px-6 border-b capitalize">{transaction.object.type}</td>
                  <td className="py-3 px-6 border-b">{size}</td>
                  <td className="py-3 px-6 border-b">
                    {new Date(transaction.createdAt).toLocaleDateString()} at{" "}
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </motion.div>
    </div>
  );
};
