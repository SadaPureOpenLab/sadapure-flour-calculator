import { CATALOGUE, DATA, ORIGINAL, allocate, parseQuantity, validateBlend, type Row, type Blend } from './engine';
export type Sheet = { rows: Row[]; grams: number; classification: string };
const quote = (text: string) => '"' + text.replaceAll('"', '""') + '"';
export function csv(sheet: Sheet) {
  const fields = [['Classification', sheet.classification], ['Formula version', DATA.version], ['Retrieved', DATA.retrievedDate], ['Source', DATA.sourceUrl], ['Total flour (g)', String(sheet.grams)], [], ['Ingredient', 'Roman Urdu', 'Percentage', 'Weight (g)', 'Category', 'Allergen notes']];
  for (const row of sheet.rows) fields.push([row.name, row.roman, String(row.share), row.grams.toFixed(2), row.group, row.allergens.join('; ') || 'No guarantee; check ingredient and cross-contact']);
  fields.push(['TOTAL', '', '100', sheet.grams.toFixed(2)]);
  return '\uFEFF' + fields.map(line => line.map(quote).join(',')).join('\r\n');
}
export function summary(sheet: Sheet) { return `${sheet.classification}\n${sheet.grams} g flour\n${sheet.rows.map(r => `${r.name}: ${r.share}% = ${r.grams.toFixed(2)} g`).join('\n')}\nNot an allergy-safe or therapeutic recommendation.\nSource: ${DATA.sourceUrl}\nSnapshot: ${DATA.version}`; }
export function downloadCSV(sheet: Sheet) {
  const url = URL.createObjectURL(new Blob([csv(sheet)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'sadapure-blend.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function downloadPDF(sheet: Sheet) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text('SadaPure Smart Flour (Atta) Builder', 16, 21);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text(sheet.classification.replaceAll('—','-'), 16, 31); doc.text(`Total flour: ${sheet.grams} g | Snapshot: ${DATA.version}`, 16, 38);
  const header=(y:number)=>{doc.setFont('helvetica','bold');doc.text('Ingredient',16,y);doc.text('%',143,y);doc.text('Weight (g)',163,y);doc.setFont('helvetica','normal');};
  header(49);let y=58;
  for(const row of sheet.rows){if(y>245){doc.addPage();doc.setFontSize(10);doc.text('SadaPure ingredient breakdown (continued)',16,20);header(31);y=40;}doc.text(row.name,16,y);doc.text(String(row.share),143,y);doc.text(row.grams.toFixed(2),163,y);y+=7;}
  if(y+70>280){doc.addPage();y=25;}
  doc.text(`TOTAL: 100% / ${sheet.grams.toFixed(2)} g`,16,y+5);
  const notes = ['Ingredient arithmetic only; not a treatment, dietary prescription or medical recipe.', 'Original blend contains wheat, barley, rye and sesame. It is not gluten-free.', 'Custom ingredient safety, cross-contact and cooking suitability are unverified.', 'Weights rounded to 0.01 g using largest-remainder allocation; total is preserved.', `Published table retrieved ${DATA.retrievedDate}:`, DATA.sourceUrl, 'Additional library entries have no validated nutrient mapping. Reference: fdc.nal.usda.gov', 'PDF uses English. Use Print for Urdu names.'];
  doc.setFontSize(8); notes.forEach((line, i) => doc.text(line, 16, y+18+i*6));
  const count=doc.getNumberOfPages();for(let page=1;page<=count;page++){doc.setPage(page);doc.setFontSize(8);doc.text(`${page} / ${count}`,185,288);}
  doc.save('sadapure-blend.pdf');
}
export function shareUrl(quantity: string, blend: Blend, custom: boolean): string {
  parseQuantity(quantity); validateBlend(blend);
  const url = new URL(window.location.href); url.search = ''; url.hash = '';
  url.searchParams.set('kg', quantity);
  if (custom) { url.searchParams.set('v','2'); url.searchParams.set('mix', CATALOGUE.map(i => blend[i.id]).join(',')); }
  return url.href;
}
export function readShared(search: string): { quantity: string; blend: Blend; custom: boolean; notice: string } {
  try {
    const params = new URLSearchParams(search), quantity = params.get('kg') ?? '2.5'; parseQuantity(quantity);
    const mix = params.get('mix');
    if (!mix) return { quantity, blend: { ...ORIGINAL }, custom: false, notice: '' };
    const parts = mix.split(',');
    const ingredients = params.get('v') === '2' ? CATALOGUE : DATA.ingredients;
    if (parts.length !== ingredients.length || parts.some(p => !/^\d{1,5}$/.test(p))) throw new Error('Invalid shared mix');
    const blend = { ...Object.fromEntries(CATALOGUE.map(i=>[i.id,0])), ...Object.fromEntries(ingredients.map((i, index) => [i.id, Number(parts[index])])) }; validateBlend(blend);
    return { quantity, blend, custom: true, notice: 'Shared custom educational mix. Not an official product.' };
  } catch { return { quantity: '2.5', blend: { ...ORIGINAL }, custom: false, notice: 'Invalid shared result. The published formula has been restored.' }; }
}
export function makeSheet(quantity: string, blend: Blend, custom: boolean): Sheet { const grams = parseQuantity(quantity); return { grams, rows: allocate(grams, blend), classification: custom ? 'Custom Educational Mix — not an official SadaPure product' : 'Official Published SadaPure Formula — public table snapshot' }; }
