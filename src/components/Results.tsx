import { useState } from 'react';
import { DATA, fmt, type Blend } from '../lib/engine';
import { csv, downloadCSV, downloadPDF, summary, shareUrl, type Sheet } from '../lib/exports';
import { Icon } from './Icons';
import { Composition } from './Composition';
export function Results({ sheet, quantity, blend, custom, urdu }: { sheet: Sheet; quantity: string; blend: Blend; custom: boolean; urdu: boolean }) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const copy = async (value: string, notice: string) => { try { await navigator.clipboard.writeText(value); setStatus(notice); } catch { setStatus('Clipboard unavailable. Use CSV or Print to save your result.'); } };
  const pdf = async () => { setBusy(true); try { await downloadPDF(sheet); setStatus('PDF downloaded in English. Use Print for Urdu.'); } catch { setStatus('PDF could not be saved. Try Print / Save as PDF.'); } finally { setBusy(false); } };
  return <section className="results" aria-labelledby="composition-title">
    <div className="result-heading"><div><h2 id="composition-title">{urdu ? 'آمیزے کی ترکیب' : 'Blend composition'}</h2><p dir="ltr">{sheet.rows.length} {urdu ? 'اجزاء' : 'ingredients'} · 100%</p></div>
      <div className="export-actions no-print">
        <button onClick={() => { downloadCSV(sheet); setStatus('CSV downloaded.'); }}><Icon kind="file"/>CSV</button>
        <button disabled={busy} onClick={pdf}><Icon kind="file"/>{busy ? '…' : 'PDF'}</button>
        <button onClick={() => copy(summary(sheet), 'Full ingredient summary copied.')}><Icon kind="copy"/>{urdu ? 'کاپی' : 'Copy'}</button>
        <button onClick={() => copy(shareUrl(quantity, blend, custom), 'Result link copied. Only quantity and formula are included.')}><Icon kind="share"/>{urdu ? 'لنک' : 'Share'}</button>
      </div>
    </div>
    <p className={custom ? 'classification custom' : 'classification'}>{custom ? (urdu ? 'حسب ضرورت تعلیمی آمیزہ — سرکاری مصنوعہ نہیں' : 'Custom Educational Mix — not an official SadaPure product') : (urdu ? 'ساداپیور کے شائع شدہ فارمولے کا حساب' : 'Official Published SadaPure Formula')}</p>
    <p className="early-warning">{urdu ? 'اصل آمیزہ گلوٹن فری نہیں۔ الرجی اور مشترکہ مشینوں کے اثرات چیک کریں۔' : 'Original blend is not gluten-free. Check ingredients and cross-contact for allergies.'}</p>
    <p role="status" className="export-status no-print">{status}</p>
    <Composition rows={sheet.rows} grams={sheet.grams} urdu={urdu}/>
    <div className="table-heading"><h3>{urdu ? 'اجزاء کی مکمل فہرست' : 'Ingredient table'}</h3><span dir="ltr">({fmt(sheet.grams)} g total)</span></div>
    <div className="table-scroll" tabIndex={0} aria-label="Complete ingredient table; scroll horizontally on small screens">
      <table><thead><tr><th scope="col">{urdu ? 'جزو' : 'Ingredient'}</th><th scope="col">%</th><th scope="col">{urdu ? 'وزن (گرام)' : 'Weight (g)'}</th></tr></thead>
        <tbody>{sheet.rows.map(row => <tr key={row.id}><th scope="row"><span>{urdu ? row.urdu : row.name}</span><small>{urdu ? row.roman : row.urdu}</small><span className="bar" aria-hidden="true"><i style={{ width: `${row.share}%` }}/></span></th><td dir="ltr">{fmt(row.share)}%</td><td dir="ltr">{fmt(row.grams)}</td></tr>)}</tbody>
        <tfoot><tr><th>{urdu ? 'کل' : 'Total'}</th><td>100%</td><td dir="ltr">{fmt(sheet.grams)} g</td></tr></tfoot>
      </table>
    </div>
    <p className="rounding">{urdu ? 'وزن 0.01 گرام تک گول کیا گیا ہے، کل وزن برقرار رہتا ہے۔' : 'Rounded to 0.01 g; the displayed weights add up to your exact total.'}</p>
    <div className="safety"><strong>{custom ? (urdu ? 'الرجی کی حفاظت کی ضمانت نہیں۔' : 'Ingredient and cross-contact safety are not guaranteed.') : (urdu ? 'گندم، جو، رائی اور تل شامل ہیں۔ گلوٹن فری نہیں۔' : 'Contains wheat, barley, rye and sesame. Not gluten-free.')}</strong><span>{urdu ? 'سیلیک مرض یا متعلقہ الرجی کی صورت میں اصل آمیزہ استعمال نہ کریں۔' : 'The original blend is unsuitable for coeliac disease or allergy to a listed ingredient.'}</span></div>
    <div className="source"><a href={DATA.sourceUrl} target="_blank" rel="noreferrer">{urdu ? 'شائع شدہ اجزاء کا ماخذ' : 'Published ingredient table'}</a><span>Retrieved 14 Oct 2026 · v{DATA.version}</span><button className="no-print" onClick={() => window.print()}><Icon kind="print"/>{urdu ? 'پرنٹ' : 'Print'}</button></div>
    <span hidden data-csv-length={csv(sheet).length}/>
  </section>;
}
