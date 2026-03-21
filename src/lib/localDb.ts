import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "projects.json");

export type ProjectRecord = {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  archived?: boolean;
  totals?: any;
  data?: any;
};

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

export function readDB(): ProjectRecord[] {
  try {
    ensureDir();
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "[]") as ProjectRecord[];
  } catch (err) {
    console.error("localDb read error", err);
    return [];
  }
}

export function writeDB(records: ProjectRecord[]) {
  try {
    ensureDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(records, null, 2), "utf8");
  } catch (err) {
    console.error("localDb write error", err);
  }
}

export function createProject(payload: Partial<ProjectRecord>) {
  const id = crypto.randomBytes(8).toString("hex");
  const now = new Date().toISOString();
  const project: ProjectRecord = {
    id,
    name: payload.name || `Project ${id}`,
    created_at: now,
    updated_at: now,
    archived: false,
    totals: payload.totals ?? null,
    data: payload.data ?? null
  };
  const all = readDB();
  all.push(project);
  writeDB(all);
  return project;
}

export function updateProject(id: string, patch: Partial<ProjectRecord>) {
  const all = readDB();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updated_at: new Date().toISOString() };
  writeDB(all);
  return all[idx];
}

export function findProject(id: string) {
  return readDB().find(p => p.id === id) || null;
}

export function listProjects() {
  return readDB().filter(p => !p.archived);
}

export function archiveProject(id: string) {
  return updateProject(id, { archived: true });
}
