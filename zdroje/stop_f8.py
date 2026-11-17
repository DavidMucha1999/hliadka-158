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
patch("nastavenia pomoc",'<div class="rrow"><span>Hlas postáv</span>','<div class="rrow"><span>Pomoc pri kontrole vodiča</span><select id="hl-pick"><option value="easy" ${s.helpLvl==="easy"?"selected":""}>Ľahká – tipy, dôkazy, návrhy opatrení</option><option value="norm" ${s.helpLvl!=="easy"&&s.helpLvl!=="hard"?"selected":""}>Normálna</option><option value="hard" ${s.helpLvl==="hard"?"selected":""}>Ťažká – bez pomôcok</option></select></div>\n    <div class="rrow"><span>Hlas postáv</span>')
patch("nastavenia pomoc obsluha",'const hvp=$("#hv-pick");','const hlp=$("#hl-pick");if(hlp)hlp.onchange=()=>{s.helpLvl=hlp.value;persist();toast("Pomoc pri kontrole: "+hlp.options[hlp.selectedIndex].text.split(" –")[0])};const hvp=$("#hv-pick");')
block("stop-f8",open(os.path.join(here,"stop","f8.js"),encoding="utf8").read())
css=open(os.path.join(here,"stop","f8.css"),encoding="utf8").read()
d=re.sub(r'<style id="f8-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="f8-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
