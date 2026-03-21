// src/components/placeholders/DeployPlaceholder.tsx
import React, { useMemo, useState } from "react";
import { sizeBatteries } from "@/lib/battery";

/**
 * DeployPlaceholder (complete corrected file)
 *
 * - Robust printable handoff flow using Blob URL + multiple fallbacks:
 *   1) open blob URL in new tab
 *   2) anchor click with target _blank
 *   3) navigate same tab to blob URL
 *   4) download HTML file
 *   5) copy HTML to clipboard
 *
 * - Exports handoff JSON and provides copy-to-clipboard for quick sharing.
 *
 * Save as: src/components/placeholders/DeployPlaceholder.tsx
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

function summarizeProject(project: ProjectShape) {
  const data = project?.data ?? {};
  const dailyWh = computeDailyWhFromAppliances(data.appliances ?? []);
  const peakLoad = computePeakLoad(data.appliances ?? []);
  const sunHours = data.sunHours ?? 5;
  const designMargin = data.designMargin ?? 20;
  const panelWatt = data.panelWattage ?? 300;
  const recommendedPVW = Math.ceil((dailyWh / Math.max(1, sunHours)) * (1 + designMargin / 100));
  const numberOfPanels = Math.ceil(recommendedPVW / panelWatt);

  const lithium = sizeBatteries({
    dailyWh,
    autonomyDays: data.autonomyDays ?? 1,
    systemVoltage: data.systemVoltage ?? 48,
    batteryNominalV: data.batteryNominalV ?? 12,
    batteryAhPerUnit: data.batteryUnitAh ?? 200,
    depthOfDischarge: 0.8,
    inverterEfficiency: data.inverterEfficiency ?? 0.9
  });

  const lead = sizeBatteries({
    dailyWh,
    autonomyDays: data.autonomyDays ?? 1,
    systemVoltage: data.systemVoltage ?? 48,
    batteryNominalV: data.batteryNominalV ?? 12,
    batteryAhPerUnit: data.batteryUnitAh ?? 200,
    depthOfDischarge: 0.4,
    inverterEfficiency: data.inverterEfficiency ?? 0.9
  });

  return {
    dailyWh,
    peakLoad,
    recommendedPVW,
    numberOfPanels,
    panelWatt,
    lithium,
    lead
  };
}

export default function DeployPlaceholder() {
  const raw = localStorage.getItem("solarhome-local") || "{}";
  const project: ProjectShape = safeParse(raw) || { data: {}, totals: {} };

  const summary = useMemo(() => summarizeProject(project), [raw]);

  const [notes, setNotes] = useState<string>("");

  function buildHandoffPayload() {
    const projectName = project.data?.projectName ?? "Untitled project";
    const recChem = summary.lithium.usableWhTotal >= summary.lead.usableWhTotal ? "Lithium" : "Lead acid";
    const payload = {
      version: "v1",
      generatedAt: new Date().toISOString(),
      projectName,
      site: {
        sunHours: project.data?.sunHours ?? 5,
        autonomyDays: project.data?.autonomyDays ?? 1,
        systemVoltage: project.data?.systemVoltage ?? 48
      },
      loads: {
        dailyWh: Math.round(summary.dailyWh),
        peakLoadW: Math.round(summary.peakLoad)
      },
      pv: {
        recommendedPVW: summary.recommendedPVW,
        numberOfPanels: summary.numberOfPanels,
        panelWatt: summary.panelWatt
      },
      batteries: {
        lithium: {
          series: summary.lithium.seriesCount,
          parallel: summary.lithium.parallelStrings,
          totalUnits: summary.lithium.totalUnits,
          usableWhTotal: Math.round(summary.lithium.usableWhTotal)
        },
        leadAcid: {
          series: summary.lead.seriesCount,
          parallel: summary.lead.parallelStrings,
          totalUnits: summary.lead.totalUnits,
          usableWhTotal: Math.round(summary.lead.usableWhTotal)
        }
      },
      recommendedChemistry: recChem,
      notes
    };
    return payload;
  }

  function downloadHandoffJson() {
    const payload = buildHandoffPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(payload.projectName ?? "project").replace(/\s+/g, "-")}-handoff-${payload.version}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildHandoffHtml(payload: any) {
    const created = payload.generatedAt;
    const projectName = payload.projectName;
    const site = payload.site;
    const loads = payload.loads;
    const pv = payload.pv;
    const batteries = payload.batteries;
    const rec = payload.recommendedChemistry;

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Handoff - ${projectName}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111; padding: 20px; }
      h1 { color: #0b7285; margin-bottom: 6px; }
      h2 { color: #0b7285; font-size: 14px; margin: 6px 0 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
      .muted { color: #666; font-size: 12px; }
      .section { margin-bottom: 14px; }
      pre { white-space: pre-wrap; font-family: inherit; }
    </style>
  </head>
  <body>
    <h1>Deployment Handoff</h1>
    <h2>${projectName} — Generated ${created}</h2>

    <div class="section">
      <strong>Site & system</strong>
      <table>
        <tr><th>Sun hours</th><td>${site.sunHours} h/day</td></tr>
        <tr><th>Autonomy</th><td>${site.autonomyDays} days</td></tr>
        <tr><th>System voltage</th><td>${site.systemVoltage} V</td></tr>
      </table>
    </div>

    <div class="section">
      <strong>Load summary</strong>
      <table>
        <tr><th>Daily energy (Wh/day)</th><td>${loads.dailyWh}</td></tr>
        <tr><th>Peak load (W)</th><td>${loads.peakLoadW}</td></tr>
      </table>
    </div>

    <div class="section">
      <strong>PV recommendation</strong>
      <table>
        <tr><th>Recommended PV (W)</th><td>${pv.recommendedPVW}</td></tr>
        <tr><th>Panels</th><td>${pv.numberOfPanels} × ${pv.panelWatt}W</td></tr>
      </table>
    </div>

    <div class="section">
      <strong>Battery options</strong>
      <table>
        <tr><th></th><th>Series</th><th>Parallel</th><th>Total units</th><th>Usable Wh (approx)</th></tr>
        <tr><td>Lithium</td><td>${batteries.lithium.series}</td><td>${batteries.lithium.parallel}</td><td>${batteries.lithium.totalUnits}</td><td>${batteries.lithium.usableWhTotal}</td></tr>
        <tr><td>Lead acid</td><td>${batteries.leadAcid.series}</td><td>${batteries.leadAcid.parallel}</td><td>${batteries.leadAcid.totalUnits}</td><td>${batteries.leadAcid.usableWhTotal}</td></tr>
      </table>
    </div>

    <div class="section">
      <strong>Recommendation</strong>
      <div style="margin-top:8px;">Recommended chemistry: <strong>${rec}</strong></div>
    </div>

    <div class="section">
      <strong>Installer notes</strong>
      <pre>${payload.notes || "None"}</pre>
    </div>

    <div class="muted">Export version: ${payload.version}</div>
  </body>
</html>`;
  }

  /**
   * Robust printable handoff:
   * 1) Create blob URL and try window.open(blobUrl)
   * 2) If blocked, try anchor click with target _blank
   * 3) If blocked, navigate same tab to blob URL (user can print and then go back)
   * 4) If blocked, download HTML file
   * 5) If all fail, copy HTML to clipboard
   */
  function openPrintableHandoff() {
    const payload = buildHandoffPayload();
    const html = buildHandoffHtml(payload);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // 1) Try to open blob URL in a new tab/window
    try {
      const newWin = window.open(url, "_blank", "noopener,noreferrer");
      if (newWin) {
        try { newWin.focus(); } catch {}
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        return;
      }
    } catch (e) {
      // continue to next fallback
    }

    // 2) Try anchor click with target _blank (some blockers allow this)
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return;
    } catch (e) {
      // continue to next fallback
    }

    // 3) Fallback: open in same tab (navigates away but avoids popup blocking)
    try {
      window.location.assign(url);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return;
    } catch (e) {
      // continue to next fallback
    }

    // 4) Fallback: download the HTML file
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(payload.projectName ?? "project").replace(/\s+/g, "-")}-handoff-${payload.version}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      alert("Popup blocked. A printable HTML file was downloaded — open it and print from your browser.");
      return;
    } catch (err) {
      // continue to final fallback
    }

    // 5) Final fallback: copy HTML to clipboard
    try {
      navigator.clipboard?.writeText(html);
      alert("Popup blocked and download failed. Printable HTML copied to clipboard — paste into a file and open it to print.");
    } catch {
      alert("Popup blocked and fallback failed. Please allow popups for this site, disable blocking extensions, or use the Export handoff (JSON) button.");
    }
  }

  function copyHandoffSummary() {
    const payload = buildHandoffPayload();
    const summaryText = `Handoff — ${payload.projectName}\nRecommended PV: ${payload.pv.recommendedPVW} W (${payload.pv.numberOfPanels} × ${payload.pv.panelWatt}W)\nRecommended chemistry: ${payload.recommendedChemistry}\nNotes: ${payload.notes || "None"}`;
    navigator.clipboard?.writeText(summaryText).then(() => {
      alert("Handoff summary copied to clipboard");
    }).catch(() => {
      alert("Copy not available");
    });
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Deployment Handoff</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div>
          <div style={{ border: "1px solid #eef6f5", padding: 12, borderRadius: 6, background: "#fbfffe" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick Handoff Summary</div>
            <div>Daily energy: <strong>{Math.round(summary.dailyWh)} Wh/day</strong></div>
            <div>Peak load: <strong>{Math.round(summary.peakLoad)} W</strong></div>
            <div>Recommended PV: <strong>{summary.recommendedPVW} W</strong></div>
            <div>Panels: <strong>{summary.numberOfPanels} × {summary.panelWatt}W</strong></div>
            <div style={{ marginTop: 8 }}><strong>Battery examples</strong></div>
            <div>Lithium: <strong>{summary.lithium.totalUnits}</strong> units ({summary.lithium.seriesCount}S × {summary.lithium.parallelStrings}P)</div>
            <div>Lead acid: <strong>{summary.lead.totalUnits}</strong> units ({summary.lead.seriesCount}S × {summary.lead.parallelStrings}P)</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Installer notes</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add site-specific handoff notes for the installer" style={{ width: "100%", minHeight: 120, padding: 8 }} />
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={downloadHandoffJson}>Export handoff (JSON)</button>
            <button onClick={openPrintableHandoff}>Open printable handoff</button>
            <button onClick={copyHandoffSummary}>Copy summary</button>
          </div>
        </div>

        <aside>
          <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Handoff checklist</div>
            <ul style={{ margin: 0 }}>
              <li>Confirm roof area and mounting plan</li>
              <li>Verify inverter continuous and surge ratings</li>
              <li>Confirm battery BMS and charger compatibility</li>
              <li>Plan cable runs and conduit routes</li>
              <li>Schedule commissioning and performance test</li>
            </ul>
          </div>

          <div style={{ marginTop: 12, border: "1px solid #eee", padding: 12, borderRadius: 6 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Export notes</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              The printable handoff opens in a new tab when allowed. If your browser blocks popups, the app will attempt several fallbacks: anchor click, same-tab navigation, file download, and finally copying the HTML to your clipboard.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


