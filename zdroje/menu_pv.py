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
N=["Pôvodné","Garáž – scéna cez celú obrazovku","Nástenka – dlaždice služieb","Mapa služieb","Tri kroky","Služobný preukaz"]
OPT="".join('<option value="%d" ${(s.menuPv==null?4:+s.menuPv)===%d?"selected":""}>%s</option>'%(i,i,n) for i,n in enumerate(N))
OLD='<div class="rrow"><span>Pomoc pri kontrole vodiča</span>'
patch("nastavenia vzhlad",OLD,'<div class="rrow"><span>Vzhľad hlavnej obrazovky</span><select id="pv-pick">'+OPT+'</select></div>'+chr(10)+'    <div class="rrow"><span>Živé pozadie hlavnej obrazovky</span><select id="pvbg-pick"><option value="on" ${s.menuBg!==false?"selected":""}>Zapnuté – mapa okresu s premávkou</option><option value="off" ${s.menuBg===false?"selected":""}>Vypnuté</option></select></div>'+chr(10)+'    '+OLD)
block("menu-pv",open(os.path.join(here,"menu","pv.js"),encoding="utf8").read())
css=open(os.path.join(here,"menu","pv.css"),encoding="utf8").read()
d=re.sub(r'<style id="pv-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="pv-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
