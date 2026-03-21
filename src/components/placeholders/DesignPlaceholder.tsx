import React, { useEffect, useState } from "react";

type ProjectData = {
  projectName?: string;
  panelWattage?: number;
  numberOfPanels?: number;
  totals?: { recommendedPVW?: number; numberOfPanels?: number };
  data?: any;
};

export default function DesignPlaceholder() {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [panelWidthM, setPanelWidthM] = useState<number>(1.0);
  const [panelHeightM, setPanelHeightM] = useState<number>(1.7);
  const [tiltFactor, setTiltFactor] = useState<number>(1.0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("solarhome-local");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const data = parsed?.data ?? parsed;
      const totals = parsed?.totals ?? parsed?.data?.totals ?? parsed?.data;
      setProject({
        projectName: data?.projectName ?? parsed?.data?.projectName ?? parsed?.name,
        panelWattage: data?.panelWattage ?? parsed?.data?.panelWattage ?? 300,
        numberOfPanels: totals?.numberOfPanels ?? undefined,
        totals: totals
      });
    } catch (e) {
      console.error("DesignPlaceholder parse error", e);
    }
  }, []);

  const numberOfPanels = (() => {
    const fromTotals = project?.totals?.numberOfPanels;
    if (typeof fromTotals === "number" && fromTotals > 0) return fromTotals;

    const recommendedPVW =
      project?.totals?.recommendedPVW ??
      project?.data?.recommendedPVW ??
      0;
    const panelWattage = project?.panelWattage ?? 300;
    if (recommendedPVW > 0) return Math.ceil(recommendedPVW / panelWattage);

    const raw = localStorage.getItem("solarhome-local");
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw);
      const appliances = parsed?.data?.appliances ?? [];
      const dailyWh = appliances.reduce((s: number, a: any) => s + (a.watts * a.qty * a.hours), 0);
      const sunHours = parsed?.data?.sunHours ?? 5;
      const designMargin = parsed?.data?.designMargin ?? 20;
      const recomPVW = Math.ceil((dailyWh / (sunHours || 1)) * (1 + (designMargin || 0) / 100));
      return recomPVW > 0 ? Math.ceil(recomPVW / (parsed?.data?.panelWattage ?? 300)) : 0;
    } catch {
      return 0;
    }
  })();

  const areaPerPanel = panelWidthM * panelHeightM * tiltFactor;
  const totalArea = (numberOfPanels || 0) * areaPerPanel;

  if (!project) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Design</h3>
        <div>No saved project found. Save a project in Planner to preview design.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Design</h3>

      <div style={{ marginBottom: 12, fontWeight: 600 }}>{project.projectName ?? "Untitled project"}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Panel width (m)</label>
            <input type="number" value={panelWidthM} onChange={(e) => setPanelWidthM(Number(e.target.value) || 0)} step="0.1" />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Panel height (m)</label>
            <input type="number" value={panelHeightM} onChange={(e) => setPanelHeightM(Number(e.target.value) || 0)} step="0.1" />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Tilt factor</label>
            <input type="number" value={tiltFactor} onChange={(e) => setTiltFactor(Number(e.target.value) || 1)} step="0.05" />
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              Tilt factor adjusts required area for tilt and spacing. Typical 1.0–1.3.
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div><strong>Panel wattage</strong> {project.panelWattage ?? "—"} W</div>
            <div><strong>Number of panels</strong> {numberOfPanels ?? 0}</div>
            <div><strong>Area per panel</strong> {areaPerPanel.toFixed(2)} m²</div>
            <div style={{ marginTop: 6, fontSize: 16 }}><strong>Total estimated area</strong> {totalArea.toFixed(2)} m²</div>
          </div>
        </div>

        <div>
          <div style={{ border: "1px solid #eee", height: 220, borderRadius: 6, padding: 8, background: "#fff" }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}>Layout preview</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Array.from({ length: numberOfPanels || 0 }).map((_, i) => (
                <div key={i} style={{
                  width: 48,
                  height: 86,
                  background: "#0ea5a4",
                  borderRadius: 4,
                  boxShadow: "0 1px 0 rgba(0,0,0,0.06)"
                }} />
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              This is a simple visual preview. Replace with a canvas or SVG for accurate placement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
