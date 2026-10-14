import formula from '../data/formula.json';
import { CATALOGUE, type Ingredient } from '../data/catalogue';
export { CATALOGUE };
export type { Ingredient };
export type Blend = Record<string, number>;
export type Row = Ingredient & { share: number; centigrams: number; grams: number };
export const ORIGINAL: Blend = Object.fromEntries(CATALOGUE.map(i => [i.id, i.basisPoints]));
export const DATA = formula;
export const MAX_KG = 1000;
export function parseQuantity(value: string): number {
  if (!/^\d+(\.\d{1,3})?$/.test(value)) throw new Error('Enter 0.001–1,000 kg, with up to three decimal places.');
  const grams = Math.round(Number(value) * 1000);
  if (!Number.isSafeInteger(grams) || grams < 1 || grams > MAX_KG * 1000) throw new Error('Enter 0.001–1,000 kg.');
  return grams;
}
export function parsePercent(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Use 0–100%, with up to two decimal places.');
  const points = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(points) || points < 0 || points > 10000) throw new Error('Use 0–100%.');
  return points;
}
export function validateBlend(blend: Blend, requireTotal = true): number {
  const ids = CATALOGUE.map(i => i.id);
  if (Object.keys(blend).length !== ids.length || Object.keys(blend).some(id => !ids.includes(id))) throw new Error('Unknown or missing ingredient.');
  let total = 0;
  for (const id of ids) {
    const p = blend[id];
    if (!Number.isSafeInteger(p) || p < 0 || p > 10000) throw new Error('Every percentage must be between 0 and 100.');
    total += p;
  }
  if (requireTotal && total !== 10000) throw new Error(`Your mix totals ${total / 100}%. Adjust it to exactly 100%.`);
  return total;
}
export function allocate(grams: number, blend: Blend): Row[] {
  if (!Number.isSafeInteger(grams) || grams < 1 || grams > MAX_KG * 1000) throw new Error('Invalid flour quantity.');
  validateBlend(blend);
  const target = grams * 100;
  const weights = CATALOGUE.map(i => ({ i, numerator: target * blend[i.id] }));
  const units = weights.map(w => Math.floor(w.numerator / 10000));
  const missing = target - units.reduce((a, b) => a + b, 0);
  const order = weights.map((w, index) => ({ index, remainder: w.numerator % 10000 }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (let n = 0; n < missing; n++) units[order[n].index]++;
  return weights.map((w, index) => ({ ...w.i, share: blend[w.i.id] / 100, centigrams: units[index], grams: units[index] / 100 })).filter(row => blend[row.id] > 0);
}
export function normalize(blend: Blend): Blend {
  const total = validateBlend(blend, false);
  if (total === 0) throw new Error('Add a positive percentage before normalizing.');
  const keys = CATALOGUE.map(i => i.id);
  const values = keys.map(id => Math.floor(blend[id] * 10000 / total));
  const missing = 10000 - values.reduce((a, b) => a + b, 0);
  const order = keys.map((id, index) => ({ index, remainder: (blend[id] * 10000) % total }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (let n = 0; n < missing; n++) values[order[n].index]++;
  return Object.fromEntries(keys.map((id, index) => [id, values[index]]));
}
export function isOriginal(blend: Blend): boolean { return CATALOGUE.every(i => blend[i.id] === ORIGINAL[i.id]); }
export function conflicts(blend: Blend, restriction: string): Ingredient[] {
  if (!restriction) return [];
  return CATALOGUE.filter(i => blend[i.id] > 0 && (restriction === i.id || i.allergens.includes(restriction)));
}
export function groupTotals(rows: Row[]): Record<string, number> {
  return rows.reduce((groups, row) => ({ ...groups, [row.group]: (groups[row.group] ?? 0) + row.share }), {} as Record<string, number>);
}
export function planHousehold(people: number, rotis: number, flourPerRoti: number, days: number) {
  if (!Number.isInteger(people) || people < 1 || people > 100 || !Number.isInteger(days) || days < 1 || days > 366 || !Number.isFinite(rotis) || rotis <= 0 || rotis > 20 || !Number.isFinite(flourPerRoti) || flourPerRoti < 1 || flourPerRoti > 500) throw new Error('Use 1–100 people, 1–20 rotis, 1–500 g per roti and 1–366 whole days.');
  const daily = people * rotis * flourPerRoti;
  return { daily, weekly: daily * 7, monthly: daily * 30, total: daily * days };
}
export function ingredientCost(blend: Blend, prices: Record<string, number>, grams: number): number {
  validateBlend(blend);
  if (!Number.isSafeInteger(grams) || grams < 1 || grams > MAX_KG * 1000) throw new Error('Invalid flour quantity.');
  return CATALOGUE.filter(i => blend[i.id] > 0).reduce((sum, i) => {
    const price = prices[i.id];
    if (!Number.isFinite(price) || price < 0 || price > 10000000) throw new Error('Enter a valid price for every ingredient, including zero if appropriate.');
    return sum + (blend[i.id] / 10000) * price * grams / 1000;
  }, 0);
}
export const fmt = (n: number) => n.toLocaleString('en-PK', { maximumFractionDigits: 2 });
