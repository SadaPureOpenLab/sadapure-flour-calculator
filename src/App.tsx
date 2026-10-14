import { useEffect, useState } from 'react';
import { DATA, ORIGINAL, parseQuantity } from './lib/engine';
import { makeSheet, readShared, type Sheet } from './lib/exports';
import { generateForGoal } from './lib/goalGenerator';
import { Results } from './components/Results';
import { Planner } from './components/Planner';
import { Explorer } from './components/Explorer';
import { Education } from './components/Education';
import { Generator } from './components/Generator';
import { OrderCheckout } from './components/OrderCheckout';
import { EMPTY_CUSTOMER } from './lib/order';
const ASSET_BASE=import.meta.env.BASE_URL;
const INITIAL=readShared(window.location.search);
export default function App(){
 const [page,setPage]=useState<'builder'|'planner'|'explorer'>('builder'),[urdu,setUrdu]=useState(false);
 const [ordering,setOrdering]=useState(false),[customer,setCustomer]=useState({...EMPTY_CUSTOMER});
 const [quantity,setQuantity]=useState(INITIAL.quantity),[goalId,setGoalId]=useState('everyday'),[shared,setShared]=useState(INITIAL.custom),[initialNotice,setInitialNotice]=useState(INITIAL.notice);
 useEffect(()=>{document.documentElement.lang=urdu?'ur':'en';document.documentElement.dir=urdu?'rtl':'ltr';},[urdu]);
 let sheet:Sheet|null=null,error='',notice='',blend=ORIGINAL,custom=goalId!=='everyday'||shared;
 try{
  parseQuantity(quantity);
  if(shared){blend=INITIAL.blend;sheet=makeSheet(quantity,blend,true);notice='Shared ingredient snapshot. Choose a goal to replace it with a live goal-based example.';}
  else{const result=generateForGoal(goalId,[]);blend=result.blend;sheet=makeSheet(quantity,blend,custom);sheet.source=result.source;notice=[result.title,...result.changes].join(' ');sheet.rationale=notice;sheet.classification=result.kind==='published'?'Published source recipe snapshot — not clinical validation':result.kind==='source-adjusted'?'Source-adjusted ingredient example — not an exact published recipe':'Ingredient exploration example — proportions need review';}
 }catch(e){error=(e as Error).message;}
 const nav=(target:typeof page)=>{setPage(target);setOrdering(false);window.scrollTo({top:0,behavior:'instant'});};
 const changeGoal=(id:string)=>{setGoalId(id);setShared(false);setInitialNotice('');};
 return <><a className="skip-link" href="#main">Skip to calculator</a><header className="site-header"><div className="brand"><a href="https://sadapure.com" aria-label="SadaPure official website"><img src={ASSET_BASE+'assets/sadapure-icon-hd.jpg'} width="60" height="60" alt="SadaPure emblem"/></a><span><strong>SadaPure</strong><small>Open Lab</small></span></div><nav aria-label="Tool navigation">{(['builder','planner','explorer'] as const).map((target,index)=><button key={target} aria-current={page===target?'page':undefined} onClick={()=>nav(target)}>{urdu?['آٹے کا حساب','گھریلو منصوبہ','اجزاء کی تلاش'][index]:['Calculator','Household planner','Ingredients'][index]}</button>)}</nav><div className="language"><button aria-pressed={!urdu} onClick={()=>setUrdu(false)}>EN</button><button lang="ur" aria-pressed={urdu} onClick={()=>setUrdu(true)}>اردو</button></div></header>
 <main id="main">{page==='builder'&&ordering&&sheet?<OrderCheckout sheet={sheet} quantity={quantity} blend={blend} customer={customer} onCustomer={setCustomer} urdu={urdu} onBack={()=>{setOrdering(false);window.scrollTo({top:0,behavior:'instant'});}}/>:page==='builder'?<><div className="workspace"><aside className="control-rail"><div className="mix-controls"><h2>1. Choose your mix</h2><Generator urdu={urdu} shared={shared} goalId={goalId} onGoalChange={changeGoal}/>
 <div className="quantity-panel"><label htmlFor="quantity">{urdu?'آٹے کی مقدار':'Flour quantity'}</label><div className="quantity-field"><input id="quantity" type="number" min="0.001" max="1000" step="0.001" value={quantity} onChange={e=>setQuantity(e.target.value)} aria-describedby="quantity-help" dir="ltr"/><span>kg</span></div><p id="quantity-help" className="small">0.001–1,000 kg · up to 3 decimal places</p><div className="presets">{['0.5','1','2.5','5','10'].map(q=><button key={q} dir="ltr" aria-pressed={quantity===q} onClick={()=>setQuantity(q)}>{q==='0.5'?'500 g':`${q} kg`}</button>)}</div></div>
 </div>
 <figure className="ingredient-art"><img src={ASSET_BASE+'assets/flour-still-life.webp'} width="900" height="600" alt="Flour, grain ears, pulses and seeds — ingredient illustration"/><figcaption>Ingredient illustration</figcaption></figure>
 <p className="small">{urdu?'آرڈر کی قیمت، اجزاء کی دستیابی اور تیاری کے لیے ساداپیور ٹیم سے رابطہ کریں۔':'For a custom order, ask the SadaPure team to confirm availability, preparation and price.'}</p></aside>
 <div className="result-rail"><div className="app-title"><h1>{urdu?'ملٹی گرین آٹے کا حساب':'Build your flour (Atta) mix'}</h1><p className="lead">{urdu?'مقصد منتخب کریں۔ مقدار بدلتے ہی اجزاء کا حساب بدل جائے گا۔':'Choose your goal and quantity. Your mix updates instantly.'}</p></div>{sheet?<Results sheet={sheet} quantity={quantity} blend={blend} custom={custom} urdu={urdu} onOrder={()=>{setOrdering(true);window.scrollTo({top:0,behavior:'instant'});}}/>:<div className="invalid" role="alert"><h2>Check your quantity</h2><p>{error}</p></div>}<details className="mix-notice"><summary>Mix source & review status</summary><p role="status">{[initialNotice,notice].filter(Boolean).join(' ')}</p></details><details className="how-it-works"><summary>How it works</summary><Education urdu={urdu}/><section className="about-calculator"><h2>About this SadaPure flour calculator</h2><p>Scale multigrain flour ingredients to your household batch. The everyday option uses SadaPure’s published 18-ingredient flour (atta) table; other goals use dated brand snapshots or clearly marked ingredient-exploration examples. References explain ingredient roles, but do not prove therapeutic percentages.</p><p>A custom-order request goes to the SadaPure team for a discussion about ingredients, availability and price. The calculator does not confirm an order, diagnose a condition or replace an individual food plan.</p><a href="https://github.com/SadaPureOpenLab/sadapure-flour-calculator/blob/main/docs/goal-research.md">Read recipe sources and review status</a></section></details></div></div></>:page==='planner'?<Planner urdu={urdu} onUse={q=>{setQuantity(q);nav('builder');}}/>:<Explorer urdu={urdu}/>}</main>
 <footer><div><strong>SadaPure Open Lab</strong><p>Ingredient transparency, everyday flour planning and direct contact with SadaPure.</p></div><div><a href="https://github.com/SadaPureOpenLab/sadapure-flour-calculator">Source & references</a><a href="https://sadapure.com/contact-us">Contact SadaPure</a><a href={DATA.sourceUrl}>SadaPure multigrain flour (Atta)</a></div><small>Published sources and ingredient examples · © 2026 SadaPure</small></footer></>;
}
