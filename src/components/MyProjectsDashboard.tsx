import React, { useEffect, useState } from "react";
import { listProjects, downloadPdf } from "../lib/cloud";
import { useAuthStub } from "../lib/useAuthStub";

export default function MyProjectsDashboard({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const { user } = useAuthStub();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await listProjects();
      setProjects(res.projects || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const archive = async (id: string) => {
    const r = await fetch('/api/projects/archive', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!r.ok) { alert('Archive failed'); return; }
    await load();
  };

  if (!user) return <div style={{ padding: 12 }}>Sign in to view your projects</div>;

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
      <h3>My Projects</h3>
      {loading && <div>Loading...</div>}
      {!loading && projects.length === 0 && <div>No projects yet</div>}
      {projects.map(p => (
        <div key={p.id} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{p.updated_at ? new Date(p.updated_at).toLocaleString() : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onOpenProject(p.id)}>Open</button>
              <button onClick={() => downloadPdf(p.id)}>PDF</button>
              <button onClick={() => archive(p.id)}>Archive</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

