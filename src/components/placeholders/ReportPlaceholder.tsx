// src/components/placeholders/ReportPlaceholder.tsx
import React, { useMemo, useState } from "react";
import { sizeBatteries } from "@/lib/battery";

/**
 * ReportPlaceholder (robust printable flow)
 *
 * - Uses Blob URL open first (most reliable).
 * - If blocked, attempts an anchor-target _blank click (user-gesture-like).
 * - If still blocked, falls back to downloading an HTML file.
 * - Final fallback copies HTML to clipboard.
 *
 * Paste/replace this file at: src/components/placeholders/ReportPlaceholder.tsx
 */

type ProjectShape = {
  data?: any;
  totals?: any;
};

function safeParse(raw: string | null) {
  try {
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function computeDailyWhFromAppliances(appliances: any[] = []) {
  return (appliances || []).reduce(
    (s, a) => s + (Number(a?.watts || 0) * Number(a?.qty || 0) * Number(a?.hours || 0)),
    0
  );
}

function computePeakLoad(appliances: any[] = []) {
  return (appliances || []).reduce((s, a) => s + (Number(a?.watts || 0) * Number(a?.qty || 0)), 0);
}

function sizeForChemistry(project: ProjectShape, chemistry: "lithium" | "lead-acid") {
  const data = project?.data ?? {};
  const dailyWh = computeDailyWhFromAppliances(data.appliances ?? []);
  const opts = {
    dailyWh,
    autonomyDays: data.autonomyDays ?? 1,
    systemVoltage: data.systemVoltage ?? 48,
    batteryNominalV: data.batteryNominalV ?? 12,
    batteryAhPerUnit: data.batteryUnitAh ?? 200,
    depthOfDischarge: chemistry === "lithium" ? 0.8 : 0.4,
    inverterEfficiency: data.inverterEfficiency ?? 0.9
  };
  const sizing = sizeBatteries(opts);
  const unitCostDefault = chemistry === "lithium" ? 600 : 200;
  const unitCost = data.batteryUnitCost ?? unitCostDefault;
  const replacementYears = chemistry === "lithium" ? 12 : 4;
  const lifecycleReplacements = Math.max(0, Math.ceil(20 / replacementYears) - 1);
  const lifecycleCost = sizing.totalUnits * unitCost * (1 + lifecycleReplacements);
  return { sizing, lifecycleCost, replacementYears, unitCost };
}

export default function ReportPlaceholder() {
  const raw = localStorage.getItem("solarhome-local") || "{}";
  const project: ProjectShape = safeParse(raw) || { data: {}, totals: {} };

  const dailyWh = useMemo(() => computeDailyWhFromAppliances(project.data?.appliances ?? []), [raw]);
  const peakLoadW = useMemo(() => computePeakLoad(project.data?.appliances ?? []), [raw]);

  const panelWatt = project.data?.panelWattage ?? 300;
  const designMargin = project.data?.designMargin ?? 20;
  const sunHours = project.data?.sunHours ?? 5;

  const recommendedPVW = useMemo(
    () => Math.ceil((dailyWh / Math.max(1, sunHours)) * (1 + designMargin / 100)),
    [raw]
  );
  const numberOfPanels = useMemo(() => Math.ceil(recommendedPVW / panelWatt), [raw]);

  const lithium = useMemo(() => sizeForChemistry(project, "lithium"), [raw]);
  const lead = useMemo(() => sizeForChemistry(project, "lead-acid"), [raw]);

  const totals = {
    dailyWh,
    peakLoadW,
    recommendedPVW,
    numberOfPanels,
    batteryLithiumUnits: lithium.sizing.totalUnits,
    batteryLeadUnits: lead.sizing.totalUnits,
    lithiumLifecycleCost: Math.round(lithium.lifecycleCost),
    leadLifecycleCost: Math.round(lead.lifecycleCost)
  };

  const [notes, setNotes] = useState<string>("");

  function buildExecutiveSummary() {
    const projectName = project.data?.projectName ?? "Untitled project";
    const recChem = lithium.lifecycleCost <= lead.lifecycleCost ? "Lithium (recommended)" : "Lead acid (recommended)";
    const lines = [
      `${projectName} — System Report`,
      `Daily energy demand: ${Math.round(dailyWh)} Wh/day.`,
      `Peak estimated load: ${Math.round(peakLoadW)} W.`,
      `Recommended PV capacity: ${recommendedPVW} W (${numberOfPanels} × ${panelWatt}W panels).`,
      `Battery recommendation: ${recChem}.`,
      `Lithium bank: ${lithium.sizing.totalUnits} units (${lithium.sizing.seriesCount}S × ${lithium.sizing.parallelStrings}P), lifecycle est $${Math.round(lithium.lifecycleCost)}.`,
      `Lead acid bank: ${lead.sizing.totalUnits} units (${lead.sizing.seriesCount}S × ${lead.sizing.parallelStrings}P), lifecycle est $${Math.round(lead.lifecycleCost)}.`,
      `Primary rationale: recommendation balances lifecycle cost, usable capacity (DOD), and site fit. See detailed sections below.`
    ];
    return lines.join("\n");
  }

  function buildBOM() {
    const panelUnitCost = project.data?.panelUnitCost ?? 120;
    const inverterUnitCost = project.data?.inverterUnitCost ?? 300;
    const batteryUnitCost = project.data?.batteryUnitCost ?? 500;

    const panelsCost = numberOfPanels * panelUnitCost;
    const inverterW = Math.ceil(peakLoadW * 1.25 / 500) * 500 || 1500;
    const inverterCost = inverterUnitCost;
    const batteryUnits = lithium.sizing.totalUnits;
    const batteriesCost = batteryUnits * batteryUnitCost;

    const bosPercent = project.data?.bosPercent ?? 20;
    const installationPercent = project.data?.installationPercent ?? 10;

    const subtotal = panelsCost + inverterCost + batteriesCost;
    const bos = Math.round((bosPercent / 100) * subtotal);
    const installation = Math.round((installationPercent / 100) * subtotal);
    const total = subtotal + bos + installation;

    return {
      panels: { qty: numberOfPanels, unitCost: panelUnitCost, total: panelsCost },
      inverter: { qty: 1, unitCost: inverterCost, total: inverterCost, sizeW: inverterW },
      batteries: { qty: batteryUnits, unitCost: batteryUnitCost, total: batteriesCost },
      bos,
      installation,
      subtotal,
      total
    };
  }

  const bom = useMemo(() => buildBOM(), [raw]);

  function exportReportJSON() {
    const report = {
      meta: {
        generatedAt: new Date().toISOString(),
        projectName: project.data?.projectName ?? "Untitled"
      },
      summary: {
        dailyWh: totals.dailyWh,
        peakLoadW: totals.peakLoadW,
        recommendedPVW: totals.recommendedPVW,
        numberOfPanels: totals.numberOfPanels
      },
      batteryComparison: {
        lithium: {
          units: lithium.sizing.totalUnits,
          series: lithium.sizing.seriesCount,
          parallel: lithium.sizing.parallelStrings,
          lifecycleCost: Math.round(lithium.lifecycleCost)
        },
        leadAcid: {
          units: lead.sizing.totalUnits,
          series: lead.sizing.seriesCount,
          parallel: lead.sizing.parallelStrings,
          lifecycleCost: Math.round(lead.lifecycleCost)
        }
      },
      bom,
      notes
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project.data?.projectName ?? "project").replace(/\s+/g, "-")}-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Robust printable flow:
   * 1) Create blob URL and try window.open(blobUrl)
   * 2) If blocked, create an anchor with target _blank and click it (user-gesture-like)
   * 3) If still blocked, download the HTML file
   * 4) If download fails, copy HTML to clipboard
   */
  function openPrintableReport() {
    const reportHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>SolarHome Report - ${(project.data?.projectName ?? "Project")}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; padding: 20px; }
            h1,h2,h3 { color: #0b7285; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .section { margin-bottom: 18px; }
            .muted { color: #666; font-size: 13px; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body>
          <h1>SolarHome System Report</h1>
          <h2>${project.data?.projectName ?? "Untitled project"}</h2>
          <div class="section">
            <h3>Executive summary</h3>
            <pre>${buildExecutiveSummary()}</pre>
          </div>

          <div class="section">
            <h3>Load analysis</h3>
            <table>
              <tr><th>Daily energy (Wh/day)</th><td>${Math.round(dailyWh)}</td></tr>
              <tr><th>Peak load (W)</th><td>${Math.round(peakLoadW)}</td></tr>
              <tr><th>Autonomy (days)</th><td>${project.data?.autonomyDays ?? 1}</td></tr>
            </table>
          </div>

          <div class="section">
            <h3>PV sizing</h3>
            <table>
              <tr><th>Recommended PV (W)</th><td>${recommendedPVW}</td></tr>
              <tr><th>Panel model</th><td>${panelWatt} W (example)</td></tr>
              <tr><th>Number of panels</th><td>${numberOfPanels}</td></tr>
            </table>
          </div>

          <div class="section">
            <h3>Battery comparison</h3>
            <table>
              <tr><th></th><th>Lithium</th><th>Lead acid</th></tr>
              <tr><td>Units</td><td>${lithium.sizing.totalUnits}</td><td>${lead.sizing.totalUnits}</td></tr>
              <tr><td>Config</td><td>${lithium.sizing.seriesCount}S × ${lithium.sizing.parallelStrings}P</td><td>${lead.sizing.seriesCount}S × ${lead.sizing.parallelStrings}P</td></tr>
              <tr><td>Lifecycle cost (est)</td><td>$${Math.round(lithium.lifecycleCost)}</td><td>$${Math.round(lead.lifecycleCost)}</td></tr>
            </table>
          </div>

          <div class="section">
            <h3>BOM & cost summary</h3>
            <table>
              <tr><th>Item</th><th>Qty</th><th>Unit cost</th><th>Total</th></tr>
              <tr><td>Panels</td><td>${bom.panels.qty}</td><td>$${bom.panels.unitCost}</td><td>$${bom.panels.total}</td></tr>
              <tr><td>Inverter</td><td>${bom.inverter.qty}</td><td>$${bom.inverter.unitCost}</td><td>$${bom.inverter.total}</td></tr>
              <tr><td>Batteries (example)</td><td>${bom.batteries.qty}</td><td>$${bom.batteries.unitCost}</td><td>$${bom.batteries.total}</td></tr>
              <tr><td>Balance of system (est)</td><td></td><td></td><td>$${bom.bos}</td></tr>
              <tr><td>Installation (est)</td><td></td><td></td><td>$${bom.installation}</td></tr>
              <tr><th colspan="3">Total estimated project cost</th><th>$${bom.total}</th></tr>
            </table>
          </div>

          <div class="section">
            <h3>Recommendations & next steps</h3>
            <ol>
              <li>Confirm site constraints (roof area, shading, structural capacity).</li>
              <li>Refine equipment selection with supplier quotes and inverter surge requirements.</li>
              <li>Plan installation with certified installer and include commissioning tests.</li>
              <li>Define maintenance and replacement schedule based on chosen chemistry.</li>
            </ol>
          </div>

          <div class="muted">Generated by SolarHome on ${new Date().toLocaleString()}</div>
        </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // 1) Try window.open(blobUrl)
    try {
      const newWin = window.open(url, "_blank", "noopener,noreferrer");
      if (newWin) {
        try { newWin.focus(); } catch {}
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        return;
      }
    } catch (e) {
      // ignore and try next fallback
    }

    // 2) Try anchor with target _blank (some blockers allow anchor clicks initiated by user event)
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      // Some browsers require the element to be in the DOM for click to work reliably
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // If the click succeeded, revoke after short delay
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      // Note: we cannot reliably detect if the click opened a window; assume success and return.
      return;
    } catch (e) {
      // ignore and try next fallback
    }

    // 3) Popup blocked: fallback to download the HTML file
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(project.data?.projectName ?? "project").replace(/\s+/g, "-")}-report.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      alert("Popup blocked. A printable HTML file was downloaded — open it and print from your browser.");
      return;
    } catch (err) {
      // ignore and try final fallback
    }

    // 4) Final fallback: copy HTML to clipboard
    try {
      navigator.clipboard?.writeText(reportHtml);
      alert("Popup blocked and download failed. Printable HTML copied to clipboard — paste into a file and open it to print.");
    } catch {
      alert("Popup blocked and fallback failed. Please allow popups for this site, disable blocking extensions, or use the Download JSON report button.");
    }
  }

  const executiveSummary = useMemo(() => buildExecutiveSummary(), [raw, notes]);

  return (
    <div style={{ padding: 12 }}>
      <h3>Project Report</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div>
          <div style={{ border: "1px solid #eef6f5", padding: 12, borderRadius: 6, background: "#fbfffe" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Executive Summary</div>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{executiveSummary}</pre>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Detailed Analysis</div>

            <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>Load Analysis</div>
              <div>Daily energy: <strong>{Math.round(dailyWh)} Wh/day</strong></div>
              <div>Peak load (est): <strong>{Math.round(peakLoadW)} W</strong></div>
              <div>Autonomy: <strong>{project.data?.autonomyDays ?? 1} days</strong></div>
            </div>

            <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>PV Sizing</div>
              <div>Recommended PV: <strong>{recommendedPVW} W</strong></div>
              <div>Panels: <strong>{numberOfPanels} × {panelWatt}W</strong></div>
              <div>Design margin: <strong>{designMargin}%</strong></div>
              <div>Sun hours used: <strong>{sunHours} h/day</strong></div>
            </div>

            <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6 }}>
              <div style={{ fontWeight: 600 }}>Battery Comparison</div>
              <div style={{ marginTop: 6 }}>
                <div><strong>Lithium</strong>: {lithium.sizing.totalUnits} units — {lithium.sizing.seriesCount}S × {lithium.sizing.parallelStrings}P — lifecycle est ${Math.round(lithium.lifecycleCost)}</div>
                <div style={{ marginTop: 6 }}><strong>Lead acid</strong>: {lead.sizing.totalUnits} units — {lead.sizing.seriesCount}S × {lead.sizing.parallelStrings}P — lifecycle est ${Math.round(lead.lifecycleCost)}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Recommendations</div>
            <ol>
              <li>Confirm site constraints (roof area, shading, structural capacity).</li>
              <li>Obtain supplier quotes for panels, inverter, and batteries; update unit costs in Planner.</li>
              <li>Prefer lithium if lifecycle cost and space/weight are priorities; prefer lead acid if strict upfront budget constraints exist.</li>
              <li>Engage a certified installer for mounting, wiring, earthing, and commissioning.</li>
            </ol>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Project notes</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add project-specific notes or constraints here" style={{ width: "100%", minHeight: 100, padding: 8 }} />
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={exportReportJSON}>Download JSON report</button>
            <button onClick={() => {
              navigator.clipboard?.writeText(executiveSummary).then(() => {
                alert("Executive summary copied to clipboard");
              }).catch(() => {
                alert("Copy not available");
              });
            }}>Copy executive summary</button>
            <button onClick={openPrintableReport}>Open printable report</button>
          </div>
        </div>

        <aside>
          <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick facts</div>
            <div>Project: <strong>{project.data?.projectName ?? "Untitled"}</strong></div>
            <div>Daily energy: <strong>{Math.round(dailyWh)} Wh/day</strong></div>
            <div>Recommended PV: <strong>{recommendedPVW} W</strong></div>
            <div>Panels: <strong>{numberOfPanels}</strong></div>
            <div style={{ marginTop: 8 }}><strong>BOM summary</strong></div>
            <div>Panels cost: <strong>${bom.panels.total}</strong></div>
            <div>Inverter cost: <strong>${bom.inverter.total}</strong></div>
            <div>Batteries cost (example): <strong>${bom.batteries.total}</strong></div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>Estimated total</div>
            <div style={{ fontSize: 18 }}>${bom.total}</div>
          </div>

          <div style={{ marginTop: 12, border: "1px solid #eee", padding: 12, borderRadius: 6 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Professional checklist</div>
            <ul style={{ margin: 0 }}>
              <li>Shading analysis completed</li>
              <li>Structural assessment for roof</li>
              <li>Inverter surge and continuous rating verified</li>
              <li>Battery BMS and charger compatibility checked</li>
              <li>Installation & commissioning plan defined</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}