import http from 'node:http';
import {release} from './policy.js';
import {events,calendar} from './calendar.js';
import {convert} from './time.js';
import {html,client} from './ui.js';

http.createServer((req,res)=>{
  const url=new URL(req.url,'http://timeboard.local');
  const send=(status,type,body,headers={})=>{
    console.log(JSON.stringify({event:'timeboard_request',release,method:req.method,path:url.pathname,status}));
    res.writeHead(status,{'content-type':type,'cache-control':'no-store','x-timeboard-release':String(release),...headers});res.end(body);
  };
  const json=(status,data)=>send(status,'application/json; charset=utf-8',JSON.stringify(data));
  try {
    if(req.method!=='GET')return send(405,'application/json','{"error":"method_not_allowed"}',{'allow':'GET'});
    if(url.pathname==='/')return send(200,'text/html; charset=utf-8',html);
    if(url.pathname==='/client.js')return send(200,'text/javascript; charset=utf-8',client);
    if(url.pathname==='/favicon.ico')return send(204,'image/x-icon','');
    if(url.pathname==='/health')return json(200,{ok:true,release,team:process.env.TEAM_LABEL||'Orbit Studio',intl:typeof Intl});
    if(url.pathname==='/api/convert')return json(200,convert(url.searchParams.get('instant')||'',url.searchParams.get('zone')||'UTC',url.searchParams.get('locale')||'en-GB'));
    if(url.pathname==='/api/schedule') {
      const zone=url.searchParams.get('zone')||'Europe/Berlin',locale=url.searchParams.get('locale')||'de-DE';
      const rows=events.map(event=>({...event,startLocal:convert(event.start,zone,locale),endLocal:convert(new Date(Date.parse(event.start)+event.minutes*60000).toISOString().slice(0,19)+'Z',zone,locale),budgetLabel:new Intl.NumberFormat(locale,{style:'currency',currency:'EUR'}).format(event.budget)}));
      return json(200,{release,team:process.env.TEAM_LABEL||'Orbit Studio',zone,locale,events:rows});
    }
    if(url.pathname==='/calendar.ics')return send(200,'text/calendar; charset=utf-8',calendar(),{'content-disposition':"attachment; filename=team.ics; filename*=UTF-8''Terminplan-%C3%BCber-Zeitzonen.ics"});
    if(url.pathname==='/diagnostic/date')return json(200,{iso:new Date('2026-10-25T00:30:00Z').toISOString(),epoch:Date.parse('2026-10-25T00:30:00Z')});
    if(url.pathname==='/diagnostic/intl')return json(200,{value:new Intl.DateTimeFormat('en-GB',{timeZone:'UTC'}).format(new Date('2026-10-25T00:30:00Z'))});
    if(url.pathname==='/diagnostic/parts')return json(200,{value:new Intl.DateTimeFormat('en-GB',{timeZone:'UTC'}).formatToParts(new Date('2026-10-25T00:30:00Z'))});
    if(url.pathname==='/diagnostic/number')return json(200,{value:new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(1234.5)});
    return json(404,{error:'not_found'});
  } catch(error) {
    console.log(JSON.stringify({event:'timeboard_error',name:error.name,code:error.code||'format_failed',message:error.message}));
    return json(error.code?400:500,{error:error.code||'format_failed',message:error.message,release});
  }
}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('timeboard_ready release='+release));
