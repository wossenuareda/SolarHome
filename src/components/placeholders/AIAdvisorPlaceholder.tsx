// src/components/placeholders/AIAdvisorPlaceholder.tsx
import React, { useMemo, useState } from "react";
import { sizeBatteries } from "@/lib/battery";

/**
 * AI Advisor Placeholder
 * - Reads current project from localStorage ("solarhome-local")
 * - Analyzes loads, PV sizing, battery sizing for lithium vs lead-acid
 * - Produces a professional executive summary, recommended architecture,
 *   prioritized action plan, and equipment suggestions from a local catalogue.
 *
 * Paste this file as src/components/placeholders/AIAdvisorPlaceholder.tsx
 */

type ProjectShape = {
  data?: any;
  totals?: any;
};

const DEFAULT_CATALOGUE = {
  batteries: [
    { id: "bat-lfp-200", name: "LiFePO4 12V 200Ah", chemistry: "lithium", nominalV: 12, Ah: 200, unitCostUSD: 600, weightKg: 25 },
    { id: "bat-lfp-300", name: "LiFePO4 12V 300Ah", chemistry: "lithium", nominalV: 12, Ah: 300, unitCostUSD: 900, weightKg: 36 },
    { id: "bat-agm-200", name: "AGM 12V 200Ah", chemistry: "lead-acid", nominalV: 12, Ah: 200, unitCostUSD: 220, weightKg: 30 },
    { id: "bat-fld-200", name: "Flooded 12V 200Ah", chemistry: "lead-acid", nominalV: 12, Ah: 200, unitCostUSD: 180, weightKg: 32 }
  ],
  inverters: [
    { id: "inv-3k", name: "Inverter 3kW", powerW: 3000, efficiency: 0.95, unitCostUSD: 350 },
    { id: "inv-5k", name: "Inverter 5kW", powerW: 5000, efficiency: 0.95, unitCostUSD: 600 }
  ],
  panels: [
    { id: "panel-300", name: "Panel 300W", watt: 300, areaM2: 1.7, unitCostUSD: 120 }
  ]
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
  return (appliances || []).reduce((s, a) => s + (Number(a?.watts || 0) * Number(a?.qty || 0) * Number(a?.hours || 0)), 0);
}

function recommendInverterSize(peakLoadW: number) {
  // Add margin for startup loads and future growth
  const recommended = Math.ceil(peakLoadW * 1.25 / 500) * 500;
  return recommended;
}

function recommendPV(dailyWh: number, sunHours: number, designMarginPct: number, panelWatt: number) {
  const pvW = Math.ceil((dailyWh / Math.max(1, sunHours)) * (1 + designMarginPct / 100));
  const panels = Math.ceil(pvW / panelWatt);
  return { pvW, panels };
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

function scoreChemistryTradeoffs(project: ProjectShape) {
  const lithium = sizeForChemistry(project, "lithium");
  const lead = sizeForChemistry(project, "lead-acid");

  // Score: lower lifecycle cost preferred; penalize weight/space issues
  const data = project?.data ?? {};
  const roofAreaLimit = data.siteConstraints?.roofAreaM2 ?? Infinity;
  const weightLimitKg = data.siteConstraints?.weightLimitKg ?? Infinity;

  // approximate weight: choose a representative battery from catalogue (200Ah)
  const lithiumWeight = lithium.sizing.totalUnits * 25; // rough
  const leadWeight = lead.sizing.totalUnits * 30; // rough

  const costScore = (lead.lifecycleCost - lithium.lifecycleCost); // positive favors lithium
  const fitPenaltyLithium = (lithiumWeight > weightLimitKg || 0) ? -10000 : 0;
  const fitPenaltyLead = (leadWeight > weightLimitKg || 0) ? -10000 : 0;

  const lithiumScore = costScore + fitPenaltyLithium;
  const leadScore = -costScore + fitPenaltyLead;

  const recommended = lithiumScore >= leadScore ? "lithium" : "lead-acid";

  return { lithium, lead, recommended, lithiumWeight, leadWeight };
}

export default function AIAdvisorPlaceholder() {
  const raw = localStorage.getItem("solarhome-local") || "{}";
  const project: ProjectShape = safeParse(raw) || { data: {}, totals: {} };

  const catalogue = DEFAULT_CATALOGUE;

  const dailyWh = useMemo(() => computeDailyWhFromAppliances(project.data?.appliances ?? []), [raw]);
  const peakLoadW = useMemo(() => {
    // estimate peak as sum of (watts * qty) for appliances (conservative)
    return (project.data?.appliances || []).reduce((s: number, a: any) => s + (Number(a?.watts || 0) * Number(a?.qty || 0)), 0);
  }, [raw]);

  const pvRecommendation = useMemo(() => recommendPV(dailyWh, project.data?.sunHours ?? 5, project.data?.designMargin ?? 20, catalogue.panels[0].watt), [raw]);
  const inverterRecommendationW = useMemo(() => recommendInverterSize(peakLoadW), [raw]);

  const chemistryAnalysis = useMemo(() => scoreChemistryTradeoffs(project), [raw]);

  const [notes, setNotes] = useState<string>("");

  function generateExecutiveSummary() {
    const rec = chemistryAnalysis.recommended;
    const chosen = rec === "lithium" ? chemistryAnalysis.lithium : chemistryAnalysis.lead;
    const summaryLines = [
      `Executive summary — ${project.data?.projectName ?? "Untitled project"}`,
      `Daily energy demand: ${Math.round(dailyWh)} Wh/day.`,
      `Recommended PV capacity: ${pvRecommendation.pvW} W (${pvRecommendation.panels} × ${catalogue.panels[0].watt}W panels).`,
      `Estimated inverter sizing: ${inverterRecommendationW} W (recommended to cover peak loads and startup currents).`,
      `Battery recommendation: ${rec.toUpperCase()} bank — ${chosen.sizing.totalUnits} units (${chosen.sizing.seriesCount}S × ${chosen.sizing.parallelStrings}P).`,
      `Estimated lifecycle cost (20 years): $${Math.round(chosen.lifecycleCost)}.`,
      `Rationale: ${rec === "lithium" ? "Higher usable capacity and longer life; lower lifecycle cost in this scenario." : "Lower upfront cost; acceptable if cycles are infrequent and budget constrained."}`
    ];
    return summaryLines.join("\n");
  }

  function buildActionPlan() {
    const steps: { title: string; detail: string }[] = [];

    steps.push({
      title: "Confirm site constraints",
      detail: "Verify roof area, mounting orientation, shading, and structural weight limits. If weight or space is constrained, prefer lithium chemistry."
    });

    steps.push({
      title: "Finalize PV layout",
      detail: `Install ${pvRecommendation.panels} × ${catalogue.panels[0].watt}W panels (total ${pvRecommendation.pvW} W). Confirm array orientation and stringing with installer.`
    });

    steps.push({
      title: "Select inverter",
      detail: `Choose an inverter ≥ ${inverterRecommendationW} W with good surge capability and high efficiency (≥95%). Consider a hybrid inverter if grid-interactive operation is required.`
    });

    steps.push({
      title: "Select battery bank",
      detail: `Procure battery bank matching recommended chemistry: ${chemistryAnalysis.recommended.toUpperCase()} — ${chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.totalUnits} units. Validate BMS and charge controller compatibility.`
    });

    steps.push({
      title: "Plan installation and commissioning",
      detail: "Engage a certified installer for mounting, wiring, earthing, and commissioning. Include testing of inverter, battery management, and safety interlocks."
    });

    steps.push({
      title: "Define maintenance and replacement schedule",
      detail: chemistryAnalysis.recommended === "lithium"
        ? "Minimal scheduled maintenance; monitor BMS and state of charge. Expect replacement after ~12 years."
        : "Schedule periodic inspections, electrolyte checks (if flooded), and plan for replacement every ~4 years."
    });

    return steps;
  }

  const executiveSummary = useMemo(() => generateExecutiveSummary(), [raw, notes]);
  const actionPlan = useMemo(() => buildActionPlan(), [raw]);

  function exportReport() {
    const report = {
      projectName: project.data?.projectName ?? "Untitled",
      dailyWh,
      pvRecommendation,
      inverterRecommendationW,
      chemistryRecommendation: chemistryAnalysis.recommended,
      lithium: {
        units: chemistryAnalysis.lithium.sizing.totalUnits,
        lifecycleCost: Math.round(chemistryAnalysis.lithium.lifecycleCost)
      },
      leadAcid: {
        units: chemistryAnalysis.lead.sizing.totalUnits,
        lifecycleCost: Math.round(chemistryAnalysis.lead.lifecycleCost)
      },
      notes
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-advisor-report-${(project.data?.projectName ?? "project").replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Professional summary card content
  return (
    <div style={{ padding: 12 }}>
      <h3>AI Advisor — Professional System Recommendation</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
        <div>
          <div style={{ border: "1px solid #eef6f5", padding: 12, borderRadius: 6, background: "#fbfffe" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Executive Summary</div>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{executiveSummary}</pre>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Recommended Architecture</div>
            <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6 }}>
              <div><strong>PV</strong>: {pvRecommendation.pvW} W — {pvRecommendation.panels} × {catalogue.panels[0].watt}W panels</div>
              <div><strong>Inverter</strong>: ~{inverterRecommendationW} W (select inverter with surge capability and 95%+ efficiency)</div>
              <div style={{ marginTop: 6 }}><strong>Battery bank</strong>: {chemistryAnalysis.recommended.toUpperCase()} — {chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.totalUnits} units ({chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.seriesCount}S × {chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.parallelStrings}P)</div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
                Notes: This recommendation balances lifecycle cost, usable capacity, and site fit. Adjust unit costs and site constraints in Planner to refine results.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Action Plan (prioritized)</div>
            <ol>
              {actionPlan.map((s, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#444" }}>{s.detail}</div>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Equipment Suggestions</div>
            <div style={{ border: "1px solid #eee", padding: 8, borderRadius: 6 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Top battery picks</div>
              {catalogue.batteries.map((b: any) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f6f6f6" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{b.nominalV}V · {b.Ah}Ah · {b.chemistry}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>${b.unitCostUSD}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{b.weightKg} kg</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, fontWeight: 700 }}>Recommended inverter options</div>
              {catalogue.inverters.map((inv: any) => (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f6f6f6" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{inv.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{inv.powerW} W · {Math.round(inv.efficiency * 100)}% eff</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>${inv.unitCostUSD}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Notes & custom remarks</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add project-specific notes or constraints here" style={{ width: "100%", minHeight: 80, padding: 8 }} />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={exportReport}>Export report (JSON)</button>
              <button onClick={() => {
                // quick copy executive summary to clipboard
                navigator.clipboard?.writeText(executiveSummary).then(() => {
                  alert("Executive summary copied to clipboard");
                }).catch(() => {
                  alert("Copy not available");
                });
              }}>Copy executive summary</button>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick diagnostics</div>

          <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, background: "#fff" }}>
            <div><strong>Daily energy</strong> {Math.round(dailyWh)} Wh/day</div>
            <div><strong>Peak load (est)</strong> {Math.round(peakLoadW)} W</div>
            <div><strong>PV recommendation</strong> {pvRecommendation.pvW} W ({pvRecommendation.panels} panels)</div>
            <div><strong>Inverter</strong> ~{inverterRecommendationW} W</div>

            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 700 }}>Chemistry comparison</div>
              <div style={{ marginTop: 6 }}>
                <div style={{ marginBottom: 6 }}><strong>Lithium</strong>: {chemistryAnalysis.lithium.sizing.totalUnits} units · lifecycle est ${Math.round(chemistryAnalysis.lithium.lifecycleCost)}</div>
                <div style={{ marginBottom: 6 }}><strong>Lead acid</strong>: {chemistryAnalysis.lead.sizing.totalUnits} units · lifecycle est ${Math.round(chemistryAnalysis.lead.lifecycleCost)}</div>
                <div style={{ fontSize: 13, color: "#666" }}><strong>Recommended:</strong> {chemistryAnalysis.recommended.toUpperCase()}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700 }}>Confidence & tradeoffs</div>
              <div style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
                Confidence is based on lifecycle cost and site fit. If you change unit costs, autonomy, or site constraints in Planner, the recommendation will update.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Professional tips</div>
            <ul>
              <li>Validate site shading with a sun-path or shading analysis before finalizing panel layout.</li>
              <li>Specify a battery management system (BMS) and ensure inverter/charger compatibility with chosen chemistry.</li>
              <li>Include surge margin for motors and pumps when sizing the inverter.</li>
              <li>Plan for safe battery enclosure, ventilation (for flooded lead-acid), and weight distribution.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}