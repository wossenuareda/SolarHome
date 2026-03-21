import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

/**
 * Minimal in-memory fallback for preview.
 * In production replace with Supabase server client using SUPABASE_SERVICE_ROLE_KEY.
 */
const DB_KEY = 'solarhome_preview_projects';

function readDB() {
  try { return JSON.parse(process.env[DB_KEY] || '[]'); } catch { return []; }
}
function writeDB(arr: any[]) { process.env[DB_KEY] = JSON.stringify(arr); }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body;
  const projects = readDB();
  const id = uuidv4();
  const now = new Date().toISOString();
  const project = { id, name: body.projectName || 'Untitled', payload: body, totals: body.totals || null, created_at: now, updated_at: now, archived: false };
  projects.push(project);
  writeDB(projects);
  return res.status(201).json({ project });
}

