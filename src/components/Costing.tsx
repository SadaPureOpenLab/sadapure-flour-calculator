import { ingredientLabel } from '../data/catalogue';
import { useState } from 'react';
import { CATALOGUE, fmt, ingredientCost, type Blend } from '../lib/engine';
export function Costing({ blend, grams }: { blend: Blend; grams: number }) {
  const [prices, setPrices] = useState<Record<string,string>>({});
  let total: number | null = null;
  const active=CATALOGUE.filter(i=>blend[i.id]>0);
  try { if (active.every(i => prices[i.id]?.trim())) total = ingredientCost(blend, Object.fromEntries(active.map(i => [i.id, Number(prices[i.id])])), grams); } catch { /* The incomplete/invalid state is explicit below. */ }
  return <details className="costing no-print"><summary>Ingredient cost calculator — your prices</summary><p>Enter your own PKR/kg price for every active ingredient. Enter 0 deliberately where appropriate. This is not SadaPure's manufacturing cost and excludes labour, packing and delivery.</p><div className="price-grid">{active.map(i=><label key={i.id}>{ingredientLabel(i)}<input aria-label={`${i.name} price per kg`} type="number" min="0" max="10000000" step="0.01" placeholder="PKR/kg" value={prices[i.id] ?? ''} onChange={e=>setPrices({...prices,[i.id]:e.target.value})}/></label>)}</div><p role="status">{total === null ? `Enter a valid nonnegative price for all ${active.length} active ingredients to calculate.` : `Ingredient-only cost: PKR ${fmt(total)} for ${fmt(grams)} g · PKR ${fmt(total / grams * 1000)} per kg.`}</p></details>;
}
