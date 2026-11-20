/* Vozidla: sluzobne auta kresli vlastny generator hry; supersport ma vlastny nizky klinovity tvar */
SPECS.super={len:4.52,h:1.28,body:[[0,.3,.05],[.02,.82,.1],[.45,.97,.2],[1.6,1.24,.4],[2.75,1.28,.45],[3.5,.84,.3],[4.38,.62,.3],[4.52,.45,.14],[4.5,.26,.05]],win:[[1.42,1],[1.74,1.2,.12],[2.7,1.23,.1],[3.34,.87]],pil:[2.05],wh:[.88,3.62],r:.36,top:325,fy:.62,ty:.82};
{const k=COPS.find(c=>c.name==="Varzetti Kuna");if(k)k.type="super"}
/* skupina 2: premavka v otvorenom svete ma znacku a tvar podla typu, navesy a linky autobusov; brzdove svetla a smerovky */
const AVT={"osobné auto":[["hatch",3],["hatch",3],["sedan",2.5],["sedan",2],["city",2],["liftback",2],["sport",1],["coupe",.5]],"SUV":[["suv",3],["suv",2],["bigsuv",2],["suvcoupe",1]],"kombi":[["combi",1],["combi",1]],"dodávka":[["van",3],["mpv",1.5]]};
function avPool(){if(avPool.p&&avPool.ct===curCt())return avPool.p;const reg=REG[curCt()],ok=m=>m.r==="*"||(Array.isArray(m.r)?m.r.includes(reg):m.r?m.r===reg:reg==="eu"||reg==="uk"),P={};for(const k in AVT){const used={};P[k]=AVT[k].map(([t,w])=>{let l=MAKES.filter(m=>m.t===t&&ok(m));if(!l.length)l=MAKES.filter(m=>m.t===t);const i=used[t]||0;used[t]=i+1;return[l[i%Math.max(1,l.length)],w]}).filter(x=>x[0])}avPool.ct=curCt();return avPool.p=P}
function avMk(c){if(c.avM!==undefined)return c.avM;const L=avPool()[c.kind];if(!L||!L.length||c.pol||c.emer)return c.avM=null;let t=L.reduce((s,x)=>s+x[1],0),r=Math.random()*t;for(const x of L){r-=x[1];if(r<=0)return c.avM=x[0]}return c.avM=L[0][0]}
function avSp(c){const m=avMk(c);return m&&SPECS[m.t]||SPECS[HSP[c.kind]]||SPECS.hatch}
function avO(c,far){const m=avMk(c);if(far&&m){const f=c.avf||(c.avf={color:c.col[1],mk:"",police:false,liv:"SK",lc:"bb",lights:false,lod:1});return f}if(!c.avo){const o=c.avo={color:c.col[1],mk:m?m.m+" "+m.mo:"",police:!!c.pol,liv:"SK",lc:"bb",lights:false};if(m)o.rim=m.t==="sport"||m.t==="coupe"?"dark":m.t==="city"?"cap":["5","mesh","5","cap"][c.id%4];if(c.kind==="kamión")o.trailer=TRAILERS[c.id%TRAILERS.length];if(c.kind==="autobus")o.bus=BUSCOL[c.id%BUSCOL.length];if(c.kind==="sanitka")o.mk="Sanitka";if(c.kind==="hasiči")o.mk="Hasiči"}c.avo.lights=!!(c.pol&&(c.goal||c.resp));return c.avo}
function avLens(k){const L=G3.avL||(G3.avL={});if(L[k])return L[k];const G=new Geo;G.box(-.5,.5,-.5,.5,-.5,.5,g3L(k==="r"?"#ff2414":"#ffa018"),2);return L[k]=g3Up(G)}
function avLights(sh,extra,ga,now){if(!sh.W||!sh.W.net)return;const hp=sh.hp,T=hTer(),E=sh.W.net.E,bl=now*1.5%1<.5;
 const rear=(x,z,a,sp,y)=>{const ca=Math.cos(a),sa=Math.sin(a),hl=sp.len/2,yaw=Math.atan2(-ca,-sa);for(const s of[-1,1])extra.push({m:avLens("r"),M:M4.trs(x-ca*(hl+.01)-sa*.64*s,y+(sp.ty||1)-.02,z-sa*(hl+.01)+ca*.64*s,yaw,.26,.1,.06)})};
 for(const c of sh.cars){if(c.park||c.kind==="traktor")continue;const dx=c.x-hp.x,dy=c.y-hp.y;if(dx*dx+dy*dy>28900)continue;const sp=avSp(c);if(sp.moto)continue;
  const pv=c._avv==null?c.v:c._avv;if(c.v<pv-.004)c._avb=now;c._avv=c.v;const brake=now-(c._avb||-9)<.35||c.v<.3,big=!!(sp.truck||sp.bus),y=T(c.x,c.y)+(c.e3||0);
  let turn=0;if(c.nx!=null&&E[c.nx]&&E[c.e]){const e=E[c.e],rem=e.len-c.t;if(rem<32){const ni=c.dir>0?e.b:e.a,ne=E[c.nx],P0=ne.a===ni?ne.pts:[...ne.pts].reverse(),da=hAng(Math.atan2(P0[1][1]-P0[0][1],P0[1][0]-P0[0][0])-c.a);if(Math.abs(da)>.55&&Math.abs(da)<2.8)turn=da>0?1:-1}}
  if(brake&&!big)rear(c.x,c.y,c.a,sp,y);
  if(turn&&bl){const ca=Math.cos(c.a),sa=Math.sin(c.a),hl=sp.len/2,lat=(big?1.02:.64)+.1,yaw=Math.atan2(-ca,-sa);for(const f of[-1,1]){if(big&&f<0)continue;const x=c.x+ca*(hl-.06)*f-sa*lat*turn,z=c.y+sa*(hl-.06)*f+ca*lat*turn,yy=y+(f>0?sp.fy||.8:(sp.ty||1)-.02);extra.push({m:avLens("a"),M:M4.trs(x,yy,z,yaw,.12,.1,.14)});ga.push(x,yy,z,1,.6,.1,.8,.5)}}}
 if(sh.drv&&sh.dv){const D=sh.dv,v=Math.abs(D.v),pv=D._avv==null?v:D._avv;if(v<pv-.004)D._avb=now;D._avv=v;const sp=SPECS[copCar().type];if(sp&&!sp.moto&&now-(D._avb||-9)<.35)rear(hp.x,hp.y,sh.fl.hd,sp,T(hp.x,hp.y)+(D.el||0))}}
{const x0=hX3D;hX3D=function(sh,C,extra,list,persons,ga,glass2,now){x0.apply(this,arguments);try{avLights(sh,extra,ga,now)}catch(e){if(!avLights.w){avLights.w=1;console.warn("avl",e)}}}}
/* skupina 3: znacka a model v radare a hlaseniach */
function avName(c){const m=c.pc&&c.pc.mk||avMk(c);if(m)return m.m+" "+m.mo;const t={"kamión":"truck","autobus":"bus","traktor":"tractor"}[c.kind];if(t){if(!c.avN){const x=pickMake(t);c.avN=x?x.m+" "+x.mo:c.kind}return c.avN}return c.kind}
/* skupina 4: karta sluzobneho auta v menu – nazov, vykon, vyber auta */
function avCard(){const wrap=$("#hero-wrap");if(!wrap)return;const old=wrap.querySelector(".av-card");if(old)old.remove();const cop=copCar();if(!cop)return;const fixed=S.save.mode==="civil"||S.save.mode==="moto",L=COPS.map((c,i)=>i).filter(i=>copOK(COPS[i])),k=L.indexOf(COPS.indexOf(cop)),one=fixed||L.length<2,el=document.createElement("div");el.className="av-card";const dur=Math.max(1,Math.min(5,Math.round(((cop.crash||.5)-.3)/.5*4)+1)),z=String(cop.z).replace(".",",");
 el.innerHTML=`<button data-d="-1" ${one?"disabled":""} title="Predchádzajúce auto">‹</button><div class="av-t"><b>${esc(cop.name)}</b><small>${esc(cop.sub||"")}</small><div class="av-s"><span><i>Max</i>${cop.top} km/h</span><span><i>0–100</i>${z} s</span><span><i>Odolnosť</i>${"●".repeat(dur)}${"○".repeat(5-dur)}</span></div></div><span class="av-k">${(k<0?0:k)+1} / ${L.length}</span><button data-d="1" ${one?"disabled":""} title="Ďalšie auto">›</button>`;
 wrap.classList.add("av");wrap.appendChild(el);
 el.querySelectorAll("button").forEach(b=>{b.onpointerdown=e=>e.stopPropagation();b.onclick=e=>{e.stopPropagation();if(one)return;S.save.copIdx=L[((k<0?0:k)+(+b.dataset.d)+L.length)%L.length];persist();try{SFX.play("click")}catch(x){}renderMenu()}})}
{const rm=renderMenu;renderMenu=function(){const r=rm.apply(this,arguments);try{avCard()}catch(e){console.warn("avcard",e)}return r}}
/* krok 1 grafiky: farba laku ako nastavenie pri kresleni (model sa stavia v zastupnej farbe) */
function avPaint(o){return!!(o&&!o.model&&G3.prog&&G3.prog.m&&G3.prog.m.u&&G3.prog.m.u.uPaint)}
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
{const g0=g3VehGeo;g3VehGeo=function(sp,o){o=o||{};if(o.lod&&sp.body)return avLow(sp,o);if(sp===SPECS.fire||/Hasiči/.test(o.mk||""))return avFire(sp,o);const r=g0.apply(this,arguments);try{avDecor(r,sp,o)}catch(e){if(!avDecor.w){avDecor.w=1;console.warn("avdecor",e)}}return r}}
