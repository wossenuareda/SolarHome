import type { NextApiRequest, NextApiResponse } from 'next';

const DB_KEY = 'solarhome_preview_projects';
function readDB() { try { return JSON.parse(process.env[DB_KEY] || '[]'); } catch { return []; } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projects = readDB();
  return res.status(200).json({ projects: projects.filter((p: any) => !p.archived) });
}

