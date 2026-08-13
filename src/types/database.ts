// Tipos del esquema. Después de correr schema.sql pueden regenerarlos con:
//   npx supabase gen types typescript --project-id SU_ID > src/types/database.ts

export type TaskStatus = "backlog" | "in_progress" | "blocked" | "done";
export type TaskPriority = "baja" | "media" | "alta";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  area: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  due_date: string | null;
  position: number;
  source: string | null;
  created_at: string;
};

export type TaskComment = {
  id: string;
  task_id: string;
  author: string;
  body: string;
  created_at: string;
};

// Lo que devuelve el agente de minutas antes de guardarse.
export type TareaPropuesta = {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  due_date: string | null;
};

export const COLUMNAS: { status: TaskStatus; label: string }[] = [
  { status: "backlog", label: "Por hacer" },
  { status: "in_progress", label: "En curso" },
  { status: "blocked", label: "Bloqueado" },
  { status: "done", label: "Hecho" },
];
