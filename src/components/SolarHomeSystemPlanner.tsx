// src/components/SolarHomeSystemPlanner.tsx
import React, { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { saveProjectCloud, downloadPdf } from "../lib/cloud";
import { useAuthStub } from "../lib/useAuthStub";

import DesignPlaceholder from "./placeholders/DesignPlaceholder";
import ResultsPlaceholder from "./placeholders/ResultsPlaceholder";
import CostPlaceholder from "./placeholders/CostPlaceholder";
import ComparePlaceholder from "./placeholders/ComparePlaceholder";
import AIAdvisorPlaceholder from "./placeholders/AIAdvisorPlaceholder";
import ReportPlaceholder from "./placeholders/ReportPlaceholder";
import DeployPlaceholder from "./placeholders/DeployPlaceholder";

import { sizeBatteries } from "../lib/battery";

const ProjectSchema = z.object({
  projectName: z.string().min(1),
  appliances: z.array(
    z.object({
      name: z.string(),
      watts: z.number(),
      qty: z.number(),
      hours: z.number()
    })
  ),
  sunHours: z.number(),
  autonomyDays: z.number(),
  systemVoltage: z.number(),
  panelWattage: z.number(),
  batteryUnitAh: z.number(),
  batteryNominalV: z.number().optional(),
  depthOfDischarge: z.number().optional(),
  inverterEfficiency: z.number().optional(),
  designMargin: z.number(),
  panelUnitCost: z.number(),
  batteryUnitCost: z.number(),
  inverterUnitCost: z.number(),
  controllerUnitCost: z.number(),
  bosPercent: z.number(),
  installationPercent: z.number()
});

type FormValues = z.infer<typeof ProjectSchema>;

type TabKey =
  | "Planner"
  | "Design"
  | "Results"
  | "Cost"
  | "Compare"
  | "AI Advisor"
  | "Report"
  | "Deploy";

export default function SolarHomeSystemPlanner() {
  const { user, login, logout } = useAuthStub();
  const [lastCloudProjectId, setLastCloudProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Planner");

  const { register, control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      projectName: "My Solar Plan",
      appliances: [{ name: "LED Bulb", watts: 10, qty: 4, hours: 5 }],
      sunHours: 5,
      autonomyDays: 1,
      systemVoltage: 24,
      panelWattage: 300,
      batteryUnitAh: 200,
      batteryNominalV: 12,
      depthOfDischarge: 0.5,
      inverterEfficiency: 0.9,
      designMargin: 20,
      panelUnitCost: 120,
      batteryUnitCost: 500,
      inverterUnitCost: 300,
      controllerUnitCost: 150,
      bosPercent: 20,
      installationPercent: 10
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "appliances" });
  const watched = watch();

  function computeDailyWh(appliances = []) {
    return (appliances || []).reduce(
      (s: number, a: any) => s + (Number(a.watts || 0) * Number(a.qty || 0) * Number(a.hours || 0)),
      0
    );
  }

  const computeTotals = useMemo(() => {
    const dailyWh = computeDailyWh(watched.appliances || []);
    const recommendedPVW = Math.ceil((dailyWh / (watched.sunHours || 1)) * (1 + (watched.designMargin || 0) / 100));
    const numberOfPanels = Math.ceil(recommendedPVW / (watched.panelWattage || 300));
    const totalEstimatedCost = (watched.panelUnitCost || 0) * numberOfPanels;
    return { dailyWh, recommendedPVW, totalEstimatedCost, numberOfPanels };
  }, [watched]);

  const batterySizing = useMemo(() => {
    const dailyWh = computeDailyWh(watched.appliances || []);
    return sizeBatteries({
      dailyWh,
      autonomyDays: watched.autonomyDays ?? 1,
      systemVoltage: watched.systemVoltage ?? 48,
      batteryNominalV: watched.batteryNominalV ?? 12,
      batteryAhPerUnit: watched.batteryUnitAh ?? 200,
      depthOfDischarge: watched.depthOfDischarge ?? 0.5,
      inverterEfficiency: watched.inverterEfficiency ?? 0.9
    });
  }, [watched]);

  const onSaveLocal = (data: FormValues) => {
    const totals = {
      dailyWh: computeTotals.dailyWh,
      recommendedPVW: computeTotals.recommendedPVW,
      numberOfPanels: computeTotals.numberOfPanels,
      totalEstimatedCost: computeTotals.totalEstimatedCost,
      batteryUnits: batterySizing.totalUnits
    };
    localStorage.setItem("solarhome-local", JSON.stringify({ data, totals, savedAt: new Date().toISOString() }));
    alert("Saved on this device");
  };

  const onSaveCloud = async (data: FormValues) => {
    if (!user) {
      alert("Sign in (stub) to save to cloud");
      return;
    }
    setSaving(true);
    try {
      const totals = {
        dailyWh: computeTotals.dailyWh,
        recommendedPVW: computeTotals.recommendedPVW,
        numberOfPanels: computeTotals.numberOfPanels,
        totalEstimatedCost: computeTotals.totalEstimatedCost,
        batteryUnits: batterySizing.totalUnits
      };
      const res = await saveProjectCloud({ ...data, totals });
      setLastCloudProjectId(res.project.id);
      alert("Saved to cloud");
    } catch (err: any) {
      console.error(err);
      alert("Cloud save failed: " + (err?.message ?? "unknown"));
    } finally {
      setSaving(false);
    }
  };

  function renderTab() {
    switch (activeTab) {
      case "Planner":
        return (
          <div>
            <form onSubmit={handleSubmit(onSaveLocal)}>
              <div style={{ marginBottom: 8 }}>
                <label>Project name</label>
                <input {...register("projectName")} style={{ width: "100%" }} />
              </div>

              <div>
                <h4>Appliances</h4>
                {fields.map((f, i) => (
                  <div key={f.id} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input {...register(`appliances.${i}.name` as const)} placeholder="Name" />
                    <input type="number" {...register(`appliances.${i}.watts` as const)} placeholder="Watts" />
                    <input type="number" {...register(`appliances.${i}.qty` as const)} placeholder="Qty" />
                    <input type="number" {...register(`appliances.${i}.hours` as const)} placeholder="Hours/day" />
                    <button type="button" onClick={() => remove(i)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => append({ name: "New", watts: 100, qty: 1, hours: 1 })}>Add</button>
              </div>

              {/* Battery Settings (react-hook-form) */}
              <div style={{ marginTop: 12 }}>
                <h4>Battery Settings</h4>

                <div style={{ marginBottom: 8 }}>
                  <label>System Voltage (V)</label>
                  <select {...register("systemVoltage")}>
                    <option value={12}>12V</option>
                    <option value={24}>24V</option>
                    <option value={48}>48V</option>
                  </select>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Battery Nominal Voltage (V)</label>
                  <select {...register("batteryNominalV")}>
                    <option value={12}>12V</option>
                    <option value={24}>24V</option>
                    <option value={48}>48V</option>
                  </select>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Battery Capacity (Ah)</label>
                  <input type="number" {...register("batteryUnitAh")} />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Depth of Discharge (fraction)</label>
                  <input type="number" step="0.01" {...register("depthOfDischarge")} />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Autonomy (days)</label>
                  <input type="number" {...register("autonomyDays")} />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Inverter Efficiency (fraction)</label>
                  <input type="number" step="0.01" {...register("inverterEfficiency")} />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button type="submit">Save on this device</button>
                <button
                  type="button"
                  disabled={!user || saving}
                  onClick={handleSubmit(onSaveCloud)}
                  style={{ marginLeft: 8 }}
                >
                  {saving ? "Saving..." : user ? "Save to my account" : "Sign in to save"}
                </button>
                {lastCloudProjectId && (
                  <button type="button" onClick={() => downloadPdf(lastCloudProjectId)} style={{ marginLeft: 8 }}>
                    Download PDF
                  </button>
                )}
              </div>

              <aside style={{ marginTop: 16, padding: 12, background: "#fafafa", borderRadius: 6 }}>
                <div><strong>Daily Wh</strong> {computeTotals.dailyWh}</div>
                <div><strong>Recommended PV W</strong> {computeTotals.recommendedPVW}</div>
                <div><strong>Panels</strong> {computeTotals.numberOfPanels}</div>
                <div><strong>Estimated cost</strong> ${computeTotals.totalEstimatedCost}</div>

                <div style={{ marginTop: 8 }}>
                  <strong>Batteries required</strong> {batterySizing.totalUnits} units
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {batterySizing.seriesCount} in series × {batterySizing.parallelStrings} parallel strings; usable Ah per string {batterySizing.usableAhPerString?.toFixed?.(0) ?? "N/A"} Ah.
                </div>
              </aside>
            </form>
          </div>
        );
      case "Design":
        return <DesignPlaceholder />;
      case "Results":
        return <ResultsPlaceholder />;
      case "Cost":
        return <CostPlaceholder />;
      case "Compare":
        return <ComparePlaceholder />;
      case "AI Advisor":
        return <AIAdvisorPlaceholder />;
      case "Report":
        return <ReportPlaceholder />;
      case "Deploy":
        return <DeployPlaceholder />;
      default:
        return null;
    }
  }

  const tabs: TabKey[] = ["Planner", "Design", "Results", "Cost", "Compare", "AI Advisor", "Report", "Deploy"];

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Planner</h2>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>{user.email}</span>
              <button onClick={logout}>Sign out</button>
            </>
          ) : (
            <button onClick={login}>Sign in (stub)</button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: activeTab === t ? "2px solid #0ea5a4" : "1px solid #ddd",
              background: activeTab === t ? "#ecfeff" : "#fff",
              cursor: "pointer"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
}