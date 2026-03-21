import type { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const DB_KEY = 'solarhome_preview_projects';
function readDB() { try { return JSON.parse(process.env[DB_KEY] || '[]'); } catch { return []; } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id || '');
  if (!id) return res.status(400).send('Missing id');
  const projects = readDB();
  const project = projects.find((p: any) => p.id === id);
  if (!project) return res.status(404).send('Not found');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText('SolarHome Planner Project', { x: 40, y: 740, size: 18, font, color: rgb(0.04, 0.47, 0.45) });
  page.drawText(`Name: ${project.name}`, { x: 40, y: 700, size: 12, font });
  page.drawText(`Created: ${project.created_at}`, { x: 40, y: 680, size: 10, font });
  page.drawText(`Estimated cost: ${project.totals?.totalEstimatedCost ?? 'N/A'}`, { x: 40, y: 660, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${project.name}.pdf"`);
  return res.send(Buffer.from(pdfBytes));
}

