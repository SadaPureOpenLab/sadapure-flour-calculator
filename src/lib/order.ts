import { ingredientLabel } from '../data/catalogue';
import {createPDF,createExcel,type Sheet} from './exports';
export const PRODUCT_URL='https://sadapure.com/product/multi-grain-atta-flour';
export const ORDER_EMAIL='sadapure.com@gmail.com';
export const ORDER_CC='contact@sadapure.com';
export type Customer={name:string;email:string;phone:string;address:string;city:string;region:string;country:string;postal:string;note:string};
export const EMPTY_CUSTOMER:Customer={name:'',email:'',phone:'',address:'',city:'',region:'',country:'Pakistan',postal:'',note:''};
export function validateCustomer(input:unknown):Customer{
 if(!input||typeof input!=='object')throw Error('Enter your contact and delivery details.');
 const customer={...EMPTY_CUSTOMER};const limits:Record<keyof Customer,number>={name:80,email:254,phone:40,address:240,city:80,region:80,country:80,postal:20,note:600};
 for(const key of Object.keys(customer) as (keyof Customer)[]){const value=(input as Record<string,unknown>)[key];if(typeof value!=='string'||value.length>limits[key]||/[\u0000-\u001f\u007f]/.test(value))throw Error(`Check your ${key}.`);customer[key]=value.trim();}
 for(const key of ['name','email','phone','address','city','country'] as const)if(!customer[key])throw Error(`Enter your ${key}.`);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))throw Error('Enter a valid email address.');
 if(!/^[+\d ().-]+$/.test(customer.phone)||customer.phone.replace(/\D/g,'').length<7||customer.phone.replace(/\D/g,'').length>15)throw Error('Enter a valid phone number with country code.');
 return customer;
}
export function customerFields(customer:Customer){return {'Full name':customer.name,'Email':customer.email,'Phone':customer.phone,'Street address':customer.address,'City':customer.city,'Province / region':customer.region||'--','Country':customer.country,'Postal code':customer.postal||'--','Order note':customer.note||'--'};}
export function privateOrderSheet(sheet:Sheet):Sheet{return {...sheet,classification:'Custom flour order request — for SadaPure team review',rationale:undefined,source:{url:'https://sadapure.com/contact-us',title:'SadaPure custom-order enquiry',version:'2026-10-14',retrieved:'2026-10-14'}};}
export function customerOrderText(sheet:Sheet,customer:Customer){return `Hello SadaPure team,\n\nPlease review my custom flour (Atta) order request.\n\n${Object.entries(customerFields(customer)).map(([key,value])=>`${key}: ${value}`).join('\n')}\n\nTotal dry flour: ${sheet.grams.toLocaleString('en-US')} g (${sheet.grams/1000} kg).\n${sheet.rows.map(row=>`${ingredientLabel(row)}: ${row.share}% — ${row.grams.toFixed(2)} g`).join('\n')}\n\nPlease confirm availability, preparation, price and delivery. This is an enquiry, not a confirmed order.\nPDF and Excel order files include my contact details and the full ingredient breakdown.`;}
export function gmailDraftUrl(sheet:Sheet,customer:Customer){const query=new URLSearchParams({view:'cm',fs:'1',to:ORDER_EMAIL,cc:ORDER_CC,su:'Custom SadaPure flour order request',body:customerOrderText(sheet,customer)+'\n\nI will attach the downloaded PDF and Excel files before sending.'});return 'https://mail.google.com/mail/?'+query;}
export async function orderFiles(sheet:Sheet,customer:Customer){const clean=privateOrderSheet(sheet),fields=customerFields(validateCustomer(customer));const pdf=await createPDF(clean,fields),excel=await createExcel(clean,fields);return [{name:'sadapure-custom-order.pdf',type:'application/pdf',bytes:new Uint8Array(pdf.output('arraybuffer'))},{name:'sadapure-custom-order.xlsx',type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',bytes:excel}];}
export function orderRequest(sheet:Sheet){
 const subject='Custom SadaPure flour order request';
 const intro=`Hello SadaPure team,\n\nPlease review this custom flour blend request.\nTotal dry flour: ${sheet.grams.toLocaleString('en-US')} g (${sheet.grams/1000} kg).\n`;
 const rows=sheet.rows.map(r=>`${ingredientLabel(r)}: ${r.share}% — ${r.grams.toFixed(2)} g`).join('\n');
 const ending='\n\nPlease confirm ingredient availability, preparation, minimum order, price and delivery before confirming an order. I can provide my delivery area and contact details in my reply.\n\nThank you.';
 const fullText=intro+'\n'+rows+ending;
 const linkFor=(body:string)=>`mailto:${ORDER_EMAIL}?cc=contact%40sadapure.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 const emailText=linkFor(fullText).length<1900?fullText:intro+'\nI will attach the calculator CSV with the complete ingredient breakdown.'+ending;
 return {fullText,emailText,href:linkFor(emailText)};
}
