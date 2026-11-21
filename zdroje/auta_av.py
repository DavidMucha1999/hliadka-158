# Vozidla: odstrani vlozene detailne modely aut (CMOD) a vlozi vlastne upravy sluzobnych aut.
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
n0=len(d)
d,k=re.subn(r'CMOD\.\w+=\{meta:\{.*?,tex:"data:image/webp;base64,[A-Za-z0-9+/=]*"\};',"",d,flags=re.S)
print("odstranene modely:",k,"usetrene",n0-len(d))
if k!=12 and "CMOD.lambo" in d: sys.exit("modely")
patch("auta vlastnym generatorom",'const pr=!o.noK&&kProf(sp,o)','const pr=null')
patch("premavka so znackou",'sp:SPECS[HSP[c.kind]]||SPECS.hatch,o:{color:c.col[1],mk:"",police:!!c.pol,liv:"SK",lc:"bb",lights:!!(c.pol&&(c.goal||c.resp))},d:-c.y','sp:avSp(c),o:avO(c,(c.x-hp.x)*(c.x-hp.x)+(c.y-hp.y)*(c.y-hp.y)>12100),d:-c.y')
patch("kolesa aut v premavke",'yaw:Math.atan2(-Math.cos(c.a),-Math.sin(c.a)),dist:c.s,fl:[0,0,N*.35]','yaw:Math.atan2(-Math.cos(c.a),-Math.sin(c.a)),dist:c.t||0,fl:[0,0,N*.35]')
patch("viac modelov v pamati",'if(G3.vcache.size>120){','if(G3.vcache.size>220){')
sys.path.insert(0,os.path.join(here,"auta"))
import nazvy
_n=0
for zn,st,nv in nazvy.MODELY:
    a1='{m:"%s",mo:"%s",'%(zn,st)
    if d.count(a1)<1: print("NAZOV VZOR",zn,st,d.count(a1));sys.exit(1)
    d=d.replace(a1,'{m:"%s",mo:"%s",'%(zn,nv))
    _n+=d.count('"%s %s"'%(zn,st));d=d.replace('"%s %s"'%(zn,st),'"%s %s"'%(zn,nv))
for st,nv in nazvy.CELE:
    if d.count('"'+st+'"')<1: print("NAZOV VZOR",st);sys.exit(1)
    d=d.replace('"'+st+'"','"'+nv+'"')
print("nazvy: ok",_n)
patch("sportove modely podla novych nazvov","/GT|RS|M5|Inovec|Sokol|911|Kuna|Type R|AMG/","/GT|RS|Inovec|Sokol|Strela|Orol|Dravec|Zenit|Šíp|Čepeľ|Orkán|Víchor|Kuna/")
patch("hlasenie vrtulnika so znackou",'`Potvrdzujem, vozidlo ${o.col[0]} ${o.kind}, ${hEdgeName(sh.W,o.e)}.','`Potvrdzujem, vozidlo ${o.col[0]} ${avName(o)}, ${hEdgeName(sh.W,o.e)}.')
# krok 1 grafiky vozidiel: farba laku sa posiela pri kresleni, jeden model sluzi pre vsetky farby
patch("lak nastavenie v programe",'uniform float uGrade;uniform sampler2D uLit;','uniform float uGrade;uniform vec4 uPaint,uPaintP;uniform float uTint;uniform sampler2D uLit;')
patch("lak v programe",'vec3 base=vC.rgb;vec3 n=normalize(vN);','vec3 base=vC.rgb;if(uPaint.a>.5){float pw=min(base.r,base.b)-base.g;if(pw>.004&&abs(base.r-base.b)<.012)base=uPaint.rgb*pw+vec3(base.g);}vec3 n=normalize(vN);')
patch("deformacia kluc modelu",'o.mk||"",o.kn||"",o.model?','o.mk||"",(o.dmF|0)+"d"+(o.dmR|0)+(o.dmA|0)+(o.dmB|0)+(o.acc||"")+(o.firm||""),o.kn||"",o.model?')
patch("autobus napis linky",'[0,0,0],15,[[dd[0],dd[3]],[dd[2],dd[3]],[dd[2],dd[1]],[dd[0],dd[1]]]','[0,0,0],15,[[dd[2],dd[3]],[dd[0],dd[3]],[dd[0],dd[1]],[dd[2],dd[1]]]')
patch("kamion napis znacky",'dark,14,[[ld[0],ld[3]],[ld[2],ld[3]],[ld[2],ld[1]],[ld[0],ld[1]]]','dark,14,[[ld[2],ld[3]],[ld[0],ld[3]],[ld[0],ld[1]],[ld[2],ld[1]]]')
patch('tvar rohy','const t=1-Math.max(0,e)/E;return 1-.34*t*t*(1-.3*t)}','const t=1-Math.max(0,e)/E;return 1-.37*Math.pow(t,2.4)}')
patch('tvar bok','FP=[[bot,.89],[bot+.05,.94],[bot+.11,.975],[bot+B*.55,1],[belt-B*.18,.995],[belt-B*.06,.975],[belt,.95]]','FP=[[bot,.85],[bot+.05,.915],[bot+.11,.955],[bot+B*.32,.992],[bot+B*.55,1],[belt-B*.18,.985],[belt-B*.06,.952],[belt,.915]]')
patch('tvar bok koniec','*Math.max(0,Math.min(1,t))}return .95};const tw0=hw*(sp.van?.9:.76)','*Math.max(0,Math.min(1,t))}return .915};const tw0=hw*(sp.van?.88:.71)')
patch('tvar blatniky','lw=ys.map(y=>fac(y)*hw*k),','lw=ys.map(y=>fac(y)*hw*k+avFl(sp,x,y,arR,wy)),')
patch('tvar klenutie','crown:yt+(gh?.032:.024)}','crown:yt+(gh?.05:.048)}')
patch('tvar napisy na boku','const sideQ=(xa,xb,y0,y1,c,m,uv,off,s)=>{','const sideQ=(xa,xb,y0,y1,c,m,uv,off,s)=>{const ny=y1-y0>.12?4:1;for(let j=0;j<ny;j++)sideQ0(xa,xb,y0+(y1-y0)*j/ny,y0+(y1-y0)*(j+1)/ny,c,m,uv?[uv[0],uv[3]+(uv[1]-uv[3])*(j+1)/ny,uv[2],uv[3]+(uv[1]-uv[3])*j/ny]:null,off,s)},sideQ0=(xa,xb,y0,y1,c,m,uv,off,s)=>{')
patch('policajna dodavka napis','xb=Math.min(W3[3][0]+.05,x1-.9),ya=Math.max(.82,belt-B*.33),yb=belt-.05;[-1,1].forEach(s=>sideQ(s>0?xa:xb,s>0?xb:xa,ya,yb,col,14,d,.009,s))','xb=Math.min(W3[3][0]+.05,x1-.9),ya=Math.max(.82,belt-B*.33),yb=belt-.05;[-1,1].forEach(s=>sp.van?sideQ(s>0?1.1:3.3,s>0?3.3:1.1,belt+.02,belt+.5,col,14,d,.009,s):sideQ(s>0?xa:xb,s>0?xb:xa,ya,yb,col,14,d,.009,s))')
patch('zrkadla mensie','G.bbox(s>0?ml:-ml-.21,s>0?ml+.21:-ml,my,my+.13,Z(mx)-.06,Z(mx)+.09,.04,st.two||police&&liv==="US"?dark:col,1,{smooth:true});G.quad([s*(ml+.03),my+.015,Z(mx)+.092],[s*(ml+.19),my+.015,Z(mx)+.092],[s*(ml+.19),my+.115,Z(mx)+.092],[s*(ml+.03),my+.115,Z(mx)+.092],[.25,.27,.3],3);G.box(s*(ml+.15),s*(ml+.2),my+.02,my+.04,Z(mx)-.02,Z(mx)+.08,amb,12);','G.box(s>0?ml-.02:-ml-.05,s>0?ml+.05:-ml+.02,my+.02,my+.06,Z(mx)-.03,Z(mx)+.03,dark,0);G.bbox(s>0?ml+.03:-ml-.19,s>0?ml+.19:-ml-.03,my,my+.105,Z(mx)-.05,Z(mx)+.06,.035,st.two||police&&liv==="US"?dark:col,1,{smooth:true});G.quad([s*(ml+.045),my+.015,Z(mx)+.062],[s*(ml+.175),my+.015,Z(mx)+.062],[s*(ml+.175),my+.09,Z(mx)+.062],[s*(ml+.045),my+.09,Z(mx)+.062],[.25,.27,.3],3);G.box(s*(ml+.13),s*(ml+.185),my+.02,my+.035,Z(mx)-.052,Z(mx)-.02,amb,12);')
patch("stopy material",'else if(m==4.){emis=.06+3.*uFlash.x;}','else if(m==44.){spec=0.;env=0.;alpha=.72;}  else if(m==4.){emis=.06+3.*uFlash.x;}')
patch("stopy hlbka",'mb==35.?4.:0.','mb==35.?4.:mb==44.?5.:0.')
patch("naklon matica",'const vm=g3Veh(v.sp,v.o),M=M4.trs(v.x,v.y||0,-v.d,v.yaw);if(vm.tex)','const vm=g3Veh(v.sp,v.o),M0=M4.trs(v.x,v.y||0,-v.d,v.yaw),M=v.tilt?avTiltM(M0,v.tilt):M0;if(vm.tex)')
patch("naklon kolesa",'if(Math.abs(v.d)<160||R.studio||R.custom)g3Wheels(draw2,v,vm,M)}for(const p of R.persons||[]){if(p.a===0)','if(Math.abs(v.d)<160||R.studio||R.custom)g3Wheels(draw2,v,vm,M0)}for(const p of R.persons||[]){if(p.a===0)')
patch("natocenie kolies",'draw2(g3WheelM(wh.k||"5",0),M4.mul(M,M4.mul(M4.tr(wh.lat,wh.r,wh.z),M4.rx(spin,wh.w,wh.r,wh.r))),true)','draw2(g3WheelM(wh.k||"5",0),M4.mul(M,M4.mul(v.steer&&wh.z<0?M4.trs(wh.lat,wh.r,wh.z,v.steer):M4.tr(wh.lat,wh.r,wh.z),M4.rx(spin,wh.w,wh.r,wh.r))),true)')
patch("naklon premavka",'dist:c.t||0,fl:[0,0,N*.35]})}let h158n','dist:c.t||0,fl:[0,0,N*.35],tilt:c.avTl,steer:c.avSt?-c.avSt:0})}let h158n')
patch("para material",'else if(m==4.){emis=.06+3.*uFlash.x;}','else if(m>40.5&&m<43.5){spec=0.;env=0.;float sf=max(dot(n,V),0.);alpha=(m<41.5?.34:m<42.5?.22:.11)*sf*sf;base=mix(base,uFogC,.25);}  else if(m==4.){emis=.06+3.*uFlash.x;}')
patch("lak kluc modelu",'[Object.keys(SPECS).find(k=>SPECS[k]===sp),o.color,o.police?o.liv+o.lc:""','[Object.keys(SPECS).find(k=>SPECS[k]===sp),avPaint(o)?"P":o.color,o.police?o.liv+o.lc:""')
patch("lak model bez farby",'const r=g3VehGeo(sp,o);v={m:g3UpSplit(r.geo),wheels:r.wheels,plates:r.plates,sp,tex:r.tex};','const pn=avPaint(o),r=g3VehGeo(sp,pn?Object.assign({},o,{color:"#ff00ff"}):o);v={m:g3UpSplit(r.geo),wheels:r.wheels,plates:r.plates,sp,tex:r.tex,pnt:pn};')
patch("lak pri kresleni",'if(vm.tex)cmBind(gl,vm.tex);draw2(vm.m,M,true,v.fl);','if(vm.tex)cmBind(gl,vm.tex);if(vm.pnt&&U2.uPaint){const pc=v.o._pc&&v.o._pcs===v.o.color?v.o._pc:(v.o._pcs=v.o.color,v.o._pc=g3L(v.o.color||"#9aa3ad"));gl.uniform4f(U2.uPaint,pc[0],pc[1],pc[2],1);if(U2.uPaintP){const pp=avPP(v.o);gl.uniform4f(U2.uPaintP,pp[0],pp[1],pp[2],0)}}draw2(vm.m,M,true,v.fl);if(vm.pnt&&U2.uPaint){gl.uniform4f(U2.uPaint,0,0,0,0);if(U2.uPaintP)gl.uniform4f(U2.uPaintP,0,0,0,0)}')
patch("vsetky farby v premavke",'const cols=COLORS.slice(0,8);','const cols=COLORS;')
# krok 2: jednoduche modely (KDATA) sa uz nepouzivaju – odstranit ich data
_k0=len(d)
d,_kn=re.subn(r'const KDATA=\{.*?\};const KBIN_GZ=1;const KBIN="[^"]*"','const KDATA={};const KBIN_GZ=0;const KBIN=""',d,count=1,flags=re.S)
print("jednoduche modely:",_kn,"usetrene",_k0-len(d))
if _kn!=1 and 'const KBIN=""' not in d: sys.exit("kdata")
# krok 4 grafiky: metaliza, perlet, vek laku, hrdza, spina podla auta, tonovane skla
_v="varying vec3 vW,vN;varying vec4 vC;varying vec2 vU;"
if d.count(_v)<2: sys.exit("varying")
d=d.replace(_v,_v+"varying vec3 vO;");print("varying: ok")
patch("poloha na aute","vW=w.xyz;vN=normalize((uM*vec4(aN,0.)).xyz);vC=aC;vU=aU;","vW=w.xyz;vN=normalize((uM*vec4(aN,0.)).xyz);vC=aC;vU=aU;vO=aP;")
patch("lak materialy",'spec*=1.-dm*.7;env*=1.-dm*.8;}}','spec*=1.-dm*.7;env*=1.-dm*.8;}if(uPaint.a>.5){float ndv=max(dot(n,V),0.);float mt=uPaintP.x;if(mt>.5){base*=.74+.42*ndv*ndv;spec*=1.9;shin=70.;env*=1.25;if(mt>1.5)base+=vec3(.05,.02,.07)*(1.-ndv)*(.5+base.g);}float ag=uPaintP.y;if(ag>0.){float lu=dot(base,vec3(.3,.59,.11));base=mix(base,vec3(lu)*1.12+.02,ag*.4);spec*=1.-ag*.8;env*=1.-ag*.85;float ru=ag*smoothstep(.52,.72,nz(vO.xz*4.3+vO.y*6.1)*.6+nz(vO.zy*17.)*.4)*(1.-smoothstep(.45,1.15,vO.y));base=mix(base,vec3(.2,.075,.03)*(.7+.6*nz(vO.xz*40.)),clamp(ru*1.3,0.,.85));spec*=1.-ru;env*=1.-ru;}float dz=uPaintP.z;if(dz>0.){float dm2=dz*(1.-smoothstep(.3,1.35,vO.y))*(.4+.6*nz(vO.xz*6.+vO.y*9.));base=mix(base,vec3(.3,.26,.2),clamp(dm2*.85,0.,.7));spec*=1.-dm2*.7;env*=1.-dm2*.8;}}}')
patch("tonovane sklo v programe",'alpha=.62+.35*fr;base=vec3(.025,.032,.04);}}','alpha=.62+.35*fr;base=vec3(.025,.032,.04);if(uTint>.5){alpha=max(alpha,.93);base=vec3(.012,.014,.018);}}}')
patch("tonovane sklo pri kresleni",'for(const v of gv)draw2(v.gm,v.gM,true,v.fl);gl.uniform1f(U2.uGlass,0);','for(const v of gv){if(U2.uTint)gl.uniform1f(U2.uTint,avPP(v.o)[3]);draw2(v.gm,v.gM,true,v.fl)}if(U2.uTint)gl.uniform1f(U2.uTint,0);gl.uniform1f(U2.uGlass,0);')
js=os.path.join(here,"auta","av.js")
if os.path.exists(js): block("auta-av",open(js,encoding="utf8").read())
css=os.path.join(here,"auta","av.css")
if os.path.exists(css):
    d=re.sub(r'<style id="av-css">.*?</style>',"",d,flags=re.S)
    i=d.find("</head>");d=d[:i]+'<style id="av-css">'+chr(10)+open(css,encoding="utf8").read()+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
