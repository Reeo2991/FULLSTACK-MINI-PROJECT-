import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

// Material UI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// Services & Components
import { getProjectById, getProjectProgress } from "../services/projects.service";
import { getTasksByProject, updateTask, deleteTask, createTask, completeTask } from "../services/tasks.service";
import ProgressBar from "../components/ProgressBar";
import Modal from "../components/Modal";
import type { Project, Task, ProgressResponse } from "../types/models";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form States
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");

  // Helper function bach n-checkiw l-date f l-past
  const isDateInPast = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateStr);
    return selectedDate < today;
  };

  async function refreshAll() {
    if (!id) return;
    try {
      const [t, p] = await Promise.all([
        getTasksByProject(Number(id)),
        getProjectProgress(Number(id)),
      ]);
      setTasks(t);
      setProgress(p);
    } catch (err) {
      console.error("Error refreshing data", err);
    }
  }

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getProjectById(Number(id)),
      getTasksByProject(Number(id)),
      getProjectProgress(Number(id)),
    ]).then(([proj, t, p]) => {
      setProject(proj);
      setTasks(t);
      setProgress(p);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load project");
      setLoading(false);
    });
  }, [id]);

  const percentage = progress && progress.totalTasks > 0 
    ? Math.round((progress.completedTasks / progress.totalTasks) * 100) : 0;

  async function handleAddTask() {
    if (!newTitle.trim() || !id) return;

    // Validation dyal l-date f l-past bach t-avoidi error 500
    if (isDateInPast(newDate)) {
      toast.error("Please select a future date or today!");
      return;
    }

    try {
      await createTask(Number(id), { 
        title: newTitle, 
        description: newDesc || "", 
        dueDate: newDate || "" 
      });
      toast.success("Task added!");
      setIsAddOpen(false);
      setNewTitle(""); setNewDesc(""); setNewDate("");
      refreshAll();
    } catch { toast.error("Failed to add task"); }
  }

  async function handleComplete(taskId: number) {
    try {
      await completeTask(taskId);
      toast.success("Task updated!");
      refreshAll();
    } catch { toast.error("Update failed"); }
  }

  async function handleEditSave() {
    if (!editingTask) return;
    const title = (document.getElementById('et') as HTMLInputElement).value.trim();
    const description = (document.getElementById('ed') as HTMLTextAreaElement).value.trim();
    const dueDate = (document.getElementById('edate') as HTMLInputElement).value;

    if (!title) return toast.error("Title is required");

    // Validation dyal l-date hta f l-Edit
    if (isDateInPast(dueDate)) {
      toast.error("The deadline must be in the future!");
      return;
    }

    try {
      // Sifet clean data (empty strings blast null) bach t-satisfy @Valid f backend
      await updateTask(editingTask.id, { 
        title, 
        description: description || "", 
        dueDate: dueDate || "" 
      });
      toast.success("Changes saved");
      setEditingTask(null);
      refreshAll();
    } catch { toast.error("Edit failed: Check server constraints"); }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteTask(deletingId);
      toast.success("Task deleted");
      setDeletingId(null);
      refreshAll();
    } catch { toast.error("Delete failed"); }
  }

  if (loading) return <div className="page-container">Loading...</div>;
  if (!project) return <div className="page-container">Project not found</div>;

  return (
    <div className="page-container">
      <Toaster position="bottom-right" />
      
      <Link to="/" className="back-btn">
        <ArrowBackIcon fontSize="small" /> Back to projects
      </Link>

      <div className="project-header-card">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        
        {progress && (
          <div className="progress-section">
            <div className="progress-info">
              <span>Overall Progress</span>
              <span className="percent-text">{percentage}%</span>
            </div>
            <ProgressBar value={percentage} />
          </div>
        )}
      </div>

      <div className="tasks-section-header">
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <AddIcon fontSize="small" /> Add Task
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-content">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>Due: {task.dueDate || "N/A"}</small>
            </div>
            <div className="task-actions">
              <button className="action-icon-btn complete" onClick={() => handleComplete(task.id)} disabled={task.completed}>
                {task.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
              </button>
              <button className="action-icon-btn edit" onClick={() => setEditingTask(task)} disabled={task.completed}>
                <EditIcon fontSize="small" />
              </button>
              <button className="action-icon-btn delete" onClick={() => setDeletingId(task.id)}>
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* MODAL: ADD */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3>New Task</h3>
        <div className="modal-form">
          <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <textarea placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddTask}>Save Task</button>
          </div>
        </div>
      </Modal>

      {/* MODAL: EDIT */}
      {editingTask && (
        <Modal open={!!editingTask} onClose={() => setEditingTask(null)}>
          <h3>Edit Task</h3>
          <div className="modal-form">
            <input defaultValue={editingTask.title} id="et" />
            <textarea defaultValue={editingTask.description} id="ed" />
            <input type="date" defaultValue={editingTask.dueDate} id="edate" />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: DELETE */}
      <Modal open={!!deletingId} onClose={() => setDeletingId(null)}>
        <h3>Delete Task?</h3>
        <p style={{ margin: '16px 0', color: 'var(--muted)' }}>This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Confirm Delete</button>
        </div>
      </Modal>
    </div>
  );
}