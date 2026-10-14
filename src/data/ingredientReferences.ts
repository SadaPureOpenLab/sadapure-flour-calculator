export const INGREDIENT_REFERENCES={
 cereal:{title:'FAO book: Sorghum and millets in human nutrition',url:'https://www.fao.org/4/T0818E/T0818E00.htm',level:'Food-family reference; not a clinical flour-percentage protocol'},
 flour:{title:'Google Books: Cereal Grains — Properties, Processing, and Nutritional Attributes',url:'https://books.google.com/books/about/Cereal_Grains.html?id=OgzSBQAAQBAJ',level:'Bibliographic record and available preview only; full book not reviewed'},
 pulse:{title:'Published review: Pulse and wheat flour blending',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9601813/',level:'Food technology review; baking formulation does not establish clinical treatment'},
 seed:{title:'Published review: Bread enrichment with oilseeds',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6262637/',level:'Family-level food technology review; oil/whole seed/meal are not interchangeable'},
 pseudo:{title:'Published study: Amaranth, quinoa and buckwheat wholemeal flour',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8003493/',level:'Specific study samples; not validated nutrient values for SadaPure supplies'},
 teff:{title:'Published review: Teff food applications',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4571201/',level:'Food applications review; no condition-specific flour dose inferred'},
 oat:{title:'Published review: Oats and beta-glucan trials',url:'https://drc.bmj.com/content/10/5/e002784',level:'Studies use specific food forms and doses; not proof of this flour recipe'},
 fenugreek:{title:'NCCIH: Fenugreek evidence and safety',url:'https://www.nccih.nih.gov/health/fenugreek',level:'Safety reference; culinary use is not an extract dose; pregnancy and interactions matter'},
 nut:{title:'Google Books: Nuts and Seeds in Health and Disease Prevention',url:'https://books.google.com/books/about/Nuts_and_Seeds_in_Health_and_Disease_Pre.html?id=deXEDwAAQBAJ',level:'Bibliographic record and available preview only; full chapters not reviewed'},
 raw:{title:'FDA: Flour is a raw food',url:'https://www.fda.gov/consumers/consumer-updates/flour-raw-food-and-other-safety-facts',level:'Food safety only; no benefit or therapeutic percentage established'},
 lupin:{title:'FDA: Lupin and allergenicity',url:'https://www.fda.gov/food/food-additives-petitions/lupin-and-allergenicity-frequently-asked-questions',level:'Ingredient-specific allergy safety reference'},
 psyllium:{title:'NIDDK: Fibre, diet and constipation',url:'https://www.niddk.nih.gov/health-information/digestive-diseases/constipation/eating-diet-nutrition',level:'Dietary pattern guidance; not a prescribed psyllium flour dose'}
};
export function ingredientReference(id:string,group:string){
 if(id==='lupin')return INGREDIENT_REFERENCES.lupin;
 if(id==='fenugreek')return INGREDIENT_REFERENCES.fenugreek;
 if(id==='teff')return INGREDIENT_REFERENCES.teff;
 if(['oat-flour','oat-bran','barley'].includes(id))return INGREDIENT_REFERENCES.oat;
 if(id==='psyllium')return INGREDIENT_REFERENCES.psyllium;
 if(group==='Pulses')return INGREDIENT_REFERENCES.pulse;
 if(group==='Pseudocereals')return INGREDIENT_REFERENCES.pseudo;
 if(group==='Seeds')return INGREDIENT_REFERENCES.seed;
 if(group==='Nuts & coconut')return INGREDIENT_REFERENCES.nut;
 if(['sorghum','millet','finger-millet','foxtail-millet','little-millet','barnyard-millet','kodo-millet','proso-millet'].includes(id))return INGREDIENT_REFERENCES.cereal;
 if(group==='Spices & leaf')return INGREDIENT_REFERENCES.raw;
 return INGREDIENT_REFERENCES.flour;
}
