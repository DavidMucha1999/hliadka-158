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
patch("rucny radar",'if(!c.measured&&!c.police&&(c.dir>0?c.x>=radarThr():c.x<=1-radarThr())){','if(!c.measured&&!c.police&&!f2Man()&&(c.dir>0?c.x>=radarThr():c.x<=1-radarThr())){')
patch("radar ciary",'[[1,nd>0?thr:1-thr,3.6],[0,nd>0?1-thr:thr,-9.2]].forEach(','(f2Man()?[]:[[1,nd>0?thr:1-thr,3.6],[0,nd>0?1-thr:thr,-9.2]]).forEach(')
patch("hover text",':"nezmerané · klik = zastaviť"',':(f2Man()?"mier radarom…":"nezmerané")+" · klik = zastaviť"')
patch("obhliadka priekopa",'motor:"Kryt motora je zle dosadnutý, akoby ho niekto nedávno otváral."}[c.hid.part]','motor:"Kryt motora je zle dosadnutý, akoby ho niekto nedávno otváral.",okolie:"V priekope pri aute leží čerstvo pohodený balíček."}[c.hid.part]')
patch("hint",'"Klikni na vozidlo a zastavíš ho. Zmerané autá zastavíš aj klávesmi 1 – 5 podľa zoznamu pod radarom."','"Namier kurzor na vozidlo a radar ho zmeria. Kliknutím ho zastavíš, zmerané autá aj klávesmi 1 – 5."')
patch("limit text",'tl=lim!==l.limit?','tl=lim!==l.limit&&!(f2Post()&&f2Post().lim===lim)?')
patch("limit stanoviste",'const limitFor=c=>{const l=curLoc();','const limitFor=c=>f2Lim(c,limitFor0(c));const limitFor0=c=>{const l=curLoc();')
block("stop-f2",open(os.path.join(here,"stop","f2.js"),encoding="utf8").read())
css=open(os.path.join(here,"stop","f2.css"),encoding="utf8").read()
d=re.sub(r'<style id="f2-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="f2-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
