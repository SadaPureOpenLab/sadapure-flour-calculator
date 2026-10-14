import { ingredientLabel } from '../data/catalogue';
import { useState } from 'react';
import { DATA, fmt, type Blend } from '../lib/engine';
import { csv, downloadCSV, downloadExcel, downloadPDF, summary, shareUrl, type Sheet } from '../lib/exports';
import { Icon } from './Icons';
import { Composition } from './Composition';
import { PRODUCT_URL } from '../lib/order';
export function Results({ sheet, quantity, blend, custom, urdu, onOrder }: { sheet: Sheet; quantity: string; blend: Blend; custom: boolean; urdu: boolean; onOrder:()=>void }) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [resultLink, setResultLink] = useState('');
  const copy = async (value: string, notice: string) => { try { await navigator.clipboard.writeText(value); setStatus(notice); } catch { setStatus('Clipboard unavailable. Use CSV or Print to save your result.'); } };
  const pdf = async () => { setBusy(true); try { await downloadPDF(sheet); setStatus('PDF downloaded with English and Roman Urdu ingredient names.'); } catch { setStatus('PDF could not be saved. Try Print / Save as PDF.'); } finally { setBusy(false); } };
  return <section className="results" aria-labelledby="composition-title">
    <div className="result-heading"><div><h2 id="composition-title">{urdu ? 'آمیزے کی ترکیب' : 'Your ingredient mix'}</h2><p dir="ltr">{sheet.rows.length} {urdu ? 'اجزاء' : 'ingredients'} · 100%</p></div>
      <div className="export-actions no-print">
        <button onClick={async()=>{setBusy(true);try{await downloadExcel(sheet);setStatus('Excel downloaded.');}catch{setStatus('Excel could not be saved. Use CSV below.');}finally{setBusy(false);}}} disabled={busy}><Icon kind="file"/>Excel</button>
        <button disabled={busy} onClick={pdf}><Icon kind="file"/>{busy ? '…' : 'PDF'}</button>
        <button onClick={() => copy(summary(sheet), 'Full ingredient summary copied.')}><Icon kind="copy"/>{urdu ? 'کاپی' : 'Copy'}</button>
        <button onClick={() => {const link=shareUrl(quantity, blend, custom);setResultLink(link);void copy(link, 'Result link copied. Only quantity and formula are included.');}}><Icon kind="share"/>{urdu ? 'لنک' : 'Share'}</button>
      </div>
    </div>
    <p className={custom ? 'classification custom' : 'classification'}>{custom ? (urdu ? 'حسب ضرورت تعلیمی آمیزہ — سرکاری مصنوعہ نہیں' : sheet.classification) : (urdu ? 'ساداپیور کے شائع شدہ فارمولے کا حساب' : 'Official Published SadaPure Formula')}</p>
    <p className="early-warning">{urdu ? 'اصل آمیزہ گلوٹن فری نہیں۔ الرجی اور مشترکہ مشینوں کے اثرات چیک کریں۔' : custom?'Check every ingredient and shared-equipment controls; omissions do not guarantee allergy safety.':'Original blend is not gluten-free. Check ingredients and cross-contact for allergies.'}</p>
    <p role="status" className="export-status no-print">{status}</p>
    {resultLink&&resultLink===shareUrl(quantity,blend,custom)?<a className="no-print" href={resultLink} target="_blank" rel="noreferrer">{urdu?'نتیجے کا لنک کھولیں یا کاپی کریں':'Open or copy this result link'}</a>:null}
    <Composition rows={sheet.rows} grams={sheet.grams} urdu={urdu}/>
    <div className="table-heading"><h3>{urdu ? 'اجزاء کی مکمل فہرست' : 'All ingredients in this mix'}</h3><span dir="ltr">({fmt(sheet.grams)} g total)</span></div>
    <div className="table-scroll" tabIndex={0} aria-label="Complete ingredient table; scroll horizontally on small screens">
      <table><thead><tr><th scope="col">{urdu ? 'جزو' : 'Ingredient'}</th><th scope="col">%</th><th scope="col">{urdu ? 'وزن (گرام)' : 'Weight (g)'}</th></tr></thead>
        <tbody>{sheet.rows.map(row => <tr key={row.id}><th scope="row"><span>{urdu ? row.urdu : ingredientLabel(row)}</span>{urdu?<small>{ingredientLabel(row)}</small>:null}<span className="bar" aria-hidden="true"><i style={{ width: `${row.share}%` }}/></span></th><td dir="ltr">{fmt(row.share)}%</td><td dir="ltr">{fmt(row.grams)}</td></tr>)}</tbody>
        <tfoot><tr><th>{urdu ? 'کل' : 'Total'}</th><td>100%</td><td dir="ltr">{fmt(sheet.grams)} g</td></tr></tfoot>
      </table>
    </div>
    <p className="rounding">{urdu ? 'وزن 0.01 گرام تک گول کیا گیا ہے، کل وزن برقرار رہتا ہے۔' : 'Rounded to 0.01 g; the displayed weights add up to your exact total.'}</p>
    <div className="safety"><strong>{custom ? (urdu ? 'الرجی کی حفاظت کی ضمانت نہیں۔' : 'Ingredient and cross-contact safety are not guaranteed.') : (urdu ? 'گندم، جو، رائی اور تل شامل ہیں۔ گلوٹن فری نہیں۔' : 'Contains wheat, barley, rye and sesame. Not gluten-free.')}</strong><span>{urdu ? 'سیلیک مرض یا متعلقہ الرجی کی صورت میں اصل آمیزہ استعمال نہ کریں۔' : 'The original blend is unsuitable for coeliac disease or allergy to a listed ingredient.'}</span></div>
    <div className="source"><a href={sheet.source?.url??DATA.sourceUrl} target="_blank" rel="noreferrer">{urdu ? 'شائع شدہ اجزاء کا ماخذ' : sheet.source?.title??(custom?'Original reference — custom ratios are not this recipe':'Published ingredient table')}</a><span>Retrieved 14 Oct 2026 · v{DATA.version}</span><button className="no-print" onClick={() => window.print()}><Icon kind="print"/>{urdu ? 'پرنٹ' : 'Print'}</button></div>
    <section className="order-panel no-print"><div><h3>Want this mix made for you?</h3><p>Ask SadaPure to review your ingredients, preparation and delivery.</p></div><div className="order-actions"><button className="order-email" onClick={onOrder}>Custom order &rarr;</button><a className="order-product" href={PRODUCT_URL} target="_blank" rel="noreferrer">View SadaPure product &nearr;</a></div></section>
    <details className="csv-option no-print"><summary>More export options</summary><button onClick={()=>{downloadCSV(sheet);setStatus('CSV downloaded.');}}>Download CSV</button></details>
    <span hidden data-csv-length={csv(sheet).length}/>
  </section>;
}

