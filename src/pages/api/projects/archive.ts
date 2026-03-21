import type { NextApiRequest, NextApiResponse } from 'next';

const DB_KEY = 'solarhome_preview_projects';
function readDB() { try { return JSON.parse(process.env[DB_KEY] || '[]'); } catch { return []; } }
function writeDB(arr: any[]) { process.env[DB_KEY] = JSON.stringify(arr); }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const projects = readDB();
  const idx = projects.findIndex((p: any) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  projects[idx].archived = true;
  projects[idx].archived_at = new Date().toISOString();
  writeDB(projects);
  return res.status(200).json({ success: true });
}

