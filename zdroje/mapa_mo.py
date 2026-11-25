# Mapa hliadky: opravy kolizii (rieka na ulici, stadion na ceste, domy vo vode a na cestach).
import sys
p=sys.argv[1]
d=open(p,encoding="utf8",newline="").read()
def patch(name,old,new):
    global d
    if new in d: print(name+": uz");return
    if d.count(old)!=1: print(name+": VZOR (%d)"%d.count(old));sys.exit(1)
    d=d.replace(old,new);print(name+": ok")

# Rieka v meste tiekla sikmo cez ulice (212 m lezala na Lipovej). Teraz tecie stredom radu blokov.
patch("rieka stredom blokov",
 '[[0,3900],[700,3820],[1400,3720],[2200,3520],[2800,3420],[3200,3350],[3600,3420],[4300,3600],[5e3,3520],[5600,3600],[6e3,3700]]',
 '[[0,3900],[700,3820],[1400,3720],[2e3,3560],[2440,3470],[2572,3432],[2650,3408],[2900,3399],[3265,3409],[3550,3399],[3750,3408],[3828,3432],[3960,3470],[4400,3560],[5e3,3520],[5600,3600],[6e3,3700]]')

# Stadion bol sirsi nez blok a tribuny lezali na dvoch uliciach. Dostal dva bloky a ulica medzi nimi je zrusena.
patch("stadion ulica",
 'E.length=0;E2.forEach(e=>E.push(e));',
 'E.length=0;E2.forEach(e=>{if(!mtn&&e.type==="city"){const a=e.pts[0],b=e.pts[e.pts.length-1];if(Math.abs((a[0]+b[0])/2-(C.x-3*130))<40&&Math.abs((a[1]+b[1])/2-(C.y+1.5*130))<50)return}E.push(e)});')
patch("stadion dva bloky", 'stadium:[-3,1],', 'stadium:[-3,1],stadB:[-4,1],')
patch("stadion stred",
 'if(sp){W3.spec[sp]={x:cx,y:cz,x0,x1,z0,z1};',
 'if(sp==="stadB")continue;if(sp){W3.spec[sp]=sp==="stadium"?{x:cx-GS/2,y:cz,x0:x0-GS,x1,z0,z1}:{x:cx,y:cz,x0,x1,z0,z1};'
 'if(sp==="stadium"){const X=cx-GS/2,O={k:"stad",col:"#b9bcc0",roof:"gable",rc:"#c8322a",nodraw:1};for(const q of[-1,1]){B.push(L22([X-58,cz+q*48-5],[X+58,cz+q*48+5],12,O));B.push(L22([X+q*68-7,cz-38],[X+q*68+7,cz+38],12,O))}}')
patch("stadion tribuny", 's.y+Math.sin(a)*r*.82]', 's.y+Math.sin(a)*r*.74]')
patch("stadion na mape", 'a.ellipse(s.x,s.y,68,53,0,0,7)', 'a.ellipse(s.x,s.y,68,48,0,0,7)')

# Cesta na zakladnu: pri zaloznej zakladni viedla uhlopriecne cez cele mesto, pri hlavnej splyvala s cestou II/503.
patch("letecka nizina",
 '{const m=P(HBASE.x+60,HBASE.y+70);road(m,ringAt(-2.4),"local","Letecká",30);road(m,IC1,"local","Letecká",30)}',
 '{const m=P(HBASE.x+(bB?-10:60),HBASE.y+70,bB?{end:1}:null);road(m,ringAt(bB?.55:-2.7),"local","Letecká",30);if(!bB)road(m,IC1,"local","Letecká",30)}')
patch("letecka hory",
 '{const m=P(HBASE.x+50,HBASE.y+70);road(m,ringAt(2.6),"local","Letecká",40);road(m,vA,"local","Letecká",60)}',
 '{const m=P(HBASE.x+50,HBASE.y+70);road(m,ringAt(bB?.45:2.6),"local","Letecká",40);road(m,bB?vB:vA,"local","Letecká",60)}')

# Volne miesto pre budovu: ziadna cesta ani voda pod podorysom.
FREE=('const moFree=(x0,z0,x1,z1)=>{const P=[[(x0+x1)/2,(z0+z1)/2]],nx=Math.max(1,Math.ceil((x1-x0)/5)),nz=Math.max(1,Math.ceil((z1-z0)/5));'
 'for(let k=0;k<=nx;k++){const x=x0+(x1-x0)*k/nx;P.push([x,z0],[x,z1])}for(let k=1;k<nz;k++){const z=z0+(z1-z0)*k/nz;P.push([x0,z],[x1,z])}'
 'for(const q of P){if(W3.river.length&&hPolyD(q[0],q[1],W3.river)<W3.rivW/2+3)return false;if(W3.lakes.some(l=>Math.hypot(l[0]-q[0],l[1]-q[1])<l[2]+3))return false}'
 'for(const e of E){if(!e.mb){let a=1e9,b=-1e9,c=1e9,f=-1e9;for(const q of e.pts){a=Math.min(a,q[0]);b=Math.max(b,q[0]);c=Math.min(c,q[1]);f=Math.max(f,q[1])}e.mb=[a,b,c,f]}'
 'const m=e.mb;if(x1<m[0]-12||x0>m[1]+12||z1<m[2]-12||z0>m[3]+12)continue;const w=HROAD[e.type].w/2+1;for(const q of P)if(hPolyD(q[0],q[1],e.pts)<w)return false}return true};')
patch("volne miesto", 'const rdNear=(x,y,r)=>E.some(e=>hPolyD(x,y,e.pts)<r);', 'const rdNear=(x,y,r)=>E.some(e=>hPolyD(x,y,e.pts)<r);'+FREE)

patch("domy obce mimo vody", 'if(rdNear(cx2,cz2,9)||B.some(', 'if(rdNear(cx2,cz2,9)||!moFree(cx2-7,cz2-7,cx2+7,cz2+7)||B.some(')
patch("kostol na volnom mieste",
 'const cx=n.x+30,cz=n.y-30;if(!rdNear(cx,cz,12))B.push(L22([cx-8,cz-16],[cx+8,cz+16],11,{k:"church",col:"#efe6d2",roof:"gable"}));',
 'let cx=n.x+30,cz=n.y-30,cok=false;for(const q of[[30,-30],[-30,-30],[30,30],[-30,30],[48,-48],[-48,-48],[48,48],[-48,48],[0,-60],[0,60],[60,0],[-60,0]]){const x=n.x+q[0],z=n.y+q[1];if(moFree(x-10,z-18,x+10,z+18)){cx=x;cz=z;cok=true;break}}'
 'if(cok){for(let i=B.length-1;i>=0;i--){const b=B[i];if(b.k==="res"&&b.x1>cx-11&&b.x0<cx+11&&b.z1>cz-19&&b.z0<cz+19)B.splice(i,1)}B.push(L22([cx-8,cz-16],[cx+8,cz+16],11,{k:"church",col:"#efe6d2",roof:"gable"}))}')
patch("majer na volnom mieste",
 'if(rdNear(cx,cz,10))continue;const big=k===0;',
 'const big=k===0;if(rdNear(cx,cz,10)||!moFree(cx-(big?15:7),cz-(big?10:6),cx+(big?15:7),cz+(big?10:6)))continue;')

# Predmestie: rodinne domy za okruznou cestou a pri vypadovkach, dalej sklady a cerpacie stanice.
SUB=('try{if(!mtn&&W3.city){const C2=W3.city,RR2=C2.r,PL=["#e9dfc8","#efe6d2","#d9cfb8","#e6d8c0","#dfe3d6","#f0e0c8"],RF=["#a33a2e","#8e3b2e","#7a3a2a","#6e7884","#9a4a32"],WC=["#b9bdc2","#c9c2b0","#9fb0c0","#c4c9bd"],ST=["#c8322a","#2f5aa8","#3a8a5a","#e0a030"],FU=new Set,'
 'clr=(x0,z0,x1,z1,m)=>!B.some(b=>{const q=m+(b.pad||0);return x1>b.x0-q&&x0<b.x1+q&&z1>b.z0-q&&z0<b.z1+q}),'
 'put=(cx,cz,hx,hz,h,o,m)=>{const r=Math.max(hx,hz);if(!moFree(cx-r,cz-r,cx+r,cz+r)||!clr(cx-r,cz-r,cx+r,cz+r,m))return false;B.push(L22([cx-hx,cz-hz],[cx+hx,cz+hz],h,o));return true},'
 'house=(x,z,a)=>put(x,z,5+R(),4.5,5.5+R()*1.8,{k:"res",col:pick2(R,PL),roof:"gable",rc:pick2(R,RF),gard:1,ang:a},5);'
 'E.forEach(e=>{const ring=e.name==="Okružná";if(!ring&&e.type!=="main"&&e.type!=="sec")return;'
 'for(let s=ring?12:30;s<e.len-(ring?12:20);s+=ring?24:46){const p=hPtAt(e.pts,e.cum,s),r=Math.hypot(p.x-C2.x,p.y-C2.y),nx=-Math.sin(p.a),nz=Math.cos(p.a),hw=HROAD[e.type].w/2;'
 'if(ring){const sd=(p.x-C2.x)*nx+(p.y-C2.y)*nz>0?1:-1;for(const q of[[hw+15,.9],[hw+41,.6]]){if(R()>q[1])continue;house(p.x+nx*q[0]*sd,p.y+nz*q[0]*sd,p.a)}continue}'
 'if(r<RR2+45||r>RR2+440)continue;for(const sd of[1,-1]){const h=R();'
 'if(e.type==="main"&&sd===1&&r>RR2+110&&r<RR2+300&&!FU.has(e.name)&&FU.size<2){if(put(p.x+nx*(hw+23),p.y+nz*(hw+23),4.5,5,4.2,{k:"fuel",col:"#eef1f3",roof:"flat",ang:p.a,rs:-1,pad:16},19)){FU.add(e.name);continue}}'
 'if(r<RR2+240){if(h<.8)house(p.x+nx*(hw+13)*sd,p.y+nz*(hw+13)*sd,p.a);if(R()<.7){const p2=hPtAt(e.pts,e.cum,s+23);house(p2.x-Math.sin(p2.a)*(hw+13)*sd,p2.y+Math.cos(p2.a)*(hw+13)*sd,p2.a)}}else if(h<.55)put(p.x+nx*(hw+26)*sd,p.y+nz*(hw+26)*sd,11,11,7.5+R()*3,{k:"ware",col:pick2(R,WC),roof:"flat",stripe:pick2(R,ST),ang:p.a,rs:-sd},10)}}})}}catch(x){console.warn("predmestie",x)}')

# Na konci (aj po lesnych cestach) vyhodi vsetky budovy, ktore este stoja na ceste alebo vo vode.
patch("budovy mimo ciest a vody",
 'W3.town=[];return W3}function pick2',
 SUB+'{const keep=B.filter(b=>b.nodraw||b.k==="hangar"||b.k==="tower2"||(b.ang!=null?moFree((b.x0+b.x1)/2-6,(b.z0+b.z1)/2-6,(b.x0+b.x1)/2+6,(b.z0+b.z1)/2+6):moFree(b.x0,b.z0,b.x1,b.z1)));'
 '{B.length=0;keep.forEach(b=>B.push(b));W3.bg=new Map;B.forEach((b,i)=>{for(let gx=Math.floor(b.x0/50);gx<=Math.floor(b.x1/50);gx++)for(let gz=Math.floor(b.z0/50);gz<=Math.floor(b.z1/50);gz++){const k=gx+","+gz;(W3.bg.get(k)||W3.bg.set(k,[]).get(k)).push(i)}})}}'
 'E.forEach((e,i)=>{if(e.type!=="dirt")return;for(let si=1;si<e.pts.length;si++)for(let k=1;k<W3.river.length;k++){const x=hSegX(e.pts[si-1],e.pts[si],W3.river[k-1],W3.river[k]);if(x)W3.bridges.push({e:i,x:x.x,y:x.y,a:Math.atan2(e.pts[si][1]-e.pts[si-1][1],e.pts[si][0]-e.pts[si-1][0]),w:HROAD.dirt.w})}});'
 'W3.town=[];return W3}function pick2')

patch("sklady bez okien",'wl,b.k==="barn"||b.k==="hangar"?0:8,','wl,b.k==="barn"||b.k==="hangar"||b.k==="ware"||b.k==="fuel"?0:8,')
open(p,"w",encoding="utf8",newline="").write(d)
