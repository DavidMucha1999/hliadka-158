import re, sys, os
p=sys.argv[1];here=os.path.dirname(os.path.abspath(__file__))
d=open(p,encoding="utf8",newline="").read()
def block(name,code):
    global d
    d=re.sub(r"/\*<"+name+r">\*/.*?/\*</"+name+r">\*/","",d,flags=re.S)
    GO='{const _go=d=>{showLoad();gzReady().then('
    if d.count(GO)!=1: sys.exit("GO")
    d=d.replace(GO,"/*<"+name+">*/"+code+"/*</"+name+">*/"+GO);print(name+": vlozene")
block("stop-f7",open(os.path.join(here,"stop","f7.js"),encoding="utf8").read())
css=open(os.path.join(here,"stop","f7.css"),encoding="utf8").read()
d=re.sub(r'<style id="f7-css">.*?</style>',"",d,flags=re.S)
i=d.find("</head>");d=d[:i]+'<style id="f7-css">\n'+css+'</style>'+d[i:]
open(p,"w",encoding="utf8",newline="").write(d);print("hotovo",len(d))
