// src/components/placeholders/ComparePlaceholder.tsx
import React, { useMemo, useState } from "react";
import { sizeBatteries } from "@/lib/battery";

/**
 * ComparePlaceholder (single-shot printable flow)
 *
 * - Prevents double-open by guarding the open action with isOpening
 * - Primary: open blob URL in new tab
 * - Fallback: download HTML file
 * - Final fallback: copy HTML to clipboard
 *
 * Save as: src/components/placeholders/ComparePlaceholder.tsx
 */

type ProjectShape = {
  data?: any;
  totals?: {
    dailyWh?: number;
    recommendedPVW?: number;
    numberOfPanels?: number;
    totalEstimatedCost?: number;
    batteryUnits?: number;
  };
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

function summarize(project: ProjectShape) {
  const data = project?.data ?? {};
  const totals = project?.totals ?? {};
  const dailyWh = totals.dailyWh ?? computeDailyWhFromAppliances(data.appliances ?? []);
  const sunHours = data.sunHours ?? 5;
  const designMargin = data.designMargin ?? 20;
  const recommendedPVW =
    totals.recommendedPVW ??
    Math.ceil((dailyWh / Math.max(1, sunHours)) * (1 + designMargin / 100));
  const panelWattage = data.panelWattage ?? 300;
  const numberOfPanels = totals.numberOfPanels ?? Math.max(1, Math.ceil(recommendedPVW / panelWattage));
  const totalEstimatedCost = totals.totalEstimatedCost ?? (data.panelUnitCost ?? 0) * numberOfPanels;

  const batterySizing = sizeBatteries({
    dailyWh,
    autonomyDays: data.autonomyDays ?? 1,
    systemVoltage: data.systemVoltage ?? 48,
    batteryNominalV: data.batteryNominalV ?? 12,
    batteryAhPerUnit: data.batteryUnitAh ?? 200,
    depthOfDischarge: data.depthOfDischarge ?? 0.5,
    inverterEfficiency: data.inverterEfficiency ?? 0.9
  });

  return {
    dailyWh,
    recommendedPVW,
    numberOfPanels,
    totalEstimatedCost,
    batteryUnits: batterySizing.totalUnits,
    batterySeries: batterySizing.seriesCount,
    batteryParallel: batterySizing.parallelStrings,
    batterySizing
  };
}

/** Minimal equipment catalogue used for display only */
const DEFAULT_CATALOGUE = {
  batteries: [
    { id: "bat-lfp-200", name: "LiFePO4 12V 200Ah", chemistry: "lithium", nominalV: 12, Ah: 200, unitCostUSD: 600, weightKg: 25 },
    { id: "bat-agm-200", name: "AGM 12V 200Ah", chemistry: "lead-acid", nominalV: 12, Ah: 200, unitCostUSD: 220, weightKg: 30 }
  ],
  panels: [{ id: "panel-300", name: "Panel 300W", watt: 300, areaM2: 1.7, unitCostUSD: 120 }],
  inverters: [{ id: "inv-3k", name: "Inverter 3kW", powerW: 3000, efficiency: 0.95, unitCostUSD: 350 }]
};

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

/** Sensitivity analysis: vary unit cost and DOD by percentages and recompute recommendation */
function computeSensitivity(project: ProjectShape) {
  const baseLithium = sizeForChemistry(project, "lithium");
  const baseLead = sizeForChemistry(project, "lead-acid");

  const scenarios: { scenario: string; params: any; lithium: number; lead: number; recommended: string }[] = [];
  const deltas = [-0.2, -0.1, 0.1, 0.2];

  deltas.forEach((d) => {
    const p = JSON.parse(JSON.stringify(project));
    const baseCost = project.data?.batteryUnitCost ?? 500;
    p.data = { ...(p.data ?? {}), batteryUnitCost: Math.round(baseCost * (1 + d)) };
    const l = sizeForChemistry(p, "lithium");
    const ld = sizeForChemistry(p, "lead-acid");
    const rec = l.lifecycleCost <= ld.lifecycleCost ? "lithium" : "lead-acid";
    scenarios.push({
      scenario: `Battery cost ${Math.round(d * 100)}%`,
      params: { batteryUnitCost: p.data.batteryUnitCost },
      lithium: Math.round(l.lifecycleCost),
      lead: Math.round(ld.lifecycleCost),
      recommended: rec
    });
  });

  deltas.forEach((d) => {
    const p = JSON.parse(JSON.stringify(project));
    const baseDod = project.data?.depthOfDischarge ?? 0.5;
    const newDod = Math.max(0.1, Math.min(0.95, baseDod * (1 + d)));
    p.data = { ...(p.data ?? {}), depthOfDischarge: newDod };
    const l = sizeForChemistry(p, "lithium");
    const ld = sizeForChemistry(p, "lead-acid");
    const rec = l.lifecycleCost <= ld.lifecycleCost ? "lithium" : "lead-acid";
    scenarios.push({
      scenario: `DOD ${Math.round(d * 100)}%`,
      params: { depthOfDischarge: newDod },
      lithium: Math.round(l.lifecycleCost),
      lead: Math.round(ld.lifecycleCost),
      recommended: rec
    });
  });

  return {
    base: { lithium: Math.round(baseLithium.lifecycleCost), lead: Math.round(baseLead.lifecycleCost) },
    scenarios
  };
}

export default function ComparePlaceholder() {
  const localRaw = localStorage.getItem("solarhome-local") || "{}";
  const localProject: ProjectShape = safeParse(localRaw) || { data: {}, totals: {} };

  const [otherRaw, setOtherRaw] = useState<string>("");
  const otherProject: ProjectShape | null = useMemo(() => safeParse(otherRaw), [otherRaw]);

  const [catalogue] = useState(DEFAULT_CATALOGUE);
  const [chemistryView, setChemistryView] = useState<"both" | "lithium" | "lead-acid">("both");

  const left = useMemo(() => summarize(localProject), [localRaw]);
  const right = useMemo(() => (otherProject ? summarize(otherProject) : null), [otherRaw]);

  const localLithium = useMemo(() => sizeForChemistry(localProject, "lithium"), [localRaw]);
  const localLead = useMemo(() => sizeForChemistry(localProject, "lead-acid"), [localRaw]);

  const recommendedChemistry = useMemo(() => {
    return localLithium.lifecycleCost <= localLead.lifecycleCost ? "lithium" : "lead-acid";
  }, [localLithium, localLead]);

  const sensitivity = useMemo(() => computeSensitivity(localProject), [localRaw]);

  const [isOpening, setIsOpening] = useState(false);

  function buildRecommendationPayload() {
    const rec = recommendedChemistry;
    const chosen = rec === "lithium" ? localLithium : localLead;
    const other = rec === "lithium" ? localLead : localLithium;
    const projectName = (localProject.data?.projectName ?? "local-project").replace(/\s+/g, "-");

    const pvW = left.recommendedPVW;
    const panels = left.numberOfPanels;
    const inverterEstimateW = Math.max(1500, Math.ceil((left.dailyWh || 1500) * 1.25));
    const batteryConfig = `${chosen.sizing.seriesCount}S × ${chosen.sizing.parallelStrings}P (${chosen.sizing.totalUnits} units)`;

    const summary = {
      recommended: rec,
      reason: `Lifecycle cost ${Math.round(chosen.lifecycleCost)} vs ${Math.round(other.lifecycleCost)}`,
      pvW,
      panels,
      inverterEstimateW,
      batteryConfig,
      lifecycleCost: Math.round(chosen.lifecycleCost)
    };

    return {
      version: "v1",
      sourceTab: "Compare",
      generatedAt: new Date().toISOString(),
      projectName,
      summary,
      sensitivity
    };
  }

  function downloadJsonRecommendation() {
    const payload = buildRecommendationPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${payload.projectName}-recommendation-${payload.version}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function openPrintableRecommendation() {
    // Prevent re-entry / double open
    if (isOpening) return;
    setIsOpening(true);

    const payload = buildRecommendationPayload();
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Recommendation - ${payload.projectName}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; padding: 24px; }
            h1 { color: #0b7285; margin-bottom: 6px; }
            .card { border: 1px solid #e6f6f5; padding: 12px; border-radius: 6px; background: #fbfffe; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            .muted { color: #666; font-size: 12px; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body>
          <h1>Project Recommendation</h1>
          <div class="card">
            <div style="font-weight:700; margin-bottom:8px;">${payload.projectName}</div>
            <div style="margin-bottom:8px;"><strong>Recommended chemistry:</strong> ${payload.summary.recommended.toUpperCase()}</div>
            <div style="margin-bottom:8px;"><strong>Reason:</strong> ${payload.summary.reason}</div>
            <div><strong>PV</strong>: ${payload.summary.pvW} W (${payload.summary.panels} × ${catalogue.panels[0].watt}W)</div>
            <div><strong>Inverter estimate</strong>: ~${payload.summary.inverterEstimateW} W</div>
            <div><strong>Battery bank</strong>: ${payload.summary.batteryConfig}</div>

            <div style="margin-top:12px;">
              <strong>Sensitivity snapshot</strong>
              <table>
                <thead><tr><th>Scenario</th><th>Recommended</th><th>Lithium $</th><th>Lead $</th></tr></thead>
                <tbody>
                  ${payload.sensitivity.scenarios.map((s: any) => `
                    <tr>
                      <td>${s.scenario}</td>
                      <td>${s.recommended}</td>
                      <td>$${s.lithium}</td>
                      <td>$${s.lead}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <div style="margin-top:12px;" class="muted">Export version: ${payload.version}</div>
          </div>

          <script>
            try { setTimeout(() => { window.print(); }, 300); } catch (e) {}
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    try {
      // Primary: open blob URL in new tab/window
      const newWin = window.open(url, "_blank", "noopener,noreferrer");
      if (newWin) {
        try { newWin.focus(); } catch {}
        // revoke after a short delay to allow browser to load
        setTimeout(() => {
          try { URL.revokeObjectURL(url); } catch {}
          setIsOpening(false);
        }, 2000);
        return;
      }

      // If window.open returned null (blocked), fallback to download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${payload.projectName}-recommendation-${payload.version}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch {}
        setIsOpening(false);
      }, 1500);
      alert("Popup blocked. A printable HTML file was downloaded — open it and print from your browser.");
      return;
    } catch (err) {
      // Final fallback: copy HTML to clipboard
      try {
        await navigator.clipboard?.writeText(html);
        alert("Printable HTML copied to clipboard — paste into a file and open it to print.");
      } catch {
        alert("Printable export failed. Please allow popups for this site or use the Export recommendation (JSON) button.");
      } finally {
        try { URL.revokeObjectURL(url); } catch {}
        setIsOpening(false);
      }
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Compare Projects and Recommendations</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: 16 }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Current local project</div>

          <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, background: "#fff" }}>
            <div><strong>Daily Wh</strong> {left.dailyWh}</div>
            <div><strong>Recommended PV W</strong> {left.recommendedPVW}</div>
            <div><strong>Panels</strong> {left.numberOfPanels}</div>
            <div><strong>Estimated cost</strong> ${left.totalEstimatedCost}</div>

            <div style={{ marginTop: 8 }}>
              <strong>Batteries (default)</strong> {left.batteryUnits} units ({left.batterySeries}S × {left.batteryParallel}P)
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Chemistry comparison</div>

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, border: "1px solid #eee", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontWeight: 700 }}>Lithium</div>
                  <div>Units: {localLithium.sizing.totalUnits}</div>
                  <div>Config: {localLithium.sizing.seriesCount}S × {localLithium.sizing.parallelStrings}P</div>
                  <div>Lifecycle cost est: ${Math.round(localLithium.lifecycleCost)}</div>
                </div>

                <div style={{ flex: 1, border: "1px solid #eee", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontWeight: 700 }}>Lead Acid</div>
                  <div>Units: {localLead.sizing.totalUnits}</div>
                  <div>Config: {localLead.sizing.seriesCount}S × {localLead.sizing.parallelStrings}P</div>
                  <div>Lifecycle cost est: ${Math.round(localLead.lifecycleCost)}</div>
                </div>
              </div>

              <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
                Lithium has higher upfront cost but fewer replacements and higher usable capacity. Lead acid is cheaper initially but may need replacement multiple times.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ border: "1px solid #e6f6f5", padding: 12, borderRadius: 6, background: "#f8fffe" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Smarter Recommendation</div>

              <div style={{ marginBottom: 8 }}>
                <strong>Recommended chemistry</strong> <span style={{ color: "#0b7285", fontWeight: 700 }}>{recommendedChemistry.toUpperCase()}</span>
              </div>

              <div style={{ fontSize: 13, color: "#444", marginBottom: 8 }}>
                Reason: estimated lifecycle cost ${Math.round(recommendedChemistry === "lithium" ? localLithium.lifecycleCost : localLead.lifecycleCost)}.
              </div>

              <div style={{ marginTop: 8 }}>
                <div><strong>Recommended PV</strong> {left.recommendedPVW} W ({left.numberOfPanels} × {catalogue.panels[0].watt}W)</div>
                <div style={{ marginTop: 6 }}><strong>Battery bank (recommended)</strong> {recommendedChemistry === "lithium" ? `${localLithium.sizing.seriesCount}S × ${localLithium.sizing.parallelStrings}P (${localLithium.sizing.totalUnits} units)` : `${localLead.sizing.seriesCount}S × ${localLead.sizing.parallelStrings}P (${localLead.sizing.totalUnits} units)`}</div>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={downloadJsonRecommendation}>Export recommendation (JSON)</button>
                <button onClick={openPrintableRecommendation} disabled={isOpening}>
                  {isOpening ? "Opening…" : "Open printable recommendation"}
                </button>
                <button onClick={() => setChemistryView(recommendedChemistry === "lithium" ? "lithium" : "lead-acid")} style={{ marginLeft: 8 }}>
                  View {recommendedChemistry} details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Paste another project JSON to compare</div>

          <textarea
            value={otherRaw}
            onChange={(e) => setOtherRaw(e.target.value)}
            placeholder='Paste JSON here (e.g. {"data":{...},"totals":{...}})'
            style={{ width: "100%", height: 220, padding: 8, fontFamily: "monospace", fontSize: 13 }}
          />

          <div style={{ marginTop: 8 }}>
            <button onClick={() => {
              navigator.clipboard?.readText().then(text => setOtherRaw(text)).catch(() => {
                alert("Clipboard read not available. Paste JSON into the box.");
              });
            }}>Paste from clipboard</button>

            <button onClick={() => setOtherRaw("")} style={{ marginLeft: 8 }}>Clear</button>
          </div>

          <div style={{ marginTop: 12 }}>
            {right ? (
              <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Comparison</div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: 6 }}></th>
                      <th style={{ textAlign: "right", padding: 6 }}>Local</th>
                      <th style={{ textAlign: "right", padding: 6 }}>Other</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 6 }}>Daily Wh</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{left.dailyWh}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{right.dailyWh}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Recommended PV W</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{left.recommendedPVW}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{right.recommendedPVW}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Panels</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{left.numberOfPanels}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{right.numberOfPanels}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Estimated cost</td>
                      <td style={{ padding: 6, textAlign: "right" }}>${left.totalEstimatedCost}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>${right.totalEstimatedCost}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Batteries (units)</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{left.batteryUnits}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{right.batteryUnits}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Battery config</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{left.batterySeries}S × {left.batteryParallel}P</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{right.batterySeries}S × {right.batteryParallel}P</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Lithium lifecycle est</td>
                      <td style={{ padding: 6, textAlign: "right" }}>${Math.round(localLithium.lifecycleCost)}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{otherProject ? `$${Math.round(sizeForChemistry(otherProject, "lithium").lifecycleCost)}` : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 6 }}>Lead acid lifecycle est</td>
                      <td style={{ padding: 6, textAlign: "right" }}>${Math.round(localLead.lifecycleCost)}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{otherProject ? `$${Math.round(sizeForChemistry(otherProject, "lead-acid").lifecycleCost)}` : "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#666", fontSize: 13 }}>No other project parsed yet. Paste a project JSON to compare.</div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>View chemistry</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setChemistryView("both")} style={{ background: chemistryView === "both" ? "#ecfeff" : undefined }}>Both</button>
              <button onClick={() => setChemistryView("lithium")} style={{ background: chemistryView === "lithium" ? "#ecfeff" : undefined }}>Lithium</button>
              <button onClick={() => setChemistryView("lead-acid")} style={{ background: chemistryView === "lead-acid" ? "#ecfeff" : undefined }}>Lead Acid</button>
            </div>

            <div style={{ marginTop: 8 }}>
              {chemistryView === "both" || chemistryView === "lithium" ? (
                <div style={{ border: "1px solid #eee", padding: 8, borderRadius: 6, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>Lithium (project)</div>
                  <div>Units: {localLithium.sizing.totalUnits}</div>
                  <div>Config: {localLithium.sizing.seriesCount}S × {localLithium.sizing.parallelStrings}P</div>
                  <div>Lifecycle cost est: ${Math.round(localLithium.lifecycleCost)}</div>
                </div>
              ) : null}

              {chemistryView === "both" || chemistryView === "lead-acid" ? (
                <div style={{ border: "1px solid #eee", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontWeight: 700 }}>Lead Acid (project)</div>
                  <div>Units: {localLead.sizing.totalUnits}</div>
                  <div>Config: {localLead.sizing.seriesCount}S × {localLead.sizing.parallelStrings}P</div>
                  <div>Lifecycle cost est: ${Math.round(localLead.lifecycleCost)}</div>
                </div>
              ) : null}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Sensitivity snapshot</div>
              <div style={{ border: "1px solid #eee", padding: 8, borderRadius: 6, background: "#fff" }}>
                <div style={{ fontSize: 13, marginBottom: 8 }}>Base lifecycle costs — Lithium: ${sensitivity.base.lithium} · Lead: ${sensitivity.base.lead}</div>
                <div style={{ maxHeight: 220, overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: 6 }}>Scenario</th>
                        <th style={{ textAlign: "right", padding: 6 }}>Recommended</th>
                        <th style={{ textAlign: "right", padding: 6 }}>Lithium $</th>
                        <th style={{ textAlign: "right", padding: 6 }}>Lead $</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivity.scenarios.map((s: any, i: number) => (
                        <tr key={i}>
                          <td style={{ padding: 6 }}>{s.scenario}</td>
                          <td style={{ padding: 6, textAlign: "right" }}>{s.recommended}</td>
                          <td style={{ padding: 6, textAlign: "right" }}>${s.lithium}</td>
                          <td style={{ padding: 6, textAlign: "right" }}>${s.lead}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                  Sensitivity scenarios show how the recommendation changes when unit cost or DOD varies by ±10–20%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}