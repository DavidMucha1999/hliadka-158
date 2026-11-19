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
OLDR='<div class="rrow"><span>Pomoc pri kontrole vodiča</span>'
patch("nastavenia dlzka sluzby",OLDR,'<div class="rrow"><span>Dĺžka služby za volantom</span><select id="fdl-pick"><option value="s" ${s.drvLen==="s"?"selected":""}>Krátka – 16 minút</option><option value="n" ${s.drvLen!=="s"&&s.drvLen!=="l"?"selected":""}>Štandardná – 32 minút</option><option value="l" ${s.drvLen==="l"?"selected":""}>Dlhá – 64 minút</option></select></div>'+chr(10)+'    '+OLDR)
block("drive-fd",open(os.path.join(here,"drive","fd.js"),encoding="utf8").read())
css=open(os.path.join(here,"drive","fd.css"),encoding="utf8").read()
d=re.sub(r'<style id="fd-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="fd-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
