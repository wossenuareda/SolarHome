module.exports = [
"[project]/src/lib/cloud.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "downloadPdf",
    ()=>downloadPdf,
    "listProjects",
    ()=>listProjects,
    "saveProjectCloud",
    ()=>saveProjectCloud
]);
async function saveProjectCloud(payload) {
    const res = await fetch('/api/projects/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Save failed');
    return res.json();
}
async function listProjects() {
    const res = await fetch('/api/projects/list');
    if (!res.ok) throw new Error('List failed');
    return res.json();
}
function downloadPdf(projectId) {
    const url = `/api/projects/pdf?id=${encodeURIComponent(projectId)}`;
    window.open(url, '_blank');
}
}),
"[project]/src/lib/useAuthStub.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStub",
    ()=>useAuthStub
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
function useAuthStub() {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const raw = localStorage.getItem('solarhome-auth-stub');
        if (raw) setUser(JSON.parse(raw));
    }, []);
    const login = ()=>{
        const u = {
            id: 'stub-user-1',
            email: 'demo@example.com'
        };
        localStorage.setItem('solarhome-auth-stub', JSON.stringify(u));
        setUser(u);
    };
    const logout = ()=>{
        localStorage.removeItem('solarhome-auth-stub');
        setUser(null);
    };
    return {
        user,
        login,
        logout
    };
}
}),
"[project]/src/components/placeholders/DesignPlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DesignPlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function DesignPlaceholder() {
    const [project, setProject] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [panelWidthM, setPanelWidthM] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1.0);
    const [panelHeightM, setPanelHeightM] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1.7);
    const [tiltFactor, setTiltFactor] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1.0);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem("solarhome-local");
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const data = parsed?.data ?? parsed;
            const totals = parsed?.totals ?? parsed?.data?.totals ?? parsed?.data;
            setProject({
                projectName: data?.projectName ?? parsed?.data?.projectName ?? parsed?.name,
                panelWattage: data?.panelWattage ?? parsed?.data?.panelWattage ?? 300,
                numberOfPanels: totals?.numberOfPanels ?? undefined,
                totals: totals
            });
        } catch (e) {
            console.error("DesignPlaceholder parse error", e);
        }
    }, []);
    const numberOfPanels = (()=>{
        const fromTotals = project?.totals?.numberOfPanels;
        if (typeof fromTotals === "number" && fromTotals > 0) return fromTotals;
        const recommendedPVW = project?.totals?.recommendedPVW ?? project?.data?.recommendedPVW ?? 0;
        const panelWattage = project?.panelWattage ?? 300;
        if (recommendedPVW > 0) return Math.ceil(recommendedPVW / panelWattage);
        const raw = localStorage.getItem("solarhome-local");
        if (!raw) return 0;
        try {
            const parsed = JSON.parse(raw);
            const appliances = parsed?.data?.appliances ?? [];
            const dailyWh = appliances.reduce((s, a)=>s + a.watts * a.qty * a.hours, 0);
            const sunHours = parsed?.data?.sunHours ?? 5;
            const designMargin = parsed?.data?.designMargin ?? 20;
            const recomPVW = Math.ceil(dailyWh / (sunHours || 1) * (1 + (designMargin || 0) / 100));
            return recomPVW > 0 ? Math.ceil(recomPVW / (parsed?.data?.panelWattage ?? 300)) : 0;
        } catch  {
            return 0;
        }
    })();
    const areaPerPanel = panelWidthM * panelHeightM * tiltFactor;
    const totalArea = (numberOfPanels || 0) * areaPerPanel;
    if (!project) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                padding: 12
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                    children: "Design"
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: "No saved project found. Save a project in Planner to preview design."
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "Design"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 12,
                    fontWeight: 600
                },
                children: project.projectName ?? "Untitled project"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 320px",
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Panel width (m)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: panelWidthM,
                                        onChange: (e)=>setPanelWidthM(Number(e.target.value) || 0),
                                        step: "0.1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Panel height (m)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: panelHeightM,
                                        onChange: (e)=>setPanelHeightM(Number(e.target.value) || 0),
                                        step: "0.1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Tilt factor"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: tiltFactor,
                                        onChange: (e)=>setTiltFactor(Number(e.target.value) || 1),
                                        step: "0.05"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            color: "#666",
                                            marginTop: 6
                                        },
                                        children: "Tilt factor adjusts required area for tilt and spacing. Typical 1.0–1.3."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Panel wattage"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                                lineNumber: 100,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            project.panelWattage ?? "—",
                                            " W"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Number of panels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                                lineNumber: 101,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            numberOfPanels ?? 0
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Area per panel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                                lineNumber: 102,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            areaPerPanel.toFixed(2),
                                            " m²"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 6,
                                            fontSize: 16
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Total estimated area"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                                lineNumber: 103,
                                                columnNumber: 57
                                            }, this),
                                            " ",
                                            totalArea.toFixed(2),
                                            " m²"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                border: "1px solid #eee",
                                height: 220,
                                borderRadius: 6,
                                padding: 8,
                                background: "#fff"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 13,
                                        marginBottom: 8
                                    },
                                    children: "Layout preview"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 6
                                    },
                                    children: Array.from({
                                        length: numberOfPanels || 0
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: 48,
                                                height: 86,
                                                background: "#0ea5a4",
                                                borderRadius: 4,
                                                boxShadow: "0 1px 0 rgba(0,0,0,0.06)"
                                            }
                                        }, i, false, {
                                            fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: 8,
                                        fontSize: 12,
                                        color: "#666"
                                    },
                                    children: "This is a simple visual preview. Replace with a canvas or SVG for accurate placement."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/DesignPlaceholder.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/placeholders/ResultsPlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResultsPlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function ResultsPlaceholder() {
    const [totals, setTotals] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [projectName, setProjectName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem("solarhome-local");
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const data = parsed?.data;
            if (parsed?.data?.totals) {
                setTotals(parsed.data.totals);
            } else if (data) {
                const appliances = data.appliances || [];
                const dailyWh = appliances.reduce((s, a)=>s + a.watts * a.qty * a.hours, 0);
                const recommendedPVW = Math.ceil(dailyWh / (data.sunHours || 1) * (1 + (data.designMargin || 0) / 100));
                const numberOfPanels = Math.ceil(recommendedPVW / (data.panelWattage || 300));
                const totalEstimatedCost = (data.panelUnitCost || 0) * numberOfPanels;
                setTotals({
                    dailyWh,
                    recommendedPVW,
                    numberOfPanels,
                    totalEstimatedCost
                });
            }
            setProjectName(parsed?.data?.projectName ?? null);
        } catch (err) {
            console.error("Results parse error", err);
        }
    }, []);
    if (!totals) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                padding: 12
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                    children: "Results"
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: "No saved project found in local storage."
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: 8,
                        color: "#666"
                    },
                    children: "Save a project using the Planner (Save on this device) and then open Results."
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "Results"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            projectName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 8,
                    fontWeight: 600
                },
                children: projectName
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                lineNumber: 51,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                style: {
                    width: "100%",
                    borderCollapse: "collapse"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        borderBottom: "1px solid #eee"
                                    },
                                    children: "Daily energy (Wh)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        borderBottom: "1px solid #eee",
                                        textAlign: "right"
                                    },
                                    children: totals.dailyWh ?? "—"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        borderBottom: "1px solid #eee"
                                    },
                                    children: "Recommended PV W"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        borderBottom: "1px solid #eee",
                                        textAlign: "right"
                                    },
                                    children: totals.recommendedPVW ?? "—"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        borderBottom: "1px solid #eee"
                                    },
                                    children: "Number of panels"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        borderBottom: "1px solid #eee",
                                        textAlign: "right"
                                    },
                                    children: totals.numberOfPanels ?? "—"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6
                                    },
                                    children: "Estimated cost (USD)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 6,
                                        textAlign: "right"
                                    },
                                    children: [
                                        "$",
                                        totals.totalEstimatedCost ?? "—"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/ResultsPlaceholder.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/placeholders/CostPlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CostPlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function CostPlaceholder() {
    const [project, setProject] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [panelUnitCost, setPanelUnitCost] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(120);
    const [batteryUnitCost, setBatteryUnitCost] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(500);
    const [inverterUnitCost, setInverterUnitCost] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(300);
    const [controllerUnitCost, setControllerUnitCost] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(150);
    const [bosPercent, setBosPercent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(20);
    const [installationPercent, setInstallationPercent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(10);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem("solarhome-local");
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const d = parsed?.data || {};
            setProject(parsed || null);
            setPanelUnitCost(d.panelUnitCost ?? panelUnitCost);
            setBatteryUnitCost(d.batteryUnitCost ?? batteryUnitCost);
            setInverterUnitCost(d.inverterUnitCost ?? inverterUnitCost);
            setControllerUnitCost(d.controllerUnitCost ?? controllerUnitCost);
            setBosPercent(d.bosPercent ?? bosPercent);
            setInstallationPercent(d.installationPercent ?? installationPercent);
        } catch (e) {
            console.error("CostPlaceholder parse error", e);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const numberOfPanels = (()=>{
        const fromTotals = project?.totals?.numberOfPanels;
        if (typeof fromTotals === "number" && fromTotals > 0) return fromTotals;
        const recommendedPVW = project?.totals?.recommendedPVW ?? project?.data?.recommendedPVW ?? 0;
        const panelWattage = project?.data?.panelWattage ?? 300;
        if (recommendedPVW > 0) return Math.ceil(recommendedPVW / panelWattage);
        const appliances = project?.data?.appliances ?? [];
        const dailyWh = appliances.reduce((s, a)=>s + a.watts * a.qty * a.hours, 0);
        const sunHours = project?.data?.sunHours ?? 5;
        const designMargin = project?.data?.designMargin ?? 20;
        const recomPVW = Math.ceil(dailyWh / (sunHours || 1) * (1 + (designMargin || 0) / 100));
        return recomPVW > 0 ? Math.ceil(recomPVW / panelWattage) : 0;
    })();
    const bom = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const panelsCost = numberOfPanels * panelUnitCost;
        const batteriesCount = project?.data ? Math.ceil((project.data.batteryUnitAh ?? 0) / 200 || 0) : 0;
        const batteriesCost = batteriesCount * batteryUnitCost;
        const inverterCost = inverterUnitCost;
        const controllerCost = controllerUnitCost;
        const subtotal = panelsCost + batteriesCost + inverterCost + controllerCost;
        const bos = Math.round(bosPercent / 100 * subtotal);
        const installation = Math.round(installationPercent / 100 * subtotal);
        const total = subtotal + bos + installation;
        return {
            panels: {
                qty: numberOfPanels,
                unit: panelUnitCost,
                total: panelsCost
            },
            batteries: {
                qty: batteriesCount,
                unit: batteryUnitCost,
                total: batteriesCost
            },
            inverter: {
                qty: inverterCost ? 1 : 0,
                unit: inverterUnitCost,
                total: inverterCost
            },
            controller: {
                qty: controllerCost ? 1 : 0,
                unit: controllerUnitCost,
                total: controllerCost
            },
            subtotal,
            bos,
            installation,
            total
        };
    }, [
        numberOfPanels,
        panelUnitCost,
        batteryUnitCost,
        inverterUnitCost,
        controllerUnitCost,
        bosPercent,
        installationPercent,
        project
    ]);
    if (!project) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                padding: 12
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                    children: "Cost"
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: "No saved project found. Save a project in Planner to calculate costs."
                }, void 0, false, {
                    fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "Cost"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 12,
                    fontWeight: 600
                },
                children: project.data?.projectName ?? "Untitled project"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 360px",
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Panel unit cost (USD)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: panelUnitCost,
                                        onChange: (e)=>setPanelUnitCost(Number(e.target.value) || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Battery unit cost (USD)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: batteryUnitCost,
                                        onChange: (e)=>setBatteryUnitCost(Number(e.target.value) || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Inverter unit cost (USD)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: inverterUnitCost,
                                        onChange: (e)=>setInverterUnitCost(Number(e.target.value) || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 13
                                        },
                                        children: "Controller unit cost (USD)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: controllerUnitCost,
                                        onChange: (e)=>setControllerUnitCost(Number(e.target.value) || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "block",
                                                    fontSize: 13
                                                },
                                                children: "BOS %"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 138,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: bosPercent,
                                                onChange: (e)=>setBosPercent(Number(e.target.value) || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 139,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "block",
                                                    fontSize: 13
                                                },
                                                children: "Installation %"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 142,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: installationPercent,
                                                onChange: (e)=>setInstallationPercent(Number(e.target.value) || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 143,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                border: "1px solid #eee",
                                padding: 12,
                                borderRadius: 6,
                                background: "#fff"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontWeight: 600,
                                        marginBottom: 8
                                    },
                                    children: "Bill of Materials"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    style: {
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: 14
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6
                                                        },
                                                        children: "Panels"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            bom.panels.qty,
                                                            " × $",
                                                            bom.panels.unit
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.panels.total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 154,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6
                                                        },
                                                        children: "Batteries"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            bom.batteries.qty,
                                                            " × $",
                                                            bom.batteries.unit
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.batteries.total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 159,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6
                                                        },
                                                        children: "Inverter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            bom.inverter.qty,
                                                            " × $",
                                                            bom.inverter.unit
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.inverter.total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6
                                                        },
                                                        children: "Controller"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            bom.controller.qty,
                                                            " × $",
                                                            bom.controller.unit
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.controller.total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            borderTop: "1px solid #eee"
                                                        },
                                                        children: "Subtotal"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {}, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right",
                                                            borderTop: "1px solid #eee"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.subtotal
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6
                                                        },
                                                        children: [
                                                            "BOS (",
                                                            bosPercent,
                                                            "%)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {}, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.bos
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6
                                                        },
                                                        children: [
                                                            "Installation (",
                                                            installationPercent,
                                                            "%)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {}, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right"
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.installation
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            fontWeight: 700
                                                        },
                                                        children: "Total"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 191,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {}, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: 6,
                                                            textAlign: "right",
                                                            fontWeight: 700
                                                        },
                                                        children: [
                                                            "$",
                                                            bom.total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: 10,
                                        display: "flex",
                                        gap: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                try {
                                                    const raw = localStorage.getItem("solarhome-local");
                                                    if (!raw) {
                                                        alert("No local project to save");
                                                        return;
                                                    }
                                                    const parsed = JSON.parse(raw);
                                                    parsed.data = parsed.data || {};
                                                    parsed.data.panelUnitCost = panelUnitCost;
                                                    parsed.data.batteryUnitCost = batteryUnitCost;
                                                    parsed.data.inverterUnitCost = inverterUnitCost;
                                                    parsed.data.controllerUnitCost = controllerUnitCost;
                                                    parsed.data.bosPercent = bosPercent;
                                                    parsed.data.installationPercent = installationPercent;
                                                    const payload = {
                                                        name: parsed.data.projectName || parsed.name || "Untitled project",
                                                        totals: parsed.totals || {},
                                                        data: parsed.data || {}
                                                    };
                                                    const serverId = parsed.project?.id || parsed.id || null;
                                                    if (serverId) payload.id = serverId;
                                                    const res = await fetch("/api/projects/save", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify(payload)
                                                    });
                                                    if (!res.ok) {
                                                        const text = await res.text().catch(()=>"unknown");
                                                        throw new Error(`Server save failed: ${res.status} ${text}`);
                                                    }
                                                    const body = await res.json();
                                                    const savedProject = body.project || body;
                                                    parsed.project = savedProject;
                                                    parsed.id = savedProject.id;
                                                    localStorage.setItem("solarhome-local", JSON.stringify(parsed));
                                                    alert("Costs saved to server project");
                                                } catch (e) {
                                                    console.error("Save costs error", e);
                                                    alert("Failed to save costs: " + (e?.message ?? "unknown"));
                                                }
                                            },
                                            children: "Save costs to project"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const rows = [
                                                    [
                                                        "Item",
                                                        "Qty",
                                                        "Unit (USD)",
                                                        "Total (USD)"
                                                    ],
                                                    [
                                                        "Panels",
                                                        String(bom.panels.qty),
                                                        String(bom.panels.unit),
                                                        String(bom.panels.total)
                                                    ],
                                                    [
                                                        "Batteries",
                                                        String(bom.batteries.qty),
                                                        String(bom.batteries.unit),
                                                        String(bom.batteries.total)
                                                    ],
                                                    [
                                                        "Inverter",
                                                        String(bom.inverter.qty),
                                                        String(bom.inverter.unit),
                                                        String(bom.inverter.total)
                                                    ],
                                                    [
                                                        "Controller",
                                                        String(bom.controller.qty),
                                                        String(bom.controller.unit),
                                                        String(bom.controller.total)
                                                    ],
                                                    [
                                                        "Subtotal",
                                                        "",
                                                        "",
                                                        String(bom.subtotal)
                                                    ],
                                                    [
                                                        "BOS",
                                                        "",
                                                        "",
                                                        String(bom.bos)
                                                    ],
                                                    [
                                                        "Installation",
                                                        "",
                                                        "",
                                                        String(bom.installation)
                                                    ],
                                                    [
                                                        "Total",
                                                        "",
                                                        "",
                                                        String(bom.total)
                                                    ]
                                                ];
                                                const csv = rows.map((r)=>r.map((c)=>`"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
                                                const blob = new Blob([
                                                    csv
                                                ], {
                                                    type: "text/csv"
                                                });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = `${project.data?.projectName ?? "project"}-bom.csv`;
                                                a.click();
                                                URL.revokeObjectURL(url);
                                            },
                                            children: "Export BOM CSV"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/CostPlaceholder.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/battery.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "sizeBatteries",
    ()=>sizeBatteries
]);
function sizeBatteries(input) {
    const notes = [];
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
        notes.push(`Bank nominal voltage ${bankNominalV}V differs from requested system voltage ${systemVoltage}V. ` + `Series count rounded to ${seriesCount}. Verify compatibility with inverter and charger.`);
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
const __TURBOPACK__default__export__ = sizeBatteries;
}),
"[project]/src/components/placeholders/ComparePlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComparePlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// src/components/placeholders/ComparePlaceholder.tsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/battery.ts [ssr] (ecmascript)");
;
;
;
function safeParse(raw) {
    try {
        if (!raw) return null;
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function computeDailyWhFromAppliances(appliances = []) {
    return (appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0) * Number(a?.hours || 0), 0);
}
function summarize(project) {
    const data = project?.data ?? {};
    const totals = project?.totals ?? {};
    const dailyWh = totals.dailyWh ?? computeDailyWhFromAppliances(data.appliances ?? []);
    const sunHours = data.sunHours ?? 5;
    const designMargin = data.designMargin ?? 20;
    const recommendedPVW = totals.recommendedPVW ?? Math.ceil(dailyWh / Math.max(1, sunHours) * (1 + designMargin / 100));
    const panelWattage = data.panelWattage ?? 300;
    const numberOfPanels = totals.numberOfPanels ?? Math.max(1, Math.ceil(recommendedPVW / panelWattage));
    const totalEstimatedCost = totals.totalEstimatedCost ?? (data.panelUnitCost ?? 0) * numberOfPanels;
    const batterySizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])({
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
/** Minimal equipment catalogue used for display only */ const DEFAULT_CATALOGUE = {
    batteries: [
        {
            id: "bat-lfp-200",
            name: "LiFePO4 12V 200Ah",
            chemistry: "lithium",
            nominalV: 12,
            Ah: 200,
            unitCostUSD: 600,
            weightKg: 25
        },
        {
            id: "bat-agm-200",
            name: "AGM 12V 200Ah",
            chemistry: "lead-acid",
            nominalV: 12,
            Ah: 200,
            unitCostUSD: 220,
            weightKg: 30
        }
    ],
    panels: [
        {
            id: "panel-300",
            name: "Panel 300W",
            watt: 300,
            areaM2: 1.7,
            unitCostUSD: 120
        }
    ],
    inverters: [
        {
            id: "inv-3k",
            name: "Inverter 3kW",
            powerW: 3000,
            efficiency: 0.95,
            unitCostUSD: 350
        }
    ]
};
function sizeForChemistry(project, chemistry) {
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
    const sizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])(opts);
    const unitCostDefault = chemistry === "lithium" ? 600 : 200;
    const unitCost = data.batteryUnitCost ?? unitCostDefault;
    const replacementYears = chemistry === "lithium" ? 12 : 4;
    const lifecycleReplacements = Math.max(0, Math.ceil(20 / replacementYears) - 1);
    const lifecycleCost = sizing.totalUnits * unitCost * (1 + lifecycleReplacements);
    return {
        sizing,
        lifecycleCost,
        replacementYears,
        unitCost
    };
}
/** Sensitivity analysis: vary unit cost and DOD by percentages and recompute recommendation */ function computeSensitivity(project) {
    const baseLithium = sizeForChemistry(project, "lithium");
    const baseLead = sizeForChemistry(project, "lead-acid");
    const scenarios = [];
    const deltas = [
        -0.2,
        -0.1,
        0.1,
        0.2
    ];
    deltas.forEach((d)=>{
        const p = JSON.parse(JSON.stringify(project));
        const baseCost = project.data?.batteryUnitCost ?? 500;
        p.data = {
            ...p.data ?? {},
            batteryUnitCost: Math.round(baseCost * (1 + d))
        };
        const l = sizeForChemistry(p, "lithium");
        const ld = sizeForChemistry(p, "lead-acid");
        const rec = l.lifecycleCost <= ld.lifecycleCost ? "lithium" : "lead-acid";
        scenarios.push({
            scenario: `Battery cost ${Math.round(d * 100)}%`,
            params: {
                batteryUnitCost: p.data.batteryUnitCost
            },
            lithium: Math.round(l.lifecycleCost),
            lead: Math.round(ld.lifecycleCost),
            recommended: rec
        });
    });
    deltas.forEach((d)=>{
        const p = JSON.parse(JSON.stringify(project));
        const baseDod = project.data?.depthOfDischarge ?? 0.5;
        const newDod = Math.max(0.1, Math.min(0.95, baseDod * (1 + d)));
        p.data = {
            ...p.data ?? {},
            depthOfDischarge: newDod
        };
        const l = sizeForChemistry(p, "lithium");
        const ld = sizeForChemistry(p, "lead-acid");
        const rec = l.lifecycleCost <= ld.lifecycleCost ? "lithium" : "lead-acid";
        scenarios.push({
            scenario: `DOD ${Math.round(d * 100)}%`,
            params: {
                depthOfDischarge: newDod
            },
            lithium: Math.round(l.lifecycleCost),
            lead: Math.round(ld.lifecycleCost),
            recommended: rec
        });
    });
    return {
        base: {
            lithium: Math.round(baseLithium.lifecycleCost),
            lead: Math.round(baseLead.lifecycleCost)
        },
        scenarios
    };
}
function ComparePlaceholder() {
    const localRaw = localStorage.getItem("solarhome-local") || "{}";
    const localProject = safeParse(localRaw) || {
        data: {},
        totals: {}
    };
    const [otherRaw, setOtherRaw] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const otherProject = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>safeParse(otherRaw), [
        otherRaw
    ]);
    const [catalogue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(DEFAULT_CATALOGUE);
    const [chemistryView, setChemistryView] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("both");
    const left = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>summarize(localProject), [
        localRaw
    ]);
    const right = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>otherProject ? summarize(otherProject) : null, [
        otherRaw
    ]);
    const localLithium = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>sizeForChemistry(localProject, "lithium"), [
        localRaw
    ]);
    const localLead = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>sizeForChemistry(localProject, "lead-acid"), [
        localRaw
    ]);
    const recommendedChemistry = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return localLithium.lifecycleCost <= localLead.lifecycleCost ? "lithium" : "lead-acid";
    }, [
        localLithium,
        localLead
    ]);
    const sensitivity = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>computeSensitivity(localProject), [
        localRaw
    ]);
    const [isOpening, setIsOpening] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
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
        const blob = new Blob([
            JSON.stringify(payload, null, 2)
        ], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${payload.projectName}-recommendation-${payload.version}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(()=>URL.revokeObjectURL(url), 1000);
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
                  ${payload.sensitivity.scenarios.map((s)=>`
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
        const blob = new Blob([
            html
        ], {
            type: "text/html"
        });
        const url = URL.createObjectURL(blob);
        try {
            // Primary: open blob URL in new tab/window
            const newWin = window.open(url, "_blank", "noopener,noreferrer");
            if (newWin) {
                try {
                    newWin.focus();
                } catch  {}
                // revoke after a short delay to allow browser to load
                setTimeout(()=>{
                    try {
                        URL.revokeObjectURL(url);
                    } catch  {}
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
            setTimeout(()=>{
                try {
                    URL.revokeObjectURL(url);
                } catch  {}
                setIsOpening(false);
            }, 1500);
            alert("Popup blocked. A printable HTML file was downloaded — open it and print from your browser.");
            return;
        } catch (err) {
            // Final fallback: copy HTML to clipboard
            try {
                await navigator.clipboard?.writeText(html);
                alert("Printable HTML copied to clipboard — paste into a file and open it to print.");
            } catch  {
                alert("Printable export failed. Please allow popups for this site or use the Export recommendation (JSON) button.");
            } finally{
                try {
                    URL.revokeObjectURL(url);
                } catch  {}
                setIsOpening(false);
            }
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "Compare Projects and Recommendations"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 480px",
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8,
                                    fontWeight: 600
                                },
                                children: "Current local project"
                            }, void 0, false, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 12,
                                    border: "1px solid #eee",
                                    borderRadius: 6,
                                    background: "#fff"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Daily Wh"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 337,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            left.dailyWh
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Recommended PV W"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 338,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            left.recommendedPVW
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Panels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 339,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            left.numberOfPanels
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Estimated cost"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 340,
                                                columnNumber: 18
                                            }, this),
                                            " $",
                                            left.totalEstimatedCost
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Batteries (default)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 343,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            left.batteryUnits,
                                            " units (",
                                            left.batterySeries,
                                            "S × ",
                                            left.batteryParallel,
                                            "P)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 600,
                                                    marginBottom: 6
                                                },
                                                children: "Chemistry comparison"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            border: "1px solid #eee",
                                                            padding: 8,
                                                            borderRadius: 6
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700
                                                                },
                                                                children: "Lithium"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    "Units: ",
                                                                    localLithium.sizing.totalUnits
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 352,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    "Config: ",
                                                                    localLithium.sizing.seriesCount,
                                                                    "S × ",
                                                                    localLithium.sizing.parallelStrings,
                                                                    "P"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 353,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    "Lifecycle cost est: $",
                                                                    Math.round(localLithium.lifecycleCost)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 354,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            border: "1px solid #eee",
                                                            padding: 8,
                                                            borderRadius: 6
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700
                                                                },
                                                                children: "Lead Acid"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    "Units: ",
                                                                    localLead.sizing.totalUnits
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 359,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    "Config: ",
                                                                    localLead.sizing.seriesCount,
                                                                    "S × ",
                                                                    localLead.sizing.parallelStrings,
                                                                    "P"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 360,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    "Lifecycle cost est: $",
                                                                    Math.round(localLead.lifecycleCost)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 361,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 349,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 8,
                                                    color: "#666",
                                                    fontSize: 13
                                                },
                                                children: "Lithium has higher upfront cost but fewer replacements and higher usable capacity. Lead acid is cheaper initially but may need replacement multiple times."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 365,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        border: "1px solid #e6f6f5",
                                        padding: 12,
                                        borderRadius: 6,
                                        background: "#f8fffe"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 700,
                                                marginBottom: 8
                                            },
                                            children: "Smarter Recommendation"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 373,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginBottom: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Recommended chemistry"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 376,
                                                    columnNumber: 17
                                                }, this),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: "#0b7285",
                                                        fontWeight: 700
                                                    },
                                                    children: recommendedChemistry.toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 376,
                                                    columnNumber: 56
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 375,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 13,
                                                color: "#444",
                                                marginBottom: 8
                                            },
                                            children: [
                                                "Reason: estimated lifecycle cost $",
                                                Math.round(recommendedChemistry === "lithium" ? localLithium.lifecycleCost : localLead.lifecycleCost),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 379,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Recommended PV"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 22
                                                        }, this),
                                                        " ",
                                                        left.recommendedPVW,
                                                        " W (",
                                                        left.numberOfPanels,
                                                        " × ",
                                                        catalogue.panels[0].watt,
                                                        "W)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 6
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Battery bank (recommended)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 47
                                                        }, this),
                                                        " ",
                                                        recommendedChemistry === "lithium" ? `${localLithium.sizing.seriesCount}S × ${localLithium.sizing.parallelStrings}P (${localLithium.sizing.totalUnits} units)` : `${localLead.sizing.seriesCount}S × ${localLead.sizing.parallelStrings}P (${localLead.sizing.totalUnits} units)`
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 383,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 10,
                                                display: "flex",
                                                gap: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: downloadJsonRecommendation,
                                                    children: "Export recommendation (JSON)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: openPrintableRecommendation,
                                                    disabled: isOpening,
                                                    children: isOpening ? "Opening…" : "Open printable recommendation"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setChemistryView(recommendedChemistry === "lithium" ? "lithium" : "lead-acid"),
                                                    style: {
                                                        marginLeft: 8
                                                    },
                                                    children: [
                                                        "View ",
                                                        recommendedChemistry,
                                                        " details"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 388,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                    lineNumber: 372,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8,
                                    fontWeight: 600
                                },
                                children: "Paste another project JSON to compare"
                            }, void 0, false, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                value: otherRaw,
                                onChange: (e)=>setOtherRaw(e.target.value),
                                placeholder: 'Paste JSON here (e.g. {"data":{...},"totals":{...}})',
                                style: {
                                    width: "100%",
                                    height: 220,
                                    padding: 8,
                                    fontFamily: "monospace",
                                    fontSize: 13
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            navigator.clipboard?.readText().then((text)=>setOtherRaw(text)).catch(()=>{
                                                alert("Clipboard read not available. Paste JSON into the box.");
                                            });
                                        },
                                        children: "Paste from clipboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 412,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setOtherRaw(""),
                                        style: {
                                            marginLeft: 8
                                        },
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 418,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 411,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: right ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        border: "1px solid #eee",
                                        padding: 12,
                                        borderRadius: 6,
                                        background: "#fff"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 600,
                                                marginBottom: 8
                                            },
                                            children: "Comparison"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 424,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                            style: {
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                fontSize: 14
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    textAlign: "left",
                                                                    padding: 6
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    textAlign: "right",
                                                                    padding: 6
                                                                },
                                                                children: "Local"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 430,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    textAlign: "right",
                                                                    padding: 6
                                                                },
                                                                children: "Other"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                lineNumber: 431,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 428,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 427,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Daily Wh"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 436,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: left.dailyWh
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 437,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: right.dailyWh
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 438,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Recommended PV W"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: left.recommendedPVW
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 442,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: right.recommendedPVW
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 443,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 440,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Panels"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 446,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: left.numberOfPanels
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 447,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: right.numberOfPanels
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 448,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 445,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Estimated cost"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 451,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: [
                                                                        "$",
                                                                        left.totalEstimatedCost
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 452,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: [
                                                                        "$",
                                                                        right.totalEstimatedCost
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 450,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Batteries (units)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: left.batteryUnits
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: right.batteryUnits
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 458,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Battery config"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 461,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: [
                                                                        left.batterySeries,
                                                                        "S × ",
                                                                        left.batteryParallel,
                                                                        "P"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 462,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: [
                                                                        right.batterySeries,
                                                                        "S × ",
                                                                        right.batteryParallel,
                                                                        "P"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 463,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Lithium lifecycle est"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 466,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: [
                                                                        "$",
                                                                        Math.round(localLithium.lifecycleCost)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: otherProject ? `$${Math.round(sizeForChemistry(otherProject, "lithium").lifecycleCost)}` : "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 468,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 465,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6
                                                                    },
                                                                    children: "Lead acid lifecycle est"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 471,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: [
                                                                        "$",
                                                                        Math.round(localLead.lifecycleCost)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 472,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: 6,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: otherProject ? `$${Math.round(sizeForChemistry(otherProject, "lead-acid").lifecycleCost)}` : "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 473,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 470,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                            lineNumber: 426,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                    lineNumber: 423,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: "#666",
                                        fontSize: 13
                                    },
                                    children: "No other project parsed yet. Paste a project JSON to compare."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                    lineNumber: 479,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 421,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 600,
                                            marginBottom: 6
                                        },
                                        children: "View chemistry"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 484,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChemistryView("both"),
                                                style: {
                                                    background: chemistryView === "both" ? "#ecfeff" : undefined
                                                },
                                                children: "Both"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 486,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChemistryView("lithium"),
                                                style: {
                                                    background: chemistryView === "lithium" ? "#ecfeff" : undefined
                                                },
                                                children: "Lithium"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 487,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChemistryView("lead-acid"),
                                                style: {
                                                    background: chemistryView === "lead-acid" ? "#ecfeff" : undefined
                                                },
                                                children: "Lead Acid"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 488,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: [
                                            chemistryView === "both" || chemistryView === "lithium" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    border: "1px solid #eee",
                                                    padding: 8,
                                                    borderRadius: 6,
                                                    marginBottom: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 700
                                                        },
                                                        children: "Lithium (project)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Units: ",
                                                            localLithium.sizing.totalUnits
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Config: ",
                                                            localLithium.sizing.seriesCount,
                                                            "S × ",
                                                            localLithium.sizing.parallelStrings,
                                                            "P"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Lifecycle cost est: $",
                                                            Math.round(localLithium.lifecycleCost)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 493,
                                                columnNumber: 17
                                            }, this) : null,
                                            chemistryView === "both" || chemistryView === "lead-acid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    border: "1px solid #eee",
                                                    padding: 8,
                                                    borderRadius: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 700
                                                        },
                                                        children: "Lead Acid (project)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 503,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Units: ",
                                                            localLead.sizing.totalUnits
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Config: ",
                                                            localLead.sizing.seriesCount,
                                                            "S × ",
                                                            localLead.sizing.parallelStrings,
                                                            "P"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Lifecycle cost est: $",
                                                            Math.round(localLead.lifecycleCost)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 502,
                                                columnNumber: 17
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 491,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 600,
                                                    marginBottom: 6
                                                },
                                                children: "Sensitivity snapshot"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 512,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    border: "1px solid #eee",
                                                    padding: 8,
                                                    borderRadius: 6,
                                                    background: "#fff"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 13,
                                                            marginBottom: 8
                                                        },
                                                        children: [
                                                            "Base lifecycle costs — Lithium: $",
                                                            sensitivity.base.lithium,
                                                            " · Lead: $",
                                                            sensitivity.base.lead
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 514,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            maxHeight: 220,
                                                            overflow: "auto"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                            style: {
                                                                width: "100%",
                                                                borderCollapse: "collapse",
                                                                fontSize: 13
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                style: {
                                                                                    textAlign: "left",
                                                                                    padding: 6
                                                                                },
                                                                                children: "Scenario"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                lineNumber: 519,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                style: {
                                                                                    textAlign: "right",
                                                                                    padding: 6
                                                                                },
                                                                                children: "Recommended"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                lineNumber: 520,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                style: {
                                                                                    textAlign: "right",
                                                                                    padding: 6
                                                                                },
                                                                                children: "Lithium $"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                lineNumber: 521,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                style: {
                                                                                    textAlign: "right",
                                                                                    padding: 6
                                                                                },
                                                                                children: "Lead $"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                lineNumber: 522,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                        lineNumber: 518,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 517,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                                    children: sensitivity.scenarios.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                    style: {
                                                                                        padding: 6
                                                                                    },
                                                                                    children: s.scenario
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                    lineNumber: 528,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                    style: {
                                                                                        padding: 6,
                                                                                        textAlign: "right"
                                                                                    },
                                                                                    children: s.recommended
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                    lineNumber: 529,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                    style: {
                                                                                        padding: 6,
                                                                                        textAlign: "right"
                                                                                    },
                                                                                    children: [
                                                                                        "$",
                                                                                        s.lithium
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                    lineNumber: 530,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                    style: {
                                                                                        padding: 6,
                                                                                        textAlign: "right"
                                                                                    },
                                                                                    children: [
                                                                                        "$",
                                                                                        s.lead
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                                    lineNumber: 531,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, i, true, {
                                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                            lineNumber: 527,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                                    lineNumber: 525,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                            lineNumber: 516,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 515,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 12,
                                                            color: "#666",
                                                            marginTop: 8
                                                        },
                                                        children: "Sensitivity scenarios show how the recommendation changes when unit cost or DOD varies by ±10–20%."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                                lineNumber: 513,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                        lineNumber: 511,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                        lineNumber: 401,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/ComparePlaceholder.tsx",
        lineNumber: 329,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIAdvisorPlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// src/components/placeholders/AIAdvisorPlaceholder.tsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/battery.ts [ssr] (ecmascript)");
;
;
;
const DEFAULT_CATALOGUE = {
    batteries: [
        {
            id: "bat-lfp-200",
            name: "LiFePO4 12V 200Ah",
            chemistry: "lithium",
            nominalV: 12,
            Ah: 200,
            unitCostUSD: 600,
            weightKg: 25
        },
        {
            id: "bat-lfp-300",
            name: "LiFePO4 12V 300Ah",
            chemistry: "lithium",
            nominalV: 12,
            Ah: 300,
            unitCostUSD: 900,
            weightKg: 36
        },
        {
            id: "bat-agm-200",
            name: "AGM 12V 200Ah",
            chemistry: "lead-acid",
            nominalV: 12,
            Ah: 200,
            unitCostUSD: 220,
            weightKg: 30
        },
        {
            id: "bat-fld-200",
            name: "Flooded 12V 200Ah",
            chemistry: "lead-acid",
            nominalV: 12,
            Ah: 200,
            unitCostUSD: 180,
            weightKg: 32
        }
    ],
    inverters: [
        {
            id: "inv-3k",
            name: "Inverter 3kW",
            powerW: 3000,
            efficiency: 0.95,
            unitCostUSD: 350
        },
        {
            id: "inv-5k",
            name: "Inverter 5kW",
            powerW: 5000,
            efficiency: 0.95,
            unitCostUSD: 600
        }
    ],
    panels: [
        {
            id: "panel-300",
            name: "Panel 300W",
            watt: 300,
            areaM2: 1.7,
            unitCostUSD: 120
        }
    ]
};
function safeParse(raw) {
    try {
        if (!raw) return null;
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function computeDailyWhFromAppliances(appliances = []) {
    return (appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0) * Number(a?.hours || 0), 0);
}
function recommendInverterSize(peakLoadW) {
    // Add margin for startup loads and future growth
    const recommended = Math.ceil(peakLoadW * 1.25 / 500) * 500;
    return recommended;
}
function recommendPV(dailyWh, sunHours, designMarginPct, panelWatt) {
    const pvW = Math.ceil(dailyWh / Math.max(1, sunHours) * (1 + designMarginPct / 100));
    const panels = Math.ceil(pvW / panelWatt);
    return {
        pvW,
        panels
    };
}
function sizeForChemistry(project, chemistry) {
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
    const sizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])(opts);
    const unitCostDefault = chemistry === "lithium" ? 600 : 200;
    const unitCost = data.batteryUnitCost ?? unitCostDefault;
    const replacementYears = chemistry === "lithium" ? 12 : 4;
    const lifecycleReplacements = Math.max(0, Math.ceil(20 / replacementYears) - 1);
    const lifecycleCost = sizing.totalUnits * unitCost * (1 + lifecycleReplacements);
    return {
        sizing,
        lifecycleCost,
        replacementYears,
        unitCost
    };
}
function scoreChemistryTradeoffs(project) {
    const lithium = sizeForChemistry(project, "lithium");
    const lead = sizeForChemistry(project, "lead-acid");
    // Score: lower lifecycle cost preferred; penalize weight/space issues
    const data = project?.data ?? {};
    const roofAreaLimit = data.siteConstraints?.roofAreaM2 ?? Infinity;
    const weightLimitKg = data.siteConstraints?.weightLimitKg ?? Infinity;
    // approximate weight: choose a representative battery from catalogue (200Ah)
    const lithiumWeight = lithium.sizing.totalUnits * 25; // rough
    const leadWeight = lead.sizing.totalUnits * 30; // rough
    const costScore = lead.lifecycleCost - lithium.lifecycleCost; // positive favors lithium
    const fitPenaltyLithium = lithiumWeight > weightLimitKg || 0 ? -10000 : 0;
    const fitPenaltyLead = leadWeight > weightLimitKg || 0 ? -10000 : 0;
    const lithiumScore = costScore + fitPenaltyLithium;
    const leadScore = -costScore + fitPenaltyLead;
    const recommended = lithiumScore >= leadScore ? "lithium" : "lead-acid";
    return {
        lithium,
        lead,
        recommended,
        lithiumWeight,
        leadWeight
    };
}
function AIAdvisorPlaceholder() {
    const raw = localStorage.getItem("solarhome-local") || "{}";
    const project = safeParse(raw) || {
        data: {},
        totals: {}
    };
    const catalogue = DEFAULT_CATALOGUE;
    const dailyWh = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>computeDailyWhFromAppliances(project.data?.appliances ?? []), [
        raw
    ]);
    const peakLoadW = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // estimate peak as sum of (watts * qty) for appliances (conservative)
        return (project.data?.appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0), 0);
    }, [
        raw
    ]);
    const pvRecommendation = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>recommendPV(dailyWh, project.data?.sunHours ?? 5, project.data?.designMargin ?? 20, catalogue.panels[0].watt), [
        raw
    ]);
    const inverterRecommendationW = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>recommendInverterSize(peakLoadW), [
        raw
    ]);
    const chemistryAnalysis = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>scoreChemistryTradeoffs(project), [
        raw
    ]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
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
        const steps = [];
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
            detail: chemistryAnalysis.recommended === "lithium" ? "Minimal scheduled maintenance; monitor BMS and state of charge. Expect replacement after ~12 years." : "Schedule periodic inspections, electrolyte checks (if flooded), and plan for replacement every ~4 years."
        });
        return steps;
    }
    const executiveSummary = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>generateExecutiveSummary(), [
        raw,
        notes
    ]);
    const actionPlan = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>buildActionPlan(), [
        raw
    ]);
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
        const blob = new Blob([
            JSON.stringify(report, null, 2)
        ], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ai-advisor-report-${(project.data?.projectName ?? "project").replace(/\s+/g, "-")}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    // Professional summary card content
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "AI Advisor — Professional System Recommendation"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 420px",
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #eef6f5",
                                    padding: 12,
                                    borderRadius: 6,
                                    background: "#fbfffe"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Executive Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("pre", {
                                        style: {
                                            whiteSpace: "pre-wrap",
                                            fontFamily: "inherit",
                                            margin: 0
                                        },
                                        children: executiveSummary
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Recommended Architecture"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #eee",
                                            padding: 12,
                                            borderRadius: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "PV"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 20
                                                    }, this),
                                                    ": ",
                                                    pvRecommendation.pvW,
                                                    " W — ",
                                                    pvRecommendation.panels,
                                                    " × ",
                                                    catalogue.panels[0].watt,
                                                    "W panels"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 223,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Inverter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 20
                                                    }, this),
                                                    ": ~",
                                                    inverterRecommendationW,
                                                    " W (select inverter with surge capability and 95%+ efficiency)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 224,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Battery bank"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 45
                                                    }, this),
                                                    ": ",
                                                    chemistryAnalysis.recommended.toUpperCase(),
                                                    " — ",
                                                    chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.totalUnits,
                                                    " units (",
                                                    chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.seriesCount,
                                                    "S × ",
                                                    chemistryAnalysis[chemistryAnalysis.recommended === "lithium" ? "lithium" : "lead"].sizing.parallelStrings,
                                                    "P)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 225,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 13,
                                                    color: "#666",
                                                    marginTop: 8
                                                },
                                                children: "Notes: This recommendation balances lifecycle cost, usable capacity, and site fit. Adjust unit costs and site constraints in Planner to refine results."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 226,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Action Plan (prioritized)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ol", {
                                        children: actionPlan.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                style: {
                                                    marginBottom: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontWeight: 600
                                                        },
                                                        children: s.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 13,
                                                            color: "#444"
                                                        },
                                                        children: s.detail
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Equipment Suggestions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 245,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #eee",
                                            padding: 8,
                                            borderRadius: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 700,
                                                    marginBottom: 6
                                                },
                                                children: "Top battery picks"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 247,
                                                columnNumber: 15
                                            }, this),
                                            catalogue.batteries.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        padding: "6px 0",
                                                        borderBottom: "1px solid #f6f6f6"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontWeight: 600
                                                                    },
                                                                    children: b.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 12,
                                                                        color: "#666"
                                                                    },
                                                                    children: [
                                                                        b.nominalV,
                                                                        "V · ",
                                                                        b.Ah,
                                                                        "Ah · ",
                                                                        b.chemistry
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                textAlign: "right"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontWeight: 700
                                                                    },
                                                                    children: [
                                                                        "$",
                                                                        b.unitCostUSD
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                    lineNumber: 255,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 12,
                                                                        color: "#666"
                                                                    },
                                                                    children: [
                                                                        b.weightKg,
                                                                        " kg"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                    lineNumber: 256,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                            lineNumber: 254,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, b.id, true, {
                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 17
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 8,
                                                    fontWeight: 700
                                                },
                                                children: "Recommended inverter options"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, this),
                                            catalogue.inverters.map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        padding: "6px 0",
                                                        borderBottom: "1px solid #f6f6f6"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontWeight: 600
                                                                    },
                                                                    children: inv.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                    lineNumber: 265,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 12,
                                                                        color: "#666"
                                                                    },
                                                                    children: [
                                                                        inv.powerW,
                                                                        " W · ",
                                                                        Math.round(inv.efficiency * 100),
                                                                        "% eff"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                    lineNumber: 266,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                            lineNumber: 264,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                textAlign: "right"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700
                                                                },
                                                                children: [
                                                                    "$",
                                                                    inv.unitCostUSD
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                            lineNumber: 268,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, inv.id, true, {
                                                    fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Notes & custom remarks"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        value: notes,
                                        onChange: (e)=>setNotes(e.target.value),
                                        placeholder: "Add project-specific notes or constraints here",
                                        style: {
                                            width: "100%",
                                            minHeight: 80,
                                            padding: 8
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            display: "flex",
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: exportReport,
                                                children: "Export report (JSON)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 280,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    // quick copy executive summary to clipboard
                                                    navigator.clipboard?.writeText(executiveSummary).then(()=>{
                                                        alert("Executive summary copied to clipboard");
                                                    }).catch(()=>{
                                                        alert("Copy not available");
                                                    });
                                                },
                                                children: "Copy executive summary"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 281,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 700,
                                    marginBottom: 8
                                },
                                children: "Quick diagnostics"
                            }, void 0, false, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #eee",
                                    padding: 12,
                                    borderRadius: 6,
                                    background: "#fff"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Daily energy"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 297,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            Math.round(dailyWh),
                                            " Wh/day"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Peak load (est)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 298,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            Math.round(peakLoadW),
                                            " W"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "PV recommendation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 299,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            pvRecommendation.pvW,
                                            " W (",
                                            pvRecommendation.panels,
                                            " panels)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Inverter"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 300,
                                                columnNumber: 18
                                            }, this),
                                            " ~",
                                            inverterRecommendationW,
                                            " W"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 700
                                                },
                                                children: "Chemistry comparison"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 303,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginBottom: 6
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                children: "Lithium"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                lineNumber: 305,
                                                                columnNumber: 50
                                                            }, this),
                                                            ": ",
                                                            chemistryAnalysis.lithium.sizing.totalUnits,
                                                            " units · lifecycle est $",
                                                            Math.round(chemistryAnalysis.lithium.lifecycleCost)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginBottom: 6
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                children: "Lead acid"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                lineNumber: 306,
                                                                columnNumber: 50
                                                            }, this),
                                                            ": ",
                                                            chemistryAnalysis.lead.sizing.totalUnits,
                                                            " units · lifecycle est $",
                                                            Math.round(chemistryAnalysis.lead.lifecycleCost)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 13,
                                                            color: "#666"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                children: "Recommended:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                                lineNumber: 307,
                                                                columnNumber: 62
                                                            }, this),
                                                            " ",
                                                            chemistryAnalysis.recommended.toUpperCase()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                        lineNumber: 307,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 304,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 700
                                                },
                                                children: "Confidence & tradeoffs"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 312,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 13,
                                                    color: "#444",
                                                    marginTop: 6
                                                },
                                                children: "Confidence is based on lifecycle cost and site fit. If you change unit costs, autonomy, or site constraints in Planner, the recommendation will update."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 313,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Professional tips"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Validate site shading with a sun-path or shading analysis before finalizing panel layout."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 322,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Specify a battery management system (BMS) and ensure inverter/charger compatibility with chosen chemistry."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Include surge margin for motors and pumps when sizing the inverter."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 324,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Plan for safe battery enclosure, ventilation (for flooded lead-acid), and weight distribution."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                                lineNumber: 325,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/placeholders/ReportPlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportPlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// src/components/placeholders/ReportPlaceholder.tsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/battery.ts [ssr] (ecmascript)");
;
;
;
function safeParse(raw) {
    try {
        if (!raw) return null;
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function computeDailyWhFromAppliances(appliances = []) {
    return (appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0) * Number(a?.hours || 0), 0);
}
function computePeakLoad(appliances = []) {
    return (appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0), 0);
}
function sizeForChemistry(project, chemistry) {
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
    const sizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])(opts);
    const unitCostDefault = chemistry === "lithium" ? 600 : 200;
    const unitCost = data.batteryUnitCost ?? unitCostDefault;
    const replacementYears = chemistry === "lithium" ? 12 : 4;
    const lifecycleReplacements = Math.max(0, Math.ceil(20 / replacementYears) - 1);
    const lifecycleCost = sizing.totalUnits * unitCost * (1 + lifecycleReplacements);
    return {
        sizing,
        lifecycleCost,
        replacementYears,
        unitCost
    };
}
function ReportPlaceholder() {
    const raw = localStorage.getItem("solarhome-local") || "{}";
    const project = safeParse(raw) || {
        data: {},
        totals: {}
    };
    const dailyWh = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>computeDailyWhFromAppliances(project.data?.appliances ?? []), [
        raw
    ]);
    const peakLoadW = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>computePeakLoad(project.data?.appliances ?? []), [
        raw
    ]);
    const panelWatt = project.data?.panelWattage ?? 300;
    const designMargin = project.data?.designMargin ?? 20;
    const sunHours = project.data?.sunHours ?? 5;
    const recommendedPVW = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>Math.ceil(dailyWh / Math.max(1, sunHours) * (1 + designMargin / 100)), [
        raw
    ]);
    const numberOfPanels = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>Math.ceil(recommendedPVW / panelWatt), [
        raw
    ]);
    const lithium = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>sizeForChemistry(project, "lithium"), [
        raw
    ]);
    const lead = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>sizeForChemistry(project, "lead-acid"), [
        raw
    ]);
    const totals = {
        dailyWh,
        peakLoadW,
        recommendedPVW,
        numberOfPanels,
        batteryLithiumUnits: lithium.sizing.totalUnits,
        batteryLeadUnits: lead.sizing.totalUnits,
        lithiumLifecycleCost: Math.round(lithium.lifecycleCost),
        leadLifecycleCost: Math.round(lead.lifecycleCost)
    };
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    function buildExecutiveSummary() {
        const projectName = project.data?.projectName ?? "Untitled project";
        const recChem = lithium.lifecycleCost <= lead.lifecycleCost ? "Lithium (recommended)" : "Lead acid (recommended)";
        const lines = [
            `${projectName} — System Report`,
            `Daily energy demand: ${Math.round(dailyWh)} Wh/day.`,
            `Peak estimated load: ${Math.round(peakLoadW)} W.`,
            `Recommended PV capacity: ${recommendedPVW} W (${numberOfPanels} × ${panelWatt}W panels).`,
            `Battery recommendation: ${recChem}.`,
            `Lithium bank: ${lithium.sizing.totalUnits} units (${lithium.sizing.seriesCount}S × ${lithium.sizing.parallelStrings}P), lifecycle est $${Math.round(lithium.lifecycleCost)}.`,
            `Lead acid bank: ${lead.sizing.totalUnits} units (${lead.sizing.seriesCount}S × ${lead.sizing.parallelStrings}P), lifecycle est $${Math.round(lead.lifecycleCost)}.`,
            `Primary rationale: recommendation balances lifecycle cost, usable capacity (DOD), and site fit. See detailed sections below.`
        ];
        return lines.join("\n");
    }
    function buildBOM() {
        const panelUnitCost = project.data?.panelUnitCost ?? 120;
        const inverterUnitCost = project.data?.inverterUnitCost ?? 300;
        const batteryUnitCost = project.data?.batteryUnitCost ?? 500;
        const panelsCost = numberOfPanels * panelUnitCost;
        const inverterW = Math.ceil(peakLoadW * 1.25 / 500) * 500 || 1500;
        const inverterCost = inverterUnitCost;
        const batteryUnits = lithium.sizing.totalUnits;
        const batteriesCost = batteryUnits * batteryUnitCost;
        const bosPercent = project.data?.bosPercent ?? 20;
        const installationPercent = project.data?.installationPercent ?? 10;
        const subtotal = panelsCost + inverterCost + batteriesCost;
        const bos = Math.round(bosPercent / 100 * subtotal);
        const installation = Math.round(installationPercent / 100 * subtotal);
        const total = subtotal + bos + installation;
        return {
            panels: {
                qty: numberOfPanels,
                unitCost: panelUnitCost,
                total: panelsCost
            },
            inverter: {
                qty: 1,
                unitCost: inverterCost,
                total: inverterCost,
                sizeW: inverterW
            },
            batteries: {
                qty: batteryUnits,
                unitCost: batteryUnitCost,
                total: batteriesCost
            },
            bos,
            installation,
            subtotal,
            total
        };
    }
    const bom = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>buildBOM(), [
        raw
    ]);
    function exportReportJSON() {
        const report = {
            meta: {
                generatedAt: new Date().toISOString(),
                projectName: project.data?.projectName ?? "Untitled"
            },
            summary: {
                dailyWh: totals.dailyWh,
                peakLoadW: totals.peakLoadW,
                recommendedPVW: totals.recommendedPVW,
                numberOfPanels: totals.numberOfPanels
            },
            batteryComparison: {
                lithium: {
                    units: lithium.sizing.totalUnits,
                    series: lithium.sizing.seriesCount,
                    parallel: lithium.sizing.parallelStrings,
                    lifecycleCost: Math.round(lithium.lifecycleCost)
                },
                leadAcid: {
                    units: lead.sizing.totalUnits,
                    series: lead.sizing.seriesCount,
                    parallel: lead.sizing.parallelStrings,
                    lifecycleCost: Math.round(lead.lifecycleCost)
                }
            },
            bom,
            notes
        };
        const blob = new Blob([
            JSON.stringify(report, null, 2)
        ], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(project.data?.projectName ?? "project").replace(/\s+/g, "-")}-report.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    /**
   * Robust printable flow:
   * 1) Create blob URL and try window.open(blobUrl)
   * 2) If blocked, create an anchor with target _blank and click it (user-gesture-like)
   * 3) If still blocked, download the HTML file
   * 4) If download fails, copy HTML to clipboard
   */ function openPrintableReport() {
        const reportHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>SolarHome Report - ${project.data?.projectName ?? "Project"}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; padding: 20px; }
            h1,h2,h3 { color: #0b7285; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .section { margin-bottom: 18px; }
            .muted { color: #666; font-size: 13px; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body>
          <h1>SolarHome System Report</h1>
          <h2>${project.data?.projectName ?? "Untitled project"}</h2>
          <div class="section">
            <h3>Executive summary</h3>
            <pre>${buildExecutiveSummary()}</pre>
          </div>

          <div class="section">
            <h3>Load analysis</h3>
            <table>
              <tr><th>Daily energy (Wh/day)</th><td>${Math.round(dailyWh)}</td></tr>
              <tr><th>Peak load (W)</th><td>${Math.round(peakLoadW)}</td></tr>
              <tr><th>Autonomy (days)</th><td>${project.data?.autonomyDays ?? 1}</td></tr>
            </table>
          </div>

          <div class="section">
            <h3>PV sizing</h3>
            <table>
              <tr><th>Recommended PV (W)</th><td>${recommendedPVW}</td></tr>
              <tr><th>Panel model</th><td>${panelWatt} W (example)</td></tr>
              <tr><th>Number of panels</th><td>${numberOfPanels}</td></tr>
            </table>
          </div>

          <div class="section">
            <h3>Battery comparison</h3>
            <table>
              <tr><th></th><th>Lithium</th><th>Lead acid</th></tr>
              <tr><td>Units</td><td>${lithium.sizing.totalUnits}</td><td>${lead.sizing.totalUnits}</td></tr>
              <tr><td>Config</td><td>${lithium.sizing.seriesCount}S × ${lithium.sizing.parallelStrings}P</td><td>${lead.sizing.seriesCount}S × ${lead.sizing.parallelStrings}P</td></tr>
              <tr><td>Lifecycle cost (est)</td><td>$${Math.round(lithium.lifecycleCost)}</td><td>$${Math.round(lead.lifecycleCost)}</td></tr>
            </table>
          </div>

          <div class="section">
            <h3>BOM & cost summary</h3>
            <table>
              <tr><th>Item</th><th>Qty</th><th>Unit cost</th><th>Total</th></tr>
              <tr><td>Panels</td><td>${bom.panels.qty}</td><td>$${bom.panels.unitCost}</td><td>$${bom.panels.total}</td></tr>
              <tr><td>Inverter</td><td>${bom.inverter.qty}</td><td>$${bom.inverter.unitCost}</td><td>$${bom.inverter.total}</td></tr>
              <tr><td>Batteries (example)</td><td>${bom.batteries.qty}</td><td>$${bom.batteries.unitCost}</td><td>$${bom.batteries.total}</td></tr>
              <tr><td>Balance of system (est)</td><td></td><td></td><td>$${bom.bos}</td></tr>
              <tr><td>Installation (est)</td><td></td><td></td><td>$${bom.installation}</td></tr>
              <tr><th colspan="3">Total estimated project cost</th><th>$${bom.total}</th></tr>
            </table>
          </div>

          <div class="section">
            <h3>Recommendations & next steps</h3>
            <ol>
              <li>Confirm site constraints (roof area, shading, structural capacity).</li>
              <li>Refine equipment selection with supplier quotes and inverter surge requirements.</li>
              <li>Plan installation with certified installer and include commissioning tests.</li>
              <li>Define maintenance and replacement schedule based on chosen chemistry.</li>
            </ol>
          </div>

          <div class="muted">Generated by SolarHome on ${new Date().toLocaleString()}</div>
        </body>
      </html>
    `;
        const blob = new Blob([
            reportHtml
        ], {
            type: "text/html"
        });
        const url = URL.createObjectURL(blob);
        // 1) Try window.open(blobUrl)
        try {
            const newWin = window.open(url, "_blank", "noopener,noreferrer");
            if (newWin) {
                try {
                    newWin.focus();
                } catch  {}
                setTimeout(()=>URL.revokeObjectURL(url), 2000);
                return;
            }
        } catch (e) {
        // ignore and try next fallback
        }
        // 2) Try anchor with target _blank (some blockers allow anchor clicks initiated by user event)
        try {
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            // Some browsers require the element to be in the DOM for click to work reliably
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            // If the click succeeded, revoke after short delay
            setTimeout(()=>URL.revokeObjectURL(url), 2000);
            // Note: we cannot reliably detect if the click opened a window; assume success and return.
            return;
        } catch (e) {
        // ignore and try next fallback
        }
        // 3) Popup blocked: fallback to download the HTML file
        try {
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(project.data?.projectName ?? "project").replace(/\s+/g, "-")}-report.html`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(()=>URL.revokeObjectURL(url), 2000);
            alert("Popup blocked. A printable HTML file was downloaded — open it and print from your browser.");
            return;
        } catch (err) {
        // ignore and try final fallback
        }
        // 4) Final fallback: copy HTML to clipboard
        try {
            navigator.clipboard?.writeText(reportHtml);
            alert("Popup blocked and download failed. Printable HTML copied to clipboard — paste into a file and open it to print.");
        } catch  {
            alert("Popup blocked and fallback failed. Please allow popups for this site, disable blocking extensions, or use the Download JSON report button.");
        }
    }
    const executiveSummary = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>buildExecutiveSummary(), [
        raw,
        notes
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "Project Report"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 360px",
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #eef6f5",
                                    padding: 12,
                                    borderRadius: 6,
                                    background: "#fbfffe"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Executive Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("pre", {
                                        style: {
                                            whiteSpace: "pre-wrap",
                                            margin: 0
                                        },
                                        children: executiveSummary
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Detailed Analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #eee",
                                            padding: 12,
                                            borderRadius: 6,
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 600
                                                },
                                                children: "Load Analysis"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 344,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Daily energy: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            Math.round(dailyWh),
                                                            " Wh/day"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 345,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Peak load (est): ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            Math.round(peakLoadW),
                                                            " W"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 346,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Autonomy: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            project.data?.autonomyDays ?? 1,
                                                            " days"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 30
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #eee",
                                            padding: 12,
                                            borderRadius: 6,
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 600
                                                },
                                                children: "PV Sizing"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Recommended PV: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            recommendedPVW,
                                                            " W"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 352,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Panels: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            numberOfPanels,
                                                            " × ",
                                                            panelWatt,
                                                            "W"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 353,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Design margin: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            designMargin,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 354,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Sun hours used: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            sunHours,
                                                            " h/day"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 355,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #eee",
                                            padding: 12,
                                            borderRadius: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 600
                                                },
                                                children: "Battery Comparison"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 359,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                children: "Lithium"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                                lineNumber: 361,
                                                                columnNumber: 22
                                                            }, this),
                                                            ": ",
                                                            lithium.sizing.totalUnits,
                                                            " units — ",
                                                            lithium.sizing.seriesCount,
                                                            "S × ",
                                                            lithium.sizing.parallelStrings,
                                                            "P — lifecycle est $",
                                                            Math.round(lithium.lifecycleCost)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: 6
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                children: "Lead acid"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 47
                                                            }, this),
                                                            ": ",
                                                            lead.sizing.totalUnits,
                                                            " units — ",
                                                            lead.sizing.seriesCount,
                                                            "S × ",
                                                            lead.sizing.parallelStrings,
                                                            "P — lifecycle est $",
                                                            Math.round(lead.lifecycleCost)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 360,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Recommendations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 368,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ol", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Confirm site constraints (roof area, shading, structural capacity)."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 370,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Obtain supplier quotes for panels, inverter, and batteries; update unit costs in Planner."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 371,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Prefer lithium if lifecycle cost and space/weight are priorities; prefer lead acid if strict upfront budget constraints exist."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 372,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Engage a certified installer for mounting, wiring, earthing, and commissioning."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 373,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 369,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Project notes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        value: notes,
                                        onChange: (e)=>setNotes(e.target.value),
                                        placeholder: "Add project-specific notes or constraints here",
                                        style: {
                                            width: "100%",
                                            minHeight: 100,
                                            padding: 8
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 379,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12,
                                    display: "flex",
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: exportReportJSON,
                                        children: "Download JSON report"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 383,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            navigator.clipboard?.writeText(executiveSummary).then(()=>{
                                                alert("Executive summary copied to clipboard");
                                            }).catch(()=>{
                                                alert("Copy not available");
                                            });
                                        },
                                        children: "Copy executive summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 384,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: openPrintableReport,
                                        children: "Open printable report"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #eee",
                                    padding: 12,
                                    borderRadius: 6,
                                    background: "#fff"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Quick facts"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 397,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Project: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: project.data?.projectName ?? "Untitled"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 398,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Daily energy: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    Math.round(dailyWh),
                                                    " Wh/day"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 399,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 399,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Recommended PV: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    recommendedPVW,
                                                    " W"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 400,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Panels: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: numberOfPanels
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 401,
                                                columnNumber: 26
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: "BOM summary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                            lineNumber: 402,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 402,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Panels cost: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "$",
                                                    bom.panels.total
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 403,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 403,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Inverter cost: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "$",
                                                    bom.inverter.total
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 404,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Batteries cost (example): ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "$",
                                                    bom.batteries.total
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 405,
                                                columnNumber: 44
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8,
                                            fontWeight: 700
                                        },
                                        children: "Estimated total"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 18
                                        },
                                        children: [
                                            "$",
                                            bom.total
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 407,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 396,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12,
                                    border: "1px solid #eee",
                                    padding: 12,
                                    borderRadius: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Professional checklist"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 411,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                        style: {
                                            margin: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Shading analysis completed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 413,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Structural assessment for roof"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 414,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Inverter surge and continuous rating verified"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 415,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Battery BMS and charger compatibility checked"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 416,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Installation & commissioning plan defined"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                                lineNumber: 417,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                        lineNumber: 412,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                        lineNumber: 395,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
                lineNumber: 333,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/ReportPlaceholder.tsx",
        lineNumber: 330,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/placeholders/DeployPlaceholder.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DeployPlaceholder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// src/components/placeholders/DeployPlaceholder.tsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/battery.ts [ssr] (ecmascript)");
;
;
;
function safeParse(raw) {
    try {
        if (!raw) return null;
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function computeDailyWhFromAppliances(appliances = []) {
    return (appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0) * Number(a?.hours || 0), 0);
}
function computePeakLoad(appliances = []) {
    return (appliances || []).reduce((s, a)=>s + Number(a?.watts || 0) * Number(a?.qty || 0), 0);
}
function summarizeProject(project) {
    const data = project?.data ?? {};
    const dailyWh = computeDailyWhFromAppliances(data.appliances ?? []);
    const peakLoad = computePeakLoad(data.appliances ?? []);
    const sunHours = data.sunHours ?? 5;
    const designMargin = data.designMargin ?? 20;
    const panelWatt = data.panelWattage ?? 300;
    const recommendedPVW = Math.ceil(dailyWh / Math.max(1, sunHours) * (1 + designMargin / 100));
    const numberOfPanels = Math.ceil(recommendedPVW / panelWatt);
    const lithium = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])({
        dailyWh,
        autonomyDays: data.autonomyDays ?? 1,
        systemVoltage: data.systemVoltage ?? 48,
        batteryNominalV: data.batteryNominalV ?? 12,
        batteryAhPerUnit: data.batteryUnitAh ?? 200,
        depthOfDischarge: 0.8,
        inverterEfficiency: data.inverterEfficiency ?? 0.9
    });
    const lead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])({
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
function DeployPlaceholder() {
    const raw = localStorage.getItem("solarhome-local") || "{}";
    const project = safeParse(raw) || {
        data: {},
        totals: {}
    };
    const summary = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>summarizeProject(project), [
        raw
    ]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
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
        const blob = new Blob([
            JSON.stringify(payload, null, 2)
        ], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(payload.projectName ?? "project").replace(/\s+/g, "-")}-handoff-${payload.version}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(()=>URL.revokeObjectURL(url), 1000);
    }
    function buildHandoffHtml(payload) {
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
   */ function openPrintableHandoff() {
        const payload = buildHandoffPayload();
        const html = buildHandoffHtml(payload);
        const blob = new Blob([
            html
        ], {
            type: "text/html"
        });
        const url = URL.createObjectURL(blob);
        // 1) Try to open blob URL in a new tab/window
        try {
            const newWin = window.open(url, "_blank", "noopener,noreferrer");
            if (newWin) {
                try {
                    newWin.focus();
                } catch  {}
                setTimeout(()=>URL.revokeObjectURL(url), 2000);
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
            setTimeout(()=>URL.revokeObjectURL(url), 2000);
            return;
        } catch (e) {
        // continue to next fallback
        }
        // 3) Fallback: open in same tab (navigates away but avoids popup blocking)
        try {
            window.location.assign(url);
            setTimeout(()=>URL.revokeObjectURL(url), 5000);
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
            setTimeout(()=>URL.revokeObjectURL(url), 2000);
            alert("Popup blocked. A printable HTML file was downloaded — open it and print from your browser.");
            return;
        } catch (err) {
        // continue to final fallback
        }
        // 5) Final fallback: copy HTML to clipboard
        try {
            navigator.clipboard?.writeText(html);
            alert("Popup blocked and download failed. Printable HTML copied to clipboard — paste into a file and open it to print.");
        } catch  {
            alert("Popup blocked and fallback failed. Please allow popups for this site, disable blocking extensions, or use the Export handoff (JSON) button.");
        }
    }
    function copyHandoffSummary() {
        const payload = buildHandoffPayload();
        const summaryText = `Handoff — ${payload.projectName}\nRecommended PV: ${payload.pv.recommendedPVW} W (${payload.pv.numberOfPanels} × ${payload.pv.panelWatt}W)\nRecommended chemistry: ${payload.recommendedChemistry}\nNotes: ${payload.notes || "None"}`;
        navigator.clipboard?.writeText(summaryText).then(()=>{
            alert("Handoff summary copied to clipboard");
        }).catch(()=>{
            alert("Copy not available");
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "Deployment Handoff"
            }, void 0, false, {
                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 320px",
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #eef6f5",
                                    padding: 12,
                                    borderRadius: 6,
                                    background: "#fbfffe"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Quick Handoff Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 318,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Daily energy: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    Math.round(summary.dailyWh),
                                                    " Wh/day"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 319,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Peak load: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    Math.round(summary.peakLoad),
                                                    " W"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 320,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Recommended PV: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    summary.recommendedPVW,
                                                    " W"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 321,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Panels: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    summary.numberOfPanels,
                                                    " × ",
                                                    summary.panelWatt,
                                                    "W"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 322,
                                                columnNumber: 26
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: "Battery examples"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                            lineNumber: 323,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Lithium: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: summary.lithium.totalUnits
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 324,
                                                columnNumber: 27
                                            }, this),
                                            " units (",
                                            summary.lithium.seriesCount,
                                            "S × ",
                                            summary.lithium.parallelStrings,
                                            "P)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Lead acid: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: summary.lead.totalUnits
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 325,
                                                columnNumber: 29
                                            }, this),
                                            " units (",
                                            summary.lead.seriesCount,
                                            "S × ",
                                            summary.lead.parallelStrings,
                                            "P)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Installer notes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        value: notes,
                                        onChange: (e)=>setNotes(e.target.value),
                                        placeholder: "Add site-specific handoff notes for the installer",
                                        style: {
                                            width: "100%",
                                            minHeight: 120,
                                            padding: 8
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                lineNumber: 328,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12,
                                    display: "flex",
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: downloadHandoffJson,
                                        children: "Export handoff (JSON)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: openPrintableHandoff,
                                        children: "Open printable handoff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: copyHandoffSummary,
                                        children: "Copy summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #eee",
                                    padding: 12,
                                    borderRadius: 6,
                                    background: "#fff"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Handoff checklist"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                        style: {
                                            margin: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Confirm roof area and mounting plan"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 344,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Verify inverter continuous and surge ratings"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 345,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Confirm battery BMS and charger compatibility"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 346,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Plan cable runs and conduit routes"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                children: "Schedule commissioning and performance test"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                                lineNumber: 348,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12,
                                    border: "1px solid #eee",
                                    padding: 12,
                                    borderRadius: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 700,
                                            marginBottom: 8
                                        },
                                        children: "Export notes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 353,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            color: "#666"
                                        },
                                        children: "The printable handoff opens in a new tab when allowed. If your browser blocks popups, the app will attempt several fallbacks: anchor click, same-tab navigation, file download, and finally copying the HTML to your clipboard."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                        lineNumber: 354,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/placeholders/DeployPlaceholder.tsx",
        lineNumber: 312,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/SolarHomeSystemPlanner.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>SolarHomeSystemPlanner
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// src/components/SolarHomeSystemPlanner.tsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hook$2d$form__$5b$external$5d$__$28$react$2d$hook$2d$form$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$29$__ = __turbopack_context__.i("[externals]/react-hook-form [external] (react-hook-form, esm_import, [project]/node_modules/react-hook-form)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__ = __turbopack_context__.i("[externals]/zod [external] (zod, esm_import, [project]/node_modules/zod)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloud.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useAuthStub$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/useAuthStub.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$DesignPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/DesignPlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$ResultsPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/ResultsPlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$CostPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/CostPlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$ComparePlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/ComparePlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$AIAdvisorPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/AIAdvisorPlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$ReportPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/ReportPlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$DeployPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/placeholders/DeployPlaceholder.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/battery.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hook$2d$form__$5b$external$5d$__$28$react$2d$hook$2d$form$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hook$2d$form__$5b$external$5d$__$28$react$2d$hook$2d$form$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const ProjectSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].object({
    projectName: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].string().min(1),
    appliances: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].array(__TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].string(),
        watts: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
        qty: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
        hours: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number()
    })),
    sunHours: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    autonomyDays: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    systemVoltage: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    panelWattage: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    batteryUnitAh: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    batteryNominalV: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number().optional(),
    depthOfDischarge: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number().optional(),
    inverterEfficiency: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number().optional(),
    designMargin: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    panelUnitCost: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    batteryUnitCost: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    inverterUnitCost: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    controllerUnitCost: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    bosPercent: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number(),
    installationPercent: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$zod$29$__["z"].number()
});
function SolarHomeSystemPlanner() {
    const { user, login, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useAuthStub$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAuthStub"])();
    const [lastCloudProjectId, setLastCloudProjectId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("Planner");
    const { register, control, handleSubmit, watch } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hook$2d$form__$5b$external$5d$__$28$react$2d$hook$2d$form$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$29$__["useForm"])({
        defaultValues: {
            projectName: "My Solar Plan",
            appliances: [
                {
                    name: "LED Bulb",
                    watts: 10,
                    qty: 4,
                    hours: 5
                }
            ],
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
    const { fields, append, remove } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$hook$2d$form__$5b$external$5d$__$28$react$2d$hook$2d$form$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$29$__["useFieldArray"])({
        control,
        name: "appliances"
    });
    const watched = watch();
    function computeDailyWh(appliances = []) {
        return (appliances || []).reduce((s, a)=>s + Number(a.watts || 0) * Number(a.qty || 0) * Number(a.hours || 0), 0);
    }
    const computeTotals = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const dailyWh = computeDailyWh(watched.appliances || []);
        const recommendedPVW = Math.ceil(dailyWh / (watched.sunHours || 1) * (1 + (watched.designMargin || 0) / 100));
        const numberOfPanels = Math.ceil(recommendedPVW / (watched.panelWattage || 300));
        const totalEstimatedCost = (watched.panelUnitCost || 0) * numberOfPanels;
        return {
            dailyWh,
            recommendedPVW,
            totalEstimatedCost,
            numberOfPanels
        };
    }, [
        watched
    ]);
    const batterySizing = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const dailyWh = computeDailyWh(watched.appliances || []);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$battery$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sizeBatteries"])({
            dailyWh,
            autonomyDays: watched.autonomyDays ?? 1,
            systemVoltage: watched.systemVoltage ?? 48,
            batteryNominalV: watched.batteryNominalV ?? 12,
            batteryAhPerUnit: watched.batteryUnitAh ?? 200,
            depthOfDischarge: watched.depthOfDischarge ?? 0.5,
            inverterEfficiency: watched.inverterEfficiency ?? 0.9
        });
    }, [
        watched
    ]);
    const onSaveLocal = (data)=>{
        const totals = {
            dailyWh: computeTotals.dailyWh,
            recommendedPVW: computeTotals.recommendedPVW,
            numberOfPanels: computeTotals.numberOfPanels,
            totalEstimatedCost: computeTotals.totalEstimatedCost,
            batteryUnits: batterySizing.totalUnits
        };
        localStorage.setItem("solarhome-local", JSON.stringify({
            data,
            totals,
            savedAt: new Date().toISOString()
        }));
        alert("Saved on this device");
    };
    const onSaveCloud = async (data)=>{
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
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["saveProjectCloud"])({
                ...data,
                totals
            });
            setLastCloudProjectId(res.project.id);
            alert("Saved to cloud");
        } catch (err) {
            console.error(err);
            alert("Cloud save failed: " + (err?.message ?? "unknown"));
        } finally{
            setSaving(false);
        }
    };
    function renderTab() {
        switch(activeTab){
            case "Planner":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit(onSaveLocal),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        children: "Project name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        ...register("projectName"),
                                        style: {
                                            width: "100%"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 161,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                lineNumber: 159,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                        children: "Appliances"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 165,
                                        columnNumber: 17
                                    }, this),
                                    fields.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                gap: 8,
                                                marginBottom: 6
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    ...register(`appliances.${i}.name`),
                                                    placeholder: "Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    ...register(`appliances.${i}.watts`),
                                                    placeholder: "Watts"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    ...register(`appliances.${i}.qty`),
                                                    placeholder: "Qty"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    ...register(`appliances.${i}.hours`),
                                                    placeholder: "Hours/day"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>remove(i),
                                                    children: "Remove"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, f.id, true, {
                                            fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                            lineNumber: 167,
                                            columnNumber: 19
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>append({
                                                name: "New",
                                                watts: 100,
                                                qty: 1,
                                                hours: 1
                                            }),
                                        children: "Add"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                        children: "Battery Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 180,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                children: "System Voltage (V)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 183,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                ...register("systemVoltage"),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: 12,
                                                        children: "12V"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: 24,
                                                        children: "24V"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: 48,
                                                        children: "48V"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 184,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 182,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                children: "Battery Nominal Voltage (V)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                ...register("batteryNominalV"),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: 12,
                                                        children: "12V"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: 24,
                                                        children: "24V"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: 48,
                                                        children: "48V"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 193,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                children: "Battery Capacity (Ah)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 201,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                ...register("batteryUnitAh")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 202,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 200,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                children: "Depth of Discharge (fraction)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 206,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.01",
                                                ...register("depthOfDischarge")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 207,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 205,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                children: "Autonomy (days)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                ...register("autonomyDays")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                children: "Inverter Efficiency (fraction)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 216,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.01",
                                                ...register("inverterEfficiency")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                lineNumber: 179,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        children: "Save on this device"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 222,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: !user || saving,
                                        onClick: handleSubmit(onSaveCloud),
                                        style: {
                                            marginLeft: 8
                                        },
                                        children: saving ? "Saving..." : user ? "Save to my account" : "Sign in to save"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 223,
                                        columnNumber: 17
                                    }, this),
                                    lastCloudProjectId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["downloadPdf"])(lastCloudProjectId),
                                        style: {
                                            marginLeft: 8
                                        },
                                        children: "Download PDF"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 232,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                                style: {
                                    marginTop: 16,
                                    padding: 12,
                                    background: "#fafafa",
                                    borderRadius: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Daily Wh"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 239,
                                                columnNumber: 22
                                            }, this),
                                            " ",
                                            computeTotals.dailyWh
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Recommended PV W"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 240,
                                                columnNumber: 22
                                            }, this),
                                            " ",
                                            computeTotals.recommendedPVW
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 240,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Panels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 241,
                                                columnNumber: 22
                                            }, this),
                                            " ",
                                            computeTotals.numberOfPanels
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 241,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Estimated cost"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 242,
                                                columnNumber: 22
                                            }, this),
                                            " $",
                                            computeTotals.totalEstimatedCost
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 242,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: "Batteries required"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                                lineNumber: 245,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            batterySizing.totalUnits,
                                            " units"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            color: "#666"
                                        },
                                        children: [
                                            batterySizing.seriesCount,
                                            " in series × ",
                                            batterySizing.parallelStrings,
                                            " parallel strings; usable Ah per string ",
                                            batterySizing.usableAhPerString?.toFixed?.(0) ?? "N/A",
                                            " Ah."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                        lineNumber: 247,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                lineNumber: 238,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                        lineNumber: 158,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 157,
                    columnNumber: 11
                }, this);
            case "Design":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$DesignPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 255,
                    columnNumber: 16
                }, this);
            case "Results":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$ResultsPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 257,
                    columnNumber: 16
                }, this);
            case "Cost":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$CostPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 259,
                    columnNumber: 16
                }, this);
            case "Compare":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$ComparePlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 261,
                    columnNumber: 16
                }, this);
            case "AI Advisor":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$AIAdvisorPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 263,
                    columnNumber: 16
                }, this);
            case "Report":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$ReportPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 265,
                    columnNumber: 16
                }, this);
            case "Deploy":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$placeholders$2f$DeployPlaceholder$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                    lineNumber: 267,
                    columnNumber: 16
                }, this);
            default:
                return null;
        }
    }
    const tabs = [
        "Planner",
        "Design",
        "Results",
        "Cost",
        "Compare",
        "AI Advisor",
        "Report",
        "Deploy"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        style: {
                            margin: 0
                        },
                        children: "Planner"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    style: {
                                        marginRight: 8
                                    },
                                    children: user.email
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: logout,
                                    children: "Sign out"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: login,
                            children: "Sign in (stub)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                            lineNumber: 286,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 12,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap"
                },
                children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(t),
                        style: {
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: activeTab === t ? "2px solid #0ea5a4" : "1px solid #ddd",
                            background: activeTab === t ? "#ecfeff" : "#fff",
                            cursor: "pointer"
                        },
                        children: t
                    }, t, false, {
                        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: renderTab()
            }, void 0, false, {
                fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SolarHomeSystemPlanner.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/MyProjectsDashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyProjectsDashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloud.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useAuthStub$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/useAuthStub.ts [ssr] (ecmascript)");
;
;
;
;
function MyProjectsDashboard({ onOpenProject }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useAuthStub$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAuthStub"])();
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const load = async ()=>{
        if (!user) return;
        setLoading(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["listProjects"])();
            setProjects(res.projects || []);
        } catch (err) {
            console.error(err);
            alert('Failed to load projects');
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        load();
    }, [
        user
    ]);
    const archive = async (id)=>{
        const r = await fetch('/api/projects/archive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        });
        if (!r.ok) {
            alert('Archive failed');
            return;
        }
        await load();
    };
    if (!user) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: "Sign in to view your projects"
    }, void 0, false, {
        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
        lineNumber: 32,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            background: '#fff',
            padding: 12,
            borderRadius: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                children: "My Projects"
            }, void 0, false, {
                fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                lineNumber: 37,
                columnNumber: 19
            }, this),
            !loading && projects.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: "No projects yet"
            }, void 0, false, {
                fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                lineNumber: 38,
                columnNumber: 45
            }, this),
            projects.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        borderTop: '1px solid #eee',
                        paddingTop: 8,
                        marginTop: 8
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 600
                                        },
                                        children: p.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#666',
                                            fontSize: 12
                                        },
                                        children: p.updated_at ? new Date(p.updated_at).toLocaleString() : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onOpenProject(p.id),
                                        children: "Open"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloud$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["downloadPdf"])(p.id),
                                        children: "PDF"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>archive(p.id),
                                        children: "Archive"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                        lineNumber: 49,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this)
                }, p.id, false, {
                    fileName: "[project]/src/components/MyProjectsDashboard.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MyProjectsDashboard.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SolarHomeSystemPlanner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SolarHomeSystemPlanner.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MyProjectsDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MyProjectsDashboard.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SolarHomeSystemPlanner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SolarHomeSystemPlanner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 24,
            fontFamily: 'Inter, system-ui, sans-serif'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                style: {
                    marginBottom: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        style: {
                            margin: 0
                        },
                        children: "SolarHome Planner"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        style: {
                            marginTop: 6,
                            color: '#555'
                        },
                        children: "Estimate panels, batteries, and costs. Save projects and download a PDF."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 360px',
                    gap: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SolarHomeSystemPlanner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MyProjectsDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        onOpenProject: (id)=>{
                            console.log('Open project', id);
                            alert('Open project ' + id + ' (preview stub)');
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/index.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02ni8ef._.js.map