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
patch("spz v popise",'const l1=`${vName(c)}${c.ct!==curCt()?" ("+c.ct+")":""}`','const l1=`${vName(c)}${c.ct!==curCt()?" ("+c.ct+")":""}${c.measured?" · "+c.plate:""}`',2)
block("stop-f3",open(os.path.join(here,"stop","f3.js"),encoding="utf8").read())
css=open(os.path.join(here,"stop","f3.css"),encoding="utf8").read()
d=re.sub(r'<style id="f3-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="f3-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
