import published from './formula.json';
export type Ingredient = { id: string; name: string; roman: string; urdu: string; basisPoints: number; group: string; allergens: string[]; note: string; sourceUrl?: string; identityStatus?: string };
// Names and culinary categories are educational. Nutrient mappings and cross-contact are unverified.
const extras: [string,string,string,string,string,string[]][] = [
  ['brown-rice','Brown Rice Flour','Brown chawal','بھورے چاول کا آٹا','Cereals',[]],
  ['white-rice','White Rice Flour','Chawal','چاول کا آٹا','Cereals',[]],
  ['red-rice','Red Rice Flour','Surkh chawal','سرخ چاول کا آٹا','Cereals',[]],
  ['black-rice','Black Rice Flour','Kala chawal','کالے چاول کا آٹا','Cereals',[]],
  ['finger-millet','Finger Millet Flour','Ragi','راگی کا آٹا','Cereals',[]],
  ['foxtail-millet','Foxtail Millet Flour','Kangni','کنگنی کا آٹا','Cereals',[]],
  ['little-millet','Little Millet Flour','Little millet','چھوٹے باجرے کا آٹا','Cereals',[]],
  ['barnyard-millet','Barnyard Millet Flour','Sanwa','سانوا کا آٹا','Cereals',[]],
  ['kodo-millet','Kodo Millet Flour','Kodo','کودو کا آٹا','Cereals',[]],
  ['proso-millet','Proso Millet Flour','Cheena','چینا کا آٹا','Cereals',[]],
  ['buckwheat','Buckwheat Flour','Kuttu','کُٹّو کا آٹا','Pseudocereals',[]],
  ['quinoa','Quinoa Flour','Quinoa','کوئنوا کا آٹا','Pseudocereals',[]],
  ['amaranth','Amaranth Flour','Rajgira','راجگیرے کا آٹا','Pseudocereals',[]],
  ['teff','Teff Flour','Teff','ٹیف کا آٹا','Cereals',[]],
  ['spelt','Spelt Flour','Spelt gandum','اسپیلٹ گندم کا آٹا','Cereals',['wheat','gluten']],
  ['einkorn','Einkorn Wheat Flour','Einkorn gandum','ایئنکورن گندم کا آٹا','Cereals',['wheat','gluten']],
  ['emmer','Emmer Wheat Flour','Emmer gandum','ایمر گندم کا آٹا','Cereals',['wheat','gluten']],
  ['red-lentil','Red Lentil Flour','Masoor','مسور کا آٹا','Pulses',['pulse']],
  ['green-lentil','Green Lentil Flour','Sabz masoor','سبز مسور کا آٹا','Pulses',['pulse']],
  ['split-moong','Split Moong Flour','Moong daal','مونگ دال کا آٹا','Pulses',['pulse']],
  ['urad','Black Gram Flour','Mash','ماش کا آٹا','Pulses',['pulse']],
  ['yellow-pea','Yellow Pea Flour','Peeli matar','پیلی مٹر کا آٹا','Pulses',['pulse']],
  ['green-pea','Green Pea Flour','Sabz matar','سبز مٹر کا آٹا','Pulses',['pulse']],
  ['soy','Soybean Flour','Soya','سویا بین کا آٹا','Pulses',['soy']],
  ['lupin','Lupin Flour','Lupin','لوپین کا آٹا','Pulses',['lupin']],
  ['pumpkin','Pumpkin Seed Meal','Kaddu beej','کدو کے بیجوں کا آٹا','Seeds',[]],
  ['sunflower','Sunflower Seed Meal','Surajmukhi beej','سورج مکھی کے بیجوں کا آٹا','Seeds',[]],
  ['hemp','Food-grade Hemp Seed Meal','Hemp beej','خوراک کے لیے ہیمپ بیج','Seeds',[]],
  ['almond','Almond Flour','Badam','بادام کا آٹا','Nuts & coconut',['tree-nut']],
  ['coconut','Coconut Flour','Nariyal','ناریل کا آٹا','Nuts & coconut',['coconut']],
  ['peanut','Peanut Flour','Moongphali','مونگ پھلی کا آٹا','Nuts & coconut',['peanut']],
  ['walnut','Walnut Meal','Akhrot','اخروٹ کا آٹا','Nuts & coconut',['tree-nut']],
  ['watermelon','Watermelon Seed Meal','Tarbooz magaz','تربوز کے بیجوں کا آٹا','Seeds',[]],
  ['melon','Melon Seed Meal','Kharbooza magaz','خربوزے کے بیجوں کا آٹا','Seeds',[]],
  ['nigella','Nigella Seeds','Kalonji','کلونجی','Spices & leaf',[]],
  ['mung-bean','Mung Bean Flour','Moong','مونگ کا آٹا','Pulses',['pulse']]
];
export const CATALOGUE: Ingredient[] = [...published.ingredients, ...extras.map(([id,name,roman,urdu,group,allergens]) => ({
  id,name,roman,urdu,group,allergens,basisPoints:0,
  sourceUrl: 'https://fdc.nal.usda.gov/', identityStatus: 'Educational ingredient name; exact food ID, milling and nutrient mapping pending review',
  note: `${name} is available for custom exploration only; it is not part of the published 18-ingredient recipe. Use food-grade ingredients and cook flour mixtures thoroughly. No nutrient composition, cooking performance or allergen-free status has been validated here.${allergens.length ? ` Highlighted concerns: ${allergens.join(', ')}.` : ''}${id==='lupin' ? ' Lupin can cause allergic reactions; seek product-specific advice, especially with peanut allergy.' : ''}`
}))];

