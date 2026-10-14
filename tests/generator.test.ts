import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGUE, ORIGINAL, allocate, conflicts, validateBlend } from '../src/lib/engine';
import { generateMix, FOCUSES } from '../src/lib/generator';
import { GOALS } from '../src/data/goals';
import { makeSheet, readShared } from '../src/lib/exports';
test('50 supported identities and 22 goals, with immutable original formula',()=>{
  assert.equal(CATALOGUE.length,50);assert.equal(new Set(CATALOGUE.map(i=>i.id)).size,50);assert.equal(GOALS.length,22);
  assert.equal(Object.values(ORIGINAL).filter(n=>n>0).length,18);assert.equal(ORIGINAL.quinoa,0);assert.equal(ORIGINAL.soy,0);
});
test('every culinary focus generates 100%, correctly scaled, explicitly custom',()=>{
  for(const focus of FOCUSES){const {blend}=generateMix(focus.id,[]);assert.equal(validateBlend(blend),10000);assert.equal(allocate(2500,blend).reduce((a,b)=>a+b.centigrams,0),250000);assert.match(makeSheet('2.5',blend,true).classification,/Custom Educational/);}
});
test('gluten concern excludes known gluten cereals and oats, without safety certification',()=>{
  const {blend,changes}=generateMix('variety',['gluten']);assert.equal(conflicts(blend,'gluten').length,0);assert.equal(conflicts(blend,'oats').length,0);assert.ok(changes.some(c=>c.includes('rescaled')));assert.equal(validateBlend(blend),10000);
  assert.equal(ORIGINAL.wheat,4800);assert.equal(ORIGINAL.barley,1000);
});
test('multiple exclusions remain mathematically valid',()=>{
  const {blend}=generateMix('seed',['gluten','sesame','nuts','soy']);for(const key of ['wheat','sesame','soy','almond','peanut','lupin'])assert.equal(blend[key],0);assert.equal(validateBlend(blend),10000);assert.throws(()=>generateMix('unsupported',[]));
});
test('all 50 equal shares produce exact output and safe shared round trip',()=>{
  const blend=Object.fromEntries(CATALOGUE.map(i=>[i.id,200]));assert.equal(validateBlend(blend),10000);assert.equal(allocate(2500,blend).length,50);
  const search='?kg=2.5&v=2&mix='+CATALOGUE.map(i=>blend[i.id]).join(',');assert.deepEqual(readShared(search).blend,blend);
});
