import re, sys, os
p=sys.argv[1];here=os.path.dirname(os.path.abspath(__file__))
d=open(p,encoding="utf8",newline="").read()
def block(name,code):
    global d
    d=re.sub(r"/\*<"+name+r">\*/.*?/\*</"+name+r">\*/","",d,flags=re.S)
    GO='{const _go=d=>{showLoad();gzReady().then('
    if d.count(GO)!=1: sys.exit("GO")
    d=d.replace(GO,"/*<"+name+">*/"+code+"/*</"+name+">*/"+GO);print(name+": vlozene")
A='const sx=(C.sly-1)*LW;if(C.gap>0&&!(C.dark&&C.gap>80)){'
B='}if(C.fx){const now=performance.now();'
NEW='const sx=(C.sly-1)*LW;if(C.gap>0){const d=Math.min(C.gap,620),p=g3Proj(d,sx,C.gap>620?0:C.sspec.h+.5);if(p.z>0)f6Arrow(g2,w,h,p.x,p.y,C.gap,C.dark&&C.gap>80)}if(C.fx){const now=performance.now();'
if NEW in d: print("sipka: uz")
else:
    i=d.find(A)
    if i<0 or d.count(A)!=1: sys.exit("sipka: VZOR")
    j=d.find(B,i)
    if j<0 or j-i>2500: sys.exit("sipka: koniec")
    d=d[:i]+NEW+d[j+len(B):];print("sipka: ok")
block("chase-sip",open(os.path.join(here,"chase","sipka.js"),encoding="utf8").read())
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
