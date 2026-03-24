// src/domain/solarPlan/types.ts

export type ApplianceInput = {
  id?: string;
  name: string;
  watts: number;
  qty: number;
  hours: number;
};

export type SiteInput = {
  location?: string;
  sunHours: number;
  gridAvailable?: boolean;
};

export type BatteryInput = {
  systemVoltage: number;
  autonomyHours: number;
  depthOfDischarge: number;
  inverterEfficiency: number;
  safetyMargin: number;
};

export type InverterInput = {
  surgeFactor: number;
};

export type SolarArrayInput = {
  panelWattage: number;
  safetyMargin: number;
};

export type PlannerFormData = {
  appliances: ApplianceInput[];
  site: SiteInput;
  battery: BatteryInput;
  inverter: InverterInput;
  solarArray: SolarArrayInput;
};

export type SolarPlanResult = {
  totalDailyWh: number;
  peakWatts: number;
  recommendedInverterW: number;
  batteryWhRequired: number;
  batteryAhAtSystemVoltage: number;
  batteryCount: number;
  solarArrayWRequired: number;
  solarPanelCount: number;
  autonomyHoursEstimated?: number;
  notes: string[];
};