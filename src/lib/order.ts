import { ingredientLabel } from '../data/catalogue';
import type { Sheet } from './exports';
export const PRODUCT_URL='https://sadapure.com/product/multi-grain-atta-flour';
export const ORDER_EMAIL='contact@sadapure.com';
export function orderRequest(sheet:Sheet){
 const subject='Custom SadaPure flour order request';
 const intro=`Hello SadaPure team,\n\nPlease review this custom flour blend request.\nTotal dry flour: ${sheet.grams.toLocaleString('en-US')} g (${sheet.grams/1000} kg).\n`;
 const rows=sheet.rows.map(r=>`${ingredientLabel(r)}: ${r.share}% — ${r.grams.toFixed(2)} g`).join('\n');
 const ending='\n\nPlease confirm ingredient availability, preparation, minimum order, price and delivery before confirming an order. I can provide my delivery area and contact details in my reply.\n\nThank you.';
 const fullText=intro+'\n'+rows+ending;
 const linkFor=(body:string)=>`mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 const emailText=linkFor(fullText).length<1900?fullText:intro+'\nI will attach the calculator CSV with the complete ingredient breakdown.'+ending;
 return {fullText,emailText,href:linkFor(emailText)};
}
