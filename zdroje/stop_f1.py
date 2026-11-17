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
patch("tip kontrola",'"Rozhodni sa klávesmi Q až T podľa najprísnejšieho priestupku."','"Otázky klávesmi A – H, rozpory vo výpovedi označ. Z otvorí záznam o priestupku, Q vodiča pustí."')
block("stop-f1",open(os.path.join(here,"stop","f1.js"),encoding="utf8").read())
css=open(os.path.join(here,"stop","f1.css"),encoding="utf8").read()
d=re.sub(r'<style id="f1-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="f1-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
