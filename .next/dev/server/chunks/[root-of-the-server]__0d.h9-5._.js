module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/pages/api/projects/pdf.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__ = __turbopack_context__.i("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib)");
;
const DB_KEY = 'solarhome_preview_projects';
function readDB() {
    try {
        return JSON.parse(process.env[DB_KEY] || '[]');
    } catch  {
        return [];
    }
}
async function handler(req, res) {
    const id = String(req.query.id || '');
    if (!id) return res.status(400).send('Missing id');
    const projects = readDB();
    const project = projects.find((p)=>p.id === id);
    if (!project) return res.status(404).send('Not found');
    const pdfDoc = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].create();
    const page = pdfDoc.addPage([
        612,
        792
    ]);
    const font = await pdfDoc.embedFont(__TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["StandardFonts"].Helvetica);
    page.drawText('SolarHome Planner Project', {
        x: 40,
        y: 740,
        size: 18,
        font,
        color: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["rgb"])(0.04, 0.47, 0.45)
    });
    page.drawText(`Name: ${project.name}`, {
        x: 40,
        y: 700,
        size: 12,
        font
    });
    page.drawText(`Created: ${project.created_at}`, {
        x: 40,
        y: 680,
        size: 10,
        font
    });
    page.drawText(`Estimated cost: ${project.totals?.totalEstimatedCost ?? 'N/A'}`, {
        x: 40,
        y: 660,
        size: 12,
        font
    });
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name}.pdf"`);
    return res.send(Buffer.from(pdfBytes));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d.h9-5._.js.map