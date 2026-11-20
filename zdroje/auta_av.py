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
patch("auta vlastnym generatorom",'const pr=!o.noK&&kProf(sp,o)','const pr0=!o.noK&&!(o.police&&sp!==SPECS.tractor)&&kProf(sp,o),pr=pr0&&(o.lod||AVKIT.has(o.kn||pr0.b))?pr0:null')
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
patch("lak nastavenie v programe",'uniform float uGrade;uniform sampler2D uLit;','uniform float uGrade;uniform vec4 uPaint;uniform sampler2D uLit;')
patch("lak v programe",'vec3 base=vC.rgb;vec3 n=normalize(vN);','vec3 base=vC.rgb;if(uPaint.a>.5){float pw=min(base.r,base.b)-base.g;if(pw>.004&&abs(base.r-base.b)<.012)base=uPaint.rgb*pw+vec3(base.g);}vec3 n=normalize(vN);')
patch("lak kluc modelu",'[Object.keys(SPECS).find(k=>SPECS[k]===sp),o.color,o.police?o.liv+o.lc:""','[Object.keys(SPECS).find(k=>SPECS[k]===sp),avPaint(o)?"P":o.color,o.police?o.liv+o.lc:""')
patch("lak model bez farby",'const r=g3VehGeo(sp,o);v={m:g3UpSplit(r.geo),wheels:r.wheels,plates:r.plates,sp,tex:r.tex};','const pn=avPaint(o),r=g3VehGeo(sp,pn?Object.assign({},o,{color:"#ff00ff"}):o);v={m:g3UpSplit(r.geo),wheels:r.wheels,plates:r.plates,sp,tex:r.tex,pnt:pn};')
patch("lak pri kresleni",'if(vm.tex)cmBind(gl,vm.tex);draw2(vm.m,M,true,v.fl);','if(vm.tex)cmBind(gl,vm.tex);if(vm.pnt&&U2.uPaint){const pc=v.o._pc&&v.o._pcs===v.o.color?v.o._pc:(v.o._pcs=v.o.color,v.o._pc=g3L(v.o.color||"#9aa3ad"));gl.uniform4f(U2.uPaint,pc[0],pc[1],pc[2],1)}draw2(vm.m,M,true,v.fl);if(vm.pnt&&U2.uPaint)gl.uniform4f(U2.uPaint,0,0,0,0);')
patch("vsetky farby v premavke",'const cols=COLORS.slice(0,8);','const cols=COLORS;')
js=os.path.join(here,"auta","av.js")
if os.path.exists(js): block("auta-av",open(js,encoding="utf8").read())
css=os.path.join(here,"auta","av.css")
if os.path.exists(css):
    d=re.sub(r'<style id="av-css">.*?</style>',"",d,flags=re.S)
    i=d.find("</head>");d=d[:i]+'<style id="av-css">'+chr(10)+open(css,encoding="utf8").read()+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
