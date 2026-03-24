// src/domain/solarPlan/computeSolarPlan.ts
import {
  PlannerFormData,
  SolarPlanResult,
  ApplianceInput,
} from "./types";

/**
 * computeSolarPlan
 *
 * Pure function: given PlannerFormData, returns SolarPlanResult.
 * Keep formulas simple and explicit so they are easy to test and adjust.
 */
export function computeSolarPlan(form: PlannerFormData): SolarPlanResult {
  const { appliances, site, battery, inverter, solarArray } = form;

  // 1) Total daily energy (Wh)
  const totalDailyWh = appliances.reduce((sum: number, a: ApplianceInput) => {
    const applianceWh = (a.watts || 0) * (a.hours || 0) * (a.qty || 0);
    return sum + applianceWh;
  }, 0);

  // 2) Peak power (W) — conservative: sum of nameplate watts * qty
  const peakWatts = appliances.reduce((sum: number, a: ApplianceInput) => {
    return sum + (a.watts || 0) * (a.qty || 0);
  }, 0);

  // 3) Inverter sizing
  const recommendedInverterW = Math.ceil((peakWatts || 0) * (inverter?.surgeFactor || 1.2));

  // 4) Battery sizing (Wh)
  // BatteryWh = (DailyLoad * AutonomyHours) / (DoD * inverterEfficiency)
  const autonomyHours = battery?.autonomyHours ?? 0;
  const dod = battery?.depthOfDischarge ?? 0.8;
  const invEff = battery?.inverterEfficiency ?? 0.9;
  const rawBatteryWh =
    (totalDailyWh * autonomyHours) / Math.max(dod * invEff, 0.0001);

  const batteryWhRequired = rawBatteryWh * (1 + (battery?.safetyMargin ?? 0.15));

  // Convert to Ah at system voltage
  const systemVoltage = battery?.systemVoltage || 48;
  const batteryAhAtSystemVoltage = batteryWhRequired / Math.max(systemVoltage, 1);

  // Default assumed battery capacity (Ah) per battery — parameterize later
  const assumedBatteryAh = 200;
  const batteryCount = Math.max(0, Math.ceil(batteryAhAtSystemVoltage / assumedBatteryAh));

  // 5) Solar array sizing
  // Base solar watts required = totalDailyWh / sunHours
  const sunHours = Math.max(site?.sunHours ?? 1, 0.1);
  const baseSolarW = totalDailyWh / sunHours;
  const solarArrayWRequired = baseSolarW * (1 + (solarArray?.safetyMargin ?? 0.15));
  const solarPanelCount = Math.max(
    0,
    Math.ceil(solarArrayWRequired / Math.max(solarArray?.panelWattage ?? 1, 1))
  );

  // 6) Notes and heuristics
  const notes: string[] = [];

  if ((site?.sunHours ?? 0) < 3) {
    notes.push("Low sun hours: consider larger array or hybrid system.");
  }

  if ((battery?.depthOfDischarge ?? 0) > 0.8) {
    notes.push("High depth of discharge: may reduce battery lifespan.");
  }

  if ((battery?.autonomyHours ?? 0) > 24) {
    notes.push("Very high autonomy: check if this is really needed.");
  }

  if (totalDailyWh === 0) {
    notes.push("No appliance load entered yet.");
  }

  const result: SolarPlanResult = {
    totalDailyWh: Math.round(totalDailyWh),
    peakWatts: Math.round(peakWatts),
    recommendedInverterW: Math.round(recommendedInverterW),
    batteryWhRequired: Math.round(batteryWhRequired),
    batteryAhAtSystemVoltage: Math.round(batteryAhAtSystemVoltage),
    batteryCount,
    solarArrayWRequired: Math.round(solarArrayWRequired),
    solarPanelCount,
    autonomyHoursEstimated: autonomyHours,
    notes,
  };

  return result;
}