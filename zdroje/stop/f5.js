/* Faza 5 – 3D scena kontroly: posila, vodic vonku, spolujazdec, balicek v priekope */
const F5PAL={sk:["#f1c9a5","#e8b48e","#d9a67e","#c68a5e","#8d5a3b"],sh:["#7a2f3a","#2f5a7a","#3c6b3a","#b88a2e","#5a4a7a","#d8d8d0","#22262c"],hr:["#2a2018","#5a3a22","#b8925a","#1a1a1a","#8a8a88","#7a3a1e"]};
let f5S=false;
{const d0=s3Draw;s3Draw=function(){f5S=true;try{return d0.apply(this,arguments)}finally{f5S=false}}}
{const r0=g3Render;g3Render=function(R){if(f5S&&S.stop&&R&&R.vehicles){try{f5Add(R)}catch(e){console.warn("f5",e)}}return r0.apply(this,arguments)}}
function f5Mesh(id,f){G3.f5m=G3.f5m||{};if(!G3.f5m[id]){const G=new Geo;f(G);G3.f5m[id]=g3Up(G)}return G3.f5m[id]}
function f5Add(R){const c=S.stop,car=c.car;if(!car)return;const F=c.f1||{},A=c.anim,now=performance.now(),sp=car.spec,cop=copCar(),cs=SPECS[cop.type],carZ=-3,copZ=carZ+sp.len/2+3.2+cs.len/2,hw=(sp.truck||sp.bus?1.27:1)+.5,doorX=6.05-hw-.1,doorZ=carZ-sp.len*.12,copDoorX=6.05-1.5,V=R.vehicles[1],arrest=A&&A.k==="arrest";
 /* spolujazdec */
 if(V&&car.occ2&&c.kind==="car"&&!sp.moto){if(!c.f5pax){const fs=c.f3p&&c.f3p.sex==="f";c.f5pax=[pick(F5PAL.sk),pick(F5PAL.sh),fs?pick(["#5a3a22","#b8925a","#7a3a1e","#2a2018"]):pick(F5PAL.hr)]}V.o.pax=c.f5pax}
 /* vodic vonku: eskalacia alebo spútaný */
 const out=!sp.moto&&!arrest&&(F.escOut||F.cuffed);if(V&&out)V.o.out=true;
 if(out){const look=g3CivLook(c.person);if(F.cuffed)R.persons.push({look,x:copDoorX+.2,z:copZ-cs.len/2-.7,yaw:Math.PI*.15,walk:null,pose:"cuffed"});else{const s=Math.sin(now/650);R.persons.push({look,x:doorX-.15+Math.sin(now/1300)*.12,z:doorZ-1+s*.35,yaw:Math.PI+s*.5,walk:now/1000*7,pose:null})}}
 /* balicek v priekope */
 if(c.hid&&c.hid.part==="okolie"){const m=f5Mesh("pkg",G=>{G.box(-.2,.2,0,.17,-.15,.15,g3L("#e6dfcc"),0);G.box(-.202,.202,.06,.1,-.152,.152,g3L("#c23a2e"),0)});R.extra.push({m,M:M4.trs(7.05,.02,carZ+sp.len/2+1.3,.6)});if(c.hidFound){const t=f5Mesh("tent",G=>{G.quad([-.09,0,-.07],[.09,0,-.07],[.09,.16,0],[-.09,.16,0],g3L("#f2c230"),0);G.quad([.09,0,.07],[-.09,0,.07],[-.09,.16,0],[.09,.16,0],g3L("#f2c230"),0);G.box(-.03,.03,.06,.11,-.072,-.068,g3L("#15171b"),0)});R.extra.push({m:t,M:M4.trs(6.7,.02,carZ+sp.len/2+1.3,.2)})}}
 /* posila */
 if(F.backup){if(!F.bkT)F.bkT=now-6e3;const t=(now-F.bkT)/1e3,T=4.5,p=ease(Math.min(1,t/T)),z0=55,zT=carZ-sp.len/2-2.6-cs.len/2,z=lerp(z0,zT,p),x=p<.62?3.6:lerp(3.6,6.05,ease((p-.62)/.38)),fl=flashState(),N=G3.N,lcc=LIVLC[curCt()]||"bb",on=fl.l||fl.r;
  R.vehicles.push({sp:cs,o:Object.assign(copOptsMk(cop,{}),{plate:copPlate()}),d:-z,x,yaw:0,dist:z0-z,fl:[fl.l?0:1,fl.r?0:1,N*.35]});const lc=g3LB(lcc,fl.l?1:0);R.glows.push(x+(fl.l?.3:-.3),cs.h+.12,z,...lc.map(v=>Math.min(1,v*1.6+.15)),.9,2.4);R.lights.push({d:-z,x,y:cs.h+.4,rng:12,c:lc.map(v=>v*(.45+.9*N))});
  if(t>T+.8){if(!F.bkFace)F.bkFace=genFace(chance(.7)?"m":"f");const k=Math.min(1,(t-T-.8)/1.8);R.persons.push({look:g3OffLook(Object.assign({},S.save,{face:F.bkFace,name:"Kolega"})),x:lerp(6.05-1.4,doorX-.4,ease(k)),z:lerp(zT+cs.len*.1,doorZ-1.9,ease(k)),yaw:k<1?Math.PI:Math.PI*.75,walk:k<1?t*8:null,pose:null})}}}
