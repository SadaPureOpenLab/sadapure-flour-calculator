import {createServer,type IncomingMessage,type ServerResponse} from 'node:http';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {makeSheet} from '../src/lib/exports';
import {CATALOGUE,validateBlend,parseQuantity,type Blend} from '../src/lib/engine';
import {validateCustomer,orderFiles,customerOrderText,ORDER_EMAIL,ORDER_CC} from '../src/lib/order';

type Config={key?:string;from?:string;origin:string};
export function validateOrder(input:unknown){
 if(!input||typeof input!=='object')throw Error('Invalid request.');
 const payload=input as Record<string,unknown>;
 if(payload.consent!==true)throw Error('Agree to share your details with SadaPure for this enquiry.');
 const customer=validateCustomer(payload.customer);
 if(typeof payload.quantity!=='string')throw Error('Check your flour quantity.');parseQuantity(payload.quantity);
 if(!payload.blend||typeof payload.blend!=='object'||Array.isArray(payload.blend))throw Error('Check your ingredient mix.');
 const source=payload.blend as Record<string,unknown>;if(Object.keys(source).length!==CATALOGUE.length||Object.keys(source).some(id=>!CATALOGUE.some(i=>i.id===id)))throw Error('Unknown ingredient mix.');
 const blend=Object.fromEntries(CATALOGUE.map(i=>[i.id,source[i.id]])) as Blend;validateBlend(blend);
 if(typeof payload.requestId!=='string'||!/^\w[\w-]{15,79}$/.test(payload.requestId))throw Error('Refresh the review step and try again.');
 return {customer,sheet:makeSheet(payload.quantity,blend,true),requestId:payload.requestId};
}
export async function prepareEmail(input:unknown,from:string){const order=validateOrder(input),files=await orderFiles(order.sheet,order.customer);return {requestId:order.requestId,email:{from,to:[ORDER_EMAIL],cc:[ORDER_CC],reply_to:order.customer.email,subject:'Custom SadaPure flour order request',text:customerOrderText(order.sheet,order.customer),attachments:files.map(file=>({filename:file.name,content:Buffer.from(file.bytes).toString('base64')}))}};}
export async function submitOrder(input:unknown,config:Config,send:typeof fetch=fetch){
 if(!config.key||!config.from)throw Error('Email sending is not connected yet. Your request has not been sent.');
 const {requestId,email}=await prepareEmail(input,config.from);
 const validated=validateOrder(input);
 const hash=createHash('sha256').update(JSON.stringify({customer:validated.customer,grams:validated.sheet.grams,rows:validated.sheet.rows.map(row=>[row.id,row.share,row.grams])})).digest('hex');
 const response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${config.key}`,'Content-Type':'application/json','Idempotency-Key':`sadapure-${requestId}-${hash}`},body:JSON.stringify(email),signal:AbortSignal.timeout(20000)});
 const result=await response.json() as {id?:string};if(!response.ok||typeof result.id!=='string')throw Error('The email service did not accept your request. Nothing is confirmed; please retry or contact SadaPure.');return {accepted:true,reference:result.id};
}
export function orderServer(config:Config){
 const visits=new Map<string,{count:number;expires:number}>();
 return createServer(async(req:IncomingMessage,res:ServerResponse)=>{
  const reply=(code:number,body:unknown)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
  if(req.headers.origin!==config.origin){reply(403,{error:'Origin not allowed.'});return;}
  res.setHeader('Access-Control-Allow-Origin',config.origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.url!=='/custom-order'){reply(404,{error:'Not found.'});return;}
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  if(req.method==='GET'){reply(200,{ready:!!(config.key&&config.from)});return;}
  if(req.method!=='POST'||!req.headers['content-type']?.startsWith('application/json')){reply(405,{error:'Use a JSON order request.'});return;}
  const now=Date.now();for(const [ip,entry] of visits)if(entry.expires<now)visits.delete(ip);
  const ip=req.socket.remoteAddress??'unknown',entry=visits.get(ip)??{count:0,expires:now+60000};entry.count++;visits.set(ip,entry);if(entry.count>5){reply(429,{error:'Too many requests. Wait one minute before trying again.'});return;}
  try{let body='';for await(const chunk of req){body+=chunk.toString();if(Buffer.byteLength(body)>20000){reply(413,{error:'Request too large.'});return;}}
   const input=JSON.parse(body);validateOrder(input);if(!config.key||!config.from){reply(503,{error:'Email sending is not connected yet. Your request has not been sent.'});return;}
   reply(200,await submitOrder(input,config));
  }catch(error){const message=error instanceof Error?error.message:'Request could not be sent.';reply(/email service|fetch|timeout|abort/i.test(message)?502:400,{error:message});}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const config={key:process.env.RESEND_API_KEY,from:process.env.ORDER_FROM_EMAIL,origin:process.env.ORDER_ALLOWED_ORIGIN??'https://sadapureopenlab.github.io'};const server=orderServer(config);server.listen(Number(process.env.ORDER_PORT??5185),process.env.ORDER_HOST??'127.0.0.1',()=>console.log('SadaPure custom-order service started. Email credentials are never included in the public app.'));}
