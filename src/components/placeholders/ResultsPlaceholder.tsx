import React, { useEffect, useState } from "react";

type Totals = {
  dailyWh?: number;
  recommendedPVW?: number;
  totalEstimatedCost?: number;
  numberOfPanels?: number;
};

export default function ResultsPlaceholder() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("solarhome-local");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const data = parsed?.data;
      if (parsed?.data?.totals) {
        setTotals(parsed.data.totals);
      } else if (data) {
        const appliances = data.appliances || [];
        const dailyWh = appliances.reduce((s: number, a: any) => s + (a.watts * a.qty * a.hours), 0);
        const recommendedPVW = Math.ceil((dailyWh / (data.sunHours || 1)) * (1 + (data.designMargin || 0) / 100));
        const numberOfPanels = Math.ceil(recommendedPVW / (data.panelWattage || 300));
        const totalEstimatedCost = (data.panelUnitCost || 0) * numberOfPanels;
        setTotals({ dailyWh, recommendedPVW, numberOfPanels, totalEstimatedCost });
      }
      setProjectName(parsed?.data?.projectName ?? null);
    } catch (err) {
      console.error("Results parse error", err);
    }
  }, []);

  if (!totals) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Results</h3>
        <div>No saved project found in local storage.</div>
        <div style={{ marginTop: 8, color: "#666" }}>
          Save a project using the Planner (Save on this device) and then open Results.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Results</h3>
      {projectName && <div style={{ marginBottom: 8, fontWeight: 600 }}>{projectName}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: 6, borderBottom: "1px solid #eee" }}>Daily energy (Wh)</td>
            <td style={{ padding: 6, borderBottom: "1px solid #eee", textAlign: "right" }}>{totals.dailyWh ?? "—"}</td>
          </tr>
          <tr>
            <td style={{ padding: 6, borderBottom: "1px solid #eee" }}>Recommended PV W</td>
            <td style={{ padding: 6, borderBottom: "1px solid #eee", textAlign: "right" }}>{totals.recommendedPVW ?? "—"}</td>
          </tr>
          <tr>
            <td style={{ padding: 6, borderBottom: "1px solid #eee" }}>Number of panels</td>
            <td style={{ padding: 6, borderBottom: "1px solid #eee", textAlign: "right" }}>{totals.numberOfPanels ?? "—"}</td>
          </tr>
          <tr>
            <td style={{ padding: 6 }}>Estimated cost (USD)</td>
            <td style={{ padding: 6, textAlign: "right" }}>${totals.totalEstimatedCost ?? "—"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
