export type CloudProject = { id: string; name: string; totals?: any; created_at?: string; updated_at?: string; archived?: boolean };

export async function saveProjectCloud(payload: any): Promise<{ project: CloudProject }> {
  const res = await fetch('/api/projects/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Save failed');
  return res.json();
}

export async function listProjects(): Promise<{ projects: CloudProject[] }> {
  const res = await fetch('/api/projects/list');
  if (!res.ok) throw new Error('List failed');
  return res.json();
}

export function downloadPdf(projectId: string) {
  const url = `/api/projects/pdf?id=${encodeURIComponent(projectId)}`;
  window.open(url, '_blank');
}

