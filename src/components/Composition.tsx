import { ingredientLabel } from '../data/catalogue';
import { useState } from 'react';
import { fmt, groupTotals, type Row } from '../lib/engine';
const COLORS = ['#023628','#6b884d','#d8c898','#a86c42','#8f987a','#c79062','#758365','#9b994f','#bda663','#ad8238','#85744c','#d6b879','#778e8a','#68726a','#b8bda3','#ba9f79','#b9bd71','#88a282'];
export function Composition({ rows, grams, urdu }: { rows: Row[]; grams: number; urdu: boolean }) {
  const [selected, setSelected] = useState('');
  let cumulative = 0;
  const stops = rows.map((row, index) => { const start = cumulative; cumulative += row.share; return `${COLORS[index % COLORS.length]} ${start}% ${cumulative}%`; }).join(',');
  const focused = rows.find(r => r.id === selected);
  return <>
    <div className="chart-layout">
      <div className="donut" style={{ background: `conic-gradient(${stops})` }} role="img" aria-label={`Composition of ${grams} grams flour; complete values in ingredient table`}>
        <div className="donut-center"><strong dir="ltr">{fmt(focused?.grams ?? grams)}<small> g</small></strong><span>{focused ? (urdu ? focused.urdu : ingredientLabel(focused)) : urdu ? 'کل آٹا' : 'Total flour'}</span><i/></div>
      </div>
      <ul className="legend">{rows.map((row, index) => <li key={row.id}><button className={selected === row.id ? 'legend-selected' : ''} onClick={() => setSelected(selected === row.id ? '' : row.id)} aria-pressed={selected === row.id}><i style={{ background: COLORS[index % COLORS.length] }}/><span>{urdu ? row.urdu : ingredientLabel(row)}</span><b dir="ltr">{row.share}%</b></button></li>)}</ul>
    </div>
    <details className="groups"><summary>{urdu ? 'اجزاء کی اقسام' : 'View ingredient groups'}</summary>{Object.entries(groupTotals(rows)).map(([group, share]) => <div key={group}><span>{group}</span><meter min="0" max="100" value={share} aria-label={group}/><b>{fmt(share)}%</b></div>)}</details>
  </>;
}
