{
/* =====================================================================================
   LETECKÁ POLÍCIA – režim „Posádka“ (fáza 1)
   dve kreslá (pilot / operátor), orbit, priebeh misie bez časovačov, hodnotenie
   ===================================================================================== */
const HXT=()=>performance.now()/1e3;
const hxOn=()=>!!(S.save&&S.save.hx!==false&&S.shift&&S.shift.heli&&S.screen==="heli");
window.__hxOn=hxOn;
const HXTIER={car:1,truck:1,foot:1,nightfoot:1,lost:1,accident:1,jam:1,fire:2,bigfire:2,river:2,crowd:2,medevac:2,boat:2,fish:2,ice:3,border:3,drone:3,convoy:3,concert:3,cycle:3};
const hxTier=()=>{const L=(S.save&&S.save.hxc)||{pil:0,op:0},lv=x=>x>=900?3:x>=300?2:1;return Math.max(lv(L.pil||0),lv(L.op||0))};
window.__hxTy=ty=>{if(!(S.save&&S.save.hx!==false))return ty;const T=hxTier();const f=ty.filter(x=>(HXTIER[x[0]]||3)<=T);return f.length?f:[["car",1]]};
/* náročnosť konkrétnej misie (špeciálne misie majú v hre prepožičaný typ) – vyššia = viac XP */
const hxMisTier=M=>{const t=M.title||"";if(M.border||M.t==="drone"||M.t==="ice"||/Koncert|Štátna|Cyklist/.test(t))return 3;if(/rybár/i.test(t))return 2;return HXTIER[M.t]||1};
window.__hxTyOk=t=>!(S.save&&S.save.hx!==false)||(HXTIER[t]||3)<=hxTier();
const HXRES=["lost","river","ice"],HXAUTO=["car","truck","foot","nightfoot","lost","river","ice","boat"],HXCHASE=["car","truck","foot","nightfoot"];
const HXS=sh=>sh.hx||(sh.hx={seat:"pilot",orb:null,prevCam:"chase",held:{},uiT:0,said:{}});
const HXPH=["Výzva","Presun","Pátranie","Potvrdenie","Sledovanie","Zákrok"];
const hxSay=(who,txt)=>{try{h7Comm(who,txt,"POSÁDKA")}catch(e){}};
const hxRadio=(who,txt,ch)=>{try{h7Comm(who,txt,ch||"STREDISKO")}catch(e){}};
const hxClock=(sh,x,y)=>{const hp=sh.hp,fl=sh.fl,rel=Math.atan2(y-hp.y,x-hp.x)-fl.hd;let c=Math.round(((rel%6.2832)+6.2832)%6.2832/(6.2832/12))%12;return c===0?12:c};
const hxDist=d=>d<1000?Math.round(d/10)*10+" metrov":(d/1000).toFixed(1).replace(".",",")+" kilometra";
const hxTgtSpd=M=>{const t=M.tgt;if(!t)return 0;return M.c&&t===M.c?(M.c.v||0):Math.hypot(t.vx||0,t.vy||0)};

/* ---------- orbit: AI pilot krúži okolo bodu alebo sleduje cieľ ---------- */
{const g0=hGoal;hGoal=function(sh){if(sh.ap==="hxorb"&&sh.hx&&sh.hx.orb){const o=sh.hx.orb,M=sh.mis,hp=sh.hp;let cx=o.x,cy=o.y;
  /* hmla: nízka oblačnosť – krúženie najviac 120 m; silný vietor: väčší polomer */
  const alt=Math.min(o.alt,sh.wx==="fog"?120:999),r=o.r>0&&sh.wind&&sh.wind.s>8?Math.max(o.r,220):o.r;
  if(o.esc&&M){const L=M.lead||M.cyc&&M.cyc.riders&&M.cyc.riders[0];if(L&&isFinite(L.x)&&isFinite(L.y)){cx=L.x;cy=L.y;o.x=cx;o.y=cy}}
  /* poistka: neplatný stred (napr. pretekári ešte nemajú polohu) by pokazil polohu vrtuľníka */
  if(!isFinite(cx)||!isFinite(cy)){const a0=M&&M.area;if(a0&&isFinite(a0.x)){cx=a0.x;cy=a0.y;o.x=cx;o.y=cy}else return g0(sh)}
  if(o.tgt&&M&&M.tgt&&M.phase==="track"){cx=M.tgt.x;cy=M.tgt.y;o.x=cx;o.y=cy;
    if(HXRES.includes(M.t)||M.t==="boat")return{x:cx,y:cy,alt:30};
    if(hxTgtSpd(M)>11){const a=Math.atan2(hp.y-cy,hp.x-cx);return{x:cx+Math.cos(a)*r*.55,y:cy+Math.sin(a)*r*.55,alt}}}
  const a=Math.atan2(hp.y-cy,hp.x-cx)+o.dir*.42;return{x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,alt}}return g0(sh)}}
const hxOrbit=(sh,x,y,tgt)=>{const H=HXS(sh),o=H.orb||{r:260,alt:130,dir:1};o.x=x;o.y=y;o.tgt=!!tgt;o.esc=0;H.orb=o;sh.ap="hxorb";sh.goto=null;sh.fl.wps=[]};
/* krúženie podľa druhu misie a fázy */
const hxOrbitFor=(sh,M)=>{const H=HXS(sh);if(!M){const a=sh._gimAim;hxOrbit(sh,a?a[0]:sh.hp.x,a?a[2]:sh.hp.y,false);return}
  if(M.phase==="track"&&M.tgt){hxOrbit(sh,M.tgt.x,M.tgt.y,true);H.orb.r=260;H.orb.alt=130;return}
  if(M.phase==="scan"&&M.site){const s=M.site,v=M.t==="fire"?[100,110]:M.t==="crowd"?[170,150]:[0,90];hxOrbit(sh,s.x,s.y,false);H.orb.r=v[0];H.orb.alt=v[1];return}
  if(M.t==="escort"){const L0=M.lead||M.cyc&&M.cyc.riders&&M.cyc.riders[0],L=L0&&isFinite(L0.x)?L0:M.area;if(L){hxOrbit(sh,L.x,L.y,false);H.orb.r=300;H.orb.alt=160;H.orb.esc=1;return}}
  const c=M.site&&M.phase!=="search"?M.site:M.area;if(c){hxOrbit(sh,c.x,c.y,false);H.orb.r=hxAreaR(M,c);H.orb.alt=M.t==="lost"?110:130}};
/* polomer kruženia vždy vnútri oblasti, inak sa pátranie nezačne */
const hxAreaR=(M,c)=>{const b=M.t==="lost"?200:260;return c===M.area&&M.area.r>0?Math.max(80,Math.min(b,M.area.r*.7)):b};

/* aktuálny pokyn (pôvodný panel je v režime Posádka skrytý, jeho text sa neobnovuje) */
const hxNow=sh=>{try{if(typeof h17Now==="function"){let r=h17Now(sh);const M=sh.mis;if(r&&M&&typeof r[0]==="string"){const t=M.title||"";if(/Koncert/.test(t))r=[r[0].replace("okolo námestia","okolo štadióna"),r[1],r[2]];else if(/rybár/i.test(t))r=[r[0].replace("okolo námestia","nad jazerom"),r[1],r[2]];if(M.phase==="escort"){r=[r[0].replace("snímanie","sprievod").replace("od kolóny",M.cyc?"od peletónu":"od kolóny"),r[1],r[2]]}}sh._h17now=r;return r}}catch(e){}return sh._h17now};
/* ---------- kreslá ---------- */
const hxSeat=(sh,seat)=>{const H=HXS(sh),fl=sh.fl;if(!fl||H.seat===seat)return;H.seat=seat;H.held={};
  if(seat==="op"&&sh.mis&&sh.mis.t==="medevac"){H.seat="pilot";toast("Pri leteckom transporte pacienta pristávaš ty – ostaň v kresle pilota.");return}
  if(seat==="op"){H.prevCam=fl.cam==="belly"?"chase":fl.cam;fl.cam="belly";const M=sh.mis;
    /* operátor mal pri hľadaní v lese alebo v noci zapnutú termokameru – prevezmi ju */
    try{const tg=M&&M.tgt,N=G3.N||0;if(tg&&!sh.thermal&&(HXRES.includes(M.t)||N>.5||tg.k==="human"&&hInF(tg.x,tg.y))){sh.thermal=true;H.thAuto=1}}catch(e){}
    hxOrbitFor(sh,M);
    toast("Si OPERÁTOR. Pilot krúži nad bodom. Kamera: myš alebo W A S D, zoom koliesko, Medzerník = krúž tu, Tab = späť pilotovať.");
  }else{fl.cam=H.prevCam||"chase";if(sh.ap==="hxorb")sh.ap=false;if(H.thAuto){sh.thermal=false;H.thAuto=0}try{if(document.pointerLockElement)document.exitPointerLock()}catch(e){}
    toast("Si PILOT. Operátor obsluhuje kameru, hľadá cieľ a hlási, kde je. Tab = presadnúť ku kamere.")}
  SFX.play("click")};
window.__hxSeat=s=>{const sh=S.shift;if(sh&&sh.heli)hxSeat(sh,s)};

/* ---------- klávesy (pred pôvodným ovládaním) ---------- */
{const prev=hKey;window.removeEventListener("keydown",prev,true);
 hKey=function(e){if(!hxOn()||(e.target&&e.target.closest&&e.target.closest("input,textarea,select")))return prev(e);
  const sh=S.shift,H=HXS(sh),k=e.key.toLowerCase(),stop=()=>{e.preventDefault();e.stopImmediatePropagation()};
  if(k==="tab"){stop();if(!e.repeat&&!modalOpen()&&sh.fl)hxSeat(sh,H.seat==="op"?"pilot":"op");return}
  if(H.seat==="op"&&!modalOpen()&&!sh._map){
    if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k)){stop();H.held[k]=true;return}
    if(k==="q"||k==="e"){stop();const o=H.orb;if(o){o.r=clamp(o.r+(k==="e"?40:-40),140,650);toast("Polomer krúženia "+o.r+" m")}return}
    if(k==="r"||k==="f"||k==="shift"){stop();const o=H.orb;if(o){o.alt=clamp(o.alt+(k==="f"?-20:20),60,320);toast("Výška krúženia "+o.alt+" m")}return}
    if(k===" "){stop();if(e.repeat)return;const M=sh.mis,a=sh._gimAim;
      if(M&&M.phase==="track"&&M.tgt&&M.atk){hxOrbit(sh,M.tgt.x,M.tgt.y,true);toast("Pilot krúži okolo cieľa a drží sa ho.")}
      else if(a){hxOrbit(sh,a[0],a[2],false);toast("Pilot krúži okolo bodu v strede kamery.")}
      if(H.orb)H.orb.dir=H.orb.dir||1;SFX.play("radio");return}
    if(k==="c"){stop();toast("Ako operátor máš podvesnú kameru. Tab = späť do kresla pilota.");return}
  }
  return prev(e)};
 window.addEventListener("keydown",hKey,true);
 window.addEventListener("keyup",e=>{const sh=S.shift;if(sh&&sh.hx)sh.hx.held[e.key.toLowerCase()]=false},true);
 window.addEventListener("blur",()=>{const sh=S.shift;if(sh&&sh.hx)sh.hx.held={}})}

/* ---------- potvrdenie cieľa (rovnaké ako v okne identifikácie) ---------- */
const hxConfirm=(sh,M,who)=>{const o=M.tgt;if(M.t==="lost"||M.t==="river")sh.ents=sh.ents.filter(e=>!e.decoy||e.k==="human");
  M.phase="track";M.locked=true;M.atk=true;M.idd=1;M.prog=0;M.lostT=0;M.q=0;hGimInit(sh.fl).mode="track";if(M.c){M.c.flee=true;M.c.nx=null}if(M.p&&M.p.run)M.p.flee=1;
  sh.rec=true;SFX.play("good");if(sh.hx&&sh.hx.seat==="op")hxOrbit(sh,o.x,o.y,true);
  const txt=HXRES.includes(M.t)||M.t==="boat"?"Mám ju! Osoba je v obraze. Záchranári idú k nám.":M.c&&o===M.c?`Mám ho! ${(o.col[0]+" "+o.kind).replace(/^./,c=>c.toUpperCase())}, ${hEdgeName(sh.W,o.e)}. Sledujem, hliadky vyrážajú.`:"Mám ho! Podozrivý sedí s popisom. Sledujem, psovod vyráža.";
  hxSay(who||"Operátor",txt)};
window.__hxConfirm=()=>{const sh=S.shift;if(sh&&sh.mis)hxConfirm(sh,sh.mis)};

/* ---------- kontrolný zoznam znakov pre objekt v zameriavači ---------- */
const hxCheck=(sh,M)=>{const rc=sh._rc,o=rc&&rc.ref,t=M.tgt;if(!t)return null;const th=sh.thermal;const rows=[];
  if(M.c||t.kind){const r=o?o.rec||0:0,isCar=o&&!!o.kind;
    const f=(lbl,need,val,ok)=>rows.push([lbl,!o||!isCar?"?":r<need?"…":val,!o||!isCar||r<need?0:ok?1:-1]);
    f("Typ",50,o&&o.kind,o&&o.kind===t.kind);
    f("Farba",50,th?"? (termo)":o&&o.col&&o.col[0],th?null:o&&o.col&&t.col&&o.col[0]===t.col[0]);
    f("Strešný box",75,o&&(o.rack?"áno":"nie"),o&&!!o.rack===!!t.rack);
    f("EČV",100,o&&o.plate,o&&o.plate===t.plate);
    rows.forEach(x=>{if(x[2]===null)x[2]=0})}
  else{const r=o?o.rec||0:0,hum=o&&o.k==="human";
    const f=(lbl,need,val,ok)=>rows.push([lbl,!o?"?":r<need?"…":val,!o||r<need?0:ok?1:-1]);
    f("Osoba",25,hum?"áno":"nie (zviera)",hum);
    if(M.t==="lost"){f("Pohyb",50,o&&(o.lost?"sedí / leží":o.run?"beží":"ide"),o&&!!o.lost)}
    else{f("Bunda",50,th?"? (termo)":o&&o.jack?o.jack[0]:"iná",th?true:o&&o.jack&&t.jack&&o.jack[0]===t.jack[0]);
      f("Batoh",75,o&&o.look&&o.look.bag==="backpack"?"áno":"nie",o&&t.look&&((o.look&&o.look.bag)===(t.look&&t.look.bag)));
      f("Pohyb",50,o&&(o.run?"beží":"ide / stojí"),o&&!!o.run===!!t.run)}}
  return{rec:o?Math.round(o.rec||0):0,rows,has:!!o}};

/* ---------- hlavná logika (každý snímok) ---------- */
const hxTick=(sh,dt)=>{const H=HXS(sh),fl=sh.fl,M=sh.mis,now=HXT();if(!fl)return;
  document.body.classList.toggle("hx-on",true);
  /* operátor: kamera W A S D */
  if(H.seat==="op"){if(fl.cam!=="belly")fl.cam="belly";const hk=H.held,g=hGimInit(fl),ax=(hk.d||hk.arrowright?1:0)-(hk.a||hk.arrowleft?1:0),ay=(hk.s||hk.arrowdown?1:0)-(hk.w||hk.arrowup?1:0);
    if(ax||ay){if(g.mode!=="free"){g.mode="free";g.gp=null;if(M)M.atk=false}const k=dt*.9/Math.sqrt(g.zoom||1);g.az=clamp(g.az+ax*k,-2.6,2.6);g.el=clamp(g.el+ay*k,-.15,1.52)}}
  if(!M){H.mid=null;return}
  /* nová misia: bez časového limitu, vlastné meranie */
  if(!M.hx&&M.t0!=null&&sh.mis===M){M._belly=1;M.lim=9999;
    const d0=Math.hypot(M.area.x-sh.hp.x,M.area.y-sh.hp.y);
    M.hx={t0:now,d0,trk:0,inV:0,clues:0,clueT:now+55,find:0,lostAt:null,seen:0,cT:now+6,opT:0,pilT:0,exp:d0/55+150};
    /* hliadky v okrsku: pri pátraní po aute sú rozmiestnené v okolí oblasti */
    if(M.c&&sh.W.net)try{const{N,E}=sh.W.net,ok=E.map((e,i)=>i).filter(i=>{const e=E[i];if(N[e.a].portal||N[e.b].portal||e.len<60)return false;const m=hPtAt(e.pts,e.cum,e.len/2),d=Math.hypot(m.x-M.area.x,m.y-M.area.y);return d>450&&d<1300});
      hxUnits(sh).forEach((u,k)=>{if(k>2||!ok.length)return;const ei=ok.splice(Math.floor(Math.random()*ok.length),1)[0];u.e=ei;u.t=E[ei].len*(.3+Math.random()*.4);u.dir=Math.random()<.5?1:-1;u.v=0;u.nx=null;u.hold=false;u.hxo=null;u.hxPath=null;try{hCarPos(sh,u)}catch(e){}});
      hxRadio("Stredisko","V okolí oblasti sú pripravené tri hliadky. Keď auto nájdete, navádzajte ich.","STREDISKO")}catch(e){console.warn("hx units",e)}
    if(H.seat==="op")hxOrbitFor(sh,M)}
  const X=M.hx;if(!X)return;
  if(H.seat==="op"&&X.ph!==M.phase){X.ph=M.phase;if(!(M.phase==="track"&&H.orb&&H.orb.tgt))hxOrbitFor(sh,M)}
  if(H.seat==="op")X.opT+=dt;else X.pilT+=dt;
  const tg=M.tgt,hp=sh.hp,agl=sh.cam?sh.cam.alt:0;
  /* PÁTRANIE: indície zužujú oblasť */
  if(M.phase==="search"&&tg&&now>X.clueT&&M.area.r>110&&X.clues<3){X.clues++;X.clueT=now+50;
    const dir=hDirTxt(tg.x-M.area.x,tg.y-M.area.y);M.area.x+=(tg.x-M.area.x)*.55;M.area.y+=(tg.y-M.area.y)*.55;M.area.r=Math.max(110,M.area.r*.6);if(H.seat==="op"&&H.orb&&!H.orb.tgt){H.orb.x=M.area.x;H.orb.y=M.area.y;H.orb.r=hxAreaR(M,M.area)}
    hxRadio(M.t==="lost"?"Záchranári":"Hliadky",(M.t==="lost"?"Hubári ho videli":M.c?"Svedok hlási vozidlo":"Svedok hlási muža")+" smerom na "+dir+". Oblasť sme zúžili.",M.t==="lost"?"ZÁCHRANKA":"HLIADKY");SFX.play("over")}
  /* PILOT: AI operátor hľadá cieľ sám */
  if(M.phase==="search"&&tg&&H.seat==="pilot"){const d=Math.hypot(tg.x-hp.x,tg.y-hp.y);const th0=sh.thermal;sh.thermal=true;let los=0;try{los=hLOS(sh,tg)}catch(e){}sh.thermal=th0;
    const N=G3.N||0,ok=fl.gnd?0:d<420&&agl<260&&agl>12&&los>0;
    if(ok)X.find+=dt*(d<220?1.4:1)*(agl<160?1.2:.8)*(N>.5?.75:1)*(sh.wx==="fog"?.6:sh.wx==="rain"||sh.wx==="storm"||sh.wx==="snow"?.85:1);else X.find=Math.max(0,X.find-dt*.4);
    if(X.find>1.2&&!H.said.sus){H.said.sus=1;hxSay("Operátor","Niečo tam vidím, drž sa tu.")}
    if(X.find>5){if(HXAUTO.includes(M.t))hxConfirm(sh,M,"Operátor");else{if(!H.said.tab){H.said.tab=1;hxSay("Operátor","Vidím ho, ale toto musíš potvrdiť ty. Presadni ku kamere a identifikuj.")}X.find=4}H.said.sus=0}
    if(now>X.cT){X.cT=now+14;const dA=Math.hypot(M.area.x-hp.x,M.area.y-hp.y);
      if(dA>M.area.r*1.05)hxSay("Operátor","Sme mimo oblasti. Vráť sa do žltého kruhu.");
      else if(agl>260)hxSay("Operátor","Z tejto výšky ho nerozoznám. Klesni pod 250 metrov.");
      else if(X.find<.5)hxSay("Operátor",pick(["Zatiaľ nič. Prelietaj oblasť pomaly.","Nevidím ho. Skús druhú stranu kruhu.","Prečesávam to kamerou, leť pomalšie."]))}}
  /* SLEDOVANIE */
  if(M.phase==="track"&&tg){X.trk+=dt;if(M.inV)X.inV+=dt;X.seen=1;
    if(!M.inV){if(X.lostAt==null)X.lostAt=now}else X.lostAt=null;
    /* posádka hlási smer sama */
    if(M.ev&&M.ev.t>0&&!M.ev._hx){M.ev._hx=1;const ev=M.ev,key=ev.k==="L"?"1":ev.k==="R"?"2":ev.k==="S"?"3":"4",
      msg=({1:"Odbočil vľavo, hlásim stredisku.",2:"Odbočil vpravo, hlásim stredisku.",3:"Ide rovno cez križovatku, hlásim.",4:(ev.txt?ev.txt.charAt(0).toUpperCase()+ev.txt.slice(1):"Niečo sa deje")+", hlásim stredisku."})[key];
      ev._hxT=1.2;ev._hxK=key;ev._hxM=msg}
    if(M.ev&&M.ev._hxT>0){M.ev._hxT-=dt;if(M.ev._hxT<=0&&M.ev.t>0){const ev=M.ev;try{hReport(ev._hxK);hxSay(H.seat==="op"?"Pilot":"Operátor",ev._hxM)}catch(e){}}}
    /* PILOT: operátor hlási polohu podľa hodín */
    if(H.seat==="pilot"&&now>X.cT){const d=Math.hypot(tg.x-hp.x,tg.y-hp.y);X.cT=now+(M.inV?11:6);
      hxSay("Operátor",(M.inV?"":"Strácam ho! ")+"Cieľ na "+hxClock(sh,tg.x,tg.y)+". hodine, "+hxDist(d)+".")}}
  /* stopa vychladla: cieľ unikol */
  if(M.phase==="search"&&X.seen&&HXCHASE.includes(M.t)){if(X.lostAt==null)X.lostAt=now;
    if(now-X.lostAt>150&&!M.arrest){X.esc=1;hFail(M.c?"Stopa vychladla – vozidlo sa stratilo v premávke. Hliadky ho budú hľadať po EČV.":"Stopa vychladla – podozrivý sa skryl a unikol.")}}
};

/* ---------- panel misie ---------- */
/* kroky podľa druhu misie: [názvy, aktuálny krok] */
const hxSteps=(sh,M)=>{if(!M)return[HXPH,sh.offer?0:-1];
  if(M.t==="medevac"){const L=["Výzva","Let k zranenému","Pristátie","Nakladanie","Transport","Odovzdanie"],d=M.site?Math.hypot(M.site.x-sh.hp.x,M.site.y-sh.hp.y):0;
    return[L,M.phase==="load"?3:M.phase==="deliver"?(sh.fl&&sh.fl.gnd?5:4):d<300?2:1]}
  if(M.t==="escort")return[["Výzva","Presun","Sprievod","Hotovo"],M.arrest?3:M.phase==="fly"?1:2];
  if(!M.tgt)return[["Výzva","Presun","Snímanie","Hotovo"],M.arrest?3:M.phase==="fly"?1:2];
  const L=HXRES.includes(M.t)||M.t==="boat"?["Výzva","Presun","Pátranie","Potvrdenie","Sledovanie","Záchrana"]:HXPH;
  if(M.arrest)return[L,5];if(M.phase==="fly")return[L,1];if(M.phase==="search"){const rc=sh._rc;return[L,rc&&rc.ref&&(rc.ref.rec||0)>=25?3:2]}
  if(M.phase==="track")return[L,(M.prog||0)>=70||M._footT>0||M.wn&&M.wn.st!=="idle"?5:4];return[L,1]};
const hxEsc=s=>esc(String(s==null?"":s));
const hxPanel=sh=>{const cv=document.getElementById("h-cv");if(!cv||!cv.parentElement)return;let el=document.getElementById("hx-card");
  if(!el||el.parentElement!==cv.parentElement){if(el)el.remove();el=document.createElement("div");el.id="hx-card";cv.parentElement.appendChild(el)}
  const H=HXS(sh),M=sh.mis,fl=sh.fl,now=HXT(),[PL,ph]=hxSteps(sh,M),seat=H.seat==="op";
  let title=M?(M.ic||"🚁")+" "+M.title:sh.offer?"📻 Nová výzva":"🚁 Hliadkový let",tm="";
  if(M&&M.hx){const s=Math.round(now-M.hx.t0);tm=Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
  let main="",info=[],chk=null,cls="";
  if(!M){const qn=(H.q||[]).length;main=sh.offer?"Stredisko ponúka prípad – prečítaj si zadanie a prijmi ho.":qn?"Vyber si výzvu z fronty – podľa priority, vzdialenosti a paliva (<kbd>1</kbd>–<kbd>3</kbd> alebo klik).":"Čakaj na výzvu strediska. Medzitým môžeš tankovať (<kbd>H</kbd>) alebo preletieť nad modrými bodmi.";}
  else{const tg=M.tgt,hp=sh.hp,agl=sh.cam?sh.cam.alt:0,X=M.hx||{};
    if(M.phase==="fly"){const d=Math.hypot(M.area.x-hp.x,M.area.y-hp.y);main=seat?"Pilot letí do oblasti. Priprav kameru – v lese a v noci zapni termo (T).":"Leť do žltého kruhu – smer ukazuje šípka. Autopilot: Tab (pilot krúži, ty obsluhuješ kameru).";
      info.push("Oblasť "+(d/1000).toFixed(1).replace(".",",")+" km");info.push("Prílet ~"+Math.max(1,Math.round(d/55))+" s")}
    else if(M.phase==="search"){chk=hxCheck(sh,M);
      main=seat?"Hľadaj kamerou: <b>"+hxEsc(M.desc)+"</b>. Daj objekt do stredu, priblíž a porovnaj znaky. Potvrď Enterom.":"Prelietaj oblasť pomaly pod 250 m. Operátor hľadá: <b>"+hxEsc(M.desc)+"</b>"+(X.find>.3?" · <span class='hx-ok'>vidí niečo ("+Math.min(99,Math.round(X.find/5*100))+" %)</span>":"");
      info.push("Oblasť r "+Math.round(M.area.r)+" m");info.push("Indície "+(X.clues||0)+"/3");if(X.lostAt!=null&&X.seen){const left=Math.max(0,Math.round(150-(now-X.lostAt)));info.push("<span class='hx-bad'>Stopa chladne · "+left+" s</span>");cls="urg"}}
    else if(M.phase==="track"){const d=tg?Math.hypot(tg.x-hp.x,tg.y-hp.y):0,pr=M.prog||0;if(X._pt==null||now<X._pt){X._pt=now;X._pp=pr}else if(now-X._pt>=2){const r=(pr-X._pp)/(now-X._pt);X._pr=X._pr==null?r:X._pr*.6+r*.4;X._pt=now;X._pp=pr}
      /* odhad príchodu podľa skutočného tempa postupu, nie podľa pevného čísla */
      const eta=HXRES.includes(M.t)&&M._footT>0?Math.ceil(M._footT):X._pr>.05?Math.max(0,Math.ceil((100-pr)/X._pr)):Math.max(0,Math.ceil((M.eta||30)*(1-pr/100)));
      const inF=tg&&tg.k==="human"&&hInF(tg.x,tg.y);
      main=M.inV?(seat?"Drž cieľ v obraze. Pilot sa ho drží (Medzerník = krúž okolo cieľa).":"Drž sa pri cieli – operátor ho sleduje a hlási smer."):"<b>Cieľ mimo obrazu!</b> "+(seat?(inF&&!sh.thermal?"V lese ho uvidíš len v termokamere – stlač <kbd>T</kbd>.":"Nájdi ho kamerou a potvrď Enterom."):"Priblíž sa – operátor ho stráca.");
      if(HXRES.includes(M.t)){const ac=typeof h7AC==="function"?h7AC():null;
        if(ac&&ac.winch){const W=M.wn,nw=hxNow(sh);main=W&&W.st!=="idle"&&W.st!=="done"?"<b>Navijak pracuje</b> – drž polohu, nehýb sa.":(seat?"Pilot visí nad osobou. ":"")+(nw&&nw[0]?String(nw[0]):"Nastav sa nad osobu (do 30 m), výška 10–48 m, zastav a stlač <kbd>N</kbd>.");if(nw&&nw[2]===2)cls="act"}
        else main=seat?"Pilot visí nad osobou a svieti záchranárom. Drž ju v obraze.":"Drž sa nad osobou – záchranári idú pešo podľa vás."}
      if(!M.inV)cls="urg";info.push((M.c&&tg===M.c?"Hliadky":HXRES.includes(M.t)||M.t==="boat"?"Záchranári":/hranic/i.test(M.title||"")||M.t==="drone"?"Hliadka":"Psovod")+" na mieste o "+eta+" s");info.push("Vzdialenosť "+Math.round(d)+" m");
      if(X.trk>0)info.push("Kontakt "+Math.round(100*X.inV/X.trk)+" %")}
    else{const nw=hxNow(sh);main=nw&&nw[0]?String(nw[0]):"Postupuj podľa pokynov strediska.";if(nw&&nw[2]===1)cls="urg";else if(nw&&nw[2]===2)cls="act";
      if(M.sw)info.push("<span class='hx-bad'>"+hxEsc(M.sw)+"</span>");
      if(M.phase==="scan"||M.phase==="escort"||M.phase==="load")info.push(({scan:"Snímanie ",escort:"Sprievod ",load:"Nakladanie "})[M.phase]+Math.round(M.prog||0)+" %");
      const c=M.phase==="deliver"&&M.site||M.site||M.area;if(c)info.push("Cieľ "+Math.round(Math.hypot(c.x-hp.x,c.y-hp.y))+" m");
      if(seat&&(M.phase==="scan"||M.t==="escort"))main=(M.t==="escort"?(M.cyc?"Pilot sprevádza peletón. ":"Pilot sprevádza kolónu. "):"Pilot krúži nad miestom. ")+main;
      if(M.t==="crowd"&&M.ev&&M.ev.t>0){main="<b>V dave sa niečo deje</b> – stlač <kbd>4</kbd> a nahlás to!";cls="act"}}
    if(M.arrest){main="<b>Zákrok prebieha</b> – drž kameru na mieste.";cls="act"}}
  const steps=PL.map((n,i)=>`<i class="${i<ph?"d":i===ph?"c":""}">${n}</i>`).join("");
  const ck=chk&&chk.has?`<div class="hx-chk"><b>V zameriavači · rozpoznané ${chk.rec} %</b>${chk.rows.map(r=>`<span class="${r[2]>0?"y":r[2]<0?"n":""}">${r[2]>0?"✓":r[2]<0?"✗":"·"} ${hxEsc(r[0])}: ${hxEsc(r[1])}</span>`).join("")}</div>`:chk?`<div class="hx-chk dim">Daj objekt do stredu zameriavača – kamera porovná znaky s popisom.</div>`:"";
  const keys=seat?"<kbd>Tab</kbd> pilotovať · myš/<kbd>WASD</kbd> kamera · koliesko zoom · <kbd>Medzerník</kbd> krúž tu · <kbd>Q</kbd>/<kbd>E</kbd> polomer · <kbd>R</kbd>/<kbd>F</kbd> výška · <kbd>Enter</kbd> potvrdiť · <kbd>T</kbd> termo":
    "<kbd>Tab</kbd> ku kamere · <kbd>WASD</kbd> let · <kbd>R</kbd>/<kbd>F</kbd> výška · <kbd>Q</kbd>/<kbd>E</kbd> do boku · <kbd>M</kbd> mapa · <kbd>H</kbd> základňa · <kbd>?</kbd> pomoc";
  const html=`<div class="hx-h"><span class="hx-seat ${seat?"op":"pil"}">${seat?"🎥 OPERÁTOR":"🕹 PILOT"}</span><b>${hxEsc(title)}</b><span class="hx-tm">${tm}</span></div>`+
    (M||sh.offer?`<div class="hx-st">${steps}</div>`:"")+`<p class="hx-n">${main}</p>`+(info.length?`<div class="hx-i">${info.map(x=>`<span>${x}</span>`).join("")}</div>`:"")+ck+(window.__hxRoster?__hxRoster(sh):"")+(window.__hxQueueHtml?__hxQueueHtml(sh):"")+`<div class="hx-k">${keys}</div>`;
  if(el._h!==html){el._h=html;el.innerHTML=html}el.className=cls};

/* AI operátor (keď hráč pilotuje) používa termokameru – vidí aj osobu v lese */
{const l0=hLOS;hLOS=function(sh,tg){if(hxOn()&&sh.hx&&sh.hx.seat==="pilot"&&!sh.thermal){sh.thermal=true;try{return l0(sh,tg)}finally{sh.thermal=false}}return l0(sh,tg)}}

/* ---------- postup pozemných zložiek: závisí len od kontaktu s cieľom (nie od časovačov) ---------- */
{const mu=hMisUpdate;hMisUpdate=function(dt,M,agl,spd,air,fl){const sh=S.shift,p0=M&&M.prog||0;const r=mu.apply(this,arguments);
  try{if(hxOn()&&M&&M.hx&&sh.mis===M&&M.phase==="track"&&!M.arrest){
    if(HXRES.includes(M.t)){const ac=typeof h7AC==="function"?h7AC():null,tg=M.tgt,d=tg?Math.hypot(tg.x-sh.hp.x,tg.y-sh.hp.y):0;
      if(!(ac&&ac.winch)&&!M._footGo&&!(M._footT>0)){M._footGo=1;M._footT=30;hxRadio("Záchranka","Ideme k osobe pešo, držte sa nad ňou a svieťte nám.","ZÁCHRANKA")}
      if(M._footT>0&&(d>260||!M.inV))M._footT+=dt}
    else if(HXCHASE.includes(M.t)){if(M.inV){const inc=dt*100/(M.eta||30)*.55*(.4+(M.q||0)*.8);M.prog=Math.min(100,Math.max(M.prog||0,p0+inc))}
      if(M.prog>=100&&!M.arrest)hArrest(M,M.c&&M.tgt===M.c?"Hliadky vozidlo zablokovali a vodiča zadržali. Celý čas ste ho mali v obraze.":/hranic/i.test(M.title||"")?"Hliadka zadržala celú skupinu pri hranici. Vďaka termokamere nikto neušiel.":"Psovod s hliadkou podozrivého dostihli a zadržali.")}}}catch(e){console.warn("hx mis",e)}return r}}

/* ---------- napojenie na hru ---------- */
{const u0=hUpdate;hUpdate=function(dt){const r=u0.apply(this,arguments);try{const sh=S.shift;if(hxOn()&&sh&&sh.fl){hxTick(sh,dt);hxEscProg(sh);const H=HXS(sh),t=HXT();if(t-H.uiT>.2){H.uiT=t;hxPanel(sh)}}}catch(e){console.warn("hx",e)}return r}}
setInterval(()=>{const on=hxOn();if(!on){document.body.classList.remove("hx-on");const c=document.getElementById("hx-card");if(c&&!(S.shift&&S.shift.heli))c.remove()}},500);
/* sprievod kolóny: postup podľa prejdenej cesty (pôvodne ukazoval 0 % až do posledných 3 km) */
const hxEscProg=sh=>{const M=sh.mis;if(!M||M.t!=="escort"||!M.lead||!M.goal||M.phase!=="escort")return;const L=M.lead,d=Math.hypot(L.x-M.goal.x,L.y-M.goal.y);if(!M._ed0||d>M._ed0)M._ed0=Math.max(d,200);M.prog=Math.max(M.prog||0,Math.min(98,(1-d/M._ed0)*100))};
/* hodnotenie posádky */
const hxScore=M=>{const X=M.hx;if(!X)return null;const t=HXT()-X.t0,con=X.trk>0?X.inV/X.trk:1,red=M.redT||0;
  let st=3;if(t>X.exp)st--;if(t>X.exp*1.8)st--;if(con<.6)st--;if(M.wrong)st-=M.wrong;if(red>10)st--;st=Math.max(1,Math.min(3,st));
  return{t,con,red,st,ev:M.evt||0,op:X.opT,pil:X.pilT}};
{const hs0=hStars;hStars=function(M){try{if(M&&M.hx){const s=hxScore(M);if(s){M.hx._st=s;return s.st}}}catch(e){}return hs0(M)}}
{const w0=hWin;hWin=function(msg){const sh=S.shift,M=sh&&sh.mis;let sc=null;try{if(M&&/rybár/i.test(M.title||"")&&/Zhromaždenie/.test(msg||""))msg=arguments[0]="Rybárska stráž mala vďaka tebe prehľad o celom jazere – skontrolovala povolenky a pytliakom zhabala siete.";}catch(e){}try{if(M&&M.hx){sc=hxScore(M);M.hx._st=sc;
    /* odmena v pôvodnom výpočte rátá s limitom – nastav ho podľa výkonu (bez umelého bonusu) */
    const el=Math.max(1,Math.round(sh.min-M.t0));M.lim=el+sc.st*(2+hxMisTier(M))}}catch(e){}
  const r=w0.apply(this,arguments);
  try{if(sc){const box=document.querySelector("#mbox .hb-g");const ft=s=>Math.floor(s/60)+" min "+Math.round(s%60)+" s",cl=(v,good)=>v?"p":"n";
    const tg=!!M.tgt;const rows=[["Čas zásahu",ft(sc.t),sc.t<=M.hx.exp],...(tg?[["Kontakt s cieľom",Math.round(sc.con*100)+" %",sc.con>=.6],["Záznam (dôkaz)",Math.round(sc.ev)+" s",sc.ev>=15]]:[]),...(M.t==="crowd"&&M.rep?[["Hlásenia z davu",(M.repOk||0)+"/"+M.rep,(M.repOk||0)===M.rep]]:[]),["Bezpečnosť letu",sc.red>10?Math.round(sc.red)+" s varovaní":"bez problémov",sc.red<=10],...(tg?[["Chybné potvrdenia",String(M.wrong||0),!M.wrong]]:[]),...(M.c?[["Zátaras",M.hx.blk?"auto zastavené na zátarase":"nepoužitý",!!M.hx.blk],["Rozkazy hliadkam",String(M.hx.cmd||0),(M.hx.cmd||0)>0]]:[]),["Kreslo",sc.op>sc.pil?"prevažne operátor":"prevažne pilot",true]];
    const h=`<div class="hx-db"><p class="eyebrow">Hodnotenie posádky</p>${rows.map(r=>`<div><span>${r[0]}</span><b class="${cl(r[2])}">${esc(r[1])}</b></div>`).join("")}</div>`;
    if(box)box.insertAdjacentHTML("afterend",h)}}catch(e){}return r}}
/* pomocník kláves */
{const k0=hKeysHelp;hKeysHelp=function(){k0();try{if(!hxOn())return;const g=document.querySelector(".ovl .hk-g");if(!g)return;
  const K=[["Tab","presadnúť: pilot ↔ operátor kamery"],["W A S D","pilot: let · operátor: otáčanie kamery"],["R / F","pilot: výška · operátor: výška krúženia"],["Q / E","pilot: do boku · operátor: polomer krúženia"],["Medzerník","pilot: zabrzdiť · operátor: krúž okolo bodu / cieľa"],["myš, koliesko","kamera a zoom (operátor)"],["Enter","potvrdiť cieľ v zameriavači"],["T","termokamera"],["M","mapa a trasa"],["H","autopilot na základňu"],["?","tento prehľad"]];
  g.innerHTML=K.map(([a,b])=>`<div><kbd>${a}</kbd><span>${b}</span></div>`).join("");const h=document.querySelector(".ovl .ovl-h h3");if(h)h.textContent="Ovládanie – režim Posádka"}catch(e){}}}
/* =====================================================================================
   FÁZA 2 – pozemné hliadky pod tvojím velením: zátarasy na predpovedaných križovatkách, prenasledovanie
   ===================================================================================== */
const hxUnits=sh=>(sh.cars||[]).filter(c=>c.unit).sort((a,b)=>a.unit-b.unit);
/* najkratšia cesta po cestnej sieti (Dijkstra, čas podľa typu cesty) */
const hxDij=(sh,s0,g)=>{const{N,E}=sh.W.net,n=N.length,dist=new Float64Array(n).fill(1e12),pe=new Int32Array(n).fill(-1),pn=new Int32Array(n).fill(-1),done=new Uint8Array(n);dist[s0]=0;
  for(;;){let u=-1,b=1e12;for(let i=0;i<n;i++)if(!done[i]&&dist[i]<b){b=dist[i];u=i}if(u<0||u===g)break;done[u]=1;
    for(const ei of N[u].e){const e=E[ei];if(e.ow&&e.a!==u)continue;const v=e.a===u?e.b:e.a;if(N[v].portal&&v!==g)continue;const w=e.len/((HROAD[e.type]||{sp:12}).sp*1.6);if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pe[v]=ei;pn[v]=u}}}
  if(dist[g]>=1e12)return null;const path=[];let v=g;while(v!==s0){path.unshift({from:pn[v],ei:pe[v]});v=pn[v]}return{path,t:dist[g]}};
const hxAhead=(sh,u)=>{const e=sh.W.net.E[u.e];return{ni:u.dir>0?e.b:e.a,rem:Math.max(0,e.len-u.t)/((HROAD[e.type]||{sp:12}).sp*1.6)}};
/* čas hliadky ku križovatke po cestách (výsledky sa držia 1 s) */
const hxUEtaN=(sh,u,ni)=>{const C=sh._hxEC||(sh._hxEC={t:0,m:new Map}),now=HXT();if(now-C.t>1){C.t=now;C.m.clear()}const k=u.unit+":"+ni;if(C.m.has(k))return C.m.get(k);
  let t=1e9;try{const a=hxAhead(sh,u);if(a.ni===ni)t=a.rem;else{const r=hxDij(sh,a.ni,ni);if(r)t=a.rem+r.t}}catch(e){}C.m.set(k,t);return t};
const hxRoute=(sh,u,ni)=>{const a=hxAhead(sh,u);u.hxGoalN=ni;if(a.ni===ni){u.hxPath=[];return}const r=hxDij(sh,a.ni,ni);u.hxPath=r?r.path:null;u.nx=null};
const hxUEta=(u,x,y)=>Math.hypot(u.x-x,u.y-y)*1.3/24;
const hxCarMis=M=>!!(M&&M.c&&M.tgt===M.c&&M.phase==="track"&&!M.arrest);
/* predpoveď: križovatka A (koniec aktuálneho úseku) a B (za ňou, keď už vodič vybral smer) */
const hxNodes=(sh,M)=>{const c=M&&M.c;if(!c||!sh.W.net)return[];const{N,E}=sh.W.net,e=E[c.e],A=c.dir>0?e.b:e.a,v=Math.max(9,c.v||0),out=[];
  const add=(id,ni,eta)=>{const n=N[ni];if(!n||n.portal)return;out.push({id,ni,eta,x:n.x,y:n.y,name:hPlaceNear(sh.W,n.x,n.y)})};
  const etaA=Math.max(0,e.len-c.t)/v;add("A",A,etaA);
  if(c.nx!=null){const e2=E[c.nx];if(e2){let nd=e2.a===A?e2.b:e2.a,eta=etaA+e2.len/v;add("B",nd,eta);
    for(const [i,p] of (c.hxPlan||[]).entries()){if(p.from!==nd)break;const e3=E[p.ei];nd=e3.a===nd?e3.b:e3.a;eta+=e3.len/v;add("CDEF"[i],nd,eta);if(i>=3)break}}}
  return out};
const hxBlocked=sh=>{const s=new Set;for(const u of hxUnits(sh))if(u.hxo&&u.hxo.k==="block"&&u.hxo.ok)s.add(u.hxo.ni);return s};
const hxUName=u=>"Hliadka "+u.unit;
const hxPickUnit=(sh,x,y,ni)=>{const ET=(u)=>ni!=null?hxUEtaN(sh,u,ni):hxUEta(u,x,y);const H=HXS(sh),L=hxUnits(sh);if(H.sel){const u=L.find(u=>u.unit===H.sel);if(u)return u}
  let best=null,bd=1e9;for(const u of L){if(u.hxo&&u.hxo.k==="block")continue;const t=ET(u);if(t<bd){bd=t;best=u}}
  if(!best)for(const u of L){const t=ET(u);if(t<bd){bd=t;best=u}}return best};
const hxSel=(sh,n)=>{const H=HXS(sh);H.sel=H.sel===n?0:n;const u=hxUnits(sh).find(u=>u.unit===n);
  toast(H.sel&&u?hxUName(u)+" vybraná – Z / X zátaras, G prenasledovanie.":"Výber zrušený – rozkaz dostane najbližšia hliadka.");SFX.play("click")};
const hxBlock=(sh,idx)=>{const M=sh.mis;if(!hxCarMis(M))return;const all=hxNodes(sh,M),taken=new Set(hxUnits(sh).filter(u=>u.hxo&&u.hxo.k==="block").map(u=>u.hxo.ni));
  let nd=null,u=null;
  if(idx==="auto"){/* najlepšia dvojica hliadka + križovatka, kam hliadka príde aspoň 3 s pred autom */
    const H=HXS(sh),L=hxUnits(sh).filter(x=>!(x.hxo&&x.hxo.k==="block")&&(!H.sel||x.unit===H.sel));let best=-1e9;
    for(const n of all){if(taken.has(n.ni))continue;for(const x of L){const m=n.eta-hxUEtaN(sh,x,n.ni);if(m>=3&&m-n.eta*.05>best){best=m-n.eta*.05;nd=n;u=x}}}
    if(!nd){toast("Žiadna voľná hliadka to pred autom nestihne. Pošli ju prenasledovať (G) a počkaj na ďalšie križovatky.");SFX.play("bad");return}}
  else{nd=all[idx];if(!nd){toast("Túto križovatku zatiaľ nepoznáme.");return}if(taken.has(nd.ni)){toast("Na križovatku "+nd.id+" už hliadka ide.");return}u=hxPickUnit(sh,nd.x,nd.y,nd.ni)}
  if(!u)return;const eta=hxUEtaN(sh,u,nd.ni);
  u.hxo={k:"block",ni:nd.ni,x:nd.x,y:nd.y,id:nd.id,name:nd.name,ok:false,t0:HXT()};u.hold=false;u.goal={x:nd.x,y:nd.y};hxRoute(sh,u,nd.ni);
  HXS(sh).sel=0;M.hx.cmd=(M.hx.cmd||0)+1;
  hxRadio(hxUName(u),"Rozumiem, zátaras na križovatke "+nd.id+" pri "+nd.name+". Sme tam o "+Math.ceil(eta)+" sekúnd"+(eta<nd.eta?".":", auto tam bude skôr – ponáhľame sa."),"HLIADKY");SFX.play("radio")};
const hxPursue=sh=>{const M=sh.mis;if(!hxCarMis(M))return;const u=hxPickUnit(sh,M.c.x,M.c.y);if(!u)return;
  u.hxo={k:"pursue",rt:0};u.hold=false;u.nx=null;HXS(sh).sel=0;M.hx.cmd=(M.hx.cmd||0)+1;
  hxRadio(hxUName(u),"Rozumiem, prenasledujeme. Navádzajte nás.","HLIADKY");SFX.play("radio")};
const hxClearOrders=sh=>{for(const u of hxUnits(sh)){if(u.hxo||u.hold||u.hxPath){u.hxo=null;u.hold=false;u.goal=null;u.nx=null;u.hxPath=null;u.hxGoalN=null}}};
/* rozkazy platia každý snímok (prepíšu automatické navádzanie pôvodného kódu) */
const hxOrders=(sh,M,dt)=>{const c=M.c,{N}=sh.W.net,pred=new Set(hxNodes(sh,M).map(n=>n.ni));
  for(const u of hxUnits(sh)){const o=u.hxo;
    if(!o){u.goal={x:c.x,y:c.y};continue}
    if(o.k==="pursue"){u.hold=false;u.goal={x:c.x,y:c.y};o.rt=(o.rt||0)-dt;if(o.rt<=0){o.rt=3;const A=hxNodes(sh,M)[0];if(A&&A.ni!==u.hxGoalN)hxRoute(sh,u,A.ni)}continue}
    if(o.k==="block"){const d=Math.hypot(u.x-o.x,u.y-o.y);
      if(!o.ok&&d<26){o.ok=true;u.hold=true;u.v=0;hxRadio(hxUName(u),"Zátaras na križovatke "+o.id+" pri "+o.name+" stojí.","HLIADKY");SFX.play("radio")}
      if(!o.ok){u.goal={x:o.x,y:o.y};u.hold=false;if(!u.hxPath||u.hxGoalN!==o.ni)hxRoute(sh,u,o.ni)}
      /* auto už križovatku minulo */
      if(!pred.has(o.ni)&&Math.hypot(c.x-o.x,c.y-o.y)>60){if(!o.ok)hxRadio(hxUName(u),"Nestihli sme, auto prešlo. Prenasledujeme.","HLIADKY");else hxRadio(hxUName(u),"Auto k nám neprišlo, ruším zátaras a prenasledujem.","HLIADKY");
        u.hxo={k:"pursue"};u.hold=false;continue}
      /* náraz do zátarasu */
      if(o.ok&&Math.hypot(c.x-o.x,c.y-o.y)<30){c.hold=true;c.v=0;c.flee=false;M.hx.blk=(M.hx.blk||0)+1;
        hArrest(M,"Auto narazilo na zátaras, ktorý postavila "+hxUName(u)+" pri "+o.name+". Vodiča zadržali.");return}}}};
/* vodič na úteku si trasu plánuje o 4 križovatky dopredu (predpoveď A–F); hotovému zátarasu sa často vyhne */
{const n0=hNext;
 const arrA=(E,ei,to)=>{const e=E[ei],P=e.a===to?[...e.pts].reverse():e.pts,a=P[P.length-2],b=P[P.length-1];return Math.atan2(b[1]-a[1],b[0]-a[0])};
 const farN=(E,ei,from)=>{const e=E[ei];return e.a===from?e.b:e.a};
 const extend=(sh,c,lastE,node)=>{const{N,E}=sh.W.net;c.hxPlan=c.hxPlan||[];let e=lastE,nd=node;
   for(const p of c.hxPlan){e=p.ei;nd=farN(E,p.ei,p.from)}
   while(c.hxPlan.length<4){if(!N[nd]||N[nd].portal)break;const fake={e,a:arrA(E,e,nd),kind:c.kind,flee:true,target:true,x:N[nd].x,y:N[nd].y};
     const ei=n0(sh,fake,nd);if(ei==null||ei===e&&N[nd].e.length>1)break;c.hxPlan.push({from:nd,ei});e=ei;nd=farN(E,ei,nd)}};
 hNext=function(sh,c,ni){if(hxOn()&&c.unit&&c.hxPath&&c.hxGoalN!=null&&sh.W.net){const{N}=sh.W.net,p=c.hxPath[0];if(p&&p.from===ni&&N[ni].e.includes(p.ei)){c.hxPath.shift();return p.ei}if(ni!==c.hxGoalN){const r=hxDij(sh,ni,c.hxGoalN);if(r&&r.path.length){c.hxPath=r.path.slice(1);return r.path[0].ei}}}if(!(hxOn()&&c.flee&&c.target&&sh.W.net))return n0.apply(this,arguments);
  const{N,E}=sh.W.net,blk=hxBlocked(sh);let r=null;
  try{const p=c.hxPlan&&c.hxPlan[0];if(p&&p.from===ni&&N[ni].e.includes(p.ei)&&Math.random()>.12){c.hxPlan.shift();r=p.ei}else c.hxPlan=[]}catch(e){c.hxPlan=[]}
  if(r==null)r=n0.apply(this,arguments);
  try{if(blk.has(farN(E,r,ni))&&Math.random()<.65){const alt=N[ni].e.filter(ei=>ei!==c.e&&ei!==r&&!blk.has(farN(E,ei,ni))&&!(E[ei].ow&&E[ei].a!==ni)&&!N[farN(E,ei,ni)].portal);
      if(alt.length){r=pick(alt);c.hxPlan=[];hxRadio("Hliadky","Vidí zátaras! Odbočuje inam.","HLIADKY");SFX.play("over")}}
    extend(sh,c,r,farN(E,r,ni))}catch(e){}
  return r}}
/* sledovanie auta samo zastaví len pomaly – pomáhajú blízke hliadky, rozhoduje zátaras */
{const mu=hMisUpdate;hMisUpdate=function(dt,M,agl,spd,air,fl){const sh=S.shift,p0=M&&M.prog||0;
  /* útek vodiča pešo až pri vysokom postupe a nie počas rozkázaného zátarasu */
  let nb=false;try{if(hxOn()&&M&&M.hx&&hxCarMis(M)&&!M.bail&&((M.prog||0)<85||hxUnits(sh).some(u=>u.hxo&&u.hxo.k==="block"))){M.bail=-1;nb=true}}catch(e){}
  let r;try{r=mu.apply(this,arguments)}finally{if(nb&&M.bail===-1)M.bail=0}
  try{if(hxOn()&&sh.mis===M&&M.hx&&hxCarMis(M)){const c=M.c;let near=0;for(const u of hxUnits(sh))if(Math.hypot(u.x-c.x,u.y-c.y)<150)near++;
      if(M.prog>p0)M.prog=p0+(M.prog-p0)*.42*(1+near*.9);M.hx.near=near;hxOrders(sh,M,dt)}}catch(e){console.warn("hx2",e)}return r}}
/* značky v obraze: križovatky A/B a hliadky */
{const hd=hHudDraw;hHudDraw=function(g2,w,h,th,C){hd(g2,w,h,th,C);try{const sh=S.shift,M=sh&&sh.mis;if(!hxOn()||!hxCarMis(M))return;const T=hTer(),blk=new Map;
  for(const u of hxUnits(sh))if(u.hxo&&u.hxo.k==="block")blk.set(u.hxo.ni,u);
  g2.save();g2.textAlign="center";
  for(const n of hxNodes(sh,M)){const p=g3Proj(-n.y,n.x,T(n.x,n.y)+3);if(p.z<=0)continue;const u=blk.get(n.ni),ok=u&&u.hxo.ok,eu=u?hxUEtaN(sh,u,n.ni):0;
    const col=ok?"#4f9bff":u?(eu<n.eta?"#3ccb8c":"#ff6060"):"#ffb21f";
    g2.fillStyle=col;g2.beginPath();g2.moveTo(p.x,p.y-30);g2.lineTo(p.x+11,p.y-17);g2.lineTo(p.x,p.y-4);g2.lineTo(p.x-11,p.y-17);g2.fill();
    g2.fillStyle="#0b1220";g2.font="800 12px "+MONO;g2.fillText(n.id,p.x,p.y-13);
    const tx=ok?"ZÁTARAS · "+hxUName(u):u?hxUName(u)+" o "+Math.ceil(eu)+" s · auto o "+Math.ceil(n.eta)+" s":"auto o "+Math.ceil(n.eta)+" s";
    g2.font="700 11px "+MONO;const tw=g2.measureText(tx).width+10;g2.fillStyle="rgba(6,10,18,.75)";g2.fillRect(p.x-tw/2,p.y-50,tw,16);g2.fillStyle=col;g2.fillText(tx,p.x,p.y-38)}
  for(const u of hxUnits(sh)){const p=g3Proj(-u.y,u.x,T(u.x,u.y)+5);if(p.z<=0||p.x<0||p.x>w||p.y<0||p.y>h)continue;
    g2.fillStyle="#2f6bff";g2.beginPath();g2.arc(p.x,p.y-8,8,0,7);g2.fill();g2.strokeStyle="#fff";g2.lineWidth=1.5;g2.stroke();
    g2.fillStyle="#fff";g2.font="800 10px "+MONO;g2.fillText(String(u.unit),p.x,p.y-4.5)}
  g2.restore()}catch(e){}}}
/* klávesy rozkazov – 1–4 výber hliadky, Z / X zátaras A / B, G prenasledovanie */
{const prev=hKey;window.removeEventListener("keydown",prev,true);
 hKey=function(e){try{const sh=S.shift;if(hxOn()&&sh&&hxCarMis(sh.mis)&&!modalOpen()&&!sh._map&&!(e.target&&e.target.closest&&e.target.closest("input,textarea,select"))){const k=e.key.toLowerCase(),stop=()=>{e.preventDefault();e.stopImmediatePropagation()};
   if(["1","2","3","4"].includes(k)){stop();if(!e.repeat)hxSel(sh,+k);return}
   if(k==="z"){stop();if(!e.repeat)hxBlock(sh,"auto");return}
   if(k==="g"){stop();if(!e.repeat)hxPursue(sh);return}}}catch(err){}return prev(e)};
 window.addEventListener("keydown",hKey,true)}
/* panel: zoznam hliadok a križovatky (kliknutím sa dá hliadka vybrať) */
const hxRoster=sh=>{const M=sh.mis;if(!hxCarMis(M))return"";const H=HXS(sh),nd=hxNodes(sh,M),c=M.c;
  const rows=hxUnits(sh).map(u=>{const o=u.hxo,d=Math.round(Math.hypot(u.x-c.x,u.y-c.y));let st,cl="";
    if(o&&o.k==="block"){const eu=hxUEtaN(sh,u,o.ni),n=nd.find(n=>n.ni===o.ni);st=o.ok?"🚧 zátaras "+o.id+" stojí":"→ zátaras "+o.id+" · "+Math.ceil(eu)+" s"+(n?(eu<n.eta?" · stihne":" · nestihne"):"");cl=o.ok?"ok":n&&eu>=n.eta?"bad":"go"}
    else if(o&&o.k==="pursue"){st="🚔 prenasleduje";cl="go"}else st="ide za autom";
    return`<span class="hx-u ${cl}${H.sel===u.unit?" sel":""}" data-hxu="${u.unit}"><b>${u.unit}</b> ${st} · ${d} m</span>`}).join("");
  const L=hxUnits(sh).filter(u=>!(u.hxo&&u.hxo.k==="block")&&(!H.sel||u.unit===H.sel)),taken=new Set(hxUnits(sh).filter(u=>u.hxo&&u.hxo.k==="block").map(u=>u.hxo.ni));
  const js=nd.map((n,i)=>{let be=1e9;for(const u of L)be=Math.min(be,hxUEtaN(sh,u,n.ni));const can=be<n.eta-1,tk=taken.has(n.ni);
    return`<span class="hx-j ${tk?"tk":can?"can":"no"}" data-hxn="${i}">${n.id} · ${esc(n.name)} · auto o ${Math.ceil(n.eta)} s${tk?" · 🚧":be<1e9?" · hliadka "+Math.ceil(be)+" s":""}</span>`}).join("");
  return`<div class="hx-r"><div class="hx-rh">Hliadky <small>1–4 / klik = vybrať · <kbd>Z</kbd> najlepší zátaras · klik na križovatku = zátaras tam · <kbd>G</kbd> prenasledovať</small></div>${rows}<div class="hx-js">${js||'<span class="hx-j">smer jazdy zatiaľ nepoznáme</span>'}</div></div>`};
document.addEventListener("pointerdown",e=>{const t=e.target.closest&&e.target.closest("[data-hxu],[data-hxn]");if(!t)return;e.preventDefault();e.stopPropagation();const sh=S.shift;if(!sh)return;
  if(t.dataset.hxu)hxSel(sh,+t.dataset.hxu);else hxBlock(sh,+t.dataset.hxn)},true);
/* rozkazy po misii zrušiť */
setInterval(()=>{try{const sh=S.shift;if(sh&&sh.heli&&!sh.mis&&hxUnits(sh).some(u=>u.hxo||u.hold))hxClearOrders(sh)}catch(e){}},700);
window.__hxRoster=hxRoster;

/* =====================================================================================
   FÁZA 3 – smena: brífing, fronta výziev (priorita, palivo, expirácia), licencie posádky
   ===================================================================================== */
/* ---------- licencie ---------- */
const HXUN={1:"vozidlo, páchateľ, nezvestná osoba, nehoda",2:"požiar, človek v rieke, dav, transport pacienta, loďka, rybári",3:"prepadnutý ľad, hranica, dron, kolóna, koncert, cyklisti"};
const HXL=[0,300,900],HXLN=["","Základná","Skúsený","Expert"];
const hxLic=()=>{const s=S.save;s.hxc=s.hxc||{pil:0,op:0};return s.hxc};
const hxLvl=xp=>xp>=HXL[2]?3:xp>=HXL[1]?2:1;
const hxPerk=(k,l)=>k==="op"?["","rozpoznávanie bežné","rozpoznávanie +25 %","rozpoznávanie +50 %"][l]:["","spotreba bežná","spotreba −10 %","spotreba −20 %"][l];
{const rc0=hRecCond;hRecCond=function(sh,o){let k=rc0.apply(this,arguments);try{if(hxOn()&&sh.hx&&sh.hx.seat==="op")k*=[1,1,1.25,1.5][hxLvl(hxLic().op)]}catch(e){}return k}}
{const tf0=hTankF;hTankF=function(){let f=tf0.apply(this,arguments);try{const sh=S.shift;if(hxOn()&&sh.hx&&sh.hx.seat==="pilot")f*=[1,1,.9,.8][hxLvl(hxLic().pil)]}catch(e){}return f}}
/* ---------- odhad paliva na výzvu ---------- */
const hxFuelNeed=(sh,M)=>{const ac=typeof h7AC==="function"?h7AC():{burn:1,vmax:72},rate=.216*(typeof hTankF==="function"?hTankF():1)*(ac.burn||1),v=(ac.vmax||72)*.85,hp=sh.hp;
  const d1=Math.hypot(M.area.x-hp.x,M.area.y-hp.y),d2=Math.hypot(M.area.x-HBASE.x,M.area.y-HBASE.y);return Math.round(rate*((d1+d2)/v+170)+6)};
/* ---------- fronta výziev ---------- */
const HXPRI=M=>["car","truck","nightfoot","fire","river","ice","medevac"].includes(M.t)?1:M.t==="lost"&&((G3.N||0)>.5||SEASON==="winter")?1:M.t==="escort"||/koncert|rybár/i.test(M.title||"")?3:2;
let hxQing=false;
{const b0=hBrief;hBrief=function(M){const sh=S.shift;if(hxQing&&hxOn()&&sh){const H=HXS(sh);H.q=H.q||[];const pri=HXPRI(M),now=HXT();
    if(H.q.some(x=>x.M.title===M.title)||sh.mis&&sh.mis.title===M.title){H._dup=M;if(sh.offer===M)sh.offer=null;sh.misT=ri(15,25);return}
    const it={M,t0:now,exp:now+(pri===1?240:pri===3?480:360),pri};H.q.push(it);H._new=it;if(sh.offer===M)sh.offer=null;sh.misT=ri(25,40);SFX.play("over");toast("📻 Nová výzva vo fronte: "+M.title+(pri===1?" (priorita 1)":""));return}
  return b0.apply(this,arguments)}}
{const n0=hNewMission;hNewMission=function(){const sh=S.shift;if(!hxOn()||!sh)return n0.apply(this,arguments);const H=HXS(sh);H.q=H.q||[];
  if(H.q.length>=3||sh.offer){sh.misT=ri(20,35);return}const e0=sh.ents.length,c0=(sh.cars||[]).length;H._new=null;H._dup=null;hxQing=true;try{return n0.apply(this,arguments)}finally{hxQing=false;
    /* entity, ktoré výzva pridala, patria k nej – pri duplicite alebo vypršaní sa zmažú */
    try{const ne=sh.ents.slice(e0),nc=(sh.cars||[]).slice(c0);if(H._dup){hxClean(sh,H._dup,ne,nc)}else if(H._new){H._new.ents=ne;H._new.cars=nc}}catch(e){console.warn("hx q",e)}H._new=null;H._dup=null}}}
const hxClean=(sh,M,ne,nc)=>{try{if(M.c)M.c.target=false;if(M.p)ne=ne.concat([M.p]);if(ne&&ne.length){const s=new Set(ne);for(let i=sh.ents.length-1;i>=0;i--)if(s.has(sh.ents[i])||sh.ents[i].grp&&s.has(sh.ents[i].grp))sh.ents.splice(i,1)}if(nc&&nc.length&&sh.cars){const s=new Set(nc);for(let i=sh.cars.length-1;i>=0;i--)if(s.has(sh.cars[i]))sh.cars.splice(i,1)}}catch(e){}};
const hxDrop=(sh,it,why)=>{const H=HXS(sh),M=it.M;H.q=(H.q||[]).filter(x=>x!==it);hxClean(sh,M,it.ents||[],it.cars||[]);if(why)hxRadio("Stredisko",why,"STREDISKO")};
const hxTake=(sh,i)=>{const H=HXS(sh),it=(H.q||[])[i];if(!it)return;if(sh.mis){toast("Najprv dokonči aktuálnu misiu.");return}if(sh.offer||modalOpen())return;
  H.q=H.q.filter(x=>x!==it);const need=hxFuelNeed(sh,it.M);if(need>(sh.fuel||0))toast("Pozor: na túto výzvu treba asi "+need+" % paliva, máš "+Math.round(sh.fuel)+" %. Zváž tankovanie (H).");
  sh.offer=it.M;hBrief(it.M)};
const hxQueueTick=(sh)=>{const H=HXS(sh),now=HXT();H.q=H.q||[];
  for(const it of H.q.slice())if(now>it.exp){if(it.pri===1){S.save.rep=Math.max(0,(S.save.rep||0)-1);persist()}hxDrop(sh,it,"Výzvu „"+it.M.title.toLowerCase()+"“ prevzala iná posádka"+(it.pri===1?" – reputácia −1.":"."))}
  /* nové výzvy prichádzajú aj počas misie */
  if(H.genT==null)H.genT=now+40;if(sh.mis&&now>H.genT){H.genT=now+75+Math.random()*60;if(H.q.length<3&&!sh.offer&&!modalOpen()){try{hNewMission()}catch(e){console.warn("hx gen",e)}}}};
const hxQueueHtml=sh=>{const H=HXS(sh),q=H.q||[],now=HXT();if(!q.length)return sh.mis?"":`<div class="hx-q dim">Fronta výziev je prázdna – stredisko sa ozve.</div>`;
  if(sh.mis)return`<div class="hx-q dim">Čakajúce výzvy: ${q.length} – vyberieš si po misii.</div>`;
  return`<div class="hx-q"><div class="hx-rh">Fronta výziev <small>1–3 / klik = otvoriť</small></div>`+q.map((it,i)=>{const M=it.M,d=Math.hypot(M.area.x-sh.hp.x,M.area.y-sh.hp.y),need=hxFuelNeed(sh,M),f=sh.fuel||0,left=Math.max(0,Math.round(it.exp-now)),
    fc=need<=f-10?"ok":need<=f?"warn":"bad";
    return`<span class="hx-qi p${it.pri}" data-hxq="${i}"><b>${i+1}</b> ${M.ic||""} ${esc(M.title)} · P${it.pri} · ${(d/1000).toFixed(1).replace(".",",")} km · <em class="${fc}">palivo ~${need} %</em> · ${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}</span>`}).join("")+`</div>`};
window.__hxQueueHtml=hxQueueHtml;
document.addEventListener("pointerdown",e=>{const t=e.target.closest&&e.target.closest("[data-hxq]");if(!t)return;e.preventDefault();e.stopPropagation();const sh=S.shift;if(sh)hxTake(sh,+t.dataset.hxq)},true);
{const prev=hKey;window.removeEventListener("keydown",prev,true);
 hKey=function(e){try{const sh=S.shift,k=e.key.toLowerCase();if(hxOn()&&sh&&!sh.mis&&!modalOpen()&&!sh._map&&["1","2","3"].includes(k)&&!(e.target&&e.target.closest&&e.target.closest("input,textarea,select"))){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)hxTake(sh,+k-1);return}}catch(err){}return prev(e)};
 window.addEventListener("keydown",hKey,true)}
/* ---------- brífing smeny ---------- */
/* tipy podľa počasia a noci + odomknuté druhy misií */
const hxTips=sh=>{const N=G3.N||0,w=sh.wind,out=[];
  if(N>.5)out.push("🌙 <b>Noc:</b> ľudí nájdeš termokamerou (<kbd>T</kbd>), svetlomet <kbd>J</kbd> osvetlí cieľ pre pozemné tímy. AI operátor hľadá pomalšie.");
  if(sh.wx==="fog")out.push("🌫 <b>Hmla:</b> rozpoznávanie je slabšie a pilot krúži najviac 120 m nad zemou.");
  if(sh.wx==="rain"||sh.wx==="storm")out.push("🌧 <b>Dážď:</b> horšia viditeľnosť, záchrana na rieke musí byť rýchla.");
  if(sh.wx==="snow")out.push("❄ <b>Sneh:</b> stopy v snehu a chladno – nezvestní sú v ohrození.");
  if(w&&w.s>8)out.push("💨 <b>Silný vietor:</b> visenie nad osobou je ťažké, pilot krúži v širšom kruhu.");
  const T=hxTier(),un=HXUN;
  out.push("🗂 <b>Odomknuté misie:</b> "+[1,2,3].filter(k=>k<=T).map(k=>un[k]).join(", ")+"."+(T<3?" Ďalšie ("+un[T+1]+") pri licencii "+(T===1?"Skúsený (300 XP)":"Expert (900 XP)")+".":""));
  return out.map(x=>"<li>"+x+"</li>").join("")};
const hxBrief=sh=>{const W0=WEATHER[sh.wx]||{n:sh.wx},ac=typeof h7AC==="function"?h7AC():{n:"vrtuľník",vmax:72,winch:true,burn:1},L=hxLic(),lp=hxLvl(L.pil),lo=hxLvl(L.op),N=G3.N||0,w=sh.wind;
  const wtxt=w&&w.s>.5?Math.round(w.s)+" m/s"+(w.s>8?" – nárazy, opatrne pri visení":""):"bezvetrie";
  openModal(`<div class="ev"><div class="ev-ic">📋</div><div><p class="eyebrow">Letecká polícia · brífing smeny</p><h3 class="ev-t">Posádka pripravená</h3></div></div>
   <div class="hb-g"><div><small>Počasie</small><b>${esc(W0.n||"")}${sh.temp!=null?" · "+sh.temp+" °C":""}</b></div><div><small>Vietor</small><b>${wtxt}</b></div><div><small>Svetlo</small><b>${N>.5?"noc – termokamera a svetlomet":"deň"}</b></div>
   <div><small>Stroj</small><b>${esc(ac.n||"")} · ${Math.round((ac.vmax||72)*3.6)} km/h · ${ac.winch?"s navijakom":"bez navijaka"}</b></div><div><small>Palivo</small><b>${Math.round(sh.fuel||100)} %</b></div>
   <div><small>Licencia pilota</small><b>${HXLN[lp]} (${hxPerk("pil",lp)})</b></div><div><small>Licencia operátora</small><b>${HXLN[lo]} (${hxPerk("op",lo)})</b></div></div>
   <ul class="hb-steps"><li>Výzvy od strediska sa zbierajú vo <b>fronte</b> (najviac 3). Vyber si podľa priority, vzdialenosti a paliva – klávesy <kbd>1</kbd>–<kbd>3</kbd> alebo klik.</li>
   <li>Výzva s prioritou 1 čaká 4 minúty, ostatné 6 minút – potom ju prevezme iná posádka.</li><li>Tankuješ len na základni – <kbd>H</kbd> ťa tam dovezie. Licencie rastú za prácu v kresle pilota aj operátora.</li>${hxTips(sh)}</ul>
   <div class="ev-o"><button class="btn primary" id="hx-go">Začať službu</button></div>`);
  const b=document.getElementById("hx-go");if(b){b.onclick=()=>{closeModal();SFX.play("radio")};b.focus()}};
/* ---------- licencie za misiu (v hodnotení) ---------- */
{const w0=hWin;hWin=function(msg){const sh=S.shift,M=sh&&sh.mis;const r=w0.apply(this,arguments);
  try{if(M&&M.hx&&M.hx._st){const sc=M.hx._st,L=hxLic(),tot=Math.max(1,sc.op+sc.pil),gain=40+sc.st*30,gp=Math.round(gain*sc.pil/tot),go=gain-gp,l0=[hxLvl(L.pil),hxLvl(L.op)],t0=hxTier();
    L.pil+=gp;L.op+=go;persist();const l1=[hxLvl(L.pil),hxLvl(L.op)],t1=hxTier();
    let h=`<div class="hx-db"><p class="eyebrow">Licencie posádky</p><div><span>Pilot</span><b class="p">+${gp} · ${HXLN[l1[0]]}${l1[0]<3?" ("+L.pil+"/"+HXL[l1[0]]+")":""}</b></div><div><span>Operátor</span><b class="p">+${go} · ${HXLN[l1[1]]}${l1[1]<3?" ("+L.op+"/"+HXL[l1[1]]+")":""}</b></div>`;
    if(l1[0]>l0[0])h+=`<div><span>📈 Nová úroveň pilota</span><b class="p">${hxPerk("pil",l1[0])}</b></div>`;
    if(l1[1]>l0[1])h+=`<div><span>📈 Nová úroveň operátora</span><b class="p">${hxPerk("op",l1[1])}</b></div>`;
    if(t1>t0)h+=`<div><span>🔓 Nové misie</span><b class="p">${HXUN[t1]}</b></div>`;
    h+=`</div>`;const db=document.querySelector("#mbox .hx-db");if(db)db.insertAdjacentHTML("afterend",h)}}catch(e){}return r}}
/* ---------- napojenie ---------- */
{const u0=hUpdate;hUpdate=function(dt){const r=u0.apply(this,arguments);try{const sh=S.shift;if(hxOn()&&sh&&sh.fl){const H=HXS(sh);
  if(!H.brief&&!modalOpen()&&!S.ovl&&sh.fl.t>1.5){H.brief=1;hxBrief(sh)}if(H.brief)hxQueueTick(sh)}}catch(e){console.warn("hx3",e)}return r}}
window.__hx=HXS;
}
