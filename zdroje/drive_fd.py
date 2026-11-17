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
block("drive-fd",open(os.path.join(here,"drive","fd.js"),encoding="utf8").read())
css=open(os.path.join(here,"drive","fd.css"),encoding="utf8").read()
d=re.sub(r'<style id="fd-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="fd-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
