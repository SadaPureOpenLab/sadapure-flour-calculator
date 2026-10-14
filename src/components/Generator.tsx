import { useState } from 'react';
import { GOALS, SOURCES } from '../data/goals';
import { FOCUSES, generateMix } from '../lib/generator';
import type { Blend } from '../lib/engine';
export function Generator({urdu,onGenerate}:{urdu:boolean;onGenerate:(blend:Blend,notice:string)=>void}) {
  const [goalId,setGoalId]=useState('everyday'),[focus,setFocus]=useState('variety'),[exclusions,setExclusions]=useState<string[]>([]),[issue,setIssue]=useState(''),[error,setError]=useState('');
  const goal=GOALS.find(g=>g.id===goalId)!,source=SOURCES[goal.source];
  const setGoal=(id:string)=>{setGoalId(id);const next=GOALS.find(g=>g.id===id);if(next?.exclusion) setExclusions(prev=>[...new Set([...prev,next.exclusion!])]);};
  const generate=()=>{try{const result=generateMix(focus,exclusions);onGenerate(result.blend,`Illustrative culinary ratios generated from ${FOCUSES.find(f=>f.id===focus)!.label}. ${result.changes.join(' ')} Percentages are not researched treatment doses. Your selected health concern and private text do not prescribe these ratios.`);setError('');}catch(e){setError((e as Error).message);}};
  return <section className="generator no-print" aria-labelledby="generator-title"><h2 id="generator-title">{urdu?'اپنا تعلیمی آمیزہ بنائیں':'Build an educational mix'}</h2><p className="small">{urdu?'50 اجزاء، 22 مقاصد اور مسائل۔ طبی علاج کا نسخہ نہیں۔':'50 supported ingredients · 22 goals and concerns · no medical recipe claims.'}</p>
    <label htmlFor="goal-selector">{urdu?'مقصد یا مسئلہ':'Goal or concern'}</label><select id="goal-selector" value={goalId} onChange={e=>setGoal(e.target.value)}>{GOALS.map(g=><option key={g.id} value={g.id}>{urdu?g.urdu:g.label}</option>)}</select>
    <div className={goal.clinical?'research-guidance clinical':'research-guidance'}><p>{goal.advice}</p><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>{goal.clinical?<strong>No clinically validated condition-specific percentages. Generated mixes use the culinary focus below, not this diagnosis.</strong>:null}</div>
    <label htmlFor="culinary-focus">{urdu?'کھانے کے اجزاء کی ترجیح':'Culinary ingredient focus'}</label><select id="culinary-focus" value={focus} onChange={e=>setFocus(e.target.value)}>{FOCUSES.map(f=><option key={f.id} value={f.id}>{urdu?f.urdu:f.label}</option>)}</select>
    <fieldset><legend>{urdu?'اجزاء خارج کریں':'Explicit ingredient exclusions'}</legend>{[['gluten','Gluten cereals + oats'],['wheat','Wheat and wheat varieties'],['sesame','Sesame'],['nuts','Tree nuts, peanut and lupin'],['soy','Soy']].map(([id,label])=><label key={id}><input type="checkbox" checked={exclusions.includes(id)} onChange={e=>setExclusions(e.target.checked?[...exclusions,id]:exclusions.filter(x=>x!==id))}/>{label}</label>)}</fieldset>
    <label htmlFor="private-issue">{urdu?'اپنا سوال (اختیاری، نجی)':'Your question (optional, private)'}</label><textarea id="private-issue" value={issue} maxLength={240} onChange={e=>setIssue(e.target.value)} placeholder="Keep this general. No medical records or identifiers."/><p className="small">Text stays in this tab, is not saved or exported, and does not trigger a diagnosis or automatic medical formulation.</p>
    <button className="primary" onClick={generate}>{urdu?'تعلیمی آمیزہ تیار کریں':'Generate educational mix'}</button><p className="small">Ratios are illustrative and cooking performance is untested. Exclusions do not establish allergy safety or gluten-free certification.</p>{error?<p role="alert">{error}</p>:null}
  </section>;
}
