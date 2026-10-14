import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGUE, DATA, ORIGINAL, allocate, conflicts, groupTotals, ingredientCost, isOriginal, normalize, parsePercent, parseQuantity, planHousehold, validateBlend } from '../src/lib/engine';
import { csv, makeSheet, readShared, summary } from '../src/lib/exports';
test('published snapshot has exactly 18 ingredients and 100%',()=>{
  assert.equal(DATA.ingredients.length,18); assert.equal(validateBlend(ORIGINAL),10000);
  assert.equal(DATA.ingredients.filter(i=>i.id==='wheat')[0].basisPoints,4800);
});
for(const kg of ['0.5','1','2.5','5','10']) test(`${kg} kg preserves exact total and every source percentage`,()=>{
  const grams=parseQuantity(kg), rows=allocate(grams,ORIGINAL);
  assert.equal(rows.reduce((s,r)=>s+r.centigrams,0),grams*100);
  for(const row of rows) assert.equal(row.grams,grams*ORIGINAL[row.id]/10000);
});
test('known 2.5 kg quantities match public table, including decimals',()=>{
  const byId=Object.fromEntries(allocate(2500,ORIGINAL).map(r=>[r.id,r.grams]));
  assert.equal(byId.wheat,1200); assert.equal(byId.barley,250); assert.equal(byId.flax,62.5); assert.equal(byId.moringa,7.5);
});
test('centigram rounding preserves totals across tiny, unusual and maximum batches',()=>{
  for(const grams of [1,7,11,101,333,1999,2501,123457,1000000]) {
    const rows=allocate(grams,ORIGINAL);
    assert.equal(rows.reduce((s,r)=>s+r.centigrams,0),grams*100);
    for(const r of rows) assert.ok(Math.abs(r.grams-grams*r.share/100)<.01000001);
  }
});
test('malformed, empty, negative, NaN, infinite, too precise and oversized quantities rejected',()=>{
  for(const value of ['','0','-1','NaN','Infinity','1e3','0.0001','1000.001','2.5001']) assert.throws(()=>parseQuantity(value));
  for(const grams of [NaN,Infinity,-100,0,1.5,1000001]) assert.throws(()=>allocate(grams,ORIGINAL));
});
test('percentage parsing rejects unsafe and overly precise values',()=>{
  for(const value of ['','-1','NaN','Infinity','100.01','2.001']) assert.throws(()=>parsePercent(value));
  assert.equal(parsePercent('0.3'),30); assert.equal(parsePercent('48'),4800);
});
test('removed ingredients do not silently normalize an invalid mix',()=>{
  const removed={...ORIGINAL,wheat:0}; assert.equal(validateBlend(removed,false),5200); assert.throws(()=>allocate(2500,removed));
  assert.equal(conflicts(removed,'gluten').length,2);
  const normalized=normalize(removed); assert.equal(validateBlend(normalized),10000); assert.equal(normalized.wheat,0); assert.equal(isOriginal(normalized),false);
});
test('normalization handles equal proportions, all-zero and invalid mixtures',()=>{
  const equal=Object.fromEntries(CATALOGUE.map(i=>[i.id,100]));
  assert.equal(validateBlend(normalize(equal)),10000);
  assert.throws(()=>normalize(Object.fromEntries(CATALOGUE.map(i=>[i.id,0]))));
  for(const p of [-1,NaN,Infinity,10001,1.2]) assert.throws(()=>normalize({...ORIGINAL,wheat:p}));
  assert.throws(()=>allocate(1000,{...ORIGINAL,unknown:0}));
});
test('group chart totals use the same rows and remain exactly 100%',()=>{
  const groups=groupTotals(allocate(2500,ORIGINAL)); assert.ok(Math.abs(Object.values(groups).reduce((a,b)=>a+b,0)-100)<1e-10);
  assert.equal(groups.Seeds,6);
});
test('CSV and copied summary include all displayed quantities and provenance',()=>{
  const sheet=makeSheet('2.5',ORIGINAL,false), exported=csv(sheet), copied=summary(sheet);
  for(const row of sheet.rows){ assert.ok(exported.includes(`"${row.name} (${row.roman})"`)); assert.ok(exported.includes(`"${row.grams.toFixed(2)}"`)); assert.ok(copied.includes(`${row.name} (${row.roman}): ${row.share}% = ${row.grams.toFixed(2)} g`)); }
  assert.ok(exported.includes('"TOTAL","","100","2500.00"')); assert.ok(exported.includes(DATA.sourceUrl));
});
test('public and custom classifications remain distinct even with identical percentages',()=>{
  assert.match(makeSheet('1',ORIGINAL,false).classification,/Official Published/); assert.match(makeSheet('1',ORIGINAL,true).classification,/Custom Educational/);
});
test('shared URLs reject corrupt mixes and restore published data',()=>{
  for(const params of ['?kg=-2','?kg=Infinity','?mix=0','?mix='+Array(18).fill('0').join(','),'?mix='+Array(18).fill('NaN').join(',')]){
    const restored=readShared(params);assert.equal(restored.custom,false);assert.equal(isOriginal(restored.blend),true);assert.match(restored.notice,/Invalid/);
  }
  const shared=readShared('?kg=5&mix='+DATA.ingredients.map(i=>i.basisPoints).join(','));assert.equal(shared.custom,true);assert.equal(shared.quantity,'5');
});
test('allergen flags never imply wheat removal makes blend gluten-free',()=>{
  assert.deepEqual(conflicts(ORIGINAL,'gluten').map(i=>i.id),['wheat','barley','rye']); assert.equal(conflicts(ORIGINAL,'sesame')[0].id,'sesame');
  assert.deepEqual(conflicts({...ORIGINAL,wheat:0},'gluten').map(i=>i.id),['barley','rye']);
});
test('household example uses explicit measured flour assumptions',()=>{
  assert.deepEqual(planHousehold(4,2,40,30),{daily:320,weekly:2240,monthly:9600,total:9600});
  for(const args of [[0,2,40,30],[4,-1,40,30],[4,2,NaN,30],[4,2,40,1.5],[4,Infinity,40,30]]) assert.throws(()=>planHousehold(...args as [number,number,number,number]));
});
test('ingredient-only cost agrees with uniform prices and excludes invented prices',()=>{
  const prices=Object.fromEntries(DATA.ingredients.map(i=>[i.id,500]));assert.equal(ingredientCost(ORIGINAL,prices,2500),1250);
  assert.throws(()=>ingredientCost(ORIGINAL,{...prices,wheat:NaN},2500));assert.throws(()=>ingredientCost(ORIGINAL,{},2500));
});
