// src/domain/solarPlan/schema.ts
import { z } from "zod";

export const ApplianceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  watts: z.number().min(0, "Watts must be >= 0"),
  qty: z.number().int().min(1, "Quantity must be >= 1"),
  hours: z.number().min(0).max(24, "Hours must be 0-24"),
});

export const SiteSchema = z.object({
  location: z.string().optional(),
  sunHours: z.number().min(0).max(24),
  gridAvailable: z.boolean().optional(),
});

export const BatterySchema = z.object({
  systemVoltage: z.number().refine((v) => [12, 24, 48].includes(v), {
    message: "System voltage must be 12, 24, or 48",
  }),
  autonomyHours: z.number().min(0),
  depthOfDischarge: z.number().min(0.1).max(1),
  inverterEfficiency: z.number().min(0.5).max(1),
  safetyMargin: z.number().min(0).max(1),
});

export const InverterSchema = z.object({
  surgeFactor: z.number().min(1).max(3),
});

export const SolarArraySchema = z.object({
  panelWattage: z.number().min(1),
  safetyMargin: z.number().min(0).max(1),
});

export const PlannerFormSchema = z.object({
  appliances: z.array(ApplianceSchema).min(1),
  site: SiteSchema,
  battery: BatterySchema,
  inverter: InverterSchema,
  solarArray: SolarArraySchema,
});

export type PlannerFormSchemaType = z.infer<typeof PlannerFormSchema>;