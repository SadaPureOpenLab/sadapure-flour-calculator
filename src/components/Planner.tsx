import { useState } from 'react';
import { fmt, planHousehold } from '../lib/engine';
export function Planner({ onUse, urdu }: { onUse: (kg: string) => void; urdu: boolean }) {
  const [fields, setFields] = useState({ people: '4', rotis: '2', flour: '40', days: '30' });
  let result: ReturnType<typeof planHousehold> | null = null, error = '';
  try { result = planHousehold(Number(fields.people), Number(fields.rotis), Number(fields.flour), Number(fields.days)); } catch(e) { error = (e as Error).message; }
  const labels = urdu ? ['گھر کے افراد','فی فرد روزانہ روٹیاں','فی روٹی آٹا (گرام)','دن'] : ['Household members','Rotis per person per day','Flour per roti (g)','Days to plan'];
  return <section className="companion"><h1>{urdu ? 'گھر کے آٹے کی منصوبہ بندی' : 'Plan for your household.'}</h1><p className="lead">{urdu ? 'اپنے معمول کے مطابق آٹے کی مقدار کا اندازہ لگائیں۔' : 'Turn your own roti-making routine into a clear flour estimate.'}</p>
    <div className="planner-layout"><div className="panel planner-fields">{(['people','rotis','flour','days'] as const).map((key,index) => <label key={key}>{labels[index]}<input type="number" min="1" max={key === 'people' ? 100 : key === 'rotis' ? 20 : key === 'flour' ? 500 : 366} step={key === 'rotis' ? '0.5' : '1'} value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })}/></label>)}<p className="small">These are your arithmetic assumptions, not recommended food portions. Measure dry flour per roti; water changes cooked weight.</p></div>
      <div className="planner-output">{result ? <><h2>{urdu ? 'آپ کا تخمینہ' : 'Your flour estimate'}</h2><strong className="big-number">{fmt(result.total / 1000)} <small>kg</small></strong><p>for {fields.days} days</p><dl><div><dt>Daily</dt><dd>{fmt(result.daily)} g</dd></div><div><dt>Weekly</dt><dd>{fmt(result.weekly / 1000)} kg</dd></div><div><dt>30 days</dt><dd>{fmt(result.monthly / 1000)} kg</dd></div></dl><p>{fields.people} × {fields.rotis} × {fields.flour} g × {fields.days} days</p><button className="primary" disabled={result.total > 1000000} onClick={() => onUse((Math.ceil(result!.total) / 1000).toFixed(3))}>{urdu ? 'اجزاء کا حساب کریں' : 'See ingredient breakdown'}</button>{result.total > 1000000 ? <p>Breakdowns support up to 1,000 kg.</p> : null}</> : <p role="alert">{error}</p>}</div></div>
  </section>;
}
