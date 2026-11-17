import re, sys, os
p=sys.argv[1];here=os.path.dirname(os.path.abspath(__file__))
d=open(p,encoding="utf8",newline="").read()
def patch(name,old,new,n=1):
    global d
    if new in d: print(name+": uz");return
    if d.count(old)!=n: print(name+": VZOR (%d)"%d.count(old));sys.exit(1)
    d=d.replace(old,new);print(name+": ok")
def block(name,code):
    global d
    d=re.sub(r"/\*<"+name+r">\*/.*?/\*</"+name+r">\*/","",d,flags=re.S)
    GO='{const _go=d=>{showLoad();gzReady().then('
    if d.count(GO)!=1: sys.exit("GO")
    d=d.replace(GO,"/*<"+name+">*/"+code+"/*</"+name+">*/"+GO);print(name+": vlozene")
# kluc cache auta: spolujazdec a vodic vonku
patch("cache kluc",'o.empty?1:0,o.ride?1:0,DEC.gen].join("|")','o.empty?1:0,o.ride?1:0,o.pax?o.pax.join(""):"",o.out?1:0,DEC.gen].join("|")')
# vodic v aute sa nekresli, ked je vonku
patch("vodic vonku",'G.bbox(-.38-.2,-.38+.2,iy2+.3,hy-.13,hz-.12,hz+.1,.07,police?g3L("#1c2a47"):sh,0,{smooth:true});G.blob(-.38,hy,hz-.02,.1,.12,.11,sk,0,5);G.blob(-.38,hy+.07,hz+.01,.11,.07,.115,g3L(police?"#1c2a47":o.hair||"#2a2018"),0,6);',
 'if(!o.out){G.bbox(-.38-.2,-.38+.2,iy2+.3,hy-.13,hz-.12,hz+.1,.07,police?g3L("#1c2a47"):sh,0,{smooth:true});G.blob(-.38,hy,hz-.02,.1,.12,.11,sk,0,5);G.blob(-.38,hy+.07,hz+.01,.11,.07,.115,g3L(police?"#1c2a47":o.hair||"#2a2018"),0,6)}')
# spolujazdec na pravom sedadle
patch("spolujazdec",'G.blob(.38,hy,hz-.02,.1,.12,.11,g3L("#e8c0a0"),0,8)}}',
 'G.blob(.38,hy,hz-.02,.1,.12,.11,g3L("#e8c0a0"),0,8)}else if(o.pax){G.bbox(.38-.2,.38+.2,iy2+.3,hy-.13,hz-.12,hz+.1,.07,g3L(o.pax[1]),0,{smooth:true});G.blob(.38,hy,hz-.02,.1,.12,.11,g3L(o.pax[0]),0,8);G.blob(.38,hy+.07,hz+.01,.11,.07,.115,g3L(o.pax[2]),0,6)}}')
block("stop-f5",open(os.path.join(here,"stop","f5.js"),encoding="utf8").read())
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
