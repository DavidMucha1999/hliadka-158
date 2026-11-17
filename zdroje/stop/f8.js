/* Pas postupu, tip na dalsi krok, cena trpezlivosti na tlacidlach, urovne pomoci */
const F8L={easy:"Ľahká",norm:"Normálna",hard:"Ťažká"};
function f8Lvl(){const v=S.save&&S.save.helpLvl;return v==="easy"||v==="hard"?v:"norm"}
{const f0=f7Facts;f7Facts=function(c){const L=f0.apply(this,arguments);return f8Lvl()==="hard"?L.filter(x=>!/po platnosti \(do|Platnosť dokladov/.test(x.t)):L}}
function f8Steps(c){const u=c.used,F=c.f1||{},nq=Object.keys(F.q||{}).length+(c.f3p&&c.f3p.asked?1:0);return[["Doklady",u.docs],["Otázky",nq>=2],["Lustrácia",u.lust],["Testy a obhliadka",u.dych||u.drug||u.obh||F.refused],["Záznam",F.done]]}
function f8Tip(c){const u=c.used,F=c.f1||{},L=f7Facts(c),easy=f8Lvl()==="easy",has=re=>L.some(x=>(x.k==="obs"||x.k==="flag"||x.k==="bad")&&re.test(x.t)),wx=S.shift?S.shift.wx:"",nq=Object.keys(F.q||{}).length;
 if(F.done)return"";if(!u.docs)return"Začni dokladmi – vyžiadaj si ich klávesom 1.";
 if(!u.dych&&!F.refused&&(has(/alkohol|kľučk|potáca|nezreteľn|sklenen|zahmlen|plechovk|druhú výzvu/)||(F.cl||[]).some(x=>x.mk&&x.k==="drink")))return"Je tu podozrenie z alkoholu – urob dychovú skúšku (3).";
 if(!u.drug&&has(/zreničk/))return"Rozšírené zreničky – narkotest (4) ukáže drogy.";
 if(!u.obh&&(c.kind==="truck"||c.kind==="bus"))return"Pri nákladnej doprave nezabudni na obhliadku, tachograf a váhu (5).";
 if(!u.obh&&c.kind==="car"&&wx==="snow")return"Je sneh – obhliadka (5) ukáže, aké má auto pneumatiky.";
 if(!u.srch&&has(/vyhodil|priekop|nápadne nízko|zakrýva|škrabance|Kryt motora|stuhne/))return"Máš stopu – prehliadka vozidla (6) je odôvodnená.";
 if(!u.lust&&(c.nervous||has(/nervózn|obzerá|trasú|vyhýba/)||(F.cl||[]).some(x=>x.mk)))return"Vodič je podozrivý – over auto aj osobu lustráciou (2).";
 if(nq<2)return"Polož pár otázok (A – H) a porovnaj odpovede s dokladmi aj medzi sebou.";
 if(easy){const cl=F.cl||[];if(cl.some(x=>x.bad&&!x.mk))return"Niektorá odpoveď nesedí – skús ju nájsť a označiť ako rozpor.";if(!u.lust)return"Lustrácia (2) odhalí kradnuté auto alebo hľadanú osobu.";return L.some(x=>x.k==="bad")?"Máš dôkazy – spíš záznam (Z), zaškrtni ich a potvrď opatrenia.":"Zatiaľ je všetko v poriadku – vodiča môžeš pustiť (Q)."}
 return"Keď máš dosť zistení, spíš záznam (Z). Ak je všetko v poriadku, pusti vodiča (Q)."}
function f8Strip(){const c=S.stop,el=$("#scr-stop");if(!c||!el||!c.f1)return;let s=$("#f8s");if(!s){const g=el.querySelector(".sgrid");if(!g)return;g.insertAdjacentHTML("beforebegin",`<div class="f8s" id="f8s"></div>`);s=$("#f8s")}const st=f8Steps(c),lv=f8Lvl(),tip=lv==="hard"?"":f8Tip(c);
 const h=`<div class="f8st">${st.map(([n,d],i)=>`<span class="${d?"d":""}">${d?"✔":i+1} ${n}</span>`).join('<i>›</i>')}</div>${tip?`<div class="f8tip">💬 <b>${S.save.partner?esc(S.save.partner.first||"Kolega"):"Tip"}:</b> ${tip}</div>`:""}<button class="btn ghost f8lv" id="f8-lv" title="Úroveň pomoci pri kontrole">🧭 Pomoc: ${F8L[lv]}</button>`;if(s.innerHTML!==h){s.innerHTML=h;$("#f8-lv").onclick=()=>{const o=["easy","norm","hard"];S.save.helpLvl=o[(o.indexOf(lv)+1)%3];persist();toast(`Pomoc pri kontrole: ${F8L[f8Lvl()]}`);try{renderTools();f7Render()}catch(e){}f8Strip()}}}
{const r0=f7Render;f7Render=function(){r0.apply(this,arguments);try{f8Strip()}catch(e){console.warn("f8",e)}}}
function f8Cost(c,key){const mul=F1MUL[c.mood]||1;const m={docs:toolMin("docs"),lust:toolMin("lust"),dych:toolMin("dych"),drug:5,obh:toolMin("obh"),srch:3,mate:0}[key];if(m==null)return 0;return Math.round(m*3*mul+(key==="srch"&&!(c.f1&&c.f1.srchAsked)?10*mul:0))}
function f8Badges(){const c=S.stop;if(!c||!c.f1||f8Lvl()==="hard")return;const mul=F1MUL[c.mood]||1,ID={"t-docs":"docs","t-lust":"lust","t-dych":"dych","t-drug":"drug","t-obh":"obh","t-srch":"srch"};for(const[id,k]of Object.entries(ID)){const b=$("#"+id);if(!b||b.disabled||b.querySelector(".f8p"))continue;const v=f8Cost(c,k);if(v)b.insertAdjacentHTML("beforeend",`<small class="f8p" title="Trpezlivosť vodiča">−${v}</small>`)}document.querySelectorAll("#f1q [data-q]:not([disabled]),#f1q [data-q3]:not([disabled])").forEach(b=>{if(b.querySelector(".f8p"))return;const v=Math.round(b.dataset.q3?3*mul+2:7*mul);b.insertAdjacentHTML("beforeend",`<small class="f8p" title="Trpezlivosť vodiča">−${v}</small>`)})}
{const t0=renderTools;renderTools=function(){t0.apply(this,arguments);try{f8Badges()}catch(e){}}}
{const q0=f1RQ;f1RQ=function(){q0.apply(this,arguments);try{f8Badges()}catch(e){}}}
