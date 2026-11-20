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
patch("premavka so znackou",'sp:SPECS[HSP[c.kind]]||SPECS.hatch,o:{color:c.col[1],mk:"",police:!!c.pol,liv:"SK",lc:"bb",lights:!!(c.pol&&(c.goal||c.resp))},d:-c.y','sp:avSp(c),o:avO(c,(c.x-hp.x)*(c.x-hp.x)+(c.y-hp.y)*(c.y-hp.y)>5600),d:-c.y')
patch("kolesa aut v premavke",'yaw:Math.atan2(-Math.cos(c.a),-Math.sin(c.a)),dist:c.s,fl:[0,0,N*.35]','yaw:Math.atan2(-Math.cos(c.a),-Math.sin(c.a)),dist:c.t||0,fl:[0,0,N*.35]')
patch("viac modelov v pamati",'if(G3.vcache.size>120){','if(G3.vcache.size>220){')
js=os.path.join(here,"auta","av.js")
if os.path.exists(js): block("auta-av",open(js,encoding="utf8").read())
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
