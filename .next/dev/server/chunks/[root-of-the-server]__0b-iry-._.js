module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/pages/api/projects/save.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__ = __turbopack_context__.i("[externals]/uuid [external] (uuid, esm_import, [project]/node_modules/uuid)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
/**
 * Minimal in-memory fallback for preview.
 * In production replace with Supabase server client using SUPABASE_SERVICE_ROLE_KEY.
 */ const DB_KEY = 'solarhome_preview_projects';
function readDB() {
    try {
        return JSON.parse(process.env[DB_KEY] || '[]');
    } catch  {
        return [];
    }
}
function writeDB(arr) {
    process.env[DB_KEY] = JSON.stringify(arr);
}
async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({
        error: 'Method not allowed'
    });
    const body = req.body;
    const projects = readDB();
    const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__["v4"])();
    const now = new Date().toISOString();
    const project = {
        id,
        name: body.projectName || 'Untitled',
        payload: body,
        totals: body.totals || null,
        created_at: now,
        updated_at: now,
        archived: false
    };
    projects.push(project);
    writeDB(projects);
    return res.status(201).json({
        project
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0b-iry-._.js.map