"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Audit } from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { Pagination } from "./Pagination";

export function AuditHistory({ audits }: { audits: Audit[] }) {
  const [auditFilter, setAuditFilter] = useState("All");
  const [auditPage, setAuditPage] = useState(0);
  const filteredAudits = audits.filter(
    (audit) => auditFilter === "All" || audit.status === auditFilter,
  );
  const auditPageSafe = Math.min(auditPage, Math.max(0, Math.ceil(filteredAudits.length / 5) - 1));
  return (
    <div className="panel audit-history">
      <div className="panel-heading">
        <h2>Audit history</h2>
        <div className="segmented" role="group" aria-label="Audit result filter">
          {["All", "Passed", "Failed"].map((filter) => (
            <button
              key={filter}
              aria-pressed={auditFilter === filter}
              onClick={() => {
                setAuditFilter(filter);
                setAuditPage(0);
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <ul>
        {filteredAudits.slice(auditPageSafe * 5, auditPageSafe * 5 + 5).map((audit, index) => (
          <li key={`${audit.group.captainLogin}-${audit.group.createdAt}-${index}`}>
            <span className={`audit-result ${audit.status === "Passed" ? "passed" : "failed"}`}>
              {audit.status === "Passed" ? <Check size={16} /> : <X size={16} />}
            </span>
            <div>
              <strong>{audit.group.captainLogin}</strong>
              <span>Group created {formatDate(audit.group.createdAt)}</span>
            </div>
            <span className={`status-badge ${audit.status === "Passed" ? "passed" : "retry"}`}>
              {audit.status}
            </span>
          </li>
        ))}
      </ul>
      {!filteredAudits.length && (
        <div className="empty-state">
          No {auditFilter === "All" ? "" : auditFilter.toLowerCase()} audits to show.
        </div>
      )}
      <Pagination
        count={filteredAudits.length}
        page={auditPageSafe}
        size={5}
        onPage={setAuditPage}
        noun="audits"
      />
    </div>
  );
}
