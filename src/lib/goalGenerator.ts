import { GOALS } from '../data/goals';
import { GOAL_EXAMPLES } from '../data/goalExamples';
import { GOAL_RECIPES, type GeneratedGoal } from '../data/goalRecipes';
import { CATALOGUE, normalize, validateBlend } from './engine';
export function generateForGoal(goalId:string,exclusions:string[]):GeneratedGoal {
 const goal=GOALS.find(g=>g.id===goalId);if(!goal)throw new Error('Choose a supported goal.');
 const recipe=GOAL_RECIPES[goalId],percentages=recipe?.percentages??GOAL_EXAMPLES[goalId];
 if(!percentages)throw new Error('No reviewed ingredient example is available for this goal.');
 const unknown=Object.keys(percentages).filter(id=>!CATALOGUE.some(i=>i.id===id));if(unknown.length)throw new Error('Unmapped ingredients: '+unknown.join(', '));
 const sourceTotal=Object.values(percentages).reduce((a,b)=>a+b,0);
 if(recipe&&sourceTotal!==recipe.sourceTotal)throw new Error('Source total mismatch; formula needs review.');
 let blend=normalize(Object.fromEntries(CATALOGUE.map(i=>[i.id,(percentages[i.id]??0)*100])));
 const changes:string[]=[];
 let kind:GeneratedGoal['kind']=recipe?'published':'illustrative';
 if(sourceTotal!==100){kind='source-adjusted';changes.push(`Source rows total ${sourceTotal}%, not 100%. All listed shares were explicitly rescaled to 100%; the missing ingredient is unknown. This is a custom example, not an exact published formula.`);}
 const effective=[...new Set([...exclusions,...(goal.exclusion?[goal.exclusion]:[])])];
 for(const i of CATALOGUE){const forbidden=effective.some(ex=>ex==='gluten'?i.allergens.includes('gluten')||i.allergens.includes('oats'):ex==='nuts'?i.allergens.some(a=>['tree-nut','peanut','lupin'].includes(a)):i.allergens.includes(ex));if(forbidden&&blend[i.id]>0){changes.push(`${i.name} excluded (${blend[i.id]/100}%).`);blend[i.id]=0;kind='illustrative';}}
 const total=Object.values(blend).reduce((a,b)=>a+b,0);if(!total)throw new Error('No ingredients remain. Review your exclusions.');
 if(total!==10000){changes.push(`Remaining ${total/100}% rescaled to 100%.`);blend=normalize(blend);}
 validateBlend(blend);
 return {blend,changes,title:recipe?.title??`${goal.label} — experimental food example`,source:recipe?.source,kind};
}
