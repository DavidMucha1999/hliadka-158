/* Vozidla: sluzobne auta kresli vlastny generator hry; supersport ma vlastny nizky klinovity tvar */
SPECS.super={len:4.52,h:1.28,body:[[0,.3,.05],[.02,.82,.1],[.45,.97,.2],[1.6,1.24,.4],[2.75,1.28,.45],[3.5,.84,.3],[4.38,.62,.3],[4.52,.45,.14],[4.5,.26,.05]],win:[[1.42,1],[1.74,1.2,.12],[2.7,1.23,.1],[3.34,.87]],pil:[2.05],wh:[.88,3.62],r:.36,top:325,fy:.62,ty:.82};
{const k=COPS.find(c=>c.name==="Varzetti Kuna");if(k)k.type="super"}
/* skupina 2: premavka v otvorenom svete ma znacku a tvar podla typu, navesy a linky autobusov; brzdove svetla a smerovky */
const AVT={"osobné auto":[["hatch",3],["hatch",3],["sedan",2.5],["sedan",2],["city",2],["liftback",2],["sport",1],["coupe",.5]],"SUV":[["suv",3],["suv",2],["bigsuv",2],["suvcoupe",1]],"kombi":[["combi",1],["combi",1]],"dodávka":[["van",3],["mpv",1.5]]};
function avPool(){if(avPool.p&&avPool.ct===curCt())return avPool.p;const reg=REG[curCt()],ok=m=>m.r==="*"||(Array.isArray(m.r)?m.r.includes(reg):m.r?m.r===reg:reg==="eu"||reg==="uk"),P={};for(const k in AVT){const used={};P[k]=AVT[k].map(([t,w])=>{const MK=MAKES.concat(AVX);let l=MK.filter(m=>m.t===t&&ok(m));if(!l.length)l=MK.filter(m=>m.t===t);const i=used[t]||0;used[t]=i+1;return[l[i%Math.max(1,l.length)],w]}).filter(x=>x[0])}avPool.ct=curCt();return avPool.p=P}
function avMk(c){if(c.avM!==undefined)return c.avM;const L=avPool()[c.kind];if(!L||!L.length||c.pol||c.emer)return c.avM=null;let t=L.reduce((s,x)=>s+x[1],0),r=Math.random()*t;for(const x of L){r-=x[1];if(r<=0)return c.avM=x[0]}return c.avM=L[0][0]}
function avSp(c){const m=avMk(c);return m&&SPECS[m.t]||SPECS[HSP[c.kind]]||SPECS.hatch}
function avO(c,far){const m=avMk(c);if(far&&m){const f=c.avf||(c.avf={color:c.col[1],mk:"",police:false,liv:"SK",lc:"bb",lights:false,lod:1});return f}if(!c.avo){const o=c.avo={color:c.col[1],mk:m?m.m+" "+m.mo:"",police:!!c.pol,liv:"SK",lc:"bb",lights:false};if(m)o.rim=m.t==="sport"||m.t==="coupe"?"dark":m.t==="city"?"cap":["5","mesh","5","cap"][c.id%4];if(m){const hh=(c.id*2654435761>>>0)%100,t=m.t;if(/^(combi|combis|suv|bigsuv|hatch|mpv|liftback)$/.test(t)){if(hh<9)o.acc="box";else if(hh<13)o.acc="bike"}else if(t==="van"){if(hh<55)o.firm=1+(c.id*7)%AVFIRM.length;if(hh%3===0)o.acc="lad"}else if(t==="pickup"&&hh<50)o.acc="cargo";if(/^(combi|combis|suv|bigsuv|pickup|mpv)$/.test(t)&&!o.acc){const h2=(c.id*40503>>>0)%100;if(h2<8){o.tow=t==="pickup"?1+h2%2:1+h2%3;c.avTL=o.tow===3?5.7:3.7}}}if(c.kind==="kamión")o.trailer=TRAILERS[c.id%TRAILERS.length];if(c.kind==="autobus")o.bus=BUSCOL[c.id%BUSCOL.length];if(c.kind==="sanitka")o.mk="Sanitka";if(c.kind==="hasiči")o.mk="Hasiči"}c.avo.lights=!!(c.pol&&(c.goal||c.resp));c.avo.dmF=avDL(c.avDf);c.avo.dmR=avDL(c.avDr);c.avo.dmA=avDL(c.avDa);c.avo.dmB=avDL(c.avDb);return c.avo}
function avLens(k){const L=G3.avL||(G3.avL={});if(L[k])return L[k];const G=new Geo;G.box(-.5,.5,-.5,.5,-.5,.5,g3L(k==="r"?"#ff2414":k==="w"?"#f2f5ff":"#ffa018"),2);return L[k]=g3Up(G)}
function avLights(sh,extra,ga,now){if(!sh.W||!sh.W.net)return;const hp=sh.hp,T=hTer(),E=sh.W.net.E,bl=now*1.5%1<.5;
 const rear=(x,z,a,sp,y,brk)=>{const ca=Math.cos(a),sa=Math.sin(a),hl=sp.len/2,yaw=Math.atan2(-ca,-sa);for(const s of brk?[1]:[-1,1])extra.push({m:avLens("r"),M:M4.trs(x-ca*(hl+.01)-sa*.64*s,y+(sp.ty||1)-.02,z-sa*(hl+.01)+ca*.64*s,yaw,.26,.1,.06)})};
 for(const c of sh.cars){if(c.kind==="traktor")continue;const dx=c.x-hp.x,dy=c.y-hp.y;if(dx*dx+dy*dy>28900)continue;const sp=avSp(c);if(sp.moto)continue;if(c.park){if((c.avDf||c.avDr)&&!avCr(sp))avDent(extra,c.x,c.y,c.a,sp,T(c.x,c.y)+(c.e3||0),c.avDf||0,c.avDr||0);continue}
  const pv=c._avv==null?c.v:c._avv;if(c.v<pv-.004)c._avb=now;c._avv=c.v;const brake=now-(c._avb||-9)<.35||c.v<.3,big=!!(sp.truck||sp.bus),y=T(c.x,c.y)+(c.e3||0);
  let turn=0;const D0=sh.dv,hz=c.avDf>0||c.avDr>0||D0&&D0.st2===c&&!c.flee&&c.v<1;if(hz)turn=2;else if(D0&&D0.st2===c&&!c.flee)turn=1;else if(c.avTs)turn=c.avTs;
  if(brake&&!big)rear(c.x,c.y,c.a,sp,y-(c.avTl?c.avTl[0]:0)*sp.len/2,avDL(c.avDr)>1);
  if(turn&&bl){const ca=Math.cos(c.a),sa=Math.sin(c.a),hl=sp.len/2,lat=(big?1.02:.64)+.1,yaw=Math.atan2(-ca,-sa);for(const tn of turn===2?[-1,1]:[turn])for(const f of[-1,1]){if(big&&f<0)continue;const x=c.x+ca*(hl-.06)*f-sa*lat*tn,z=c.y+sa*(hl-.06)*f+ca*lat*tn,yy=y+(f>0?sp.fy||.8:(sp.ty||1)-.02);extra.push({m:avLens("a"),M:M4.trs(x,yy,z,yaw,.12,.1,.14)});ga.push(x,yy,z,1,.6,.1,.8,.5)}}if((c.avDf||c.avDr)&&!avCr(sp))avDent(extra,c.x,c.y,c.a,sp,y,c.avDf||0,c.avDr||0)}
 if(sh.drv&&sh.dv){const D=sh.dv,v=Math.abs(D.v),pv=D._avv==null?v:D._avv;if(v<pv-.004)D._avb=now;D._avv=v;const sp=SPECS[copCar().type];const py=T(hp.x,hp.y)+(D.el||0);if(sp&&!sp.moto&&now-(D._avb||-9)<.35)rear(hp.x,hp.y,sh.fl.hd,sp,py-(D.avTl?D.avTl[0]:0)*sp.len/2,avDL(D.dmR)>1);if(sp&&!sp.moto&&D.v<-.25){const a=sh.fl.hd,ca=Math.cos(a),sa=Math.sin(a),hl=sp.len/2+.012,yaw=Math.atan2(-ca,-sa),yy=py+(sp.ty||1)-.13;for(const s of[-1,1]){const x=hp.x-ca*hl-sa*.4*s,z=hp.y-sa*hl+ca*.4*s;extra.push({m:avLens("w"),M:M4.trs(x,yy,z,yaw,.13,.07,.05)});ga.push(x,yy,z,1,1,.95,.55,.45)}}if(sp&&!sp.moto&&!avCr(sp)&&(D.dmF||D.dmR))avDent(extra,hp.x,hp.y,sh.fl.hd,sp,py,D.dmF||0,D.dmR||0)}}
{const x0=hX3D;hX3D=function(sh,C,extra,list,persons,ga,glass2,now){x0.apply(this,arguments);try{avWorldCull(sh,C,extra);avCull(sh,C,list);avTow(sh,list);avMotion(sh,now);avLights(sh,extra,ga,now);avSteam(sh,glass2,now);avTrail(sh,glass2,now);avNight(sh,ga,now);avSpray(sh,glass2,now)}catch(e){if(!avLights.w){avLights.w=1;console.warn("avl",e)}}}}
/* skupina 3: znacka a model v radare a hlaseniach */
function avName(c){const m=c.pc&&c.pc.mk||avMk(c);if(m)return m.m+" "+m.mo;const t={"kamión":"truck","autobus":"bus","traktor":"tractor"}[c.kind];if(t){if(!c.avN){const x=pickMake(t);c.avN=x?x.m+" "+x.mo:c.kind}return c.avN}return c.kind}
/* skupina 4: karta sluzobneho auta v menu – nazov, vykon, vyber auta */
function avCard(){const wrap=$("#hero-wrap");if(!wrap)return;const old=wrap.querySelector(".av-card");if(old)old.remove();const cop=copCar();if(!cop)return;const fixed=S.save.mode==="civil"||S.save.mode==="moto",L=COPS.map((c,i)=>i).filter(i=>copOK(COPS[i])),k=L.indexOf(COPS.indexOf(cop)),one=fixed||L.length<2,el=document.createElement("div");el.className="av-card";const dur=Math.max(1,Math.min(5,Math.round(((cop.crash||.5)-.3)/.5*4)+1)),z=String(cop.z).replace(".",",");
 el.innerHTML=`<button data-d="-1" ${one?"disabled":""} title="Predchádzajúce auto">‹</button><div class="av-t"><b>${esc(cop.name)}</b><small>${esc(cop.sub||"")}</small><div class="av-s"><span><i>Max</i>${cop.top} km/h</span><span><i>0–100</i>${z} s</span><span><i>Odolnosť</i>${"●".repeat(dur)}${"○".repeat(5-dur)}</span></div></div><span class="av-k">${(k<0?0:k)+1} / ${L.length}</span><button data-d="1" ${one?"disabled":""} title="Ďalšie auto">›</button>`;
 wrap.classList.add("av");wrap.appendChild(el);
 el.querySelectorAll("button").forEach(b=>{b.onpointerdown=e=>e.stopPropagation();b.onclick=e=>{e.stopPropagation();if(one)return;S.save.copIdx=L[((k<0?0:k)+(+b.dataset.d)+L.length)%L.length];persist();try{SFX.play("click")}catch(x){}renderMenu()}})}
{const rm=renderMenu;renderMenu=function(){const r=rm.apply(this,arguments);try{avCard()}catch(e){console.warn("avcard",e)}return r}}
/* krok 1 grafiky: farba laku ako nastavenie pri kresleni (model sa stavia v zastupnej farbe) */
function avPaint(o){return!!(o&&!(o.model&&typeof CMOD!=="undefined"&&CMOD[o.model])&&G3.prog&&G3.prog.m&&G3.prog.m.u&&G3.prog.m.u.uPaint)}
/* krok 2 grafiky: vlastne modely namiesto jednoduchych – vzdialene auta, hasici, sanitka, taxi */
SPECS.fire=Object.assign({},SPECS.truck,{len:8.2,h:3.15,wh:[1.5,6.5]});HSP["hasiči"]="fire";
function avLow(sp,o){const G=new Geo,L=sp.len,Z=x=>L/2-x,col=g3L(o.color||"#9aa3ad"),B=sp.body,hw=sp.van?.95:.88,dark=g3L("#101114"),gl=g3L("#1b2430"),n=B.length,yb=B[0][1],cx=L/2;
 for(let i=0;i<n-1;i++){const a=B[i],b=B[i+1];G.quad([-hw,a[1],Z(a[0])],[hw,a[1],Z(a[0])],[hw,b[1],Z(b[0])],[-hw,b[1],Z(b[0])],col,1);for(const s of[-1,1])G.tri([s*hw,yb,Z(cx)],[s*hw,a[1],Z(a[0])],[s*hw,b[1],Z(b[0])],col,1)}
 G.quad([-hw,yb,Z(0)],[hw,yb,Z(0)],[hw,yb,Z(L)],[-hw,yb,Z(L)],dark,0);
 const W=sp.win;if(W){for(const s of[-1,1]){const x=s*(hw+.012);G.quad([x,W[0][1],Z(W[0][0])],[x,W[1][1],Z(W[1][0])],[x,W[2][1],Z(W[2][0])],[x,W[3][1],Z(W[3][0])],gl,19)}const q=(p0,p1)=>G.quad([-hw*.86,p0[1]+.025,Z(p0[0])],[hw*.86,p0[1]+.025,Z(p0[0])],[hw*.86,p1[1]+.025,Z(p1[0])],[-hw*.86,p1[1]+.025,Z(p1[0])],gl,19);q(W[0],W[1]);q(W[2],W[3])}
 for(const x of sp.wh)for(const s of[-1,1])G.box(Math.min(s*(hw-.2),s*(hw+.02)),Math.max(s*(hw-.2),s*(hw+.02)),0,sp.r*2,Z(x)-sp.r,Z(x)+sp.r,dark,0);
 G.box(-hw*.82,hw*.82,(sp.ty||1)-.08,(sp.ty||1)+.03,Z(0)-.01,Z(0)+.02,PCOL.red,12);G.box(-hw*.82,hw*.82,(sp.fy||.8)-.06,(sp.fy||.8)+.04,Z(L)-.02,Z(L)+.01,PCOL.white,13);
 return{geo:G,wheels:[],plates:[]}}
function avFire(sp,o){const G=new Geo,L=sp===SPECS.fire?sp.len:Math.max(6.2,sp.len),Z=x=>L/2-x,col=g3L(o.color||"#c22a22"),hw=1.25,dark=g3L("#17181b"),sil=g3L("#b9bec5"),wh=g3L("#f1f2f0"),gls=g3L("#16202b"),bl=g3L("#2a6bff"),cab0=L-2.4,B=(x0,x1,y0,y1,l,c,m)=>G.box(-l,l,y0,y1,Z(x1),Z(x0),c,m);
 B(.1,L-.1,.45,.8,hw-.08,dark,0);B(.15,cab0-.1,.8,3,hw,col,1);B(cab0,L-.12,.8,2.85,hw,col,1);B(.15,L-.12,.82,.98,hw+.012,wh,1);
 for(let x=.45;x+1.4<cab0-.2;x+=1.6)B(x,x+1.4,1.1,2.65,hw+.015,sil,9);
 B(L-.1,L+.08,.48,.95,hw-.02,sil,9);
 G.quad([-hw+.12,1.75,Z(L-.115)],[hw-.12,1.75,Z(L-.115)],[hw-.12,2.7,Z(L-.115)],[-hw+.12,2.7,Z(L-.115)],gls,19);B(cab0+.35,L-.55,1.8,2.65,hw+.012,gls,19);
 for(const s of[-.38,.38])G.box(s-.03,s+.03,3.02,3.12,Z(cab0-.3),Z(.3),sil,9);for(let x=.5;x<cab0-.4;x+=.55)G.box(-.38,.38,3.05,3.09,Z(x+.03),Z(x-.03),sil,9);
 G.box(-.85,-.05,2.85,3.02,Z(L-1.1),Z(L-1.5),bl,4);G.box(.05,.85,2.85,3.02,Z(L-1.1),Z(L-1.5),bl,5);
 for(const s of[-1,1]){G.box(s*.95-.16,s*.95+.16,1.02,1.2,Z(L-.1)-.03,Z(L-.1),PCOL.white,13);G.box(s*.95-.14,s*.95+.14,1,1.25,Z(.15),Z(.15)+.03,PCOL.red,12)}
 const wheels=[],r=.5,w0=1.5,w1=L-1.7;for(const s of[-1,1])wheels.push({z:Z(w0),lat:s*1.04,r,w:.34,k:"truck"},{z:Z(w0),lat:s*.7,r,w:.3,k:"truck"},{z:Z(w1),lat:s*1.04,r,w:.34,k:"truck"});
 return{geo:G,wheels,plates:[]}}
function avDecor(r,sp,o){const mk=o.mk||"",G=r.geo,L=sp.len,Z=x=>L/2-x;if(!G||!sp.body)return;
 if(/^Taxi /.test(mk)&&sp.win){const z=Z((sp.win[1][0]+sp.win[2][0])/2);G.box(-.32,.32,sp.h,sp.h+.05,z-.12,z+.12,g3L("#15171b"),0);G.box(-.28,.28,sp.h+.05,sp.h+.2,z-.09,z+.09,g3L("#f2c21a"),13)}
 if(/Sanitka|Ambul/.test(mk)){const w0=r.wheels&&r.wheels[0],hw=(w0?Math.abs(w0.lat):.82)+.15,red=g3L("#d1281f"),or=g3L("#f08a1c"),bl=g3L("#2a6bff"),B=(x0,x1,y0,y1,l,c,m)=>G.box(-l,l,y0,y1,Z(x1),Z(x0),c,m),cb=sp.win?sp.win[0][0]:L*.7;
  B(.12,cb-.05,1,1.2,hw,or,1);B(.12,cb-.05,1.2,1.26,hw+.002,red,1);
  const cx=Math.min(cb-1,L*.38),cy=1.62;B(cx-.3,cx+.3,cy-.09,cy+.09,hw+.004,red,1);B(cx-.09,cx+.09,cy-.3,cy+.3,hw+.004,red,1);
  G.box(-.62,-.04,sp.h,sp.h+.15,Z(cb+.45),Z(cb+.15),bl,4);G.box(.04,.62,sp.h,sp.h+.15,Z(cb+.45),Z(cb+.15),bl,5);G.box(-.5,.5,sp.h,sp.h+.1,Z(.5),Z(.3),bl,4)}}
{const g0=g3VehGeo;g3VehGeo=function(sp,o){o=o||{};const V=avVar(sp,o);if(!V)return avGen.apply(this,arguments);const sv={body:sp.body,win:sp.win,pil:sp.pil,h:sp.h,fy:sp.fy,_rr:sp._rr};Object.assign(sp,V);try{return avGen.apply(this,arguments)}finally{Object.assign(sp,sv)}};const avGen=function(sp,o){o=o||{};if(sp.trl)return avTrl(sp,o);if(o.lod&&sp.body)return avLow(sp,o);if(sp===SPECS.fire||/Hasiči/.test(o.mk||""))return avFire(sp,o);if(sp.moto&&!o.model)return avMoto(sp,o);const r=g0.apply(this,arguments);try{avDecor(r,sp,o);avBody(r,sp,o);avAcc(r,sp,o);avFace(r,sp,o);avPol(r,sp,o);avInt(r,sp,o);avCabrio(r,sp,o);avCrush(r,sp,o);avBow(r,sp,o)}catch(e){if(!avDecor.w){avDecor.w=1;console.warn("avdecor",e)}}return r}}
/* krok 3 grafiky: detaily karoserie, nova motorka, vlastna karoseria sportoveho kombi */
SPECS.combis={len:4.99,h:1.42,body:[[0,.36,.06],[0,.94,.08],[.12,1.22,.14],[.6,1.4,.3],[3.15,1.42,.45],[3.92,.96,.3],[4.72,.82,.3],[4.99,.6,.14],[4.97,.34,.05]],win:[[.42,.99],[.72,1.33,.1],[3.08,1.34,.12],[3.72,.99]],pil:[1.35,2.4],wh:[1.02,4.02],r:.36,top:280,fy:.78,ty:1};
{const k=COPS.find(c=>c.name==="Aurex Víchor Kombi");if(k)k.type="combis"}
function avBody(r,sp,o){const G=r.geo,W=sp.win,w0=r.wheels&&r.wheels[0];if(!G||!W||!w0||!sp.body||sp.truck||sp.bus||sp.moto||sp.tractor)return;const L=sp.len,Z=x=>L/2-x,hw=Math.abs(w0.lat)+.13,mk=o.mk||"",col=g3L(o.color||"#9aa3ad"),dark=PCOL.plast,chrome=PCOL.chrome,belt=W[3][1],xa=W[3][0],lux=/Aurex|Bavaro|Mervana|Lumeo|Nordvik|Pfalzer|Voltara|Varzetti|Moorland/.test(mk),sport=!!(sp.cal||o.cal)||/GT|RS|Inovec|Sokol|Strela|Orol|Dravec|Zenit|Šíp|Čepeľ|Orkán|Víchor|Kuna/.test(mk)||sp===SPECS.coupe||sp===SPECS.super,ev=/Voltara|Vres/.test(mk),two=sp===SPECS.coupe||sp===SPECS.super||sp===SPECS.van||sp===SPECS.pickup,
  bx=(s,l0,l1,y0,y1,xA,xB,c,m)=>G.box(Math.min(s*l0,s*l1),Math.max(s*l0,s*l1),y0,y1,Z(xB),Z(xA),c,m),hc=lux?chrome:g3Mix(col,[0,0,0],.4),p0=sp.pil&&sp.pil.length?sp.pil[sp.pil.length-1]:W[0][0]-.05;
 for(const s of[-1,1]){
  bx(s,hw-.05,hw+.022,belt-.075,belt-.04,p0+.08,p0+.28,hc,lux?9:1);if(!two&&sp.pil&&sp.pil.length&&W[0][0]+.8<sp.pil[0])bx(s,hw-.05,hw+.022,belt-.075,belt-.04,W[0][0]+.38,W[0][0]+.58,hc,lux?9:1);
  bx(s,.05,hw*.62,belt+.022,belt+.045,xa+.11,xa+.15,dark,0)}
 try{const rr=roofRange(sp),x=rr[0]+.2;G.box(-.025,.025,sp.h,sp.h+.1,Z(x+.17),Z(x),dark,0)}catch(e){}
}
function avMoto(sp,o){const G=new Geo,L=sp.len,Z=x=>L/2-x,pol=!!o.police,c=pol?g3L("#f3f5f7"):g3L(o.color||"#2b2f36"),dark=PCOL.dark,plast=PCOL.plast,chrome=PCOL.chrome,met=g3L("#4a4e55"),wheels=[],plates=[],xr=sp.wh[0],xf=sp.wh[1],r=sp.r,tour=pol||/Tulák|Búrka|Jazdec/.test(o.mk||"");
 G.bbox(-.13,.13,.3,.64,Z(1.36),Z(.78),.05,met,9,{smooth:true});for(let y=.36;y<.6;y+=.07)G.box(-.15,.15,y,y+.025,Z(1.3),Z(1.02),chrome,9);
 G.bbox(-.17,.17,.72,.97,Z(1.56),Z(1.02),.08,c,1,{smooth:true});G.bbox(-.15,.15,.78,.89,Z(1.04),Z(.42),.04,plast,0);G.bbox(-.11,.11,.72,.85,Z(.46),Z(.06),.04,c,1,{smooth:true});
 G.bbox(-.08,.08,r*2-.06,r*2+.05,Z(xf+.3),Z(xf-.3),.03,c,1);G.bbox(-.09,.09,r*2-.05,r*2+.07,Z(xr+.3),Z(xr-.3),.03,plast,0);
 for(const s of[-1,1]){G.limb([s*.09,r,Z(xf)],[s*.09,1,Z(xf-.24)],.028,.024,6,chrome,9);G.box(s*.1-.02,s*.1+.02,r-.04,r+.05,Z(xr+.55),Z(xr),met,9);G.limb([s*.28,1.07,Z(1.58)],[s*.3,1.2,Z(1.6)],.012,.012,5,dark,0);G.box(s*.3-.06,s*.3+.06,1.18,1.25,Z(1.62),Z(1.59),plast,0)}
 G.cylX(-.33,.33,1.06,Z(1.58),.018,6,dark,0);G.cylZ(.15,.36,Z(.98),Z(.1),.05,8,chrome,9,dark);G.box(-.02,.02,.14,.5,Z(1.02),Z(.98),chrome,9);
 if(tour){G.bbox(-.25,.25,.74,1.16,Z(2.02),Z(1.62),.09,c,1,{smooth:true});G.quad([-.2,1.14,Z(1.74)],[.2,1.14,Z(1.74)],[.16,1.5,Z(1.58)],[-.16,1.5,Z(1.58)],[.1,.12,.14],3)}else G.bbox(-.15,.15,.82,1.06,Z(1.98),Z(1.74),.06,c,1,{smooth:true});
 G.cylZ(0,.96,Z(2.02)-.03,Z(2.02)-.005,.09,10,PCOL.white,13,PCOL.white);G.quad([-.08,.66,Z(.06)+.01],[.08,.66,Z(.06)+.01],[.08,.78,Z(.06)+.01],[-.08,.78,Z(.06)+.01],PCOL.red,6);
 if(pol){const lc=o.lc||"bb",bl=g3L("#1f4fa8");for(const s of[-1,1]){G.bbox(s*.27-.13,s*.27+.13,.5,.9,Z(.86),Z(.28),.05,c,1,{smooth:true});G.box(s*.4-.004,s*.4+.004,.62,.74,Z(.84),Z(.3),bl,1);G.box(s*.255-.004+s*.0,s*.255+.004,.86,.98,Z(1.98),Z(1.66),bl,1)}G.bbox(-.2,.2,.9,1.16,Z(.4),Z(.02),.05,c,1,{smooth:true});G.box(-.34,-.22,1.18,1.28,Z(.34),Z(.24),g3LB(lc,0),4);G.box(.22,.34,1.18,1.28,Z(.34),Z(.24),g3LB(lc,1),5);G.box(-.015,.015,1.16,1.95,Z(.2),Z(.17),dark,0);G.box(-.03,.03,1.95,2.02,Z(.215),Z(.155),g3LB(lc,0),4)}
 if(!o.empty){const rk=g3L(pol?"#d6f03a":o.rider||"#2b2f36"),pants=g3L("#1d2027"),boot=g3L("#111214");G.bbox(-.2,.2,.98,1.5,Z(1.25),Z(.88),.08,rk,0,{smooth:true});G.blob(0,1.66,Z(1.12),.16,.17,.18,pol?g3L("#f4f6f8"):g3L(o.helmet||"#1d1f24"),1,3);G.quad([-.1,1.62,Z(1.29)],[.1,1.62,Z(1.29)],[.1,1.72,Z(1.27)],[-.1,1.72,Z(1.27)],[0,0,0],3);
  for(const s of[-1,1]){G.limb([s*.2,1.4,Z(1.2)],[s*.27,1.14,Z(1.42)],.055,.05,6,rk,0);G.limb([s*.27,1.14,Z(1.42)],[s*.3,1.07,Z(1.57)],.05,.045,6,rk,0);G.limb([s*.15,.95,Z(.95)],[s*.2,.72,Z(1.22)],.085,.07,6,pants,0);G.limb([s*.2,.72,Z(1.22)],[s*.19,.36,Z(1.08)],.065,.055,6,pants,0);G.box(s*.19-.05,s*.19+.05,.28,.38,Z(1.22),Z(1),boot,0)}
  if(pol)G.box(-.14,.14,1.2,1.3,Z(.875)-.004,Z(.875),g3L("#1f4fa8"),1)}
 plates.push({y:.5,z:Z(.06)+.012,w:.2,h:.12,moto:true});wheels.push({z:Z(xr),lat:0,r,w:.16,k:"moto"},{z:Z(xf),lat:0,r,w:.13,k:"moto"});return{geo:G,wheels,plates}}
/* krok 4 grafiky: vlastnosti laku podla auta – [metaliza 0/1, perlet 2 | vek 0..1 | spina | tonovane skla] */
function avPP(o){if(!o)return AVPP0;if(o.avDirt>0)return[0,0,o.avDirt,0];if(o._pp&&o._pps===o.color)return o._pp;o._pps=o.color;if(o.police||o.model||o.trailer||o.bus||!o.color)return o._pp=AVPP0;const k=(o.mk||"")+o.color+(o.plate||"");let h=7;for(let i=0;i<k.length;i++)h=h*31+k.charCodeAt(i)>>>0;const c=o.color.toLowerCase(),lux=/Aurex|Bavaro|Mervana|Lumeo|Nordvik|Pfalzer|Voltara|Varzetti|Moorland/.test(o.mk||""),old=!lux&&(h>>>7)%100<12,age=old?.45+(h>>>3)%50/100:0;
 const metal=old?0:c==="#f2efe6"?2:c==="#eceff2"?((h>>>5)%100<25?2:0):(h%100<62?1:(h%100<70?2:0));return o._pp=[metal,age,old?.35:(h>>>13)%100<18?.25:0,(h>>>11)%100<(lux?55:22)?1:0]}
const AVPP0=[0,0,0,0];
/* krok 5 grafiky: poskodenie po naraze, vystrazne svetla, svetlomety premavky, vzory majakov */
function avDentM(){if(G3.avDn)return G3.avDn;const G=new Geo,dk=g3L("#2b2d31"),bl=[.02,.02,.025],sc=g3L("#55585e");
 for(let i=0;i<7;i++){const x0=-.82+i*.235,w=.16+((i*37)%5)*.03,y0=.33+((i*53)%7)*.022,h=.08+((i*29)%6)*.022;G.quad([x0,y0,0],[x0+w,y0+.02,0],[x0+w+.03,y0+h,0],[x0+.02,y0+h-.02,0],i%2?dk:sc,0)}
 G.quad([-.9,.3,.004],[.9,.26,.004],[.9,.3,.004],[-.9,.34,.004],bl,0);G.quad([-.3,.5,.004],[.35,.54,.004],[.3,.57,.004],[-.32,.53,.004],bl,0);return G3.avDn=g3Up(G)}
function avDent(extra,x,z,a,sp,y,f,r){const ca=Math.cos(a),sa=Math.sin(a),yaw=Math.atan2(-ca,-sa),hl=sp.len/2+.015,w=(sp.van?1.9:1.76)/1.8,M=M4.trs(x,y,z,yaw);if(r>0)extra.push({m:avDentM(),M:M4.mul(M,M4.trs(0,0,hl,0,w,.8+r*.25,1))});if(f>0)extra.push({m:avDentM(),M:M4.mul(M,M4.trs(0,0,-hl,Math.PI,w,.8+f*.25,1))})}
function avHit(c,fwd){const sh=S.shift,D=sh.dv,hp=sh.hp,up=(o,k,v)=>{o[k]=Math.min(1,(o[k]||0)+v)};let sd=0;if(c){const a=sh.fl.hd,dx=c.x-hp.x,dy=c.y-hp.y,al=dx*Math.cos(a)+dy*Math.sin(a),lt=-dx*Math.sin(a)+dy*Math.cos(a),ps=SPECS[copCar().type];if(Math.abs(al)<(ps?ps.len:4.5)/2-.5&&Math.abs(lt)>.9)sd=lt>0?1:-1}if(sd)up(D,sd>0?"dmA":"dmB",.5);else up(D,fwd?"dmF":"dmR",c?.4:.25);if(c){const ca=Math.cos(c.a),sa=Math.sin(c.a),dx=hp.x-c.x,dy=hp.y-c.y,al=dx*ca+dy*sa,lt=-dx*sa+dy*ca,sp=avSp(c);if(Math.abs(al)<sp.len/2-.5&&Math.abs(lt)>.9)up(c,lt>0?"avDa":"avDb",.5);else up(c,al>0?"avDf":"avDr",.5)}}
function avFlash(){const p=S.save&&S.save.drvFl||0,t=performance.now();if(p===1){const l=t%900<450;return{l,r:!l}}if(p===2){const tt=t%700,on=tt<60||tt>110&&tt<170||tt>220&&tt<280;return{l:on,r:on}}return flashState()}
function avFlNext(){const s=S.save;s.drvFl=((s.drvFl||0)+1)%3;persist();toast("Vzor majákov: "+["striedavé záblesky","pomalé striedanie","trojitý záblesk"][s.drvFl])}
function avCarL(L2,sh,T,N,m){if(N<=.3||L2.length>5)return;const hp=sh.hp,near=[];for(const c of sh.cars){if(c.park||c.v<1)continue;const d=(c.x-hp.x)*(c.x-hp.x)+(c.y-hp.y)*(c.y-hp.y);if(d<8100&&d>60)near.push([d,c])}near.sort((a,b)=>a[0]-b[0]);for(const[,c]of near.slice(0,3)){const x=c.x+Math.cos(c.a)*9,z=c.y+Math.sin(c.a)*9;L2.push({d:-z,x,y:T(x,z)+(c.e3||0)+3,rng:14,c:[1.1*m*N,1.05*m*N,.9*m*N]})}}

/* krok 6: deformacia karoserie, rozbite svetla, cuvacie svetla */
const AVRK=-1;
function avDL(v){return v>=.75?2:v>=.2?1:0}
function avCr(sp){return !!(sp&&(sp.body||sp.truck||sp.bus)&&!sp.moto&&!sp.tractor&&sp!==SPECS.fire)}
function avCrush(r,sp,o){const big=!!(sp.truck||sp.bus),lf=o.dmF|0,lr=o.dmR|0,sa=big?0:o.dmA|0,sb=big?0:o.dmB|0;if(!lf&&!lr&&!sa&&!sb||!avCr(sp)||o.lod)return;const G=r.geo,L=sp.len,hl=L/2,w0=r.wheels&&r.wheels[0],hw=big?1.27:(w0?Math.abs(w0.lat):.8)+.13,h=[...(o.mk||"x")].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7),sdF=h&1?1:-1,sdR=AVRK;
 const dk=g3L("#2b2d31"),sc=g3L("#55585e"),bl=[.02,.02,.025],k=hw*.66/.92;
 const scuff=(dir,lv)=>{const z=dir*(hl+(big?.014:.095)),q=(a,b,c,d,col)=>{const f=p=>[-dir*p[0]*k,p[1],z];G.quad(f(a),f(b),f(c),f(d),col,0)};for(let i=0;i<(lv>1?7:4);i++){const j=lv>1?i:i*2%7,x0=-.82+j*.235,w=.16+((j*37)%5)*.03,y0=.33+((j*53)%7)*.022,hh=.08+((j*29)%6)*.022;q([x0,y0],[x0+w,y0+.02],[x0+w+.03,y0+hh],[x0+.02,y0+hh-.02],i%2?dk:sc)}q([-.8,.31],[.7,.28],[.7,.31],[-.8,.34],bl);if(lv>1)q([-.3,.5],[.35,.54],[.3,.57],[-.32,.53],bl)};
 if(lf)scuff(-1,lf);if(lr)scuff(1,lr);for(const p of r.plates||[]){if(p.front&&lf)p.z+=lf>1?.2:.07;else if(!p.front&&lr)p.z-=lr>1?.2:.07}
 const mv=(P,i)=>{let x=P[i],y=P[i+1],z=P[i+2],m=0;for(const[dir,lv,sd]of[[-1,lf,sdF],[1,lr,sdR]]){if(!lv)continue;const zone=lv>1?.95:.6,d=Math.max(0,hl-dir*z);if(d>=zone)continue;const t=1-d/zone,sw=.55+.45*Math.max(-1,Math.min(1,sd*x/hw)),n=.5+.5*Math.sin(x*9.1+y*7.3+h%7),dep=lv>1?.3:.12;z-=dir*dep*t*t*sw*(.72+.28*n);if(y>(sp.fy||.75)+.08)y+=(lv>1?.075:.03)*Math.sin(t*Math.PI)*sw*(.55+.45*Math.sin(x*5.3+1.7));else if(lv>1&&y<.46)y-=.035*t*sw*(.5+.5*n);if(x*sd>0)x*=1-.05*lv*t*t;m=Math.max(m,t*sw*lv)}for(const[sd,lv]of[[1,sa],[-1,sb]]){if(!lv||x*sd<=0)continue;const zc=((h>>3)%9-4)*.09*sd,zl=lv>1?1.5:1.05,tz=1-Math.abs(z-zc)/zl;if(tz<=0)continue;const ty=1-Math.abs(y-.62)/(lv>1?.78:.52);if(ty<=0)continue;const wx=Math.max(0,Math.min(1,(Math.abs(x)-hw*.6)/(hw*.3))),n=.5+.5*Math.sin(z*6.7+y*8.3+h%5),k2=tz*tz*ty*wx;x-=sd*(lv>1?.2:.09)*k2*(.68+.32*n);m=Math.max(m,k2*lv)}P[i]=x;P[i+1]=y;P[i+2]=z;return m};
 for(const A of[G.a,G.gl&&G.gl.a]){if(!A||!A.length)continue;for(let i=0;i+36<=A.length;i+=36){let m=0;for(let v=0;v<3;v++)m=Math.max(m,mv(A,i+v*12));if(m<=0)continue;
   const ax=A[i+12]-A[i],ay=A[i+13]-A[i+1],az=A[i+14]-A[i+2],bx=A[i+24]-A[i],by=A[i+25]-A[i+1],bz=A[i+26]-A[i+2];let nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;const l=Math.hypot(nx,ny,nz);if(l>1e-9){nx/=l;ny/=l;nz/=l;if(nx*(A[i+3]+A[i+15]+A[i+27])+ny*(A[i+4]+A[i+16]+A[i+28])+nz*(A[i+5]+A[i+17]+A[i+29])<0){nx=-nx;ny=-ny;nz=-nz}const w=Math.min(.85,m*.9);for(let v=0;v<3;v++){const o2=i+v*12,x=A[o2+3]*(1-w)+nx*w,y=A[o2+4]*(1-w)+ny*w,z=A[o2+5]*(1-w)+nz*w,l2=Math.hypot(x,y,z)||1;A[o2+3]=x/l2;A[o2+4]=y/l2;A[o2+5]=z/l2}}
   const mat=A[i+9],cz=(A[i+2]+A[i+14]+A[i+26])/3,cx=(A[i+0]+A[i+12]+A[i+24])/3,fr=cz<0,lv=fr?lf:lr,sd=fr?sdF:sdR;if(lv>1&&cx*sd>hw*.2&&(mat===2||mat===13||mat===12||mat===6))for(let v=0;v<3;v++){const o2=i+v*12;A[o2+6]=.05;A[o2+7]=.05;A[o2+8]=.06;A[o2+9]=0}}}
 const A=G.a,gk=PCOL.glassK,belt=sp.win?sp.win[0][1]:1;for(const[sd,lv]of[[1,sa],[-1,sb]]){if(!lv)continue;const zc=((h>>3)%9-4)*.09*sd,zl=lv>1?1.5:1.05,N0=A.length;
  const sx=(y,z)=>{let best=null;for(let i=0;i+36<=N0;i+=36){if(A[i+9]!==1&&A[i+9]!==0)continue;const x0=A[i],x1=A[i+12],x2=A[i+24];if(x0*sd<hw*.55&&x1*sd<hw*.55&&x2*sd<hw*.55)continue;const z0=A[i+2],y0=A[i+1],z1=A[i+14],y1=A[i+13],z2=A[i+26],y2=A[i+25],d=(y1-y2)*(z0-z2)+(z2-z1)*(y0-y2);if(Math.abs(d)<1e-9)continue;const u=((y1-y2)*(z-z2)+(z2-z1)*(y-y2))/d,v=((y2-y0)*(z-z2)+(z0-z2)*(y-y2))/d,w=1-u-v;if(u<-.001||v<-.001||w<-.001)continue;const x=(u*x0+v*x1+w*x2)*sd;if(best==null||x>best)best=x}return best};
  const Q=[],n=lv>1?7:3;for(let k=0;k<n;k++){const r1=((h>>>(k+1))*2654435761>>>0)%1000/1000,r2=((h+k*977)*40503>>>0)%1000/1000,len=.35+r1*(lv>1?1.1:.7),za=zc-zl*.6+r2*(zl*1.2-len),y=.44+((k*5+h)%7)*.07,th=.012+r1*.022,sl=(r2-.5)*.06,col=k%3===0?[.5,.51,.53]:k%3===1?[.11,.11,.12]:[.3,.3,.32],st=Math.max(2,Math.ceil(len/.16));for(let q=0;q<st;q++){const z0=za+len*q/st,z1=za+len*(q+1)/st,ya=y+sl*q/st,yb=y+sl*(q+1)/st,P=[[ya,z0],[ya,z1],[yb+th,z1],[ya+th,z0]].map(p=>{const x=sx(p[0],p[1]);return x==null?null:[sd*(x+.007),p[0],p[1]]});if(P.some(p=>!p))continue;Q.push(sd>0?[P[0],P[3],P[2],P[1],col]:[P[0],P[1],P[2],P[3],col])}}
  if(lv>1)for(let i=0;i+36<=N0;i+=36){if(A[i+9]!==3||A[i+6]!==gk[0]||A[i+7]!==gk[1])continue;const cx=(A[i]+A[i+12]+A[i+24])/3,cy=(A[i+1]+A[i+13]+A[i+25])/3,cz=(A[i+2]+A[i+14]+A[i+26])/3;if(cx*sd<hw*.5||cy<belt||Math.abs(cz-zc)>zl*.62||(i/36*7+h)%5===0)continue;for(let v=1;v<3;v++){A[i+v*12]=A[i];A[i+v*12+1]=A[i+1];A[i+v*12+2]=A[i+2]}}
  for(const q of Q)G.quad(q[0],q[1],q[2],q[3],q[4],0)}}
/* krok 7: para z rozbiteho predku */
function avPuff(k,d){const P=G3.avPf||(G3.avPf=[]),q=k+(d|0)*3;if(P[q])return P[q];const G=new Geo,c=d===3?[[1.5,1.55,1.62],[1.35,1.4,1.48],[1.6,1.65,1.7]]:d===2?[[.2,.2,.22],[.16,.16,.18],[.26,.26,.28]]:d?[[.6,.53,.41],[.55,.48,.37],[.66,.59,.46]]:[[.86,.87,.89],[.8,.81,.84],[.9,.9,.92]];G.blob(0,0,0,.5,.5,.5,c[0],41+k,7);G.blob(.28,.12,.1,.34,.32,.34,c[1],41+k,5);G.blob(-.22,.2,-.14,.3,.3,.3,c[2],41+k,3);return P[q]=g3Up(G)}
function avSteam(sh,gl2,now){if(!gl2||!sh.W)return;const hp=sh.hp,T=hTer(),D=sh.dv;const one=(o,x,z,a,sp,y,id)=>{if(o.avS0==null)o.avS0=now;const age=now-o.avS0,n=age<50?5:age<130?2:0;if(!n)return;const ca=Math.cos(a),sa=Math.sin(a),fx=x+ca*(sp.len/2-.5),fz=z+sa*(sp.len/2-.5),fy=y+(sp.fy||.8)+.12;for(let k=0;k<n;k++){const u=(now*.33+k/n+id*.37)%1,sc=.3+u*1.25,wob=Math.sin(u*5+k*2.1+id)*.25*u;gl2.push({m:avPuff(u<.3?0:u<.65?1:2),M:M4.trs(fx+wob-sa*.15*(k%2?1:-1),fy+u*2.4,fz+wob*.6,u*2+k,sc,sc*.9,sc)})}};
 for(const c of sh.cars){if(avDL(c.avDf)<2)continue;const dx=c.x-hp.x,dy=c.y-hp.y;if(dx*dx+dy*dy>14400)continue;const sp=avSp(c);if(!avCr(sp))continue;one(c,c.x,c.y,c.a,sp,T(c.x,c.y)+(c.e3||0),c.id||1)}
 if(sh.drv&&D&&avDL(D.dmF||0)>1){const sp=SPECS[copCar().type];if(avCr(sp))one(D,hp.x,hp.y,sh.fl.hd,sp,T(hp.x,hp.y)+(D.el||0),0)}}

/* krok 9: poskodenie ma nasledky - vykon, tah do strany, ukazovatel, opotrebenie */
function avPerf(D){const f=avDL(D.dmF||0),r=avDL(D.dmR||0),a=avDL(D.dmA||0),b=avDL(D.dmB||0);return{top:[1,.9,.7][f]*[1,.97,.93][r],acc:[1,.92,.7][f],pull:(a-b)*.01,f,r,a,b}}
function avHud(){const cv=$("#h-cv"),sh=S.shift;if(!cv||!sh||!sh.dv)return;const P=avPerf(sh.dv);if(!(P.f||P.r||P.a||P.b))return;const g=cv.getContext("2d"),w=cv.clientWidth,h=cv.clientHeight,k=cv.width/Math.max(1,w),C=["#3d4a60","#ffcb5c","#ff5a4d"],x=16,y=h-150;g.save();g.setTransform(k,0,0,k,0,0);g.fillStyle="rgba(8,13,24,.78)";rrect(g,x,y,170,56,10);g.fill();
 const cx=x+26,cy=y+28;g.fillStyle=C[P.f];rrect(g,cx-9,cy-21,18,11,4);g.fill();g.fillStyle=C[P.r];rrect(g,cx-9,cy+10,18,11,4);g.fill();g.fillStyle=C[P.b];g.fillRect(cx-9,cy-9,8,18);g.fillStyle=C[P.a];g.fillRect(cx+1,cy-9,8,18);
 g.textAlign="left";g.textBaseline="alphabetic";g.font=`700 11px ${MONO}`;g.fillStyle=P.f>1||P.r>1||P.a>1||P.b>1?"#ff5a4d":"#ffcb5c";g.fillText("POŠKODENIE",x+50,y+21);g.fillStyle="#9fb0c8";const t=[];if(P.top<1)t.push("max −"+Math.round((1-P.top)*100)+" %");if(P.pull)t.push(P.pull>0?"ťahá vpravo":"ťahá vľavo");g.fillText(t.join(" · ")||"bez vplyvu na jazdu",x+50,y+38);g.restore()}
{const h0=fdHud;fdHud=function(){h0.apply(this,arguments);try{avHud()}catch(e){if(!avHud.w){avHud.w=1;console.warn("avhud",e)}}}}
{const e0=endShift;endShift=function(){let d=null;try{const sh=S.shift;if(sh&&sh.drv&&sh.dv)d=sh.dv}catch(e){}const r=e0.apply(this,arguments);try{if(d&&!d.avEnd){d.avEnd=1;const i=COPS.indexOf(copCar());if(i>=0){const f=h10Fleet(i),P=avPerf(d),n=P.f+P.r+P.a+P.b;f.wear=clamp(f.wear+.03+n*.05,0,1);f.km+=Math.round((d.odo||0)/1e3);persist();if(n)toast(`Služobné auto je poškodené – opotrebenie ${Math.round(f.wear*100)} %. Servis nájdeš vo vozovom parku.`)}}}catch(e){console.warn("avend",e)}return r}}

/* krok 10: pohyb karoserie - naklon v zakrute, predklon pri brzdeni, natacanie prednych kolies */
function avTiltM(M,t){const p=t[0],b=t[1];if(Math.abs(p)<.002&&Math.abs(b)<.002)return M;const c=Math.cos(p),s=Math.sin(p),cb=Math.cos(b),sb=Math.sin(b),RX=new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]),RZ=new Float32Array([cb,sb,0,0,-sb,cb,0,0,0,0,1,0,0,0,0,1]);return M4.mul(M,M4.mul(M4.tr(0,.3,0),M4.mul(RZ,M4.mul(RX,M4.tr(0,-.3,0)))))}
function avMotion(sh,now){const hp=sh.hp,D=sh.dv,dt=Math.max(0,Math.min(.1,now-(sh._mT==null?now:sh._mT)));sh._mT=now;if(dt<=0)return;
 const step=(o,a,v,st)=>{if(o._mA==null){o._mA=a;o._mV=v;o.avTl=[0,0];o.avSt=0;return}const yr=hAng(a-o._mA)/dt,ac=(v-o._mV)/dt;o._mA=a;o._mV=v;o.avAc=ac;o.avLa=yr*v;const k=Math.min(1,dt*7),pt=clamp(ac*.005,-.055,.035),rl=clamp(yr*v*.011,-.075,.075),sa=st!=null?st:clamp(yr*2.7/Math.max(3,Math.abs(v)),-.5,.5);o.avTl[0]+=(pt-o.avTl[0])*k;o.avTl[1]+=(rl-o.avTl[1])*k;o.avSt+=(sa-o.avSt)*k};
 for(const c of sh.cars){if(c.park)continue;const dx=c.x-hp.x,dy=c.y-hp.y;if(dx*dx+dy*dy>22500){c._mA=null;continue}step(c,c.a,c.v||0)}
 if(sh.drv&&D)step(D,sh.fl.hd,D.v,D.st*.5*(1-.6*Math.min(1,Math.abs(D.v)/30)))}

/* krok 11: brzdne stopy, dym z pneumatik, prach mimo cesty, spina */
function avTrail(sh,gl2,now){const D=sh.dv,hp=sh.hp;if(!sh.drv||!D||!gl2)return;const sp=SPECS[copCar().type];if(!sp)return;const dt=Math.max(0,Math.min(.1,now-(D._trT==null?now:D._trT)));D._trT=now;
 const T=hTer(),a=sh.fl.hd,ca=Math.cos(a),sa=Math.sin(a),av=Math.abs(D.v),zr=sp.len/2-Math.min(...sp.wh),lat=sp.moto?[0]:[-.78,.78],y=T(hp.x,hp.y)+(D.el||0);
 const skid=!D.off&&(av>4&&!!KEYS[" "]||av>15&&(D.avAc||0)<-9||av>8&&Math.abs(D.avLa||0)>11),wx=sh.wx,wet=wx==="rain"||wx==="storm"||wx==="snow";
 D.avDi=Math.min(.6,(D.avDi||0)+av*dt*(D.off?.0035:wet?.0005:.00002));
 const K=D.avSk||(D.avSk={segs:[],last:null,mesh:null,dirty:false,t:0}),P=D.avPs||(D.avPs=[]),pts=lat.map(l=>[hp.x-ca*zr-sa*l,hp.y-sa*zr+ca*l]);
 if(skid){if(K.last){const d=Math.hypot(pts[0][0]-K.last[0][0],pts[0][1]-K.last[0][1]);if(d>.25&&d<4){pts.forEach((p,i)=>K.segs.push([K.last[i][0],K.last[i][1],p[0],p[1],y]));K.last=pts;K.dirty=true;while(K.segs.length>420)K.segs.shift()}else if(d>=4)K.last=pts}else K.last=pts}else K.last=null;
 if(K.dirty&&now-K.t>.1){K.dirty=false;K.t=now;const G=new Geo,c=[.012,.012,.015];for(const[x0,z0,x1,z1,yy]of K.segs){const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz)||1,nx=-dz/l*.1,nz=dx/l*.1,h=yy+.11;G.quad([x0-nx,h,z0-nz],[x0+nx,h,z0+nz],[x1+nx,h,z1+nz],[x1-nx,h,z1-nz],c,44);G.quad([x1-nx,h,z1-nz],[x1+nx,h,z1+nz],[x0+nx,h,z0+nz],[x0-nx,h,z0-nz],c,44)}for(let i=0;i<G.a.length;i+=12){G.a[i+3]=0;G.a[i+4]=1;G.a[i+5]=0}if(K.mesh)g3Free(K.mesh);K.mesh=G.a.length?g3Up(G):null}
 if(K.mesh)gl2.push({m:K.mesh,M:M4.tr(0,0,0)});
 const dust=D.off&&av>5;if((skid||dust)&&now-(D._psT||0)>(dust?.08:.09)){D._psT=now;const p=pts[(D._psN=(D._psN||0)+1)%pts.length];P.push([p[0],y+.15,p[1],now,dust?1:0]);if(P.length>44)P.shift()}
 for(let i=P.length-1;i>=0;i--){const q=P[i],u=(now-q[3])/(q[4]?1.5:1.1);if(u>=1){P.splice(i,1);continue}const sc=.25+u*(q[4]?1.5:.8);gl2.push({m:avPuff(u<.3?0:u<.65?1:2,q[4]),M:M4.trs(q[0],q[1]+u*(q[4]?.7:.95),q[2],i*1.7,sc,sc*.8,sc)})}}

/* krok 12: rozmanitost premavky - stresne boxy, bicykle, rebriky, naklad, firemne napisy */
const AVFIRM=["KUČERA ELEKTRO","RÝCHLA ZÁSIELKA","PEKÁREŇ KLAS","VODA · KÚRENIE HRIC","STAVBY MORAVEC","KVETY IRIS","TATRA EXPRES","MALIARI BIELIK","SERVIS VÝŤAHOV","ČISTIAREŇ LUNA"];
const AVFCOL=["#1d4fc4","#c8261f","#1f7a3a","#15171b","#b0560e"];
function avSx(A,N0,sd,hw,y,z){let best=null;for(let i=0;i+36<=N0;i+=36){if(A[i+9]!==1&&A[i+9]!==0)continue;const x0=A[i],x1=A[i+12],x2=A[i+24];if(x0*sd<hw*.55&&x1*sd<hw*.55&&x2*sd<hw*.55)continue;const z0=A[i+2],y0=A[i+1],z1=A[i+14],y1=A[i+13],z2=A[i+26],y2=A[i+25],d=(y1-y2)*(z0-z2)+(z2-z1)*(y0-y2);if(Math.abs(d)<1e-9)continue;const u=((y1-y2)*(z-z2)+(z2-z1)*(y-y2))/d,v=((y2-y0)*(z-z2)+(z0-z2)*(y-y2))/d,w=1-u-v;if(u<-.001||v<-.001||w<-.001)continue;const x=(u*x0+v*x1+w*x2)*sd;if(best==null||x>best)best=x}return best}
function avAcc(r,sp,o){if(!o.acc&&!o.firm||!sp.body||o.lod)return;const G=r.geo,L=sp.len,Z=x=>L/2-x,w0=r.wheels&&r.wheels[0],hw=(w0?Math.abs(w0.lat):.8)+.13,rr=roofRange(sp),xm=(rr[0]+rr[1])/2,zm=Z(xm),ry=sp.h+.035,dk=g3L("#17191c"),al=g3L("#b9bec5"),h=[...(o.mk||"x")].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7);
 const bars=()=>{for(const dz of[-.42,.42])G.box(-hw*.74,hw*.74,ry,ry+.045,zm+dz-.03,zm+dz+.03,dk,0)};
 if(o.acc==="box"){bars();const bl=Math.min(1.05,(rr[1]-rr[0])/2-.05),c=h%3===0?g3L("#c9cdd2"):dk;G.bbox(-.4,.4,ry+.05,ry+.36,zm-bl,zm+bl,.1,c,1,{smooth:true});G.box(-.405,.405,ry+.19,ry+.205,zm-bl+.06,zm+bl-.06,g3L("#0c0d0f"),0)}
 else if(o.acc==="bike"){bars();const fc=g3L(["#c8261f","#1d6fd0","#e0a012","#2f8f46"][h%4]),x=.18,wr=.33,wy=ry+.06+wr,za=zm-.52,zb=zm+.52;for(const z of[za,zb]){G.cylX(x-.02,x+.02,wy,z,wr,14,g3L("#141517"),0);G.cylX(x-.022,x+.022,wy,z,wr*.82,14,al,9)}const P=(z,y)=>[x,y,z],L2=(a,b)=>G.limb(a,b,.018,.018,5,fc,1);L2(P(zb,wy),P(zm+.1,wy+.02));L2(P(zm+.1,wy+.02),P(zm-.1,wy+.42));L2(P(zm-.1,wy+.42),P(zm+.3,wy+.42));L2(P(zm+.3,wy+.42),P(zb,wy));L2(P(zm+.1,wy+.02),P(zm+.3,wy+.42));L2(P(zm-.1,wy+.42),P(za,wy));G.limb(P(zm-.12,wy+.42),P(zm-.14,wy+.56),.012,.012,5,dk,0);G.box(x-.2,x+.2,wy+.55,wy+.58,zm-.16,zm-.13,dk,0);G.box(x-.05,x+.05,wy+.5,wy+.53,zm+.22,zm+.42,dk,0)}
 else if(o.acc==="lad"){const z0=Z(rr[1]-.2),z1=Z(rr[0]+.25);for(const dz of[.25,.5,.75])G.box(-hw*.78,hw*.78,ry,ry+.05,z0+(z1-z0)*dz-.03,z0+(z1-z0)*dz+.03,dk,0);for(const x of[-.5,-.14]){G.box(x-.02,x+.02,ry+.05,ry+.1,z0,z1,al,9)}for(let z=z0+.15;z<z1;z+=.3)G.box(-.5,-.14,ry+.06,ry+.085,z-.015,z+.015,al,9);G.cylZ(.35,ry+.11,z0+.2,z1-.1,.06,8,g3L("#8a5a2b"),0,g3L("#8a5a2b"));G.cylZ(.52,ry+.11,z0+.4,z1-.3,.05,8,g3L("#6f7379"),9,g3L("#6f7379"))}
 else if(o.acc==="cargo"&&sp.bed){const k=h%3;if(k===0)G.bbox(-hw+.14,hw-.14,1.04,1.34,Z(1.45),Z(.25),.06,g3L("#3a5a3c"),0,{smooth:true});else{G.bbox(-hw+.2,-.05,1.04,1.5,Z(1.4),Z(.75),.03,g3L("#a8814f"),0);G.bbox(.05,hw-.2,1.04,1.38,Z(1.2),Z(.5),.03,g3L("#8f6a3c"),0);if(k===2)G.cylZ(0,1.2,Z(.6),Z(.2),.16,10,g3L("#2c5d9b"),0,g3L("#2c5d9b"))}}
 if(o.firm&&sp.van){const txt=AVFIRM[(o.firm-1)%AVFIRM.length],d=decText(txt,AVFCOL[o.firm%AVFCOL.length],"800 54px "+COND,512,112,"#f4f5f7"),A=G.a,N0=A.length,xa=.75,xb=3.25,ya=1.08,yb=1.08+(xb-xa)*112/512,n=5,Q=[];for(const sd of[-1,1])for(let i=0;i<n;i++){const a=xa+(xb-xa)*i/n,b=xa+(xb-xa)*(i+1)/n,C=[[ya,a],[ya,b],[yb,b],[yb,a]].map(p=>{const x=avSx(A,N0,sd,hw,p[0],Z(p[1]));return x==null?null:[sd*(x+.01),p[0],Z(p[1])]});if(C.some(p=>!p))continue;const f=k=>d[0]+(d[2]-d[0])*(sd>0?k/n:1-k/n),u0=f(i),u1=f(i+1),uv=[[u0,d[3]],[u1,d[3]],[u1,d[1]],[u0,d[1]]];Q.push(sd>0?[C[0],C[1],C[2],C[3],uv]:[C[1],C[0],C[3],C[2],[uv[1],uv[0],uv[3],uv[2]]])}for(const q of Q)G.quad(q[0],q[1],q[2],q[3],[1,1,1],14,q[4])}}

/* krok 13: ziara svetiel v noci a v dazdi, vodna triest, vyfukovy dym starych aut */
function avNight(sh,ga,now){const N=G3.N||0,wx=sh.wx,L=Math.max(N,wx==="rain"||wx==="storm"||wx==="fog"||wx==="snow"?.45:0);if(L<.3)return;const hp=sh.hp,T=hTer(),D=sh.dv;
 const one=(x,z,a,sp,y,far,df,dr)=>{const ca=Math.cos(a),sa=Math.sin(a),hl=sp.len/2+.06,big=sp.truck||sp.bus,lat=sp.moto?0:big?1:.62,fy=y+(sp.fy||(big?1.1:.75)),ty=y+(sp.ty||(big?1:.95));if(far||sp.moto){ga.push(x+ca*hl,fy,z+sa*hl,1,.95,.8,L*.9,.9);ga.push(x-ca*hl,ty,z-sa*hl,1,.08,.05,L*.6,.55);return}for(const s of[-1,1]){if(!(df>1&&s===1))ga.push(x+ca*hl-sa*lat*s,fy,z+sa*hl+ca*lat*s,1,.95,.8,L*.7,.55);if(!(dr>1&&s===-1))ga.push(x-ca*hl-sa*lat*s,ty,z-sa*hl+ca*lat*s,1,.08,.05,L*.55,.42)}};
 const near=[];for(const c of sh.cars){if(c.park||c.kind==="traktor")continue;const dx=c.x-hp.x,dy=c.y-hp.y,d=dx*dx+dy*dy;if(d<62500)near.push([d,c])}near.sort((p,q)=>p[0]-q[0]);
 for(const[d,c]of near.slice(0,36))one(c.x,c.y,c.a,avSp(c),T(c.x,c.y)+(c.e3||0),d>8100,avDL(c.avDf),avDL(c.avDr));
 if(sh.drv&&D){const sp=SPECS[copCar().type];if(sp)one(hp.x,hp.y,sh.fl.hd,sp,T(hp.x,hp.y)+(D.el||0),false,avDL(D.dmF||0),avDL(D.dmR||0))}}
function avSpray(sh,gl2,now){if(!gl2)return;const hp=sh.hp,T=hTer(),D=sh.dv,wx=sh.wx,wet=wx==="rain"||wx==="storm"||(G3.wet||0)>.3;
 const tail=(x,z,a,sp,y,v,id,kind)=>{const ca=Math.cos(a),sa=Math.sin(a),hl=sp.len/2,n=3;for(let k=0;k<n;k++){const u=(now*(kind?.8:1.5)+k/n+id*.37)%1,b=hl+.2+u*(kind?1.6:Math.min(5,v*.22)),sc=kind?.3+u*.9:.45+u*1.3,l=kind?.45:(k%2?.55:-.55);gl2.push({m:avPuff(kind?(u<.4?0:u<.7?1:2):(u<.3?0:u<.6?1:2),kind?2:3),M:M4.trs(x-ca*b-sa*l,y+(kind?.32+u*.9:.25+u*.55),z-sa*b+ca*l,u*3+k,sc,sc*.7,sc)})}};
 for(const c of sh.cars){if(c.park||c.kind==="traktor")continue;const dx=c.x-hp.x,dy=c.y-hp.y,d=dx*dx+dy*dy;if(d>8100)continue;const v=c.v||0,sp=avSp(c),y=T(c.x,c.y)+(c.e3||0);if(wet&&v>8)tail(c.x,c.y,c.a,sp,y,v,c.id||1,0);else if(d<3600&&v>.4&&v<7&&c.avo&&avPP(c.avo)[1]>0&&(c.avAc||0)>.3)tail(c.x,c.y,c.a,sp,y,v,c.id||1,1)}
 if(wet&&sh.drv&&D&&D.v>8&&!D.off){const sp=SPECS[copCar().type];if(sp)tail(hp.x,hp.y,sh.fl.hd,sp,T(hp.x,hp.y)+(D.el||0),D.v,0,0)}}

/* krok 14: tvar karoserie - vystupene blatniky */
function avFl(sp,x,y,arR,wy){let f=0;for(const w of sp.wh){const d=Math.abs(x-w),R=arR+.22;if(d<R){const a=Math.cos(d/R*Math.PI/2),top=wy+arR+.08,yy=y<=top?1:Math.max(0,1-(y-top)/.3);f=Math.max(f,.048*a*a*yy)}}return f}

/* krok 15: predok a zadok ako modelovane diely - narazniky, hmlovky, ramy svetiel a masky, hrana kufra */
function avFace(r,sp,o){if(!sp.body||sp.truck||sp.bus||sp.moto||sp.tractor||sp===SPECS.fire||o.lod)return;const FF=r.geo.avF,FR=r.geo.avR,LD=FF?FF.D:0;if(FF)avPocket(r.geo,FF,1);if(FR)avPocket(r.geo,FR,-1);const G=r.geo,L=sp.len,Z=x=>L/2-x,st=carStyle(o,sp),ch=sp.body.slice(1,-1),bot=sp.body[0][1],x0=ch[0][0],x1=ch[ch.length-1][0],W3=sp.win,belt=W3?W3[0][1]:1,hw0=(sp.van?2:sp.clad||sp.bed?1.95:1.84)*(o.police?1:st.wk)/2,cw=FF?FF.cw:hw0*.78,rw=hw0*.83,fz=Z(x1)-.006,rz=Z(x0)+.006,fy=sp.fy||.8,gy0=fy-.3,gy1=fy-.04,col=g3L(o.color||"#9aa3ad"),dark=PCOL.dark,plast=PCOL.plast,chrome=PCOL.chrome,wht=PCOL.white,red=PCOL.red,bc=sp.clad?plast:col,bm=sp.clad?0:1,grC=st.lux||st.sport?chrome:g3L("#2a2d33");
 /* predny naraznik */
 const ft=Math.max(bot+.13,gy0-.035),zf=fz-.075;if(ft-bot>.1){G.bbox(-cw*1.05,cw*1.05,bot-.005,ft,zf,fz+.14,.055,bc,bm,{smooth:true});const q=(xa,xb,ya,yb,c,m,d)=>G.quad([xa,ya,zf-(d||.004)],[xb,ya,zf-(d||.004)],[xb,yb,zf-(d||.004)],[xa,yb,zf-(d||.004)],c,m),it=ft-.055,ib=bot+.035;if(it-ib>.04){q(-cw*.56,cw*.56,ib,it,dark,3);const n=Math.max(1,Math.round((it-ib)/.045));for(let k=1;k<n;k++){const y=ib+(it-ib)*k/n;G.box(-cw*.54,cw*.54,y-.006,y+.006,zf-.012,zf,st.gr==="mesh"||st.gr==="big"?grC:plast,st.gr==="mesh"||st.gr==="big"?9:0)}}
  [-1,1].forEach(s=>{const fx=s*cw*.8,fyy=(ib+it)/2;G.box(fx-.085,fx+.085,fyy-.04,fyy+.04,zf-.006,zf,dark,0);q(fx-.06,fx+.06,fyy-.022,fyy+.022,wht,2,.009);G.box(fx-.07,fx+.07,fyy+.026,fyy+.034,zf-.014,zf,st.lux?chrome:plast,st.lux?9:0)});
  if(st.sport)G.bbox(-cw*1.02,cw*1.02,bot-.02,bot+.02,zf-.035,zf+.06,.012,dark,0);
  for(const p of r.plates||[])if(p.front)p.z=zf-.009}
 /* ramy svetlometov a masky */
 const HL=st.hl,yA=fy-(HL==="slim"?.05:HL==="round"||HL==="twin"?.1:.11),yB=fy+(HL==="slim"?.04:.06);[-1,1].forEach(s=>{const a=s*cw*.4,b=s*cw*.985,lo=Math.min(a,b),hi=Math.max(a,b);G.box(lo,hi,yB,yB+.022,fz-.045,fz+.04,col,1);G.box(lo,hi,yA-.016,yA,fz-.03,fz+.03,dark,0);G.box(s>0?lo:hi-.012,s>0?lo+.012:hi,yA,yB,fz-.03,fz+.03,dark,0)});
 if(HL!=="round"&&HL!=="twin")[-1,1].forEach(s=>{const yc=(yA+yB)/2,rr=Math.min(.042,(yB-yA)*.36);for(const k of[.58,.8]){const x=s*cw*k;G.cylZ(x,yc,fz-.03+LD,fz-.005+LD,rr,12,chrome,9,chrome);G.cylZ(x,yc,fz-.032+LD,fz-.03+LD,rr*.72,10,wht,13,wht)}});if(FF)for(const k of FF.pk)if(k.k==="lamp"){const z=FF.z-.003;G.quad([k.x0,k.y0,z],[k.x1,k.y0,z],[k.x1,k.y1,z],[k.x0,k.y1,z],[.5,.56,.62],45)}if(FF)avLampShape(G,FF,st.hl);
 {const yt2=sp.body[1]?sp.body[1][1]:belt,a0=Math.min(belt-.3,yt2-.25),a1=Math.min(belt-.1,yt2-.06);if(a1-a0>.06)[-1,1].forEach(s=>{const lo=Math.min(s*rw*.5,s*rw*.985),hi=Math.max(s*rw*.5,s*rw*.985),fc=g3L("#1a1b1e");G.box(lo,hi,a1-.012,a1,rz-.01,rz+.022,fc,0);G.box(lo,hi,a0,a0+.012,rz-.01,rz+.022,fc,0);G.box(s>0?lo:hi-.012,s>0?lo+.012:hi,a0,a1,rz-.01,rz+.022,fc,0);for(let k=1;k<3;k++){const y=a0+(a1-a0)*k/3;G.box(lo+.012,hi-.012,y-.003,y+.003,rz,rz+.012,[.25,.02,.02],0)}})}
 if(st.gr==="wide"||st.gr==="mesh"||!["blank","slim","shield","big","split","slots","wide","mesh"].includes(st.gr)){G.box(-cw*.39,cw*.39,gy1,gy1+.014,fz-.035,fz+.02,chrome,9);G.box(-cw*.39,cw*.39,gy0-.014,gy0,fz-.035,fz+.02,chrome,9);for(const s of[-1,1])G.box(s*cw*.39-.007,s*cw*.39+.007,gy0,gy1,fz-.035,fz+.02,chrome,9)}
 /* zadny naraznik */
 const yt=sp.body[1]?sp.body[1][1]:belt,ty0=Math.min(belt-.3,yt-.25),ty1=Math.min(belt-.1,yt-.06),rt=Math.min(bot+.28,ty0-.04),zr=rz+.075;if(rt-bot>.1){G.bbox(-rw*1.06,rw*1.06,bot-.005,rt,rz-.14,zr,.055,bc,bm,{smooth:true});const q=(xa,xb,ya,yb,c,m,d)=>G.quad([xb,ya,zr+(d||.004)],[xa,ya,zr+(d||.004)],[xa,yb,zr+(d||.004)],[xb,yb,zr+(d||.004)],c,m);q(-rw*.7,rw*.7,bot+.01,bot+.085,st.sport?dark:plast,st.sport?3:0);q(-.3,.3,bot+.13,Math.min(rt-.02,bot+.29),g3Mix(bc,[0,0,0],.25),bm,.003);[-1,1].forEach(s=>{q(s*rw*.86-.07,s*rw*.86+.07,bot+.11,bot+.14,red,0,.006);if(!st.ev&&(st.sport||s>0||st.lux)){const ex=s*rw*(st.sport?.5:.62);G.cylZ(ex,bot+.05,zr-.03,zr+.045,st.sport?.045:.038,10,chrome,9,dark);if(st.sport)G.cylZ(ex+s*.11,bot+.05,zr-.03,zr+.045,.045,10,chrome,9,dark)}});for(const p of r.plates||[])if(!p.front)p.z=zr+.011}
 if(ty1>ty0)G.box(-rw*.99,rw*.99,ty1,ty1+.02,rz-.03,rz+.04,col,1);
 /* obrys piatych dveri na zadnom cele (auta bez stupnoviteho kufra) */
 if(W3&&!sp.bed&&!sp.cab&&W3[0][0]-x0<=.6&&rt-bot>.1){const bk=[.012,.012,.014],z=rz+.003,yb=rt+.018,yt2=yt-.03,q=(xa,xb,ya,yb2)=>G.quad([xb,ya,z],[xa,ya,z],[xa,yb2,z],[xb,yb2,z],bk,0);if(yt2-yb>.2){q(-rw*.9,rw*.9,yb,yb+.012);for(const s of[-1,1]){const x=s*rw*.455;q(x-.006,x+.006,yb,yt2)}G.box(-.09,.09,yb+.05,yb+.075,rz,rz+.022,sp.van?plast:chrome,sp.van?0:9)}}
 /* stierace: rameno a lista na spodku celneho skla */
 if(W3){const wz=Z(W3[3][0])-.025,wy=belt+.062,bk=[.02,.02,.024];for(const p of[-.56,.04]){const a=[p,wy,wz+.004],b=[p+.5,wy+.035,wz+.05];G.limb(a,b,.011,.008,5,bk,0);G.limb([p+.14,wy+.016,wz+.012],[p+.54,wy+.045,wz+.056],.016,.016,4,bk,0);G.cyl(p,wz+.004,wy-.02,wy+.012,.022,.022,6,bk,0)}}}

/* krok 16: kolesa - zaoblena pneumatika s dezenom, hlbsi disk, luce s hrubkou, brzdovy kotuc */
function avWheel(kind){G3.avWh=G3.avWh||new Map;let m=G3.avWh.get(kind);if(m)return m;const G=new Geo,seg=16,TAU=6.2832,P=(x,a,r)=>[x,Math.cos(a)*r,Math.sin(a)*r],tyre=g3L("#101114"),tread=g3L("#1f2023"),wall=g3L("#17181b"),
 rimC=kind==="dark"||kind==="black"?g3L("#2e3137"):kind==="cap"?g3L("#9aa1a9"):kind==="chrome"?g3L("#e3e7ec"):g3L("#c3c9d0"),rimD=g3Mix(rimC,[0,0,0],.5),steel=g3L("#70757d"),hubC=g3L("#2a2d33");
 const ring=(x0,r0,x1,r1,c,mt)=>{for(let i=0;i<seg;i++){const a0=i/seg*TAU,a1=(i+1)/seg*TAU;G.quad(P(x0,a0,r0),P(x1,a0,r1),P(x1,a1,r1),P(x0,a1,r0),c,mt)}},fan=(x,r,xc,c,mt,n)=>{n=n||seg;for(let i=0;i<n;i++){const a0=i/n*TAU,a1=(i+1)/n*TAU;G.tri(P(x,a0,r),P(x,a1,r),[xc,0,0],c,mt)}};
 for(const s of[-1,1]){const xr=s*.455,xh=s*.4,xb=s*.27;
  ring(s*.2,.2,s*.2,.57,steel,9);fan(s*.2,.2,s*.26,hubC,9,10);
  if(kind==="cap"){for(let i=0;i<seg;i++){const a0=i/seg*TAU,a1=(i+1)/seg*TAU;G.tri(P(s*.47,a0,.655),P(s*.47,a1,.655),[s*.52,0,0],i%2?rimC:g3Mix(rimC,[0,0,0],.12),9)}for(let k=0;k<10;k++){const a=k/10*TAU;G.quad(P(s*.487,a-.09,.46),P(s*.487,a+.09,.46),P(s*.479,a+.07,.57),P(s*.479,a-.07,.57),[.02,.02,.025],0)}G.cylX(s*.5,s*.535,0,0,.07,8,hubC,9)}
  else{const pairs=kind==="dark"||kind==="black",ns=kind==="mesh"?10:pairs?10:5,sw=kind==="mesh"?.085:pairs?.06:.19;for(let k=0;k<ns;k++){const a=pairs?(Math.floor(k/2)/5*TAU+(k%2?.13:-.13)):k/ns*TAU,h1=sw*.55,h2=sw*.36,A=P(xh,a-h1,.17),B=P(xh,a+h1,.17),C=P(xr,a+h2,.648),D=P(xr,a-h2,.648),Ab=P(xb,a-h1,.17),Bb=P(xb,a+h1,.17),Cb=P(xb,a+h2,.63),Db=P(xb,a-h2,.63);G.quad(A,B,C,D,rimC,9);G.quad(A,D,Db,Ab,rimD,9);G.quad(B,C,Cb,Bb,rimD,9)}
   fan(xh,.18,s*.43,rimC,9,10);G.cylX(s*.42,s*.455,0,0,.065,8,hubC,9);for(let k=0;k<5;k++){const a=k/5*TAU+.3;G.cylX(s*.405,s*.43,Math.cos(a)*.115,Math.sin(a)*.115,.022,5,g3L("#d9dde2"),9)}}
  ring(s*.49,.7,s*.505,.675,rimC,9);ring(s*.505,.675,s*.47,.652,rimC,9);ring(s*.47,.652,s*.24,.6,rimD,9)}
 const s0=G.a.length/12;ring(-.36,1,.36,1,tread,0);for(const s of[-1,1]){ring(s*.36,1,s*.45,.972,tread,0);ring(s*.45,.972,s*.5,.9,wall,0);ring(s*.5,.9,s*.517,.8,wall,0);ring(s*.517,.8,s*.49,.7,wall,0)}G.smooth(s0,.9);
 for(const x of[-.2,0,.2])ring(x-.028,1.004,x+.028,1.004,tyre,0);for(const s of[-1,1])for(const a of[0,3.14]){G.quad(P(s*.52,a-.16,.79),P(s*.52,a+.16,.79),P(s*.513,a+.16,.87),P(s*.513,a-.16,.87),g3L("#34363a"),0)}
 m=g3Up(G);m.tris=G.a.length/36;G3.avWh.set(kind,m);return m}
{const w0=g3WheelM;g3WheelM=function(kind,cal){if(kind==="truck"||kind==="tractor"||kind==="moto"||G3.avWf)return w0.apply(this,arguments);try{return avWheel(kind||"5")}catch(e){if(!avWheel.w){avWheel.w=1;console.warn("avwheel",e)}return w0.apply(this,arguments)}}}

/* krok 17: skla a interier - opierky hlavy, zadne sedadla, stredova konzola, pristroje, displej, vnutorne zrkadlo, lem celneho skla, vyhrievanie zadneho skla */
function avSy(A,N0,gk,x,z){let best=null;for(let i=0;i+36<=N0;i+=36){if(A[i+9]!==3||A[i+6]!==gk[0]||A[i+7]!==gk[1])continue;const x0=A[i],z0=A[i+2],x1=A[i+12],z1=A[i+14],x2=A[i+24],z2=A[i+26],d=(z1-z2)*(x0-x2)+(x2-x1)*(z0-z2);if(Math.abs(d)<1e-9)continue;const u=((z1-z2)*(x-x2)+(x2-x1)*(z-z2))/d,v=((z2-z0)*(x-x2)+(x0-x2)*(z-z2))/d,w=1-u-v;if(u<-.001||v<-.001||w<-.001)continue;const y=u*A[i+1]+v*A[i+13]+w*A[i+25];if(best==null||y>best)best=y}return best}
function avInt(r,sp,o){const W3=sp.win;if(!W3||!sp.body||sp.truck||sp.bus||sp.moto||sp.tractor||sp===SPECS.fire||o.lod)return;const G=r.geo,A=G.a,N0=A.length,L=sp.len,Z=x=>L/2-x,st=carStyle(o,sp),pil=sp.pil||[],bot=sp.body[0][1],belt=W3[0][1],w0=r.wheels&&r.wheels[0],hw=(w0?Math.abs(w0.lat):.8)+.13,dark=g3L("#141517"),gk=PCOL.glassK,Q=[];
 /* skla */
 const strip=(za,zb,xw,n,c,dy)=>{for(let i=0;i<n;i++){const xa=-xw+2*xw*i/n,xb=-xw+2*xw*(i+1)/n,P=[[xa,za],[xb,za],[xb,zb],[xa,zb]].map(p=>{const y=avSy(A,N0,gk,p[0],p[1]);return y==null?null:[p[0],y+(dy||.007),p[1]]});if(P.every(p=>p))Q.push([P[0],P[1],P[2],P[3],c])}};
 const zfb=Z(W3[3][0]),zft=Z(W3[2][0]),zrt=Z(W3[1][0]),zrb=Z(W3[0][0]);
 if(zft-zfb>.25){strip(zfb+.015,zfb+.085,hw*.82,8,dark);strip(zft-.075,zft-.012,hw*.6,6,[.02,.03,.05])}
 if(zrb-zrt>.3&&!sp.van&&!sp.bed){for(let k=1;k<=5;k++){const z=zrt+(zrb-zrt)*(.15+k*.13);strip(z-.006,z+.006,hw*.5,6,[.09,.045,.025],.006)}strip(zrb-.07,zrb-.012,hw*.72,8,dark)}
 if(!o.empty){const ix0=W3[0][0]+.1,ix1=W3[3][0]-.05,iy2=bot+.25,sx=(pil.length?pil[0]:(ix0+ix1)/2)-.1,seatC=g3L(st.lux?"#5a4636":"#232428"),trim=g3L("#1c1d20"),top=Math.min(belt+.42,sp.h-.14),hrT=Math.min(top+.19,sp.h-.06);
  if(hrT-top>.08)for(const s of[-1,1]){G.bbox(s*.38-.115,s*.38+.115,top+.015,hrT,Z(sx-.06),Z(sx-.17),.04,seatC,0,{smooth:true});G.box(s*.38-.015,s*.38+.015,top-.02,top+.03,Z(sx-.1),Z(sx-.13),g3L("#8a9098"),9)}
  if(ix0<sx-.6){G.bbox(-hw*.74,hw*.74,iy2,iy2+.34,Z(ix0+.9),Z(ix0+.4),.06,seatC,0,{smooth:true});const rt=Math.min(belt+.3,sp.h-.2),rh=Math.min(rt+.16,sp.h-.07);if(rh-rt>.07)for(const s of[-1,1])G.bbox(s*.36-.11,s*.36+.11,rt+.01,rh,Z(ix0+.4),Z(ix0+.28),.04,seatC,0,{smooth:true})}
  G.bbox(-.1,.1,iy2,iy2+.3,Z(ix1-.36),Z(sx-.15),.03,trim,0);G.limb([0,iy2+.3,Z(ix1-.62)],[0,iy2+.42,Z(ix1-.66)],.014,.02,5,g3L("#0c0d0f"),0);
  const dt=belt+.02;G.bbox(-.38-.2,-.38+.2,dt-.02,dt+.06,Z(ix1-.22),Z(ix1-.39),.03,trim,0,{smooth:true});G.quad([-.38-.15,dt-.015,Z(ix1-.392)],[-.38+.15,dt-.015,Z(ix1-.392)],[-.38+.15,dt+.04,Z(ix1-.392)],[-.38-.15,dt+.04,Z(ix1-.392)],[.25,.5,.75],12);
  G.box(-.13,.13,belt-.13,dt+.02,Z(ix1-.385),Z(ix1-.4),g3L("#0c0d0f"),0);G.quad([-.115,belt-.115,Z(ix1-.402)],[.115,belt-.115,Z(ix1-.402)],[.115,dt+.005,Z(ix1-.402)],[-.115,dt+.005,Z(ix1-.402)],[.12,.3,.5],12);
  const mx=W3[2][0]-.2,my=W3[2][1]-.09;G.box(-.1,.1,my-.035,my+.03,Z(mx)-.012,Z(mx)+.012,g3L("#0c0d0f"),0);G.box(-.012,.012,my+.03,my+.09,Z(mx)-.01,Z(mx)+.02,g3L("#0c0d0f"),0)}
 for(const q of Q){G.quad(q[0],q[1],q[2],q[3],q[4],0);G.quad(q[3],q[2],q[1],q[0],q[4],0)}}

/* krok 18: volant ako veniec */
function avSteer(G,x,y0,z0,y1,z1){const c=g3L("#101113"),dy=y1-y0,dz=z1-z0,l=Math.hypot(dy,dz)||1,ny=dy/l,nz=dz/l,vy=nz,vz=-ny,R=.165,n=12;G.limb([x,y0,z0],[x,y1,z1],.03,.026,6,c,0);const P=a=>[x+Math.cos(a)*R,y1+Math.sin(a)*R*vy,z1+Math.sin(a)*R*vz];for(let i=0;i<n;i++)G.limb(P(i/n*6.2832),P((i+1)/n*6.2832),.017,.017,5,c,0);for(const a of[0,3.1416,-1.5708])G.limb([x,y1,z1],P(a),.013,.011,4,g3L("#1c1d20"),0);G.limb([x,y1-ny*.02,z1-nz*.02],[x,y1+ny*.015,z1+nz*.015],.05,.045,8,g3L("#1c1d20"),0)}

/* krok 19: karoseria z tvarovanych ploch */
/* zaobleny bocny profil: lomena ciara profilu sa vyhladi, hrany kapota-sklo-strecha-kufor su oble */
function avTop(f,x,x0,x1,sp){const w=sp.van?.07:sp.cab?.035:.15,c=v=>f(Math.min(x1,Math.max(x0,v)));return(c(x-w)+2*c(x-w/2)+3*c(x)+2*c(x+w/2)+c(x+w))/9}
/* bok: ostra hrana pod oknami, ramena nad kolesami, prelis dveri medzi kolesami */
function avSh(sp,st,x,y,x0,x1,bot,belt){const B=belt-bot,yc=belt-B*.3,ss=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)},fade=ss(.2,.85,Math.min(x-x0,x1-x));let d=0;
 const yl=bot+B*.32;if(y<=yc+1e-4)d+=(sp.van?.008:.014)*fade*Math.max(0,Math.min(1,(y-yl)/(yc-yl)));
 if(sp.van||!sp.wh||sp.wh.length<2)return d;
 const wr=sp.wh[0],wf=sp.wh[sp.wh.length-1],hy=ss(bot+B*.22,yc,y)*(1-.45*ss(yc,belt,y)),gr=Math.exp(-Math.pow((x-wr)/.52,2)),gf=Math.exp(-Math.pow((x-wf)/.5,2));
 const hf=.65+(st.h>>>17)%8*.11,wsk=.5+(st.h>>>20)%6*.2;d+=((st.sport?.04:.028)*gr+.02*gf)*hy*hf;
 const mid=(wr+wf)/2,half=(wf-wr)/2,u=(x-mid)/half;if(Math.abs(u)<1){const q=1-u*u,hy2=ss(bot+.1,bot+B*.45,y)*(1-ss(bot+B*.5,yc,y));d-=(st.sport?.026:.02)*q*q*hy2*wsk}
 return d}
/* kabina sa v podoryse zuzuje dopredu aj dozadu */
function avCab(sp,x){const W=sp.win;if(!W)return 1;const c=(W[0][0]+W[3][0])/2,h=(W[3][0]-W[0][0])/2,u=Math.max(-1.25,Math.min(1.25,(x-c)/h));return sp.van?1-.02*u*u:1-.055*u*u-(u<0?.035*u*u:0)}
/* predok a zadok su v podoryse oble: rohy sa stiahnu dozadu, siroke plochy sa predtym rozdelia */
function avBow(r,sp,o){let bFk=1,bRk=1;if(!sp.body||sp.truck||sp.bus||sp.moto||sp.tractor||sp===SPECS.fire||o.lod)return;const G=r.geo,w0=r.wheels&&r.wheels[0];if(!G||!w0)return;const hl=sp.len/2,hw=Math.abs(w0.lat)+.13,hwE=hw*.86,zone=sp.van?.4:.5,bF=sp.van?.08:.15,bR=sp.van?.05:.11,thr=.2,nz=.3;
 {const hm=avH(o.mk||"x"),k=.72+hm%7*.09;bFk=k;bRk=.8+(hm>>>4)%5*.1}const near=z=>hl-Math.abs(z)<nz;
 const sub=A0=>{let A=A0;for(let pass=0;pass<4;pass++){const O=[];let ch=0;for(let i=0;i+36<=A.length;i+=36){const P=[A.slice(i,i+12),A.slice(i+12,i+24),A.slice(i+24,i+36)];const sp2=[0,1,2].map(k=>{const a=P[k],b=P[(k+1)%3];return Math.abs(a[0]-b[0])>thr&&(near(a[2])||near(b[2]))});
    if(!sp2[0]&&!sp2[1]&&!sp2[2]){for(let k=0;k<36;k++)O.push(A[i+k]);continue}ch=1;
    const M=[0,1,2].map(k=>{if(!sp2[k])return null;const a=P[k],b=P[(k+1)%3],m=[];for(let q=0;q<12;q++)m[q]=(a[q]+b[q])/2;const l=Math.hypot(m[3],m[4],m[5])||1;m[3]/=l;m[4]/=l;m[5]/=l;m[9]=a[9];return m});
    const T=(a,b,c)=>{for(const v of[a,b,c])for(let q=0;q<12;q++)O.push(v[q])},n=sp2.filter(Boolean).length;
    if(n===3){T(P[0],M[0],M[2]);T(M[0],P[1],M[1]);T(M[2],M[1],P[2]);T(M[0],M[1],M[2])}
    else if(n===1){const k=sp2.indexOf(true),a=P[k],b=P[(k+1)%3],c=P[(k+2)%3];T(a,M[k],c);T(M[k],b,c)}
    else{const k=sp2.indexOf(false),a=P[k],b=P[(k+1)%3],c=P[(k+2)%3],mb=M[(k+1)%3],mc=M[(k+2)%3];T(a,b,mb);T(a,mb,mc);T(mc,mb,c)}}
   A=O;if(!ch)break}return A};
 const warp=A=>{for(let i=0;i+12<=A.length;i+=12){const x=A[i],z=A[i+2],d=hl-Math.abs(z);if(d>=zone)continue;const s=z<0?-1:1,bow=z<0?bF*bFk:bR*bRk,t=1-Math.max(0,d)/zone,w=t*t*(3-2*t),rr=Math.min(1.1,Math.abs(x)/hwE),g=bow*Math.pow(rr,2.6),gp=rr<1.1?2.6*bow*Math.pow(rr,1.6)/hwE*(x<0?-1:1):0,b=1-g*6*t*(1-t)/zone,a=-s*gp*w;
   A[i+2]=z-s*g*w;const nx=A[i+3]-a/b*A[i+5],ny=A[i+4],nz=A[i+5]/b,l=Math.hypot(nx,ny,nz)||1;A[i+3]=nx/l;A[i+4]=ny/l;A[i+5]=nz/l}};
 const A=sub(G.a);if(A!==G.a){G.a.length=0;for(let i=0;i<A.length;i++)G.a.push(A[i])}warp(G.a);
 if(G.gl&&G.gl.a&&G.gl.a.length){const B=sub(G.gl.a);if(B!==G.gl.a){G.gl.a.length=0;for(let i=0;i<B.length;i++)G.gl.a.push(B[i])}warp(G.gl.a)}}

/* krok 20: vlastna silueta pre kazdy model - profil typu karoserie sa pre model jemne pretvori */
function avH(s){let h=7;for(let i=0;i<s.length;i++)h=h*31+s.charCodeAt(i)>>>0;return h}
const AVVC=new Map;
function avVar(sp,o){if(!sp||!sp.body||!sp.win||sp.truck||sp.bus||sp.moto||sp.tractor||sp===SPECS.fire||!o||!o.mk)return null;const key=Object.keys(SPECS).find(k=>SPECS[k]===sp)+"|"+o.mk+(o.police?"|p":"");if(AVVC.has(key))return AVVC.get(key);
 const hm=avH(o.mk),hb=avH(o.mk.split(" ")[0]),rn=(h,i)=>(Math.imul(h^Math.imul(i+1,0x9E3779B1),2654435761)>>>0)/4294967296*2-1,R=i=>{const v=.65*rn(hm,i)+.35*rn(hb,i);return Math.sign(v)*Math.pow(Math.abs(v),.55)};
 const W=sp.win,B=sp.body,bot=B[0][1],belt=W[0][1],h=sp.h,x0=B[1][0],x1=B[B.length-2][0],ss=(a,b,v)=>{if(b-a<1e-6)return v>=b?1:0;const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)};
 const van=!!sp.van,bed=!!sp.bed,low=sp===SPECS.coupe||sp===SPECS.sport,trunk=W[0][0]-x0>.6;
 let dc=R(0)*.1,dr=R(1)*.2,dw=R(2)*.1,dh=R(3)*.05,db=R(4)*.045,dn=R(5)*.05,dt=R(6)*.06;
 if(van){dc=dr=dw=db=dt=0;dn*=.5;dh*=.8}if(sp.cab){dc=dr=dw=db=0;dh*=.5;dn*=1.3;dt*=1.3}if(bed){dc=dr=dt=db=0}if(!trunk){dc*=.6;dt=0}if(low)dh*=.6;if(o.police)dh=0;
 const cabC=(W[0][0]+W[3][0])/2,wp=p=>{const x=p[0],y=p[1],rf=ss(belt+.05,h-.06,y),rear=1-ss(W[1][0]+.05,cabC,x),front=ss(cabC,W[2][0]-.05,x),cab=ss(Math.max(x0,W[0][0]-.5),W[0][0],x)*(1-ss(W[3][0],Math.min(x1,W[3][0]+.5),x)),mid=ss(bot+.3,belt-.06,y)*(1-ss(belt+.04,h-.08,y)),m2=ss(bot+.15,bot+.4,y)*(1-rf),fr=ss(W[3][0]+.1,x1-.1,x),rr=trunk?1-ss(x0+.1,W[0][0]-.1,x):0;
  const q=p.slice();q[0]=x+dc*cab-dr*rf*rear+dw*rf*front;q[1]=y+dh*rf+db*mid+dn*fr*m2+dt*rr*m2;return q};
 const body=B.map((p,i)=>i===0||i===B.length-1?p.slice():wp(p));for(let i=1;i<body.length-1;i++){body[i][0]=Math.min(x1,Math.max(x0,body[i][0]));if(i>1)body[i][0]=Math.max(body[i][0],body[i-1][0])}
 const win=W.map(wp);win[0][1]=win[3][1]=belt+db;for(let i=1;i<4;i++)win[i][0]=Math.max(win[i][0],win[i-1][0]+.1);
 const V={body,win,pil:(sp.pil||[]).map(x=>x+dc),h:h+dh,fy:(sp.fy||.8)+dn,_rr:undefined};AVVC.set(key,V);return V}

/* krok 21: zapustene svetla a maska */
/* celo (ci=1) alebo zad (ci=0) auta ako mriezka: v obdlznikoch svetiel a masky je plocha zatlacena dovnutra */
function avFascia(G,sp,st,Rr,P,z,ci,col,ys,bot,belt){if(sp.truck||sp.bus||sp.moto||sp.tractor)return false;const pk=[],e=.012,front=ci===1;let cw=0;
 if(front){const fy=sp.fy||.8,cwI=Math.max(0,ys.findIndex(y=>y>=fy-.05)),HL=st.hl,yA=fy-(HL==="slim"?.05:HL==="round"||HL==="twin"?.1:.11),yB=fy+(HL==="slim"?.04:.06),gy0=fy-.3,gy1=fy-.04,GR=st.gr;cw=(Rr.lw[cwI]||Rr.lw[2])*.93;
  for(const s of[-1,1])pk.push({k:"lamp",x0:Math.min(s*cw*.4,s*cw*.985),x1:Math.max(s*cw*.4,s*cw*.985),y0:yA,y1:yB,D:.045});
  if(GR==="big")pk.push({k:"gr",x0:-cw*.385,x1:cw*.385,y0:bot+.13,y1:gy1+.02,D:.04});else if(GR==="shield")pk.push({k:"gr",x0:-cw*.345,x1:cw*.345,y0:gy0,y1:gy1,D:.04});else if(GR==="split")for(const s of[-1,1])pk.push({k:"gr",x0:Math.min(s*cw*.045,s*cw*.305),x1:Math.max(s*cw*.045,s*cw*.305),y0:gy0+.03,y1:gy1,D:.04});else if(GR==="slots"){for(let q=-2;q<=2;q++)pk.push({k:"gr",x0:q*cw*.13-cw*.04-.002,x1:q*cw*.13+cw*.04+.002,y0:gy0,y1:gy1,D:.035})}else if(GR==="slim")pk.push({k:"gr",x0:-cw*.385,x1:cw*.385,y0:fy-.06,y1:fy+.02,D:.03});else if(GR==="blank")pk.push({k:"gr",x0:-cw*.455,x1:cw*.455,y0:gy0-.02,y1:gy0+.04,D:.02});else pk.push({k:"gr",x0:-cw*.385,x1:cw*.385,y0:gy0,y1:gy1,D:.04})}
 else{const rw=Rr.lw[Math.max(1,ys.length-3)]||Rr.lw[1],ty0=Math.min(belt-.3,Rr.yt-.25),ty1=Math.min(belt-.1,Rr.yt-.06);if(ty1-ty0<.06)return false;cw=rw;for(const s of[-1,1])pk.push({k:"tail",x0:Math.min(s*rw*.48,s*rw*.99),x1:Math.max(s*rw*.48,s*rw*.99),y0:ty0,y1:ty1,D:.022})}
 const n=(P.length+1)/2,C=P.slice(0,n).map(p=>[Math.abs(p[0]),p[1]]),yT=C[n-1][1],yBt=C[0][1];
 const wAt=y=>{if(y>=yT)return 0;for(let i=0;i<n-1;i++){const a=C[i],b=C[i+1];if(y<=b[1]+1e-9){const d=b[1]-a[1];return d<1e-6?Math.max(a[0],b[0]):a[0]+(b[0]-a[0])*Math.max(0,(y-a[1])/d)}}return 0};
 const wMax=Math.max(...C.map(p=>p[0]));for(const k of pk){if(k.k==="tail"){const lim=Math.min(wAt(k.y0),wAt(k.y1))-.006;if(k.x1>lim){k.x1=lim;k.tol=.03}if(k.x0<-lim){k.x0=-lim;k.tol=.03}if(k.x1-k.x0<.15)k.off=1}if(k.y1>yT-.02||k.y0<yBt+.02||Math.max(-k.x0,k.x1)>Math.min(wAt(k.y0),wAt(k.y1))-.004)k.off=1}
 const act=pk.filter(k=>!k.off);let Y=C.map(p=>p[1]),X=[0,wMax+.02,-wMax-.02];for(const k of act){Y.push(k.y0,k.y0+e,k.y1-e,k.y1);X.push(k.x0,k.x0+e,k.x1-e,k.x1)}
 for(let x=.13;x<wMax;x+=.13)X.push(x,-x);const uq=A=>{A.sort((a,b)=>a-b);const o=[];for(const v of A)if(!o.length||v-o[o.length-1]>.004)o.push(v);return o};Y=uq(Y);{const Y2=[];for(let i=0;i<Y.length;i++){Y2.push(Y[i]);if(i<Y.length-1){const g=Y[i+1]-Y[i],m=Math.ceil(g/.07);for(let q=1;q<m;q++)Y2.push(Y[i]+g*q/m)}}Y=Y2}X=uq(X);
 const dep=(x,y)=>{let d=0;for(const k of act){const fx=Math.min((x-k.x0)/e,(k.x1-x)/e),fy2=Math.min((y-k.y0)/e,(k.y1-y)/e),f=Math.max(0,Math.min(1,Math.min(fx,fy2)));if(f>0)d=Math.max(d,k.D*f)}return d},sg=front?1:-1;
 const V=Y.map(y=>{const w=wAt(y);return X.map(x=>{const xc=Math.max(-w,Math.min(w,x));return[xc,y,z+sg*dep(xc,y)]})});
 const refl=[.42,.44,.47],wall=[.05,.05,.06],grf=[.015,.015,.018],tlf=[.1,.01,.01];
 for(let j=0;j<Y.length-1;j++)for(let i=0;i<X.length-1;i++){const a=V[j][i],b=V[j][i+1],c=V[j+1][i+1],d=V[j+1][i];if(Math.abs(a[0]-b[0])<1e-5&&Math.abs(c[0]-d[0])<1e-5)continue;const mx=(a[0]+b[0]+c[0]+d[0])/4,my=(Y[j]+Y[j+1])/2;let cc=col,m=1;
   for(const k of act){if(mx>k.x0&&mx<k.x1&&my>k.y0&&my<k.y1){const inner=mx>k.x0+e&&mx<k.x1-e&&my>k.y0+e&&my<k.y1-e;if(!inner){cc=wall;m=0}else if(k.k==="lamp"){cc=refl;m=9}else if(k.k==="gr"){cc=grf;m=0}else{cc=tlf;m=0}}}
   if(front)G.quad(a,b,c,d,cc,m);else G.quad(b,a,d,c,cc,m)}
 G[front?"avF":"avR"]={pk:act,cw,z,yt:Rr.yt,D:act.length&&act[0].k==="lamp"?act[0].D:0};return true}
/* detaily nakreslene na povodnej rovine cela sa zatlacia na dno priehlbin; tmave sklo svetlometu sa odstrani */
function avPocket(G,F,sg){const A=G.a,z=F.z,dk=PCOL.dark;for(let i=0;i+36<=A.length;i+=36){const zs=[A[i+2],A[i+14],A[i+26]];if(zs.some(v=>sg>0?v>z+.0005||v<z-.07:v<z-.0005||v>z+.07))continue;const cx=(A[i]+A[i+12]+A[i+24])/3,cy=(A[i+1]+A[i+13]+A[i+25])/3;
  for(const k of F.pk){if(cx<=k.x0+.001||cx>=k.x1-.001||cy<=k.y0+.001||cy>=k.y1-.001)continue;let ok=true;const tl=k.tol||1e-4;for(let v=0;v<3;v++){const x=A[i+v*12],y=A[i+v*12+1];if(x<k.x0-tl||x>k.x1+tl||y<k.y0-1e-4||y>k.y1+1e-4)ok=false}if(!ok)continue;
   if(k.k==="lamp"&&A[i+9]===3&&Math.abs(A[i+6]-dk[0])<1e-4&&Math.abs(A[i+7]-dk[1])<1e-4){for(let v=1;v<3;v++){A[i+v*12]=A[i];A[i+v*12+1]=A[i+1];A[i+v*12+2]=A[i+2]}}else for(let v=0;v<3;v++)A[i+v*12+2]+=sg*k.D;break}}}

/* krok 22: skary a diely karoserie - kapota, kufor, zlaby strechy, spodok dveri, svy naraznikov, lozka klucok, trysky */
function avPanel(G,sp,st,o,E){if(sp.truck||sp.bus||sp.moto||sp.tractor||!E.W3)return;const{ring,latAt,sideQ,seam,Z,x0,x1,bot,belt,W3,pil,arR,archY,NU,xs}=E,bk=[.012,.012,.014],R=new Map,rg=x=>{let r=R.get(x);if(!r){r=ring(x);R.set(x,r)}return r};
 /* bod na hornej ploche v stanici x: f = podiel polsirky hrany (0 stred, 1 hrana) */
 const at=(x,f,s)=>{const r=rg(x),e=r.up[NU][0],ye=r.up[NU][1],c=r.crown,a=Math.abs(f),y=a>=.5?ye+(c-ye)*.75*(1-a)/.5:ye+(c-ye)*(.75+.25*(.5-a)/.5);return[s*a*e,y+.006,Z(x)]};
 const lerp=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t];
 const pt=(x,f,s)=>{let i=0;while(i<xs.length-2&&xs[i+1]<x)i++;const a=xs[i],b=xs[i+1];if(b-a<1e-6)return at(a,f,s);return lerp(at(a,f,s),at(b,f,s),Math.max(0,Math.min(1,(x-a)/(b-a))))};
 /* pozdlzna skara na hornej ploche od xa po xb */
 const lon=(xa,xb,f,w)=>{const S=[xa,...xs.filter(x=>x>xa+.01&&x<xb-.01),xb];for(const s of[-1,1])for(let i=0;i<S.length-1;i++){const p=pt(S[i],f,s),q=pt(S[i+1],f,s);G.quad([p[0]-w/2,p[1],p[2]],[p[0]+w/2,p[1],p[2]],[q[0]+w/2,q[1],q[2]],[q[0]-w/2,q[1],q[2]],bk,0)}};
 /* priecna skara v stanici x medzi -f a f */
 const tra=(x,f,w)=>{const F=[-f,-.5,0,.5,f];for(let i=0;i<F.length-1;i++){const s0=F[i]<0?-1:1,s1=F[i+1]<0?-1:1,p=pt(x,F[i],s0),q=pt(x,F[i+1],s1);G.quad([p[0],p[1],p[2]-w/2],[q[0],q[1],q[2]-w/2],[q[0],q[1],q[2]+w/2],[p[0],p[1],p[2]+w/2],bk,0)}};
 const hoodA=W3[3][0]+.07,hoodB=x1-.17;if(hoodB-hoodA>.35){lon(hoodA,hoodB,.86,.012);tra(hoodB,.86,.012);tra(hoodA-.02,.9,.02);
  for(const s of[-1,1]){const p=pt(hoodA+.12,.42,s);G.box(p[0]-.03,p[0]+.03,p[1]-.004,p[1]+.012,p[2]-.012,p[2]+.012,bk,0)}
  if(st.sport)for(const s of[-1,1]){const xa=hoodA+(hoodB-hoodA)*.35,xb=hoodA+(hoodB-hoodA)*.6;for(let k=0;k<3;k++){const p=pt(xa+(xb-xa)*k/3,.5,s),q=pt(xa+(xb-xa)*(k+.5)/3,.5,s);G.quad([p[0]-.07,p[1]+.002,p[2]],[p[0]+.07,p[1]+.002,p[2]],[q[0]+.07,q[1]+.002,q[2]],[q[0]-.07,q[1]+.002,q[2]],bk,0)}}}
 if(!sp.bed&&W3[0][0]-x0>.6){const ta=x0+.12,tb=W3[0][0]-.06;if(tb-ta>.25){lon(ta,tb,.86,.012);tra(tb,.88,.014);tra(ta,.86,.012)}}
 if(!sp.bed){const ra=W3[1][0]+.06,rb=W3[2][0]-.06;if(rb-ra>.5)lon(ra,rb,.82,.016)}
 /* bok: spodna hrana dveri, svy naraznikov, lozka klucok */
 const fF=Math.min(x1-.9,W3[3][0]+.08),bP=pil.length?pil[0]:null,rE=pil.length>1?pil[1]-.05:sp.van?null:W3[0][0]+.35,dA=rE!=null&&rE<(bP||fF)-.4?rE:bP||W3[0][0]+.4,yd=bot+.115;
 for(const s of[-1,1]){if(fF-dA>.5){const a=Math.max(dA,sp.wh[0]+arR+.06),b=Math.min(fF,sp.wh[sp.wh.length-1]-arR-.06);if(b-a>.3)sideQ(a,b,yd,yd+.01,bk,0,null,.005,s)}
  const fx=x1-.4,rx=x0+.4,fy=sp.fy||.8;if(fx>sp.wh[sp.wh.length-1]+arR*.5)seam(fx,Math.max(bot+.1,archY(fx)+.02),fy-.13,s);if(rx<sp.wh[0]-arR*.5)seam(rx,Math.max(bot+.1,archY(rx)+.02),Math.min(belt-.32,rg(x0).yt-.28),s);
  [[bP||rE||W3[0][0]+.4,fF],[rE,bP]].forEach(([r,f])=>{if(r==null||f==null||f-r<.5||st.ev)return;const hx=r+.2,hy=belt-.13;sideQ(hx-.025,hx+.165,hy-.034,hy+.03,[.03,.03,.035],0,null,.0045,s)})}}

/* krok 23: nove typy vozidiel - kabriolet, pikap v premavke, privesy s klbom, policajne diely */
SPECS.cabrio={len:4.4,h:1.3,body:[[0,.32,.05],[.02,.86,.1],[.7,.95,.2],[1.15,.97,.2],[2.5,.97,.1],[2.56,1.27,.05],[2.64,1.3,.1],[3.3,.95,.3],[4.2,.78,.3],[4.4,.55,.14],[4.38,.3,.05]],win:[[1.2,.97],[2.5,.98,.1],[2.62,1.26,.1],[3.15,.97]],pil:[],wh:[.9,3.6],r:.33,top:220,fy:.74,ty:.9,cab:[1.2,2.5],chrome:true};
SPECS.trl={len:3.4,h:1.6,trl:true,wh:[1.2],r:.3,top:100};
SPECS.crv={len:5.4,h:2.55,trl:true,crv:true,wh:[2.2],r:.3,top:100};
const AVX=[{m:"Mazaki",mo:"Vánok",v:"JM1",t:"cabrio",r:"*"},{m:"Bavaro",mo:"Zefír",v:"WBA",t:"cabrio",r:["eu","uk","ae","us"]},{m:"Pellier",mo:"Letná",v:"VF3",t:"cabrio"}];
AVT["osobné auto"].push(["cabrio",.7],["cabrio",.4]);AVT["SUV"].push(["pickup",1.2]);AVT["dodávka"].push(["pickup",.9]);
/* kabriolet: vystelka otvorenej kabiny, zlozena strecha, ochranne obluky */
function avCabrio(r,sp,o){if(!sp.cab||o.lod)return;const G=r.geo,L=sp.len,Z=x=>L/2-x,w0=r.wheels&&r.wheels[0],hw=(w0?Math.abs(w0.lat):.8)+.13,belt=sp.win[0][1],bot=sp.body[0][1],a=sp.cab[0],b=sp.cab[1],dk=g3L("#1a1b1e"),tr=g3L(/Bavaro|Mervana|Aurex/.test(o.mk||"")?"#6a4a34":"#232428"),cl=g3L("#15161a");
 for(const s of[-1,1]){G.box(Math.min(s*hw*.74,s*hw*.86),Math.max(s*hw*.74,s*hw*.86),bot+.25,belt-.015,Z(b+.5),Z(a),tr,0);G.box(Math.min(s*hw*.72,s*hw*.9),Math.max(s*hw*.72,s*hw*.9),belt-.03,belt+.004,Z(b),Z(a),dk,0)}
 G.box(-hw*.86,hw*.86,bot+.25,belt-.02,Z(a+.06),Z(a),tr,0);G.box(-hw*.86,hw*.86,bot+.2,bot+.26,Z(b+.6),Z(a),dk,0);
 G.bbox(-hw*.74,hw*.74,belt-.02,belt+.085,Z(a+.04),Z(a-.34),.04,cl,0,{smooth:true});
 for(const s of[-1,1]){const x=s*.38,z=Z(a+.2);G.bbox(x-.17,x+.17,belt,belt+.2,z-.03,z+.03,.03,dk,0);G.box(x-.12,x+.12,belt+.02,belt+.15,z-.035,z+.035,g3L("#0c0d0f"),0)}}
/* policajne diely: ram pred prednym naraznikom a hladaci reflektor na stlpiku */
function avPol(r,sp,o){if(!o.police||!sp.body||!sp.win||sp.truck||sp.bus||sp.moto||o.lod)return;const G=r.geo,L=sp.len,Z=x=>L/2-x,w0=r.wheels&&r.wheels[0],hw=(w0?Math.abs(w0.lat):.8)+.13,bot=sp.body[0][1],belt=sp.win[0][1],fy=sp.fy||.8,bk=[.03,.03,.035],big=!!(sp.clad||sp.van||sp.bed)||sp===SPECS.bigsuv,z0=-L/2-.085,z1=z0-.075,y0=bot+.02,y1=Math.min(fy-(big?.02:.14),bot+(big?.5:.36));
 for(const s of[-1,1]){const x=s*.3;G.bbox(x-.028,x+.028,y0,y1,z1-.02,z1+.02,.012,bk,0);G.box(x-.02,x+.02,y0+.05,y0+.1,z1,z0+.03,bk,0);if(y1-y0>.25)G.box(x-.02,x+.02,y1-.1,y1-.05,z1,z0+.03,bk,0)}
 G.cylX(-.36,.36,y0+.07,z1,.022,8,bk,0);G.cylX(-.36,.36,y1-.03,z1,.022,8,bk,0);if(big)G.cylX(-.36,.36,(y0+y1)/2,z1,.018,8,bk,0);
 const sx=sp.win[3][0]-.1,sy=belt+.15,sl=-hw*.84,zc=Z(sx);G.box(sl-.012,sl+.05,sy-.06,sy-.03,zc-.012,zc+.012,bk,0);G.cylZ(sl-.02,sy,zc-.11,zc-.01,.052,12,PCOL.chrome,9,PCOL.chrome);G.cylZ(sl-.02,sy,zc-.113,zc-.11,.044,12,PCOL.white,13,PCOL.white)}
/* prives za autom: 1 skrinovy, 2 otvoreny s nakladom, 3 obytny */
function avTrl(sp,o){const G=new Geo,L=sp.len,Z=x=>L/2-x,wheels=[],plates=[],col=g3L(o.color||"#e8eaec"),dk=g3L("#1c1d20"),al=g3L("#b9bec5"),red=PCOL.red,k=o.tow||1,v=o.tv||0,wx=sp.wh[0],r=sp.r;
 const bar=(xa,hwb,y)=>{for(const s of[-1,1])G.limb([s*hwb,y,Z(xa)],[0,y,Z(L-.08)],.035,.03,5,dk,0);G.box(-.05,.05,y-.04,y+.06,Z(L),Z(L-.14),dk,0);G.cyl(.16,Z(L-.5),y-.02,y-.36,.025,.02,5,al,9);G.cyl(.16,Z(L-.5),y-.36,y-.42,.06,.06,6,dk,0)};
 const lamps=(hwb,y,z)=>{for(const s of[-1,1]){const a=Math.min(s*(hwb-.2),s*(hwb-.03)),b=Math.max(s*(hwb-.2),s*(hwb-.03));G.quad([b,y,z],[a,y,z],[a,y+.09,z],[b,y+.09,z],red,6);G.tri([s*(hwb-.3),y,z],[s*(hwb-.42),y,z],[s*(hwb-.36),y+.1,z],[.6,.05,.04],0)}};
 if(sp.crv){const hw=1.08,y0=.5,y1=2.5,xa=.1,xb=4.3,wh=g3L("#f1f2f3"),st=g3L(["#2f5aa8","#c8322a","#3a8a5a","#6a6f78"][v%4]),gk=PCOL.glassK;
  G.bbox(-hw,hw,y0,y1,Z(xb),Z(xa),.22,wh,1,{smooth:true});G.box(-hw+.1,hw-.1,y0-.1,y0+.02,Z(xb-.1),Z(xa+.1),dk,0);
  for(const s of[-1,1]){const l=s*(hw+.004);G.quad([l,1.02,Z(xa+.3)],[l,1.02,Z(xb-.3)],[l,1.14,Z(xb-.3)],[l,1.14,Z(xa+.3)],st,1);G.quad([l,.9,Z(xa+.3)],[l,.9,Z(xb-.3)],[l,.94,Z(xb-.3)],[l,.94,Z(xa+.3)],st,1);
   G.quad([l,1.35,Z(.7)],[l,1.35,Z(1.6)],[l,1.9,Z(1.6)],[l,1.9,Z(.7)],gk,3);G.quad([l,1.35,Z(2.9)],[l,1.35,Z(3.8)],[l,1.9,Z(3.8)],[l,1.9,Z(2.9)],gk,3);
   if(s>0){const q=(a,b,c,d)=>G.quad([l+.002,c,Z(a)],[l+.002,c,Z(b)],[l+.002,d,Z(b)],[l+.002,d,Z(a)],dk,0);q(1.9,1.92,.6,2.2);q(2.56,2.58,.6,2.2);q(1.9,2.58,2.19,2.21);G.box(l,l+.02,1.3,1.34,Z(2.5),Z(2.42),al,9)}
   G.box(Math.min(s*(hw-.02),s*(hw+.07)),Math.max(s*(hw-.02),s*(hw+.07)),y0+.02,y0+.14,Z(wx+.42),Z(wx-.42),dk,0);wheels.push({z:Z(wx),lat:s*(hw-.1),r,w:.2,k:"cap"})}
  G.quad([-.7,1.4,Z(xb)-.004],[.7,1.4,Z(xb)-.004],[.7,1.95,Z(xb)-.004],[-.7,1.95,Z(xb)-.004],gk,3);G.quad([.6,1.45,Z(xa)+.004],[-.6,1.45,Z(xa)+.004],[-.6,1.9,Z(xa)+.004],[.6,1.9,Z(xa)+.004],gk,3);
  G.bbox(-.3,.3,y0,y0+.45,Z(xb+.5),Z(xb+.02),.05,g3L("#d9dcdf"),0,{smooth:true});G.bbox(-.3,.3,y1-.02,y1+.1,Z(2.6),Z(1.8),.04,wh,1);
  bar(xb,.55,y0-.04);lamps(hw,.62,Z(xa)+.004);plates.push({y:.82,z:Z(xa)+.012,w:.52,h:.11})}
 else{const hw=.74,y0=.46,xa=.15,xb=2.45;G.box(-hw+.06,hw-.06,y0-.09,y0,Z(xb),Z(xa),dk,0);
  for(const s of[-1,1]){G.bbox(Math.min(s*(hw+.01),s*(hw+.25)),Math.max(s*(hw+.01),s*(hw+.25)),y0+.08,y0+.15,Z(wx+.4),Z(wx-.4),.03,dk,0);wheels.push({z:Z(wx),lat:s*(hw+.13),r,w:.19,k:"cap"})}
  if(k===1){const y1=1.58,c=v%2?g3L("#d9dcdf"):col;G.bbox(-hw,hw,y0,y1,Z(xb),Z(xa),.05,c,1,{smooth:true});G.box(-.01,.01,y0+.06,y1-.06,Z(xa)+.001,Z(xa)+.006,dk,0);for(const s of[-1,1])G.box(s*.3-.015,s*.3+.015,y0+.5,y0+.62,Z(xa)+.001,Z(xa)+.03,al,9);
   for(const s of[-1,1])for(const y of[y0+.2,y1-.2])G.box(Math.min(s*hw,s*(hw+.012)),Math.max(s*hw,s*(hw+.012)),y-.02,y+.02,Z(xb-.1),Z(xa+.1),al,9)}
  else{const y1=y0+.34,wc=v%2?g3L("#4a5058"):g3L("#8a6a3c");G.box(-hw,hw,y0,y0+.04,Z(xb),Z(xa),dk,0);for(const s of[-1,1])G.box(Math.min(s*(hw-.03),s*hw),Math.max(s*(hw-.03),s*hw),y0,y1,Z(xb),Z(xa),wc,0);G.box(-hw,hw,y0,y1,Z(xb),Z(xb-.03),wc,0);G.box(-hw,hw,y0,y1,Z(xa+.03),Z(xa),wc,0);
   if(v%3===0)G.bbox(-hw+.06,hw-.06,y0+.04,y1+.22,Z(xb-.1),Z(xa+.1),.12,g3L("#3a5a3c"),0,{smooth:true});else if(v%3===1){for(let i=0;i<5;i++)G.cylZ(-.45+i*.22,y0+.16+(i%2)*.02,Z(xb-.08),Z(xa+.08),.1,8,g3L("#8a5a2b"),0,g3L("#c9a26a"));for(let i=0;i<4;i++)G.cylZ(-.34+i*.22,y0+.34,Z(xb-.12),Z(xa+.12),.1,8,g3L("#7a4e26"),0,g3L("#c9a26a"))}else{G.bbox(-hw+.1,-.05,y0+.04,y0+.6,Z(2.2),Z(1.3),.03,g3L("#a8814f"),0);G.bbox(.05,hw-.1,y0+.04,y0+.48,Z(1.9),Z(.5),.03,g3L("#8f6a3c"),0);G.cylZ(-.3,y0+.24,Z(1.1),Z(.4),.2,10,g3L("#2c5d9b"),0,g3L("#2c5d9b"))}}
  bar(xb,.5,y0-.05);lamps(hw,y0+.04,Z(xa)+.006);plates.push({y:y0+.21,z:Z(xa)+.014,w:.52,h:.11})}
 return{geo:G,wheels,plates}}
/* prives sa kresli ako samostatne vozidlo: os privesu sleduje tazne zariadenie auta, takze sa v zakrute lame */
function avTow(sh,list){const hp=sh.hp,T=hTer(),N=G3.N||0;for(const c of sh.cars){const dx=c.x-hp.x,dy=c.y-hp.y;if(dx*dx+dy*dy>90000){c.avTw=null;continue}if(!c.avo&&!c.pol&&!c.emer&&c.kind!=="traktor")try{avO(c,false)}catch(e){}const o=c.avo;if(!o||!o.tow)continue;
  const spc=avSp(c),tsp=o.tow===3?SPECS.crv:SPECS.trl,d=tsp.len-tsp.wh[0],ca=Math.cos(c.a),sa=Math.sin(c.a),hx=c.x-ca*(spc.len/2+.1),hy=c.y-sa*(spc.len/2+.1);let w=c.avTw;if(!w||Math.hypot(w.x-hx,w.y-hy)>d+3)w=c.avTw={x:hx-ca*d,y:hy-sa*d};
  let ux=hx-w.x,uy=hy-w.y;const l=Math.hypot(ux,uy)||1;ux/=l;uy/=l;w.x=hx-ux*d;w.y=hy-uy*d;const a=Math.atan2(uy,ux),kc=tsp.len/2-tsp.wh[0],cx=w.x+ux*kc,cy=w.y+uy*kc;w.cx=cx;w.cy=cy;w.r=tsp.crv?2.5:1.9;
  if(!o.towO)o.towO={color:["#e8eaec","#c9cdd2","#8f959c","#2f3640"][c.id%4],mk:"",police:false,liv:"SK",lc:"bb",lights:false,kn:"tw"+o.tow+c.id%6,tow:o.tow,tv:c.id%6,empty:1};
  list.push({sp:tsp,o:o.towO,d:-cy,x:cx,y:T(cx,cy)+(c.e3||0),yaw:Math.atan2(-Math.cos(a),-Math.sin(a)),dist:c.t||0,fl:[0,0,N*.35]})}}

/* krok 25: celo auta je zvisle az po hornu hranu svetlometov, aby v nom mohli byt svetla a maska naozaj zapustene.
   Predtym profil klesal k spici a svetla sa kreslili na rovine pred sikmou kapotou, takze priehlbiny nemali kde vzniknut. */
for(const k in SPECS){const sp=SPECS[k];if(!sp.body||!sp.win||sp.avNs)continue;const B=sp.body,n=B.length,T=B[n-3][1]-.03;if(T>B[n-2][1])B[n-2][1]=T;sp.fy=Math.min(sp.fy||.8,B[n-2][1]-.08);sp.avNs=1}

/* krok 25: tvar svetlometu podla znacky. Obdlznik svetla sa pretvori posunom vysky: u=0 vnutorna hrana, u=1 vonkajsia.
   Posuva sa vsetko, co k svetlu patri (priehlbina, vnutro, ramiky, krycie sklo), takze diely ostanu spolu. */
function avLampShape(G,F,HL){const sh={swept:[.5,0,0,0],slim:[0,0,.35,0],C:[.15,0,.3,0],T:[0,.4,0,0],Y:[.3,0,0,.25],fang:[.4,0,.15,0]}[HL];if(!sh)return;const A=G.a,z0=F.z-.09,z1=F.z+F.D+.004;
 for(const k of F.pk){if(k.k!=="lamp")continue;const s=k.x0+k.x1<0?-1:1,xi=Math.min(Math.abs(k.x0),Math.abs(k.x1)),xo=Math.max(Math.abs(k.x0),Math.abs(k.x1)),h=k.y1-k.y0,ya=k.y0-.1,yb=Math.min(k.y1+.04,F.yt-.012),up=yb>k.y1+.012;
  for(let i=0;i+12<=A.length;i+=12){const x=A[i]*s,y=A[i+1],z=A[i+2];if(z<z0||z>z1||x<xi-.008||x>xo+.008||y<=ya||y>=(up?yb:k.y1+1e-4))continue;const u=Math.max(0,Math.min(1,(x-xi)/(xo-xi))),yL=k.y0+h*(sh[0]*(1-u)+sh[1]*u),yU=up?k.y1-h*(sh[2]*(1-u)+sh[3]*u):k.y1;
   A[i+1]=y<k.y0?ya+(y-ya)*(yL-ya)/(k.y0-ya):y<=k.y1?yL+(y-k.y0)*(yU-yL)/h:yU+(y-k.y1)*(yb-yU)/(yb-k.y1)}}}

/* krok 26: v jazde sa nekreslia auta za kamerou a velmi vzdialene; tien pokryva mensie okolie, takze je jemnejsi */
function avCull(sh,C,list){if(!sh.drv||!C||!C.eye||!C.tgt)return;const ex=C.eye[0],ez=C.eye[2],fx=C.tgt[0]-ex,fz=C.tgt[2]-ez,fl=Math.hypot(fx,fz)||1;for(let i=list.length-1;i>=0;i--){const v=list[i],dx=v.x-ex,dz=-v.d-ez,al=(dx*fx+dz*fz)/fl;if(al<-45||dx*dx+dz*dz>302500)list.splice(i,1)}}
{const r1=g3Render;g3Render=function(R){try{if(R&&R.custom&&R.shr>70&&S.shift&&S.shift.drv)R.shr=70}catch(e){}return r1.apply(this,arguments)}}

/* krok 27: svet je rozdeleny na dlazdice 400 m. V jazde sa do tienovej mapy kreslia len dlazdice blizko auta
   (tien pokryva 70 m, predtym sa kreslilo vsetko do 1 km) a na obrazovku len dlazdice v zabere kamery. */
function avWorldCull(sh,C,extra){if(!sh.drv||!sh.g3w||!C||!C.eye||!C.tgt||G3.avNoCull)return;const g=sh.g3w,nw=performance.now();let mp=g.avMp;if(!mp||nw-g.avMpT>2000){mp=g.avMp=new Map;g.avMpT=nw;const add=o=>{if(!o)return;for(const k in o){const m=o[k];if(m){const q=k.split(",");mp.set(m,[+q[0],+q[1]])}}};add(g.ch);add(g.x&&g.x.ch);add(g.lo)}
 const ex=C.eye[0],ez=C.eye[2];let fx=C.tgt[0]-ex,fz=C.tgt[2]-ez;const fl=Math.hypot(fx,fz)||1;fx/=fl;fz/=fl;const hp=sh.hp,sx=hp.x+fx*33,sz=hp.y+fz*33,SR=190,tn=1.6,CS=400;
 for(const e of extra){const q=mp.get(e.m);if(!q)continue;const x0=q[0]*CS,z0=q[1]*CS,x1=x0+CS,z1=z0+CS;
  if(!e.noSh){const dx=Math.max(x0-sx,0,sx-x1),dz=Math.max(z0-sz,0,sz-z1);if(dx>SR||dz>SR)e.noSh=true}
  let bh=0,rt=0,lf=0;for(const cx of[x0,x1])for(const cz of[z0,z1]){const dx=cx-ex,dz=cz-ez,al=dx*fx+dz*fz,lt=-dx*fz+dz*fx;if(al<-25)bh++;if(lt-al*tn>40)rt++;if(-lt-al*tn>40)lf++}
  if(bh===4||rt===4||lf===4)e.avHide=true}}

/* krok 28: odbocovanie oblukom. Auto uz na krizovatke neskoci z jedneho useku na druhy s okamzitou zmenou smeru:
   poslednych a prvych par metrov ide po obluku medzi svojim pruhom na starom a novom useku. */
function avLaneP(E,ei,dir,t,c){const e=E[ei],s=dir>0?t:e.len-t,p=hPtAt(e.pts,e.cum,clamp(s,0,e.len)),a=p.a+(dir<0?Math.PI:0);let off=HROAD[e.type].off;if(e.type==="hwy")off=c.kind==="kamión"||c.kind==="autobus"||c.v<26?7.6:3.8;if(e.ow)off=0;return{x:p.x-Math.sin(a)*off,y:p.y+Math.cos(a)*off,a}}
function avArc(sh,c){c.aE=c.a;if(c.park||!sh.W||!sh.W.net)return;const E=sh.W.net.E,e=E[c.e];if(!e)return;const rem=e.len-c.t;let A=null,B=null,u=0,R=0;
 if(c.nx!=null&&c.nx!==c.e&&E[c.nx]){const ne=E[c.nx],ni=c.dir>0?e.b:e.a,nd=ne.a===ni?1:-1;
  if(rem<32){const b0=avLaneP(E,c.nx,nd,Math.min(3,ne.len*.3),c),da=hAng(b0.a-c.aE);c.avTs=Math.abs(da)>.55&&Math.abs(da)<2.8?(da>0?1:-1):0;c.avTsE=c.nx}
  R=Math.min(7,e.len*.45,ne.len*.45);if(rem<R&&R>1.5){A=avLaneP(E,c.e,c.dir,e.len-R,c);B=avLaneP(E,c.nx,nd,R,c);u=(R-rem)/(2*R)}}
 if(!A&&c.prevE!=null&&c.prevE!==c.e&&E[c.prevE]){const pe=E[c.prevE],n0=c.dir>0?e.a:e.b;if(pe.a===n0||pe.b===n0){const pd=pe.b===n0?1:-1;R=Math.min(7,e.len*.45,pe.len*.45);if(c.t<R&&R>1.5){A=avLaneP(E,c.prevE,pd,pe.len-R,c);B=avLaneP(E,c.e,c.dir,R,c);u=.5+c.t/(2*R)}else if(c.avTsE===c.e){c.avTs=0;c.avTsE=null}}}
 if(!A){const s0=Math.max(0,c.t-3),s1=Math.min(e.len,c.t+3);if(s1-s0>1){const p=avLaneP(E,c.e,c.dir,s0,c),q=avLaneP(E,c.e,c.dir,s1,c);if(Math.abs(hAng(q.a-p.a))>.02)c.a=Math.atan2(q.y-p.y,q.x-p.x)}return}const ax=Math.cos(A.a),ay=Math.sin(A.a),bx=Math.cos(B.a),by=Math.sin(B.a),cr=ax*by-ay*bx;let cx=(A.x+B.x)/2,cy=(A.y+B.y)/2;
 if(Math.abs(cr)>.2){const s=((B.x-A.x)*by-(B.y-A.y)*bx)/cr;if(s>0&&s<3*R+6){cx=A.x+ax*s;cy=A.y+ay*s}}
 const v=1-u,tx=2*v*(cx-A.x)+2*u*(B.x-cx),ty=2*v*(cy-A.y)+2*u*(B.y-cy);c.x=v*v*A.x+2*u*v*cx+u*u*B.x;c.y=v*v*A.y+2*u*v*cy+u*u*B.y;if(tx*tx+ty*ty>1e-6)c.a=Math.atan2(ty,tx)}
{const p0=hCarPos;hCarPos=function(sh,c){p0(sh,c);try{avArc(sh,c)}catch(e){}}}
/* prednost v jazde: hlavna cesta, kruhovy objazd, pravidlo pravej ruky, odbocenie vlavo, vozidla s majakom */
const AVPR={hwy:5,ring:4.5,main:4,sec:3,local:2,city:2,dirt:1};
function avRk(e){return(AVPR[e.type]||2)+(e.fdSt==="av"?.5:0)}
function avYield(sh,c,ni,rem,lanes,dt,now){const W3=sh.W,{N,E}=W3.net,n=N[ni];if(G3.avNoYield||n.tl||n.portal||n.e.length<3||rem<9){c.avYw=0;return false}
 const rk=avRk(E[c.e]),h=hTlAng(W3,ni,c.e)+Math.PI,left=c.nx!=null&&hAng(hTlAng(W3,ni,c.nx)-h)<-.6,go=c.avGo>now;let y=false;
 for(const ej of n.e){if(ej===c.e)continue;const oe=E[ej],l=lanes.get(ej*2+(oe.b===ni?1:0));if(!l||!l.length)continue;const o=l[l.length-1];if(o.id===-2||o===c)continue;const orem=oe.len-o.t;
  if(o.v>=1.5?orem>8+o.v*3.2:orem>16||go)continue;
  let pri=!!(o.emer||o.unit&&o.goal);const ork=avRk(oe);
  if(!pri){if(ork>rk)pri=true;else if(ork===rk){const r=hAng(hTlAng(W3,ni,ej)-h);if(r>.6&&r<2.5)pri=true;else if(left&&Math.abs(r)<.6)pri=o.nx==null||hAng(hTlAng(W3,ni,o.nx)-hTlAng(W3,ni,ej)-Math.PI)>-.6}}
  if(pri){y=true;break}}
 if(!y){c.avYw=0;return false}
 if(c.v<.6){c.avYw=(c.avYw||0)+dt;if(c.avYw>2.5+(Math.abs(c.id||0)%7)*.7){c.avYw=0;c.avGo=now+4}}
 return true}
