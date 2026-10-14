import { CATALOGUE, normalize, type Blend } from './engine';
export const FOCUSES = [
  {id:'variety',label:'Everyday grain variety',urdu:'روزمرہ اناج کا تنوع'},
  {id:'oat-pulse',label:'Oat and pulse exploration',urdu:'جئی اور دالوں کا آمیزہ'},
  {id:'millet',label:'Millet and rice exploration',urdu:'باجرے اور چاول کا آمیزہ'},
  {id:'seed',label:'Grain and seed exploration',urdu:'اناج اور بیجوں کا آمیزہ'}
];
// These are disclosed illustrative culinary ratios, not clinical or nutrient-validated formulas.
const TEMPLATES: Record<string,Record<string,number>> = {
  variety:{wheat:50,'oat-flour':15,barley:10,'brown-rice':10,'kala-chana':5,flax:5,sesame:3,chia:2},
  'oat-pulse':{wheat:40,'oat-flour':25,barley:15,besan:10,'oat-bran':5,flax:5},
  millet:{'brown-rice':30,sorghum:25,millet:20,'finger-millet':10,besan:10,flax:5},
  seed:{wheat:55,'oat-flour':15,'brown-rice':15,pumpkin:5,sunflower:5,flax:3,sesame:2}
};
export function generateMix(focus:string,exclusions:string[]): {blend:Blend;changes:string[]} {
  const template=TEMPLATES[focus]; if(!template) throw new Error('Choose a supported culinary focus.');
  const changes:string[]=[];
  const blend=Object.fromEntries(CATALOGUE.map(i=>{
    let value=(template[i.id]??0)*100;
    const forbidden=exclusions.some(ex=>ex==='gluten' ? i.allergens.includes('gluten')||i.allergens.includes('oats') : ex==='nuts' ? i.allergens.some(a=>['tree-nut','peanut','lupin'].includes(a)) : i.allergens.includes(ex));
    if(forbidden&&value>0){changes.push(`${i.name} excluded (${value/100}%).`);value=0;}
    return [i.id,value];
  }));
  const total=Object.values(blend).reduce((a,b)=>a+b,0);
  if(total===0) throw new Error('No ingredients remain. Choose a different focus or review exclusions.');
  if(total!==10000) changes.push(`Remaining ${total/100}% rescaled explicitly to 100%.`);
  return {blend:normalize(blend),changes};
}
