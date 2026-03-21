// src/lib/battery.ts
/**
 * sizeBatteries
 *
 * Inputs:
 *  - dailyWh: number         // daily energy consumption in Wh/day
 *  - autonomyDays: number    // days of autonomy required
 *  - systemVoltage: number   // target system voltage (12, 24, 48)
 *  - batteryNominalV: number // nominal voltage of a single battery (12, 24, etc.)
 *  - batteryAhPerUnit: number// Ah rating of a single battery unit
 *  - depthOfDischarge: number// usable fraction (0.5 for 50%)
 *  - inverterEfficiency: number // fraction (0.9 for 90%)
 *
 * Returns an object with:
 *  - totalUnits: number
 *  - seriesCount: number
 *  - parallelStrings: number
 *  - usableAhPerString: number
 *  - bankNominalV: number
 *  - requiredAhAtSystem: number
 *  - notes: string[]
 *
 * The function is intentionally conservative and defensive: it validates inputs,
 * rounds up where necessary, and returns explanatory notes for edge cases.
 */

export type SizeBatteriesInput = {
  dailyWh: number;
  autonomyDays?: number;
  systemVoltage?: number;
  batteryNominalV?: number;
  batteryAhPerUnit?: number;
  depthOfDischarge?: number;
  inverterEfficiency?: number;
};

export type SizeBatteriesResult = {
  totalUnits: number;
  seriesCount: number;
  parallelStrings: number;
  usableAhPerString: number;
  bankNominalV: number;
  requiredAhAtSystem: number;
  usableWhTotal: number;
  notes: string[];
};

export function sizeBatteries(input: SizeBatteriesInput): SizeBatteriesResult {
  const notes: string[] = [];

  const dailyWh = Number(input.dailyWh || 0);
  const autonomyDays = Number(input.autonomyDays ?? 1);
  const systemVoltage = Number(input.systemVoltage ?? 48);
  const batteryNominalV = Number(input.batteryNominalV ?? 12);
  const batteryAhPerUnit = Number(input.batteryAhPerUnit ?? 200);
  const depthOfDischarge = Number(input.depthOfDischarge ?? 0.5);
  const inverterEfficiency = Number(input.inverterEfficiency ?? 0.9);

  if (dailyWh <= 0) {
    notes.push("dailyWh is zero or missing; result will be zero-sized.");
  }
  if (batteryAhPerUnit <= 0) {
    notes.push("batteryAhPerUnit is zero or missing; defaulting to 200 Ah.");
  }
  if (depthOfDischarge <= 0 || depthOfDischarge > 1) {
    notes.push("depthOfDischarge out of range; using 0.5 (50%).");
  }
  if (inverterEfficiency <= 0 || inverterEfficiency > 1) {
    notes.push("inverterEfficiency out of range; using 0.9 (90%).");
  }

  // 1. Energy required from battery bank (Wh)
  // Account for inverter losses: battery must supply more than load
  const requiredWh = dailyWh * Math.max(1, autonomyDays) / Math.max(0.0001, inverterEfficiency);

  // 2. Convert required Wh to required Ah at system voltage
  const requiredAhAtSystem = requiredWh / Math.max(1, systemVoltage);

  // 3. Usable Ah per single battery unit (Ah)
  const usableAhPerUnit = batteryAhPerUnit * Math.max(0.01, depthOfDischarge);

  // 4. Determine series count to reach or exceed systemVoltage
  // seriesCount = ceil(systemVoltage / batteryNominalV)
  const seriesCount = Math.max(1, Math.ceil(systemVoltage / Math.max(1, batteryNominalV)));
  const bankNominalV = batteryNominalV * seriesCount;

  if (bankNominalV !== systemVoltage) {
    notes.push(
      `Bank nominal voltage ${bankNominalV}V differs from requested system voltage ${systemVoltage}V. ` +
      `Series count rounded to ${seriesCount}. Verify compatibility with inverter and charger.`
    );
  }

  // 5. Usable Ah per string (Ah) equals usableAhPerUnit (since series strings do not increase Ah)
  const usableAhPerString = usableAhPerUnit;

  // 6. Number of parallel strings required to meet requiredAhAtSystem
  // parallelStrings = ceil(requiredAhAtSystem / usableAhPerString)
  const parallelStrings = usableAhPerString > 0 ? Math.max(1, Math.ceil(requiredAhAtSystem / usableAhPerString)) : 0;

  // 7. Total units = seriesCount * parallelStrings
  const totalUnits = seriesCount * parallelStrings;

  // 8. Usable Wh total in bank (approx)
  const usableWhTotal = usableAhPerString * bankNominalV * parallelStrings;

  // Defensive notes
  if (parallelStrings === 0 || totalUnits === 0) {
    notes.push("Calculated zero units. Check inputs for dailyWh, batteryAhPerUnit, and depthOfDischarge.");
  }

  // Return structured result
  return {
    totalUnits,
    seriesCount,
    parallelStrings,
    usableAhPerString,
    bankNominalV,
    requiredAhAtSystem,
    usableWhTotal,
    notes
  };
}

export default sizeBatteries;