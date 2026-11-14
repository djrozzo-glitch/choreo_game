const GAME_URL='https://djrozzo-glitch.github.io/choreo_game/';
const ALLOWED_ORIGIN='https://djrozzo-glitch.github.io';
const ID=/^[A-Za-z0-9_-]{8,16}$/;
function cors(origin){return {'Access-Control-Allow-Origin':origin===ALLOWED_ORIGIN?origin:ALLOWED_ORIGIN,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};}
function json(data,status=200,origin=''){return new Response(JSON.stringify(data),{status,headers:{...cors(origin),'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}})}
function valid(d){return d&&d.format==='everybody-dances'&&d.version===1&&Array.isArray(d.poses)&&d.poses.length>=2&&d.poses.length<=8&&Array.isArray(d.boneNames)&&d.boneNames.length>=20&&d.boneNames.length<=150&&d.poses.every(p=>Array.isArray(p.q)&&p.q.length===d.boneNames.length&&p.q.every(q=>Array.isArray(q)&&q.length===4&&q.every(n=>Number.isFinite(n)&&Math.abs(n)<=2))&&Array.isArray(p.h)&&p.h.length===3&&p.h.every(Number.isFinite)&&Array.isArray(p.root)&&p.root.length===3&&p.root.every(Number.isFinite))&&Number.isFinite(d.bpm)&&d.bpm>=50&&d.bpm<=180&&[1,2,4].includes(d.bars)&&['from-within','broken-glass','silent'].includes(d.track)}
export default {async fetch(request,env){
 const url=new URL(request.url),origin=request.headers.get('Origin')||'';
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors(origin),'Access-Control-Max-Age':'86400'}});
 if(url.pathname==='/api/dances'&&request.method==='POST'){
  if(origin!==ALLOWED_ORIGIN)return json({error:'Forbidden origin'},403,origin);
  if(Number(request.headers.get('Content-Length')||0)>65000)return json({error:'Too large'},413,origin);
  let raw;try{raw=await request.text()}catch{return json({error:'Invalid body'},400,origin)}
  if(raw.length>65000)return json({error:'Too large'},413,origin);
  let data;try{data=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400,origin)}
  if(!valid(data))return json({error:'Invalid choreography'},400,origin);
  const id=Array.from(crypto.getRandomValues(new Uint8Array(9)),b=>'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[b%62]).join('');
  await env.DANCES.put('dance:'+id,JSON.stringify(data),{expirationTtl:60*60*24*365});
  return json({id,url:url.origin+'/d/'+id},201,origin);
 }
 const match=url.pathname.match(/^\/api\/dances\/([A-Za-z0-9_-]{8,16})$/);
 if(match&&request.method==='GET'){
  const data=await env.DANCES.get('dance:'+match[1]);
  return data?new Response(data,{headers:{...cors(origin),'Content-Type':'application/json','Cache-Control':'public, max-age=120'}}):json({error:'Not found'},404,origin);
 }
 const redirect=url.pathname.match(/^\/d\/([A-Za-z0-9_-]{8,16})$/);
 if(redirect&&request.method==='GET'){
  return Response.redirect(GAME_URL+'?dance='+encodeURIComponent(redirect[1])+'&api='+encodeURIComponent(url.origin),302);
 }
 if(url.pathname==='/'&&request.method==='GET')return Response.redirect(GAME_URL,302);
 return json({error:'Not found'},404,origin);
}};