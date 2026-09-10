"use client";
import { useState } from "react";
import { Check, ChevronDown, Code2, Search, X } from "lucide-react";
import { formatXP, readableName, type Project } from "@/lib/dashboard";
import { formatDate } from "@/lib/dates";
import { Pagination } from "./Pagination";

export function ProjectTable({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [projectStatus, setProjectStatus] = useState("All projects");
  const [projectPage, setProjectPage] = useState(0);
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (projectStatus === "All projects" || project.status === projectStatus),
  );
  const projectPageSafe = Math.min(
    projectPage,
    Math.max(0, Math.ceil(filteredProjects.length / 6) - 1),
  );
  return (
    <div className="panel projects-panel">
      <div className="table-toolbar">
        <div className="search-field">
          <Search size={17} />
          <label className="sr-only" htmlFor="project-search">
            Search projects
          </label>
          <input
            id="project-search"
            placeholder="Find a project…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setProjectPage(0);
            }}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setProjectPage(0);
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
        <label className="select-field">
          <span className="sr-only">Project status</span>
          <select
            value={projectStatus}
            onChange={(event) => {
              setProjectStatus(event.target.value);
              setProjectPage(0);
            }}
          >
            {["All projects", "Passed", "In progress", "Retry"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <ChevronDown size={15} />
        </label>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <caption className="sr-only">Project results and module XP awards</caption>
          <thead>
            <tr>
              <th>PROJECT</th>
              <th>STATUS</th>
              <th>BEST GRADE</th>
              <th>MODULE XP</th>
              <th>LAST XP AWARD</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.slice(projectPageSafe * 6, projectPageSafe * 6 + 6).map((project) => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </tbody>
        </table>
        {!filteredProjects.length && (
          <div className="empty-state">
            <Search size={25} />
            <strong>
              {projects.length ? "No matching projects" : "Your project story starts here"}
            </strong>
            <p>
              {projects.length
                ? "Try a different name or status."
                : "Project results will appear when they’re available."}
            </p>
          </div>
        )}
      </div>
      <Pagination
        count={filteredProjects.length}
        page={projectPageSafe}
        size={6}
        onPage={setProjectPage}
        noun="projects"
      />
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <tr>
      <td>
        <span className="project-name">
          <span className="project-icon">
            <Code2 size={16} />
          </span>
          <strong>{readableName(project.name)}</strong>
        </span>
      </td>
      <td>
        <span
          className={`status-badge ${project.status === "Passed" ? "passed" : project.status === "Retry" ? "retry" : "pending"}`}
        >
          {project.status === "Passed" && <Check size={12} />} {project.status}
        </span>
      </td>
      <td className="tabular">
        {project.grade === null ? "—" : `${Math.round(project.grade * 100)}%`}
      </td>
      <td className="xp-value tabular">{formatXP(project.xp)}</td>
      <td className="muted">{project.date ? formatDate(project.date) : "—"}</td>
    </tr>
  );
}
