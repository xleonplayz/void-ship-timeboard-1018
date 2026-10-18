export const events = [
  {id:'handover', title:'Übergabe · Berlin → 東京', start:'2026-10-25T00:30:00Z', minutes:90, budget:1234.5,
   description:'Team A, Team B; Übergabe\nKalender für München und 東京. '+ 'Planung, Prüfung; Veröffentlichung. '.repeat(5)},
  {id:'review', title:'Design review · New York', start:'2026-11-01T06:30:00Z', minutes:45, budget:80,
   description:'Second 01:30 after the clock change; stored as a unique UTC instant.'},
  {id:'new-year', title:'Neujahrsplanung · Kiritimati', start:'2026-12-31T12:30:00Z', minutes:30, budget:0,
   description:'This UTC date is already the following year in Pacific/Kiritimati.'}
];
const escapeText = text => text.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function fold(text) {
  let output='', line='', bytes=0;
  for(let index=0;index<text.length;index++) {
    let character=text[index],c=text.charCodeAt(index);
    if(c>=55296&&c<=56319&&index+1<text.length){character+=text[++index];c=65536;}
    const size=c<128?1:c<2048?2:c<65536?3:4;
    if(bytes+size>75) {output+=line+'\r\n';line=' ';bytes=1;}
    line+=character;bytes+=size;
  }
  return output+line;
}
const stamp = iso => new Date(iso).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
export function calendar() {
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ship Fixtures//Timeboard//EN','CALSCALE:GREGORIAN'];
  for(const event of events) lines.push('BEGIN:VEVENT','UID:'+event.id+'@ship.invalid','DTSTAMP:20261018T000000Z',
    'DTSTART:'+stamp(event.start),'DTEND:'+stamp(Date.parse(event.start)+event.minutes*60000),
    'SUMMARY:'+escapeText(event.title),'DESCRIPTION:'+escapeText(event.description),'END:VEVENT');
  lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}
