import { ingredientLabel } from '../data/catalogue';
import { CATALOGUE, DATA, ORIGINAL, allocate, parseQuantity, validateBlend, type Row, type Blend } from './engine';
import type { RecipeSource } from '../data/goalRecipes';
export type Sheet = { rows: Row[]; grams: number; classification: string; source?:RecipeSource; rationale?:string };
const quote = (text: string) => '"' + text.replaceAll('"', '""') + '"';
export function csv(sheet: Sheet) {
  const fields = [['Classification', sheet.classification], ['Formula version', sheet.source?.version??DATA.version], ['Retrieved', sheet.source?.retrieved??DATA.retrievedDate], ['Source', sheet.source?.url??(sheet.classification.startsWith('Official')?DATA.sourceUrl:'Experimental software proportions; see linked ingredient references')], ['Total flour (g)', String(sheet.grams)], ['Ratio rationale',sheet.rationale??'Published original table or manually entered custom percentages'], [], ['Ingredient', 'Roman Urdu', 'Percentage', 'Weight (g)', 'Category', 'Allergen notes']];
  for (const row of sheet.rows) fields.push([ingredientLabel(row), row.roman, String(row.share), row.grams.toFixed(2), row.group, row.allergens.join('; ') || 'No guarantee; check ingredient and cross-contact']);
  fields.push(['TOTAL', '', '100', sheet.grams.toFixed(2)]);
  return '\uFEFF' + fields.map(line => line.map(quote).join(',')).join('\r\n');
}
export function summary(sheet: Sheet) { return `${sheet.classification}\n${sheet.grams} g flour\n${sheet.rows.map(r => `${ingredientLabel(r)}: ${r.share}% = ${r.grams.toFixed(2)} g`).join('\n')}\nNot an allergy-safe or therapeutic recommendation.\nSource: ${sheet.source?.url??DATA.sourceUrl}\nSnapshot: ${sheet.source?.version??DATA.version}\n${sheet.rationale??''}`; }
export function downloadCSV(sheet: Sheet) {
  const url = URL.createObjectURL(new Blob([csv(sheet)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'sadapure-blend.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function createPDF(sheet: Sheet, customer?: Record<string, string>) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text('SadaPure Smart Flour (Atta) Builder', 16, 21);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text(sheet.classification.replaceAll('—','-'), 16, 31); doc.text(`Total flour: ${sheet.grams} g | Snapshot: ${sheet.source?.version??DATA.version}`, 16, 38);
  const header=(y:number)=>{doc.setFont('helvetica','bold');doc.text('Ingredient',16,y);doc.text('%',143,y);doc.text('Weight (g)',163,y);doc.setFont('helvetica','normal');};
  let y=49;
  if(customer){doc.setFontSize(9);for(const [label,value] of Object.entries(customer)){const lines=doc.splitTextToSize(`${label}: ${value}`,178);doc.text(lines,16,y);y+=lines.length*4.5+2;}doc.setFontSize(10);y+=5;}
  header(y);y+=9;
  for(const row of sheet.rows){const lines=doc.splitTextToSize(ingredientLabel(row),120);const height=Math.max(7,lines.length*5+2);if(y+height>245){doc.addPage();doc.setFontSize(10);doc.text('SadaPure ingredient breakdown (continued)',16,20);header(31);y=40;}doc.text(lines,16,y);doc.text(String(row.share),143,y);doc.text(row.grams.toFixed(2),163,y);y+=height;}
  if(y+70>280){doc.addPage();y=25;}
  doc.text(`TOTAL: 100% / ${sheet.grams.toFixed(2)} g`,16,y+5);
  const notes = ['Ingredient arithmetic only; not a treatment, dietary prescription or medical recipe.', 'Original blend contains wheat, barley, rye and sesame. It is not gluten-free.', 'Custom ingredient safety, cross-contact and cooking suitability are unverified.', 'Weights rounded to 0.01 g using largest-remainder allocation; total is preserved.', `Reference retrieved ${sheet.source?.retrieved??DATA.retrievedDate}:`, sheet.source?.url??DATA.sourceUrl, sheet.rationale??'Custom proportions are not validated medical doses.', 'Additional library entries have no validated nutrient mapping. Reference: fdc.nal.usda.gov', 'PDF uses English and Roman Urdu ingredient names. Use Print for Urdu script.'];
  doc.setFontSize(8);let noteY=y+18;for(const note of notes){for(const line of doc.splitTextToSize(note,178)){if(noteY>276){doc.addPage();noteY=20;}doc.text(line,16,noteY);noteY+=4.5;}noteY+=2;}
  const count=doc.getNumberOfPages();for(let page=1;page<=count;page++){doc.setPage(page);doc.setFontSize(8);doc.text(`${page} / ${count}`,185,288);}
  return doc;
}
export async function downloadPDF(sheet: Sheet) { (await createPDF(sheet)).save('sadapure-blend.pdf'); }
export async function createExcel(sheet: Sheet, customer?: Record<string,string>) {
  const {default:ExcelJS}=await import('exceljs');
  const workbook=new ExcelJS.Workbook();workbook.creator='SadaPure Open Lab';
  if(customer){const contact=workbook.addWorksheet('Customer details');contact.columns=[{header:'Field',key:'field',width:25},{header:'Value',key:'value',width:70}];for(const [field,value] of Object.entries(customer))contact.addRow({field,value});contact.getColumn(2).alignment={wrapText:true};}
  const table=workbook.addWorksheet('Ingredients');table.columns=[{header:'Ingredient (Roman Urdu)',key:'name',width:55},{header:'Percent',key:'share',width:15},{header:'Weight (g)',key:'grams',width:18}];
  for(const row of sheet.rows)table.addRow({name:ingredientLabel(row),share:row.share,grams:row.grams});table.addRow({name:'TOTAL',share:100,grams:sheet.grams});table.getColumn(3).numFmt='0.00';table.views=[{state:'frozen',ySplit:1}];table.autoFilter={from:'A1',to:'C'+(sheet.rows.length+1)};
  const notes=workbook.addWorksheet('Request notes');notes.columns=[{header:'Field',width:25},{header:'Value',width:100}];notes.addRow(['Classification',sheet.classification]);notes.addRow(['Total dry flour (g)',sheet.grams]);notes.addRow(['Source',sheet.source?.url??DATA.sourceUrl]);notes.addRow(['Status','Request only. SadaPure must confirm availability, preparation, price and delivery.']);
  for(const page of workbook.worksheets){page.getRow(1).font={bold:true,color:{argb:'FFF5F3E8'}};page.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF143428'}};page.getRow(1).height=26;}
  return new Uint8Array(await workbook.xlsx.writeBuffer());
}
export function downloadBytes(bytes:Uint8Array,name:string,type:string){const url=URL.createObjectURL(new Blob([bytes as BlobPart],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export async function downloadExcel(sheet:Sheet){downloadBytes(await createExcel(sheet),'sadapure-blend.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');}
export function shareUrl(quantity: string, blend: Blend, custom: boolean): string {
  parseQuantity(quantity); validateBlend(blend);
  const url = new URL(window.location.href); url.search = ''; url.hash = '';
  url.searchParams.set('kg', quantity);
  if (custom) { url.searchParams.set('v','3'); url.searchParams.set('mix', CATALOGUE.map(i => blend[i.id]).join(',')); }
  return url.href;
}
export function readShared(search: string): { quantity: string; blend: Blend; custom: boolean; notice: string } {
  try {
    const params = new URLSearchParams(search), quantity = params.get('kg') ?? '2.5'; parseQuantity(quantity);
    const mix = params.get('mix');
    if (!mix) return { quantity, blend: { ...ORIGINAL }, custom: false, notice: '' };
    const parts = mix.split(',');
    const ingredients = params.get('v') === '3' ? CATALOGUE : params.get('v') === '2' ? CATALOGUE.slice(0,50) : DATA.ingredients;
    if (parts.length !== ingredients.length || parts.some(p => !/^\d{1,5}$/.test(p))) throw new Error('Invalid shared mix');
    const blend = { ...Object.fromEntries(CATALOGUE.map(i=>[i.id,0])), ...Object.fromEntries(ingredients.map((i, index) => [i.id, Number(parts[index])])) }; validateBlend(blend);
    return { quantity, blend, custom: true, notice: 'Shared custom educational mix. Not an official product.' };
  } catch { return { quantity: '2.5', blend: { ...ORIGINAL }, custom: false, notice: 'Invalid shared result. The published formula has been restored.' }; }
}
export function makeSheet(quantity: string, blend: Blend, custom: boolean): Sheet { const grams = parseQuantity(quantity); return { grams, rows: allocate(grams, blend), classification: custom ? 'Custom Educational Mix — not an official SadaPure product' : 'Official Published SadaPure Formula — public table snapshot' }; }
