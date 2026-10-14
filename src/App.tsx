import { useEffect, useState } from 'react';
import { CATALOGUE, ORIGINAL, conflicts, parsePercent, parseQuantity, validateBlend, type Blend } from './lib/engine';
import { makeSheet, readShared, type Sheet } from './lib/exports';
import { Results } from './components/Results';
import { CustomEditor } from './components/CustomEditor';
import { Planner } from './components/Planner';
import { Explorer } from './components/Explorer';
import { Education } from './components/Education';
import { Costing } from './components/Costing';
import { Generator } from './components/Generator';
import type { GeneratedGoal } from './data/goalRecipes';
const ASSET_BASE = import.meta.env.BASE_URL;
const INITIAL = readShared(window.location.search);
const draftFor = (blend: Blend) => Object.fromEntries(CATALOGUE.map(i => [i.id, String(blend[i.id] / 100)]));
export default function App() {
  const [page,setPage] = useState<'builder'|'planner'|'explorer'>('builder'), [urdu,setUrdu] = useState(false);
  const [quantity,setQuantity] = useState(INITIAL.quantity), [custom,setCustom] = useState(INITIAL.custom);
  const [draft,setDraft] = useState(draftFor(INITIAL.blend)), [restriction,setRestriction] = useState('');
  const [generated,setGenerated]=useState<GeneratedGoal|null>(null),[pending,setPending]=useState('');
  const [notice,setNotice] = useState(INITIAL.notice), [dark,setDark] = useState(false);
  useEffect(()=>{ document.documentElement.lang = urdu ? 'ur' : 'en'; document.documentElement.dir = urdu ? 'rtl' : 'ltr'; },[urdu]);
  useEffect(()=>{ document.documentElement.dataset.theme = dark ? 'dark' : 'light'; },[dark]);
  let sheet: Sheet | null = null, error = '', blend: Blend = ORIGINAL;
  try { if(custom) blend = Object.fromEntries(CATALOGUE.map(i => [i.id,parsePercent(draft[i.id])])); validateBlend(blend); parseQuantity(quantity); sheet = makeSheet(quantity,blend,custom); } catch(e) { error = (e as Error).message; }
  if(generated&&sheet){sheet.source=generated.source;sheet.rationale=notice;sheet.classification=generated.kind==='published'?'Published source recipe snapshot — not clinical validation':generated.kind==='source-adjusted'?'Source-adjusted educational example — not exact published recipe':'Experimental goal + focus example — not clinical validation';}
  if(pending){sheet=null;error=pending;}
  const flagged = conflicts(blend,restriction);
  const nav = (target: typeof page) => { setPage(target); window.scrollTo({top:0,behavior:'instant'}); };
  const reset = () => { setGenerated(null);setPending(''); setDraft(draftFor(ORIGINAL)); setCustom(false); setNotice('Published recipe restored.'); };
  return <><a className="skip-link" href="#main">Skip to calculator</a><header className="site-header"><div className="brand"><a href="https://sadapure.com" aria-label="SadaPure official website"><img src={ASSET_BASE+"assets/sadapure-icon.png"} width="60" height="60" alt="SadaPure emblem"/></a><span>Open Lab</span></div><nav aria-label="Tool navigation">{(['builder','planner','explorer'] as const).map((target,index)=><button key={target} aria-current={page===target?'page':undefined} onClick={()=>nav(target)}>{urdu ? ['آٹے کا حساب','گھریلو منصوبہ','اجزاء کی تلاش'][index] : ['Flour (atta) builder','Household flour planner','Ingredient explorer'][index]}</button>)}</nav><div className="language"><button aria-pressed={!urdu} onClick={()=>setUrdu(false)}>EN</button><button lang="ur" aria-pressed={urdu} onClick={()=>setUrdu(true)}>اردو</button></div></header>
    <main id="main">{page==='builder' ? <><div className="workspace"><aside className="control-rail"><h1>{urdu ? 'اپنا آمیزہ سمجھیں۔' : 'Know your blend.'}</h1><p className="lead">{urdu ? 'تمام 18 اجزاء دیکھیں۔ اپنی ضرورت کے مطابق شائع شدہ فارمولے کا حساب کریں۔' : 'Explore all 18 ingredients. Scale the published recipe to your kitchen.'}</p>
      <div className="panel quantity-panel"><label htmlFor="quantity">{urdu ? 'آٹے کی مقدار' : 'Flour quantity'}</label><div className="quantity-field"><input id="quantity" type="number" min="0.001" max="1000" step="0.001" value={quantity} onChange={e=>setQuantity(e.target.value)} aria-describedby="quantity-help" dir="ltr"/><span>kg</span></div><p id="quantity-help" className="small">0.001–1,000 kg · up to 3 decimal places</p><div className="presets">{['0.5','1','2.5','5','10'].map(q=><button key={q} dir="ltr" aria-pressed={quantity===q} onClick={()=>setQuantity(q)}>{q==='0.5'?'500 g':`${q} kg`}</button>)}</div></div>
      <div className="mode-switch"><button aria-pressed={!custom} onClick={()=>{setGenerated(null);setPending('');setCustom(false);setNotice('Published percentages shown without alteration.');}}><i/><span>{urdu ? 'شائع شدہ فارمولا' : 'Published formula'}<small>{urdu ? 'اصل تناسب' : 'Use the original proportions'}</small></span></button><button aria-pressed={custom} onClick={()=>{setCustom(true);setNotice('Custom mode is educational, even when proportions match the original.');}}><i/><span>{urdu ? 'تعلیمی آمیزہ' : 'Custom educational mix'}<small>{urdu ? 'اجزاء میں تبدیلی' : 'Adjust ingredients and learn'}</small></span></button></div>
      <Generator urdu={urdu} onPending={message=>{setPending(message);setGenerated(null);}} onGenerate={(result,message)=>{setGenerated(result);setPending('');setDraft(draftFor(result.blend));setCustom(true);setNotice(message);requestAnimationFrame(()=>{if(window.innerWidth<1000)document.getElementById("composition-title")?.scrollIntoView({behavior:"auto",block:"start"});});}}/>
      <figure className="ingredient-art"><img src={ASSET_BASE+"assets/flour-still-life.webp"} width="900" height="600" alt="Illustration of a ceramic bowl of flour with grain ears, pulses and seeds"/><figcaption>Ingredient illustration · not a product photograph</figcaption></figure>
      <div className="context no-print">
        <label htmlFor="restriction">{urdu ? 'جزو یا الرجی کی جانچ' : 'Ingredient or allergy concern'}</label><select id="restriction" value={restriction} onChange={e=>setRestriction(e.target.value)}><option value="">No selection</option><option value="gluten">Gluten-containing cereals</option><option value="sesame">Sesame</option><option value="oats">Oats / cross-contact</option><option value="chickpea">Chickpea ingredients</option>{CATALOGUE.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select>
        {restriction ? <p role="status" className="safety">{flagged.length ? `Present: ${flagged.map(i=>i.name).join(', ')}.` : 'No selected ingredient/category in this mix.'} No absence-of-allergen or cross-contact guarantee.</p> : null}
        <details><summary>Optional personal context — local only</summary><p className="small">Age, weight and gender have no validated role in this arithmetic. They do not alter the formula and are not saved or exported. Avoid entering medical narratives.</p><label>Age (optional)<input type="number" min="0" max="120"/></label><label>Weight in kg (optional)<input type="number" min="1" max="500"/></label><label>Gender (optional)<select defaultValue=""><option value="">Prefer not to say</option><option>Woman</option><option>Man</option><option>Self-described</option></select></label><label>Question for your own reference (optional)<textarea maxLength={240} placeholder="Keep this general; no private medical details."/></label></details>
      </div><button className="reset no-print" onClick={reset}>{urdu ? 'اصل فارمولا بحال کریں' : 'Reset to published recipe'}</button></aside>
      <div className="result-rail">{custom ? <CustomEditor draft={draft} setDraft={next=>{setGenerated(null);setPending('');setDraft(next);}} urdu={urdu} setNotice={setNotice}/> : null}<p className="notice no-print" role="status">{notice}</p>{sheet ? <Results sheet={sheet} quantity={quantity} blend={blend} custom={custom} urdu={urdu}/> : <div className="invalid" role="alert"><h2>Check your inputs</h2><p>{error}</p><p>Results and exports are unavailable until quantity and percentages are valid.</p></div>}</div></div>
      {sheet ? <Costing blend={blend} grams={sheet.grams}/> : null}<Education urdu={urdu}/></> : page==='planner' ? <Planner urdu={urdu} onUse={q=>{setQuantity(q);nav('builder');setNotice('Household quantity applied. Rounded up to the next whole gram.');}}/> : <Explorer urdu={urdu}/>}
    </main><footer><div><strong>SadaPure Open Lab</strong><p>Open tools for transparent ingredients and informed everyday choices.</p></div><div><a href="https://github.com/SadaPureOpenLab">Source & contributions</a><a href="https://sadapure.com/contact-us">Product questions</a><button onClick={()=>setDark(!dark)}>{dark?'Light':'Dark'} appearance</button></div><small>Educational software · no medical or batch certification · © 2026 SadaPure</small></footer></>;
}
