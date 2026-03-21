import React, { useEffect, useMemo, useState } from "react";

type Appliance = { name: string; watts: number; qty: number; hours: number };
type SavedProject = {
  data?: {
    projectName?: string;
    panelWattage?: number;
    panelUnitCost?: number;
    batteryUnitCost?: number;
    inverterUnitCost?: number;
    controllerUnitCost?: number;
    bosPercent?: number;
    installationPercent?: number;
    appliances?: Appliance[];
    batteryUnitAh?: number;
    recommendedPVW?: number;
    sunHours?: number;
    designMargin?: number;
  };
  totals?: {
    recommendedPVW?: number;
    numberOfPanels?: number;
    totalEstimatedCost?: number;
  };
  project?: { id?: string; name?: string };
  id?: string;
  name?: string;
};

export default function CostPlaceholder() {
  const [project, setProject] = useState<SavedProject | null>(null);
  const [panelUnitCost, setPanelUnitCost] = useState<number>(120);
  const [batteryUnitCost, setBatteryUnitCost] = useState<number>(500);
  const [inverterUnitCost, setInverterUnitCost] = useState<number>(300);
  const [controllerUnitCost, setControllerUnitCost] = useState<number>(150);
  const [bosPercent, setBosPercent] = useState<number>(20);
  const [installationPercent, setInstallationPercent] = useState<number>(10);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("solarhome-local");
      if (!raw) return;
      const parsed: SavedProject = JSON.parse(raw);
      const d = parsed?.data || {};
      setProject(parsed || null);
      setPanelUnitCost(d.panelUnitCost ?? panelUnitCost);
      setBatteryUnitCost(d.batteryUnitCost ?? batteryUnitCost);
      setInverterUnitCost(d.inverterUnitCost ?? inverterUnitCost);
      setControllerUnitCost(d.controllerUnitCost ?? controllerUnitCost);
      setBosPercent(d.bosPercent ?? bosPercent);
      setInstallationPercent(d.installationPercent ?? installationPercent);
    } catch (e) {
      console.error("CostPlaceholder parse error", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numberOfPanels = (() => {
    const fromTotals = project?.totals?.numberOfPanels;
    if (typeof fromTotals === "number" && fromTotals > 0) return fromTotals;

    const recommendedPVW =
      project?.totals?.recommendedPVW ??
      project?.data?.recommendedPVW ??
      0;
    const panelWattage = project?.data?.panelWattage ?? 300;
    if (recommendedPVW > 0) return Math.ceil(recommendedPVW / panelWattage);

    const appliances = project?.data?.appliances ?? [];
    const dailyWh = appliances.reduce((s: number, a: any) => s + (a.watts * a.qty * a.hours), 0);
    const sunHours = project?.data?.sunHours ?? 5;
    const designMargin = project?.data?.designMargin ?? 20;
    const recomPVW = Math.ceil((dailyWh / (sunHours || 1)) * (1 + (designMargin || 0) / 100));
    return recomPVW > 0 ? Math.ceil(recomPVW / panelWattage) : 0;
  })();

  const bom = useMemo(() => {
    const panelsCost = numberOfPanels * panelUnitCost;
    const batteriesCount = project?.data ? Math.ceil(((project.data.batteryUnitAh ?? 0) / 200) || 0) : 0;
    const batteriesCost = batteriesCount * batteryUnitCost;
    const inverterCost = inverterUnitCost;
    const controllerCost = controllerUnitCost;
    const subtotal = panelsCost + batteriesCost + inverterCost + controllerCost;
    const bos = Math.round((bosPercent / 100) * subtotal);
    const installation = Math.round((installationPercent / 100) * subtotal);
    const total = subtotal + bos + installation;
    return {
      panels: { qty: numberOfPanels, unit: panelUnitCost, total: panelsCost },
      batteries: { qty: batteriesCount, unit: batteryUnitCost, total: batteriesCost },
      inverter: { qty: inverterCost ? 1 : 0, unit: inverterUnitCost, total: inverterCost },
      controller: { qty: controllerCost ? 1 : 0, unit: controllerUnitCost, total: controllerCost },
      subtotal,
      bos,
      installation,
      total
    };
  }, [numberOfPanels, panelUnitCost, batteryUnitCost, inverterUnitCost, controllerUnitCost, bosPercent, installationPercent, project]);

  if (!project) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Cost</h3>
        <div>No saved project found. Save a project in Planner to calculate costs.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Cost</h3>

      <div style={{ marginBottom: 12, fontWeight: 600 }}>{project.data?.projectName ?? "Untitled project"}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Panel unit cost (USD)</label>
            <input type="number" value={panelUnitCost} onChange={(e) => setPanelUnitCost(Number(e.target.value) || 0)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Battery unit cost (USD)</label>
            <input type="number" value={batteryUnitCost} onChange={(e) => setBatteryUnitCost(Number(e.target.value) || 0)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Inverter unit cost (USD)</label>
            <input type="number" value={inverterUnitCost} onChange={(e) => setInverterUnitCost(Number(e.target.value) || 0)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13 }}>Controller unit cost (USD)</label>
            <input type="number" value={controllerUnitCost} onChange={(e) => setControllerUnitCost(Number(e.target.value) || 0)} />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>BOS %</label>
              <input type="number" value={bosPercent} onChange={(e) => setBosPercent(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13 }}>Installation %</label>
              <input type="number" value={installationPercent} onChange={(e) => setInstallationPercent(Number(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        <div>
          <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Bill of Materials</div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                <tr>
                  <td style={{ padding: 6 }}>Panels</td>
                  <td style={{ padding: 6, textAlign: "right" }}>{bom.panels.qty} × ${bom.panels.unit}</td>
                  <td style={{ padding: 6, textAlign: "right" }}>${bom.panels.total}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6 }}>Batteries</td>
                  <td style={{ padding: 6, textAlign: "right" }}>{bom.batteries.qty} × ${bom.batteries.unit}</td>
                  <td style={{ padding: 6, textAlign: "right" }}>${bom.batteries.total}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6 }}>Inverter</td>
                  <td style={{ padding: 6, textAlign: "right" }}>{bom.inverter.qty} × ${bom.inverter.unit}</td>
                  <td style={{ padding: 6, textAlign: "right" }}>${bom.inverter.total}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6 }}>Controller</td>
                  <td style={{ padding: 6, textAlign: "right" }}>{bom.controller.qty} × ${bom.controller.unit}</td>
                  <td style={{ padding: 6, textAlign: "right" }}>${bom.controller.total}</td>
                </tr>

                <tr>
                  <td style={{ padding: 6, borderTop: "1px solid #eee" }}>Subtotal</td>
                  <td />
                  <td style={{ padding: 6, textAlign: "right", borderTop: "1px solid #eee" }}>${bom.subtotal}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6 }}>BOS ({bosPercent}%)</td>
                  <td />
                  <td style={{ padding: 6, textAlign: "right" }}>${bom.bos}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6 }}>Installation ({installationPercent}%)</td>
                  <td />
                  <td style={{ padding: 6, textAlign: "right" }}>${bom.installation}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6, fontWeight: 700 }}>Total</td>
                  <td />
                  <td style={{ padding: 6, textAlign: "right", fontWeight: 700 }}>${bom.total}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button onClick={async () => {
                try {
                  const raw = localStorage.getItem("solarhome-local");
                  if (!raw) { alert("No local project to save"); return; }
                  const parsed = JSON.parse(raw);

                  parsed.data = parsed.data || {};
                  parsed.data.panelUnitCost = panelUnitCost;
                  parsed.data.batteryUnitCost = batteryUnitCost;
                  parsed.data.inverterUnitCost = inverterUnitCost;
                  parsed.data.controllerUnitCost = controllerUnitCost;
                  parsed.data.bosPercent = bosPercent;
                  parsed.data.installationPercent = installationPercent;

                  const payload: any = {
                    name: parsed.data.projectName || parsed.name || "Untitled project",
                    totals: parsed.totals || {},
                    data: parsed.data || {}
                  };

                  const serverId = parsed.project?.id || parsed.id || null;
                  if (serverId) payload.id = serverId;

                  const res = await fetch("/api/projects/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });

                  if (!res.ok) {
                    const text = await res.text().catch(() => "unknown");
                    throw new Error(`Server save failed: ${res.status} ${text}`);
                  }

                  const body = await res.json();
                  const savedProject = body.project || body;

                  parsed.project = savedProject;
                  parsed.id = savedProject.id;
                  localStorage.setItem("solarhome-local", JSON.stringify(parsed));

                  alert("Costs saved to server project");
                } catch (e: any) {
                  console.error("Save costs error", e);
                  alert("Failed to save costs: " + (e?.message ?? "unknown"));
                }
              }}>Save costs to project</button>

              <button onClick={() => {
                const rows = [
                  ["Item", "Qty", "Unit (USD)", "Total (USD)"],
                  ["Panels", String(bom.panels.qty), String(bom.panels.unit), String(bom.panels.total)],
                  ["Batteries", String(bom.batteries.qty), String(bom.batteries.unit), String(bom.batteries.total)],
                  ["Inverter", String(bom.inverter.qty), String(bom.inverter.unit), String(bom.inverter.total)],
                  ["Controller", String(bom.controller.qty), String(bom.controller.unit), String(bom.controller.total)],
                  ["Subtotal", "", "", String(bom.subtotal)],
                  ["BOS", "", "", String(bom.bos)],
                  ["Installation", "", "", String(bom.installation)],
                  ["Total", "", "", String(bom.total)]
                ];
                const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${project.data?.projectName ?? "project"}-bom.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}>Export BOM CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
