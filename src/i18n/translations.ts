// src/i18n/translations.ts
export type Locale = "en" | "am" | "om";

type Translations = {
  [K in Locale]: {
    // top-level UI
    tabs: {
      planner: string;
      design: string;
      results: string;
      cost: string;
      compare: string;
      aiAdvisor: string;
      report: string;
      deploy: string;
    };
    planner: {
      title: string;
      appliances: string;
      addPreset: string;
      loadHouseholdPreset: string;
      addAppliance: string;
      reset: string;
      siteSystem: string;
      location: string;
      locationHint: string;
      sunHours: string;
      sunHoursHint: string;
      batteryVoltage: string;
      batteryVoltageHint: string;
      autonomyHours: string;
      autonomyHoursHint: string;
      dod: string;
      dodHint: string;
      inverterEff: string;
      inverterEffHint: string;
      panelW: string;
      panelWHint: string;
      safetyMargin: string;
      safetyMarginHint: string;
      saveCompute: string;
      validate: string;
      unsavedChanges: string;
      saved: string;
      liveSummary: string;
      wizard: string;
      apply: string;
      dismiss: string;
      suggestedSunHours: (loc: string, hours: number) => string;
      appliedSunHours: (hours: number) => string;
      optionalLocation: string;
    };
    presets: {
      smallHome: string;
      mediumHome: string;
      largeHome: string;
      ledLight: string;
      fridge: string;
      tv: string;
      laptop: string;
      router: string;
      phoneCharger: string;
    };
    notes: {
      noLoad: string;
      lowSun: string;
      highDod: string;
      highAutonomy: string;
    };
    auth: {
      signIn: string;
      signOut: string;
    };
  };
};

export const TRANSLATIONS: Translations = {
  en: {
    tabs: {
      planner: "Planner",
      design: "Design",
      results: "Results",
      cost: "Cost",
      compare: "Compare",
      aiAdvisor: "AI Advisor",
      report: "Report",
      deploy: "Deploy",
    },
    planner: {
      title: "Planner",
      appliances: "Appliances",
      addPreset: "Add preset...",
      loadHouseholdPreset: "Load household preset...",
      addAppliance: "+ Add appliance",
      reset: "Reset",
      siteSystem: "Site & System",
      location: "Location",
      locationHint: "Optional. Type a city to get suggested sun hours.",
      sunHours: "Sun hours",
      sunHoursHint: "Peak sun hours per day.",
      batteryVoltage: "Battery voltage",
      batteryVoltageHint: "Choose 12, 24, or 48 V depending on system design.",
      autonomyHours: "Autonomy hours",
      autonomyHoursHint: "Backup hours required.",
      dod: "DoD 0–1",
      dodHint: "Depth of discharge: fraction of battery capacity you plan to use.",
      inverterEff: "Inverter eff 0–1",
      inverterEffHint: "Inverter efficiency: fraction of DC energy converted to AC.",
      panelW: "Panel W",
      panelWHint: "Watt rating per panel.",
      safetyMargin: "Safety margin 0–1",
      safetyMarginHint: "Extra sizing margin for array and battery.",
      saveCompute: "Save / Compute",
      validate: "Validate",
      unsavedChanges: "Unsaved changes",
      saved: "Saved",
      liveSummary: "Live System Summary",
      wizard: "Wizard",
      apply: "Apply",
      dismiss: "Dismiss",
      suggestedSunHours: (loc, hours) => `Suggested sun hours for "${loc}": ${hours}`,
      appliedSunHours: (hours) => `Applied suggested sun hours: ${hours}`,
      optionalLocation: "Optional. Helps with defaults and notes.",
    },
    presets: {
      smallHome: "Small Home",
      mediumHome: "Medium Home",
      largeHome: "Large Home",
      ledLight: "LED Light",
      fridge: "Fridge",
      tv: "TV",
      laptop: "Laptop",
      router: "WiFi Router",
      phoneCharger: "Phone Charger",
    },
    notes: {
      noLoad: "No appliance load entered yet.",
      lowSun: "Low sun hours: consider larger array or hybrid system.",
      highDod: "High depth of discharge: may reduce battery lifespan.",
      highAutonomy: "Very high autonomy: check if this is really needed.",
    },
    auth: {
      signIn: "Sign in (stub)",
      signOut: "Sign out",
    },
  },

  // Amharic (am) — concise translations
  am: {
    tabs: {
      planner: "እቅድ",
      design: "ንድፍ",
      results: "ውጤቶች",
      cost: "ወጪ",
      compare: "እንደሚነጻጸር",
      aiAdvisor: "AI አማካሪ",
      report: "ሪፖርት",
      deploy: "አቅርብ",
    },
    planner: {
      title: "እቅድ",
      appliances: "መሳሪያዎች",
      addPreset: "ቅድመ ምርጫ ያክሉ...",
      loadHouseholdPreset: "የቤት ቅድመ ምርጫ ጫን...",
      addAppliance: "+ መሳሪያ ያክሉ",
      reset: "ዳግም ማቀናበር",
      siteSystem: "ስፍራ እና ስርዓት",
      location: "ቦታ",
      locationHint: "አማራጭ። ከተማ ያስገቡ ለፀሐይ ሰዓቶች ምክር ይሰጣል።",
      sunHours: "የፀሐይ ሰዓቶች",
      sunHoursHint: "በቀን የሚገኙ የፀሐይ ሰዓቶች።",
      batteryVoltage: "የባትሪ ቫልቲጅ",
      batteryVoltageHint: "12, 24, 48 V ይምረጡ።",
      autonomyHours: "የራስ እርዳታ ሰዓቶች",
      autonomyHoursHint: "የባትሪ የሚያበቃ የማይኖር ሰዓቶች።",
      dod: "DoD 0–1",
      dodHint: "የባትሪ የመጠን ክፍል።",
      inverterEff: "የኢንቨርተር ትርፍ 0–1",
      inverterEffHint: "የDC ወደ AC ማቀየር ትርፍ።",
      panelW: "የፓነል ዋት",
      panelWHint: "የአንድ ፓነል ዋት።",
      safetyMargin: "የደህንነት ክልል 0–1",
      safetyMarginHint: "የስርዓት ትርፍ ተጨማሪ ክልል።",
      saveCompute: "አስቀምጥ / አስላ",
      validate: "ማረጋገጫ",
      unsavedChanges: "ያልተቀረጡ ለውጦች",
      saved: "ተቀምጧል",
      liveSummary: "የስርዓት አጭር ማጠቃለያ",
      wizard: "መምሪያ",
      apply: "ተግባር",
      dismiss: "አስወግድ",
      suggestedSunHours: (loc, hours) => `ለ"${loc}" የተመነጨ የፀሐይ ሰዓቶች: ${hours}`,
      appliedSunHours: (hours) => `የተቀበለ የፀሐይ ሰዓቶች: ${hours}`,
      optionalLocation: "አማራጭ። ከተማ ያስገቡ ለነገሮች ምክር ይሰጣል።",
    },
    presets: {
      smallHome: "ትንሽ ቤት",
      mediumHome: "መካከለኛ ቤት",
      largeHome: "ትልቅ ቤት",
      ledLight: "LED መብራት",
      fridge: "ፍሪጅ",
      tv: "ቴሌቪዥን",
      laptop: "ላፕቶፕ",
      router: "WiFi ሩተር",
      phoneCharger: "ስልክ ካርጅር",
    },
    notes: {
      noLoad: "እስካሁን ድረስ የመሳሪያ ጭነት አልተገባም።",
      lowSun: "የፀሐይ ሰዓቶች ዝቅተኛ ናቸው። ትልቅ አየር ወይም ሂብሪድ ስርዓት ይመከራል።",
      highDod: "DoD ከፍ ከሆነ የባትሪ ሕይወት ይቀናል።",
      highAutonomy: "እጅግ ከፍ ያለ የራስ እርዳታ። እውነታ ይረጋገጡ።",
    },
    auth: {
      signIn: "ግባ (ሞክር)",
      signOut: "ውጣ",
    },
  },

  // Oromo (om) — concise translations
  om: {
    tabs: {
      planner: "Qopheessaa",
      design: "Kalaqa",
      results: "Bu'aa",
      cost: "Baasi",
      compare: "Waliin madaali",
      aiAdvisor: "Gorsa AI",
      report: "Gabaasa",
      deploy: "Maxxansi",
    },
    planner: {
      title: "Qopheessaa",
      appliances: "Meeshaalee",
      addPreset: "Dursee ida'uu...",
      loadHouseholdPreset: "Dursee maatii fe'i...",
      addAppliance: "+ Meeshaa ida'uu",
      reset: "Deebi'ee kaa'uu",
      siteSystem: "Bakki & Sirna",
      location: "Iddoo",
      locationHint: "Filannoo. Magaalaa barreessi; sa'aatii aduu ni gorsa.",
      sunHours: "Sa'aatii aduu",
      sunHoursHint: "Sa'aatii aduu guyyaa tokko keessatti.",
      batteryVoltage: "Voltage baaterii",
      batteryVoltageHint: "12, 24, yookin 48 V filadhu.",
      autonomyHours: "Sa'aatii of danda'uu",
      autonomyHoursHint: "Sa'aatii baateriin deeggarsa kennu.",
      dod: "DoD 0–1",
      dodHint: "Kutaa baaterii kan itti fayyadamu.",
      inverterEff: "Effi inverter 0–1",
      inverterEffHint: "Effiinsiin DC gara AC jijjiiru.",
      panelW: "Panel W",
      panelWHint: "Watt panel tokko.",
      safetyMargin: "Safety margin 0–1",
      safetyMarginHint: "Dabalata qixxeeffamaaf.",
      saveCompute: "Kuusi / Herregi",
      validate: "Mirkaneessi",
      unsavedChanges: "Garaagarummaan hin kuufamne",
      saved: "Kuufame",
      liveSummary: "Waliigala Sirna",
      wizard: "Gorsa",
      apply: "Fudhachiisi",
      dismiss: "Haqi",
      suggestedSunHours: (loc, hours) => `Sa'aatii aduu "${loc}"af yaadame: ${hours}`,
      appliedSunHours: (hours) => `Sa'aatii aduu fudhatame: ${hours}`,
      optionalLocation: "Filannoo. Deebii fi gorsaaf magaalaa galchi.",
    },
    presets: {
      smallHome: "Mana Xiqqaa",
      mediumHome: "Mana Giddugaleessa",
      largeHome: "Mana Guddaa",
      ledLight: "Ifti LED",
      fridge: "Firiji",
      tv: "TV",
      laptop: "Laptop",
      router: "WiFi Router",
      phoneCharger: "Chaarger Bilbila",
    },
    notes: {
      noLoad: "Meeshaalee hin galchamne.",
      lowSun: "Sa'aatii aduu xiqqaa: panel hedduu yookin sirna hybrid yaadi.",
      highDod: "DoD ol'aanaa: jireenya baaterii ni hir'isa.",
      highAutonomy: "Autonomy ol'aanaa: dhugaa isaa mirkaneessi.",
    },
    auth: {
      signIn: "Seeni (stub)",
      signOut: "Ba'i",
    },
  },
};