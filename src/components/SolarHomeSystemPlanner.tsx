// src/components/SolarHomeSystemPlanner.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { computeSolarPlan } from "../domain/solarPlan/computeSolarPlan";
import { PlannerFormData, ApplianceInput } from "../domain/solarPlan/types";
import { PlannerFormSchema } from "../domain/solarPlan/schema";
import { TRANSLATIONS, Locale } from "../i18n/translations";

type TabKey =
  | "Planner"
  | "Design"
  | "Results"
  | "Cost"
  | "Compare"
  | "AI Advisor"
  | "Report"
  | "Deploy";

function makeId() {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      // @ts-ignore
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return String(Date.now()) + "-" + Math.floor(Math.random() * 10000);
}

const defaultAppliance = (): ApplianceInput => ({
  id: makeId(),
  name: "",
  watts: 0,
  qty: 1,
  hours: 0,
});

const DEFAULT_FORM: PlannerFormData = {
  appliances: [],
  site: {
    location: "",
    sunHours: 5,
    gridAvailable: true,
  },
  battery: {
    systemVoltage: 48,
    autonomyHours: 6,
    depthOfDischarge: 0.8,
    inverterEfficiency: 0.9,
    safetyMargin: 0.15,
  },
  inverter: {
    surgeFactor: 1.2,
  },
  solarArray: {
    panelWattage: 400,
    safetyMargin: 0.15,
  },
};

const LOCAL_STORAGE_KEY = "solarhome.planner.v1";
const LOCALE_STORAGE_KEY = "solarhome.locale";

const APPLIANCE_PRESETS: { id: string; nameKey: string; nameEn: string; watts: number }[] = [
  { id: "light-9w", nameKey: "presets.ledLight", nameEn: "LED Light (9W)", watts: 9 },
  { id: "fan-60w", nameKey: "presets.tv", nameEn: "Ceiling Fan (60W)", watts: 60 },
  { id: "fridge-150w", nameKey: "presets.fridge", nameEn: "Fridge (150W)", watts: 150 },
  { id: "tv-100w", nameKey: "presets.tv", nameEn: "TV (100W)", watts: 100 },
  { id: "laptop-65w", nameKey: "presets.laptop", nameEn: "Laptop Computer (65W)", watts: 65 },
  { id: "ipad-10w", nameKey: "presets.laptop", nameEn: "Tablet (10W)", watts: 10 },
  { id: "wifi-12w", nameKey: "presets.router", nameEn: "WiFi Router (12W)", watts: 12 },
  { id: "phone-5w", nameKey: "presets.phoneCharger", nameEn: "Phone Charger (5W)", watts: 5 },
];

const HOUSEHOLD_PRESETS: {
  id: string;
  nameKey: string;
  nameEn: string;
  appliances: Partial<ApplianceInput>[];
}[] = [
  {
    id: "small-home",
    nameKey: "presets.smallHome",
    nameEn: "Small Home",
    appliances: [
      { name: "LED Light", watts: 9, qty: 4, hours: 4 },
      { name: "Fridge", watts: 150, qty: 1, hours: 24 },
      { name: "TV", watts: 100, qty: 1, hours: 3 },
      { name: "Phone Charger", watts: 5, qty: 2, hours: 2 },
    ],
  },
  {
    id: "medium-home",
    nameKey: "presets.mediumHome",
    nameEn: "Medium Home",
    appliances: [
      { name: "LED Light", watts: 9, qty: 8, hours: 4 },
      { name: "Fridge", watts: 150, qty: 1, hours: 24 },
      { name: "TV", watts: 100, qty: 1, hours: 4 },
      { name: "Laptop", watts: 65, qty: 1, hours: 4 },
      { name: "WiFi Router", watts: 12, qty: 1, hours: 24 },
      { name: "Phone Charger", watts: 5, qty: 4, hours: 2 },
    ],
  },
  {
    id: "large-home",
    nameKey: "presets.largeHome",
    nameEn: "Large Home",
    appliances: [
      { name: "LED Light", watts: 9, qty: 12, hours: 4 },
      { name: "Fridge", watts: 150, qty: 2, hours: 24 },
      { name: "TV", watts: 100, qty: 2, hours: 4 },
      { name: "Laptop", watts: 65, qty: 2, hours: 6 },
      { name: "WiFi Router", watts: 12, qty: 1, hours: 24 },
      { name: "Phone Charger", watts: 5, qty: 6, hours: 2 },
    ],
  },
];

const LOCATION_SUNHOURS_MAP: { [key: string]: number } = {
  "addis ababa": 5.0,
  "nairobi": 5.5,
  "kampala": 5.0,
  "dar es salaam": 5.0,
  "mogadishu": 6.0,
  "juba": 6.0,
  "kigali": 5.0,
  "cairo": 6.0,
  "alexandria": 4.5,
  "rabat": 5.0,
  "algiers": 6.0,
  "tunis": 5.5,
  "tripoli": 6.0,
  "accra": 5.0,
  "abidjan": 5.0,
  "lagos": 5.0,
  "abuja": 5.0,
  "dakar": 5.5,
  "bamako": 5.5,
  "ouagadougou": 5.5,
  "niamey": 6.0,
  "conakry": 5.5,
  "freetown": 5.5,
  "monrovia": 5.5,
  "bissau": 5.5,
  "yaounde": 5.0,
  "brazzaville": 5.0,
  "kinshasa": 5.0,
  "pretoria": 5.5,
  "cape town": 5.0,
  "harare": 4.5,
  "lusaka": 5.0,
  "maputo": 5.5,
  "gaborone": 5.0,
  "windhoek": 5.5,
  "antananarivo": 5.0,
  "port louis": 5.0,
  "moroni": 5.0,
  "new york": 4.5,
  "los angeles": 5.5,
  "sydney": 5.5,
  "mumbai": 5.0,
  "delhi": 5.5,
};

function Info({ text }: { text: string }) {
  return (
    <span
      title={text}
      style={{
        display: "inline-block",
        marginLeft: 8,
        color: "#0ea5a4",
        cursor: "help",
        fontWeight: 600,
      }}
      aria-label={text}
    >
      ℹ️
    </span>
  );
}

export default function SolarHomeSystemPlanner(): JSX.Element {
  const [locale, setLocale] = useState<Locale>("en");

  // t helper: path like "planner.suggestedSunHours"
  const t = (path: string, ...args: any[]) => {
    const parts = path.split(".");
    // @ts-ignore
    let cur: any = TRANSLATIONS[locale];
    for (const p of parts) {
      if (!cur) return path;
      cur = cur[p];
    }
    if (typeof cur === "function") {
      return cur(...args);
    }
    return cur ?? path;
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (saved && ["en", "am", "om"].includes(saved)) {
        setLocale(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const [user, setUser] = useState<{ email: string } | null>(null);
  const login = () => setUser({ email: "user@example.com" });
  const logout = () => setUser(null);

  const [activeTab, setActiveTab] = useState<TabKey>("Planner");
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [locationHint, setLocationHint] = useState<string | null>(null);
  const [suggestedSunHours, setSuggestedSunHours] = useState<number | null>(null);
  const [suggestedLocationLabel, setSuggestedLocationLabel] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PlannerFormData>({
    resolver: zodResolver(PlannerFormSchema) as any,
    defaultValues: DEFAULT_FORM,
    mode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "appliances",
  });

  const watched = watch();
  const currentSunHours = watch("site.sunHours");

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) {
        if (fields.length === 0) {
          replace([defaultAppliance()]);
        }
        return;
      }
      const parsed = JSON.parse(raw) as Partial<PlannerFormData>;
      const merged: PlannerFormData = {
        ...DEFAULT_FORM,
        ...parsed,
        appliances:
          parsed.appliances && parsed.appliances.length > 0
            ? parsed.appliances.map((a) => ({ ...defaultAppliance(), ...a }))
            : [defaultAppliance()],
        site: { ...DEFAULT_FORM.site, ...(parsed.site || {}) },
        battery: { ...DEFAULT_FORM.battery, ...(parsed.battery || {}) },
        inverter: { ...DEFAULT_FORM.inverter, ...(parsed.inverter || {}) },
        solarArray: { ...DEFAULT_FORM.solarArray, ...(parsed.solarArray || {}) },
      };
      reset(merged);
      replace(merged.appliances);
    } catch {
      if (fields.length === 0) {
        replace([defaultAppliance()]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plan = useMemo(() => {
    if (!mounted) return null;
    try {
      return computeSolarPlan(watched as PlannerFormData);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, JSON.stringify(watched)]);

  const saveTimeout = useRef<number | null>(null);
  const saveForm = (data?: PlannerFormData) => {
    const toSave = data ?? (watched as PlannerFormData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (saveTimeout.current) {
      window.clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = window.setTimeout(() => {
      saveForm();
      saveTimeout.current = null;
    }, 800);
    return () => {
      if (saveTimeout.current) {
        window.clearTimeout(saveTimeout.current);
        saveTimeout.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, JSON.stringify(watched)]);

  const handleBlurSave = () => {
    if (!mounted) return;
    saveForm();
  };

  const applyAppliancePreset = (presetId: string) => {
    const preset = APPLIANCE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    append({
      id: makeId(),
      name:
        // @ts-ignore
        TRANSLATIONS[locale].presets[preset.nameKey.split(".")[1] as keyof typeof TRANSLATIONS["en"]["presets"]] ??
        preset.nameEn,
      watts: preset.watts,
      qty: 1,
      hours: 1,
    });
  };

  const applyHouseholdPreset = (presetId: string) => {
    const preset = HOUSEHOLD_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const newAppliances = preset.appliances.map((a) => ({
      id: makeId(),
      name: a.name ?? "",
      watts: a.watts ?? 0,
      qty: a.qty ?? 1,
      hours: a.hours ?? 0,
    }));
    replace(newAppliances);
    setTimeout(() => saveForm({ ...(watched as PlannerFormData), appliances: newAppliances }), 0);
  };

  const handleReset = () => {
    reset(DEFAULT_FORM);
    replace([]);
    setTimeout(() => replace([defaultAppliance()]), 0);
    saveForm(DEFAULT_FORM);
  };

  const wizardSteps = ["Appliances", "Site & Battery", "Review"];
  const nextWizard = () => setWizardStep((s) => Math.min(s + 1, wizardSteps.length - 1));
  const prevWizard = () => setWizardStep((s) => Math.max(s - 1, 0));
  const goToWizardStep = (i: number) => setWizardStep(i);

  const onSubmit = (data: PlannerFormData) => {
    saveForm(data);
    // eslint-disable-next-line no-console
    console.log("Saved form:", data);
    // eslint-disable-next-line no-console
    console.log("Computed plan:", computeSolarPlan(data));
    alert(TRANSLATIONS[locale].planner.saveCompute);
  };

  const fieldError = (path: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = (errors as any);
    const parts = path.split(".");
    let cur = e;
    for (const p of parts) {
      if (!cur) return undefined;
      cur = cur[p];
    }
    return cur?.message;
  };

  const handleLocationBlur = (value: string | undefined) => {
    if (!mounted) return;
    if (!value) {
      setLocationHint(null);
      setSuggestedSunHours(null);
      setSuggestedLocationLabel(null);
      return;
    }
    const key = value.trim().toLowerCase();
    let matched: number | undefined = undefined;
    if (LOCATION_SUNHOURS_MAP[key] !== undefined) {
      matched = LOCATION_SUNHOURS_MAP[key];
    } else {
      for (const k of Object.keys(LOCATION_SUNHOURS_MAP)) {
        if (key.includes(k)) {
          matched = LOCATION_SUNHOURS_MAP[k];
          break;
        }
      }
    }
    if (matched !== undefined) {
      setSuggestedSunHours(matched);
      setSuggestedLocationLabel(value.trim());
      // Use t() helper to call function translations safely
      setLocationHint(t("planner.suggestedSunHours", value.trim(), matched));
    } else {
      setLocationHint(null);
      setSuggestedSunHours(null);
      setSuggestedLocationLabel(null);
    }
  };

  const applySuggestedSunHours = () => {
    if (!mounted) return;
    if (suggestedSunHours != null) {
      setValue("site.sunHours", suggestedSunHours, { shouldDirty: true, shouldValidate: true });
      saveForm();
      // Use t() helper to call function translations safely
      setLocationHint(t("planner.appliedSunHours", suggestedSunHours));
      setSuggestedSunHours(null);
      setSuggestedLocationLabel(null);
    }
  };

  const dismissSuggestedSunHours = () => {
    setSuggestedSunHours(null);
    setSuggestedLocationLabel(null);
    setLocationHint(null);
  };

  const presetLabel = (nameKey: string, fallback: string) => {
    const key = nameKey.split(".")[1];
    // @ts-ignore
    return TRANSLATIONS[locale].presets[key] ?? fallback;
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{TRANSLATIONS[locale].planner.title}</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label="Language"
            style={{ padding: 6 }}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ (Amharic)</option>
            <option value="om">Afaan Oromoo (Oromo)</option>
          </select>

          {user ? (
            <>
              <span style={{ marginRight: 8 }}>{user.email}</span>
              <button onClick={logout}>{TRANSLATIONS[locale].auth.signOut}</button>
            </>
          ) : (
            <button onClick={login}>{TRANSLATIONS[locale].auth.signIn}</button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.values(TRANSLATIONS[locale].tabs).map((tLabel) => (
          <button
            key={tLabel}
            onClick={() => setActiveTab(tLabel as TabKey)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: activeTab === tLabel ? "2px solid #0ea5a4" : "1px solid #ddd",
              background: activeTab === tLabel ? "#ecfeff" : "#fff",
              cursor: "pointer",
            }}
          >
            {tLabel}
          </button>
        ))}
      </div>

      <div>
        {activeTab === TRANSLATIONS[locale].tabs.planner ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0 }}>{TRANSLATIONS[locale].planner.appliances}</h3>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          applyAppliancePreset(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">{TRANSLATIONS[locale].planner.addPreset}</option>
                      {APPLIANCE_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {presetLabel(p.nameKey, p.nameEn)} — {p.watts}W
                        </option>
                      ))}
                    </select>

                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          applyHouseholdPreset(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">{TRANSLATIONS[locale].planner.loadHouseholdPreset}</option>
                      {HOUSEHOLD_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {TRANSLATIONS[locale].presets[p.nameKey.split(".")[1] as keyof typeof TRANSLATIONS["en"]["presets"]] ?? p.nameEn}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => append(defaultAppliance())}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #0ea5a4",
                        background: "#ecfeff",
                        cursor: "pointer",
                      }}
                    >
                      {TRANSLATIONS[locale].planner.addAppliance}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {TRANSLATIONS[locale].planner.reset}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 90px 90px 90px 40px",
                        gap: 8,
                        alignItems: "center",
                        padding: 8,
                        border: "1px solid #eee",
                        borderRadius: 6,
                      }}
                    >
                      <input
                        placeholder="Name"
                        {...register(`appliances.${index}.name` as const)}
                        defaultValue={field.name}
                        onBlur={handleBlurSave}
                        style={{ padding: 8 }}
                      />
                      <input
                        type="number"
                        placeholder="Watts"
                        {...register(`appliances.${index}.watts` as const, {
                          valueAsNumber: true,
                        })}
                        defaultValue={field.watts}
                        onBlur={handleBlurSave}
                        style={{ padding: 8 }}
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        {...register(`appliances.${index}.qty` as const, {
                          valueAsNumber: true,
                        })}
                        defaultValue={field.qty}
                        onBlur={handleBlurSave}
                        style={{ padding: 8 }}
                      />
                      <input
                        type="number"
                        placeholder="Hours"
                        {...register(`appliances.${index}.hours` as const, {
                          valueAsNumber: true,
                        })}
                        defaultValue={field.hours}
                        onBlur={handleBlurSave}
                        style={{ padding: 8 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                          setTimeout(() => saveForm(), 0);
                        }}
                        title="Remove"
                        style={{
                          background: "#ffefef",
                          border: "1px solid #f5c2c2",
                          borderRadius: 6,
                          padding: "6px 8px",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <h3>{TRANSLATIONS[locale].planner.siteSystem}</h3>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.location}
                        </label>
                        <input
                          placeholder={TRANSLATIONS[locale].planner.location}
                          {...register("site.location")}
                          onBlur={(e) => {
                            handleBlurSave();
                            handleLocationBlur(e.target.value);
                          }}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.locationHint}
                        </div>

                        {locationHint && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#0f766e",
                              marginTop: 6,
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <div style={{ flex: 1 }}>{locationHint}</div>

                            {suggestedSunHours != null ? (
                              <div style={{ display: "flex", gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={applySuggestedSunHours}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    border: "1px solid #0ea5a4",
                                    background: "#ecfeff",
                                    cursor: "pointer",
                                    fontSize: 12,
                                  }}
                                >
                                  {TRANSLATIONS[locale].planner.apply}
                                </button>
                                <button
                                  type="button"
                                  onClick={dismissSuggestedSunHours}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: "pointer",
                                    fontSize: 12,
                                  }}
                                >
                                  {TRANSLATIONS[locale].planner.dismiss}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>

                      <div style={{ width: 140 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.sunHours}
                          <Info text={TRANSLATIONS[locale].planner.sunHoursHint} />
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 5"
                          {...register("site.sunHours", { valueAsNumber: true })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.sunHoursHint}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 220 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.batteryVoltage}
                          <Info text={TRANSLATIONS[locale].planner.batteryVoltageHint} />
                        </label>
                        <input
                          type="number"
                          placeholder="48"
                          {...register("battery.systemVoltage", {
                            valueAsNumber: true,
                          })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.batteryVoltageHint}
                        </div>
                      </div>

                      <div style={{ width: 160 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.autonomyHours}
                          <Info text={TRANSLATIONS[locale].planner.autonomyHoursHint} />
                        </label>
                        <input
                          type="number"
                          placeholder="6"
                          {...register("battery.autonomyHours", {
                            valueAsNumber: true,
                          })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.autonomyHoursHint}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 160 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.dod}
                          <Info text={TRANSLATIONS[locale].planner.dodHint} />
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.8"
                          {...register("battery.depthOfDischarge", {
                            valueAsNumber: true,
                          })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.dodHint}
                        </div>
                      </div>

                      <div style={{ width: 160 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.inverterEff}
                          <Info text={TRANSLATIONS[locale].planner.inverterEffHint} />
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.9"
                          {...register("battery.inverterEfficiency", {
                            valueAsNumber: true,
                          })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.inverterEffHint}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 160 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.panelW}
                          <Info text={TRANSLATIONS[locale].planner.panelWHint} />
                        </label>
                        <input
                          type="number"
                          placeholder="400"
                          {...register("solarArray.panelWattage", {
                            valueAsNumber: true,
                          })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.panelWHint}
                        </div>
                      </div>

                      <div style={{ width: 160 }}>
                        <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                          {TRANSLATIONS[locale].planner.safetyMargin}
                          <Info text={TRANSLATIONS[locale].planner.safetyMarginHint} />
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.15"
                          {...register("solarArray.safetyMargin", {
                            valueAsNumber: true,
                          })}
                          onBlur={handleBlurSave}
                          style={{ padding: 8, width: "100%" }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {TRANSLATIONS[locale].planner.safetyMarginHint}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #0ea5a4",
                      background: "#0ea5a4",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {TRANSLATIONS[locale].planner.saveCompute}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      handleSubmit(onSubmit)();
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {TRANSLATIONS[locale].planner.validate}
                  </button>

                  <div style={{ marginLeft: "auto", color: "#666", alignSelf: "center" }}>
                    {isDirty ? TRANSLATIONS[locale].planner.unsavedChanges : TRANSLATIONS[locale].planner.saved}
                  </div>
                </div>
              </div>

              <div style={{ width: 380 }}>
                <h3>{TRANSLATIONS[locale].planner.liveSummary}</h3>
                <div
                  style={{
                    padding: 12,
                    background: "#f8fafc",
                    borderRadius: 8,
                    border: "1px solid #eef2f7",
                  }}
                >
                  {plan ? (
                    <>
                      <p>
                        <strong>Total Daily Load:</strong> {plan.totalDailyWh} Wh
                      </p>
                      <p>
                        <strong>Peak Load:</strong> {plan.peakWatts} W
                      </p>
                      <p>
                        <strong>Recommended Inverter:</strong> {plan.recommendedInverterW} W
                      </p>
                      <p>
                        <strong>Battery Required:</strong> {Math.round(plan.batteryWhRequired)} Wh (
                        {Math.round(plan.batteryAhAtSystemVoltage)} Ah)
                      </p>
                      <p>
                        <strong>Battery Count (est):</strong> {plan.batteryCount}
                      </p>
                      <p>
                        <strong>Solar Array:</strong> {Math.round(plan.solarArrayWRequired)} W
                      </p>
                      <p>
                        <strong>Panels Needed:</strong> {plan.solarPanelCount}
                      </p>

                      {plan.notes.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <strong>Notes</strong>
                          <ul>
                            {plan.notes.map((n, i) => (
                              <li key={i} style={{ color: "#b45309" }}>
                                {n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ color: "#666" }}>{TRANSLATIONS[locale].notes.noLoad}</p>
                  )}
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4>{TRANSLATIONS[locale].planner.wizard}</h4>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    {wizardSteps.map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => goToWizardStep(i)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 6,
                          border: wizardStep === i ? "2px solid #0ea5a4" : "1px solid #ddd",
                          background: wizardStep === i ? "#ecfeff" : "#fff",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={prevWizard}
                      disabled={wizardStep === 0}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextWizard}
                      disabled={wizardStep === wizardSteps.length - 1}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid #0ea5a4",
                        background: "#ecfeff",
                        cursor: "pointer",
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div style={{ padding: 12 }}>
            <h3>{activeTab}</h3>
            <p style={{ color: "#666" }}>Placeholder for the {activeTab} tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}