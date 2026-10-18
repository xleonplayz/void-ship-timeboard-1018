function problem(code) {const error=new Error(code);error.code=code;return error;}
export function convert(instant, zone, locale) {
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(instant))throw problem('invalid_instant');
  const epoch=Date.parse(instant);
  if(!Number.isFinite(epoch)||new Date(epoch).toISOString().slice(0,19)+'Z'!==instant)throw problem('invalid_instant');
  if(zone.length>100||locale.length>50)throw problem('invalid_options');
  try {Intl.getCanonicalLocales(locale);} catch {throw problem('invalid_locale');}
  let formatter;
  try {formatter=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});}
  catch {throw problem('invalid_zone');}
  const fields={};
  for(const part of formatter.formatToParts(new Date(epoch)))if(part.type!=='literal')fields[part.type]=part.value;
  const wall=fields.year+'-'+fields.month+'-'+fields.day+'T'+fields.hour+':'+fields.minute+':'+fields.second;
  const offsetMinutes=(Date.parse(wall+'Z')-epoch)/60000;
  const label=new Intl.DateTimeFormat(locale,{timeZone:zone,dateStyle:'full',timeStyle:'short',hourCycle:'h23'}).format(new Date(epoch));
  return {instant,epoch,zone,locale,wall,offsetMinutes,label};
}
