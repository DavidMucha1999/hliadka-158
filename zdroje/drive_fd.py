import re, sys, os
p=sys.argv[1];here=os.path.dirname(os.path.abspath(__file__))
d=open(p,encoding="utf8",newline="").read()
def patch(name,old,new):
    global d
    if new in d: print(name+": uz");return
    if d.count(old)!=1: print(name+": VZOR (%d)"%d.count(old));sys.exit(1)
    d=d.replace(old,new);print(name+": ok")
def block(name,code):
    global d
    d=re.sub(r"/\*<"+name+r">\*/.*?/\*</"+name+r">\*/","",d,flags=re.S)
    GO='{const _go=d=>{showLoad();gzReady().then('
    if d.count(GO)!=1: sys.exit("GO")
    d=d.replace(GO,"/*<"+name+">*/"+code+"/*</"+name+">*/"+GO);print(name+": vlozene")
patch("start rezimu",'if(S.save.mode==="heli"){startHeli();return','if(S.save.mode==="drive"){fdStart();return}if(S.save.mode==="heli"){startHeli();return')
patch("bez zameriavaca",'if(C.mode!=="belly"){const tg=M&&M.locked','if(C.mode!=="belly"&&C.mode!=="drive"){const tg=M&&M.locked')
patch("lampy dalej od cesty",'off=H2.w/2+(e.type==="city"?3.2:1.8),step=e.type==="city"?30:urb?40:34;','off=H2.w/2+(e.type==="city"?3.6:3.4),step=e.type==="city"?30:urb?40:34;')
patch("lampy nie na ceste",'if(hIsWaterW(W3,x,z)||hBldAt(x,z))continue;const y=T(x,z)+hElev(e,s),g2=G(x,z),hx=','if(hIsWaterW(W3,x,z)||hBldAt(x,z)||h8OnRoad(W3,x,z,3.3))continue;(H8.poles=H8.poles||[]).push([x,z]);const y=T(x,z)+hElev(e,s),g2=G(x,z),hx=')
patch("lampy pomocna funkcia",'function h8Build(W3){','function h8OnRoad(W3,x,z,m){const gx=Math.floor(x/100),gz=Math.floor(z/100),seen=new Set;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const L=W3.rg&&W3.rg.get((gx+i)+","+(gz+j));if(!L)continue;for(const ei of L){if(seen.has(ei))continue;seen.add(ei);const e=W3.net.E[ei];if(e&&hPolyD(x,z,e.pts)<HROAD[e.type].w/2+m)return true}}return false}function h8Build(W3){')
patch("lampy na objazde zvonka",'sd=-sd;const x=p.x+nx*off*sd,z=p.y+nz*off*sd;','sd=-sd;if(e.type==="ring"){let c=null,cd=60;for(const n of W3.net.N){if(!n.rbc)continue;const dd=Math.hypot(n.x-p.x,n.y-p.y);if(dd<cd){cd=dd;c=n}}if(c)sd=(p.x-c.x)*nx+(p.y-c.y)*nz>0?1:-1}const x=p.x+nx*off*sd,z=p.y+nz*off*sd;')
patch("semafor model",'g2=G(px,pz);g2.cyl(px,pz,0,4,.1,.1,5,L2("#2a2d31"),9);g2.box(px-.25,px+.25,3.2,4.4,pz-.25,pz+.25,L2("#1a1c1f"),9)})}','g2=G(px,pz);hTlGeo(g2,W3,n,ei,a,T)})}')
patch("semafor svetlo",',st=hTlState(n,ei,now);ga.push(px,4.1,pz,st==="g"?.2:1,st==="g"?1:st==="a"?.75:.12,st==="g"?.45:.08,1.1,.7)})}',';hTlLit(extra,ga,W3,n,ni,ei,a,now,T,hp)})}')
patch("stare lampy prec",'for(let s=15;s<e.len;s+=38){const p=hPtAt(e.pts,e.cum,s),o=HROAD[e.type].w/2+1.5,','for(let s=15;s<0;s+=38){const p=hPtAt(e.pts,e.cum,s),o=HROAD[e.type].w/2+1.5,')
patch("ulice znacenie",'for(const n of W3.net.N){if(!n.tl)continue;n.e.forEach(ei=>{const e=W3.net.E[ei],P0=e.a===W3.net.N.indexOf(n)?','try{hStreetFx(W3,G,T)}catch(e){console.warn("street",e)}for(const n of W3.net.N){if(!n.tl)continue;n.e.forEach(ei=>{const e=W3.net.E[ei],P0=e.a===W3.net.N.indexOf(n)?')
patch("stredova ciara mimo priechodov",'for(let s=6;s<e.len-6;s+=e.type==="hwy"?18:14){const p=hPtAt(e.pts,e.cum,s),q=','for(let s=e.type==="hwy"?6:13;s<e.len-(e.type==="hwy"?6:16);s+=e.type==="hwy"?18:14){const p=hPtAt(e.pts,e.cum,s),q=')
OB='gg.box(X0,X1,Y,Y+b.h,Z0,Z1,wl,b.k==="barn"||b.k==="hangar"?0:8,{uvm:true,cols:{t:h8Roof(L2(b.roof==="flat"?"#6e747c":b.rc||"#a33a2e"))},modes:{t:0}});'
patch("budovy fasada uv",OB,'{const n0=gg.a.length;'+OB+'hBldUv(gg,n0,Y,b,X0,X1,Z0,Z1)}')
patch("budovy vyklady",'if(b.shop){const c=L2(shopC[Math.floor(R()*5)]);gg.box(X0-.15,X1+.15,Y+3.1,Y+3.7,Z0-.15,Z1+.15,c,12)}','if(b.shop){R();hShopFx(gg,W3,b,X0,X1,Z0,Z1,Y,rot)}')
_i=d.index("else if(m==8.){vec2 c=uv/vec2(3.2,3.4);");_j=d.index("else if(m==9.){spec=1.4",_i)
d=d[:_i]+open(os.path.join(here,"drive","fasada.glsl"),encoding="utf8").read().rstrip("\n")+"\n "+d[_j:];print("fasada shader: ok")
patch("svetlomety auta",'if(N>.5&&fl.light!==false){const ga2=sh._gimAim,sx=','if(sh.drv){if(N>.3)fdHeadL(L2,sh,T,N)}else if(N>.5&&fl.light!==false){const ga2=sh._gimAim,sx=')
patch("lampy tlmenejsie na svetlych plochach",'col+=lt*uNight*(base*3.4+.03)*','col+=lt*uNight*(min(base,vec3(.13))*3.4+.02)*')
patch("lampy mensia ziara pri zemi",'ga.push(l[0],l[1]-7.2,l[2],1,.72,.42,.16*k,12)','ga.push(l[0],l[1]-7.2,l[2],1,.72,.42,.07*k,12)')
OLDR='<div class="rrow"><span>Pomoc pri kontrole vodiča</span>'
patch("nastavenia dlzka sluzby",OLDR,'<div class="rrow"><span>Dĺžka služby za volantom</span><select id="fdl-pick"><option value="s" ${s.drvLen==="s"?"selected":""}>Krátka – 16 minút</option><option value="n" ${s.drvLen!=="s"&&s.drvLen!=="l"?"selected":""}>Štandardná – 32 minút</option><option value="l" ${s.drvLen==="l"?"selected":""}>Dlhá – 64 minút</option></select></div>'+chr(10)+'    '+OLDR)
patch("chodci vlastny vzhlad",'lk=sh._cLooks[Math.abs((e.x*3+e.y)|0)%4]}','lk=e.fdPed?e.fdLk||(e.fdLk=g3CivLook(genPerson("sk"))):sh._cLooks[Math.abs((e.x*3+e.y)|0)%4]}')
patch("chodci stala farba",'extra.push({m:G3.crowdM[Math.abs((e.x*3+e.y)|0)%4],M:','extra.push({m:G3.crowdM[e.fdC!=null?e.fdC:Math.abs((e.x*3+e.y)|0)%4],M:')
patch("chodci viac postav zblizka",'.slice(0,8);for(const e of sh.ents){if(!vis(','.slice(0,sh.drv?14:8);for(const e of sh.ents){if(!vis(')
patch("dlazba v starom meste",'strip(g2,sP,H2.w,.09,L2(H2.c),10,sE);','strip(g2,sP,H2.w,.09,L2(e.fdSt==="old"?"#8f897e":H2.c),e.fdSt==="old"?36:10,sE);')
patch("druhy ulic pred stavbou ciest",'for(const e of W3.net.E){const H2=HROAD[e.type],{P,EL}=dens(e);','try{fdStCls(W3)}catch(x){}for(const e of W3.net.E){const H2=HROAD[e.type],{P,EL}=dens(e);')
block("drive-fd",open(os.path.join(here,"drive","fd.js"),encoding="utf8").read())
css=open(os.path.join(here,"drive","fd.css"),encoding="utf8").read()
d=re.sub(r'<style id="fd-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="fd-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
