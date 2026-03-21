module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/pages/api/projects/list.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
const DB_KEY = 'solarhome_preview_projects';
function readDB() {
    try {
        return JSON.parse(process.env[DB_KEY] || '[]');
    } catch  {
        return [];
    }
}
async function handler(req, res) {
    const projects = readDB();
    return res.status(200).json({
        projects: projects.filter((p)=>!p.archived)
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0~2hilu._.js.map