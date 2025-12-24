import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  getProjects,
  createProject,
} from "../services/projects.service";
import type { Project } from "../types/models";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;

    const project = await createProject({ title, description });
    setProjects((p) => [...p, project]);
    setTitle("");
    setDescription("");
    setOpen(false);
  }

  return (
    <div className="container">
      <div className="header-row">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          <AddIcon /> Add Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <Link to={`/projects/${p.id}`} className="project-card" key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </Link>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create Project</h3>
              <CloseIcon onClick={() => setOpen(false)} className="icon-btn" />
            </div>

            <input
              placeholder="Project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
