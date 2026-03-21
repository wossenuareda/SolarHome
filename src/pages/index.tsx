import React from 'react';
import SolarHomeSystemPlanner from '../components/SolarHomeSystemPlanner';
import MyProjectsDashboard from '../components/MyProjectsDashboard';

export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>SolarHome Planner</h1>
        <p style={{ marginTop: 6, color: '#555' }}>
          Estimate panels, batteries, and costs. Save projects and download a PDF.
        </p>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <SolarHomeSystemPlanner />
        <MyProjectsDashboard onOpenProject={(id) => {
          console.log('Open project', id);
          alert('Open project ' + id + ' (preview stub)');
        }} />
      </main>
    </div>
  );
}

