import re, sys, os
p = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
d = open(p, encoding="utf8", newline="").read()

def patch(name, old, new):
    global d
    if new in d:
        print(name + ": uz"); return
    if d.count(old) != 1:
        print(name + ": VZOR (%d)" % d.count(old)); sys.exit(1)
    d = d.replace(old, new); print(name + ": ok")

def block(name, code):
    global d
    d = re.sub(r"/\*<" + name + r">\*/.*?/\*</" + name + r">\*/", "", d, flags=re.S)
    GO = '{const _go=d=>{showLoad();gzReady().then('
    if d.count(GO) != 1: sys.exit("GO")
    d = d.replace(GO, "/*<" + name + ">*/" + code + "/*</" + name + ">*/" + GO)
    print(name + ": vlozene")

HXON = '(window.__hxOn&&__hxOn())'
# typy misii v rezime Posadka (faza 1)
patch("hx typy", 'const t=hWpick(ty),M={t,t0:null', 'const t=hWpick(window.__hxTy?__hxTy(ty):ty),M={t,t0:null')
# faza 4: specialne misie (lodka, lad, hranica, dron, kolona, koncert, cyklisti, rybari) sa odomykaju licenciou
FORCED = 'if(R()>.42||tot<=0||(S.save&&S.save.hx!==false))return n0();'
if FORCED in d:
    d = d.replace(FORCED, 'if(R()>.42||tot<=0)return n0();'); print("hx specialne: vratene")
patch("hx specialne odomknute",
 'if(r<=0){t=o[0];break}}const M={t,t0:null,wrong:0,prog:0,phase:"fly",hint:0,ind:[],rep:0,repOk:0,evt:0,evm:0},T=hTer();',
 'if(r<=0){t=o[0];break}}if(window.__hxTyOk&&!__hxTyOk(t))return n0();const M={t,t0:null,wrong:0,prog:0,phase:"fly",hint:0,ind:[],rep:0,repOk:0,evt:0,evm:0},T=hTer();')
# panel nahradza kroky misie a hliadkovanie v platne
patch("hx kroky", 'if(!HMOB()){const steps=HSTEP[M.t]||HSTEP.car,cur=', 'if(!HMOB()&&!' + HXON + '){const steps=HSTEP[M.t]||HSTEP.car,cur=')
patch("hx hliadkovanie", 's}`,28,y)})}}else if(!sh.offer&&!sh.trn&&!HMOB()){', 's}`,28,y)})}}else if(!sh.offer&&!sh.trn&&!HMOB()&&!' + HXON + '){')
patch("hx hlasenie", 'if(M&&M.ev&&!HMOB()){', 'if(M&&M.ev&&!HMOB()&&!' + HXON + '){')
patch("hx zoom tlacidlo", 'const on=S.screen==="heli"&&sh&&sh.heli&&sh.fl&&sh.fl.cam==="belly";', 'const on=S.screen==="heli"&&sh&&sh.heli&&sh.fl&&sh.fl.cam==="belly"&&!(sh.hx&&sh.hx.seat==="op");')
patch("hx lista", '${M.ic} ${M.title} · zostáva <b>${Math.max(0,Math.ceil(M.lim-(sh.min-M.t0)))} min</b>',
 '${M.ic} ${M.title} · ${M.hx?"v akcii <b>"+Math.max(0,Math.round(sh.min-M.t0))+" min</b>":"zostáva <b>"+Math.max(0,Math.ceil(M.lim-(sh.min-M.t0)))+" min</b>"}')
patch("hx rychlost hliadok", '*(c.emer||c.unit&&c.goal?1.3:1)', '*(c.unit&&c.hxo?1.6:c.emer||c.unit&&c.goal?1.3:1)')
# nastavenia: rezim leteckej policie
patch("hx nastavenia",
 '<div class="rrow"><span>Hlas postáv</span>',
 '<div class="rrow"><span>Letecká polícia</span><select id="hx-pick"><option value="new" ${s.hx!==false?"selected":""}>Posádka – pilot a operátor (nový)</option><option value="old" ${s.hx===false?"selected":""}>Pôvodný režim</option></select></div>\n    <div class="rrow"><span>Hlas postáv</span>')
patch("hx nastavenia obsluha",
 'const hvp=$("#hv-pick");',
 'const hxp=$("#hx-pick");if(hxp)hxp.onchange=()=>{s.hx=hxp.value!=="old";persist();toast(s.hx?"Letecká polícia: režim Posádka. Prejaví sa pri ďalšej službe.":"Letecká polícia: pôvodný režim. Prejaví sa pri ďalšej službe.")};const hvp=$("#hv-pick");')

block("hgl-hx", open(os.path.join(here, "hx.js"), encoding="utf8").read())

CSS = '''<style id="hx-css">
body.hx-on #h17-co{display:none!important}
#hx-card{position:absolute;top:92px;left:50%;transform:translateX(-50%);width:min(640px,58%);z-index:6;pointer-events:none;
 background:rgba(8,13,24,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(140,175,235,.22);border-left:4px solid #4f8cff;
 border-radius:8px;padding:7px 12px 8px;color:#e8eef6;font-size:.88rem;line-height:1.35;box-shadow:0 6px 20px rgba(0,0,0,.25)}
#hx-card.urg{border-left-color:#ffb21f}#hx-card.act{border-left-color:#3ccb8c}
#hx-card .hx-h{display:flex;align-items:center;gap:10px;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}
#hx-card .hx-h b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ffcb5c}
#hx-card .hx-seat{padding:1px 8px;border-radius:5px;font-weight:800;font-size:.7rem}
#hx-card .hx-seat.pil{background:rgba(79,140,255,.3);color:#cfe0ff}#hx-card .hx-seat.op{background:rgba(60,203,140,.3);color:#c8f5df}
#hx-card .hx-tm{font-family:var(--f-mono,monospace);color:#cfd8e6}
#hx-card .hx-st{display:flex;gap:3px;margin:6px 0 2px}
#hx-card .hx-st i{flex:1;font-style:normal;text-align:center;font-size:.64rem;text-transform:uppercase;letter-spacing:.04em;padding:2px 0;border-radius:3px;background:rgba(255,255,255,.06);color:#7d8aa3}
#hx-card .hx-st i.d{background:rgba(60,203,140,.18);color:#9fe3c4}#hx-card .hx-st i.c{background:rgba(255,178,31,.85);color:#1a1000;font-weight:800}
#hx-card .hx-n{margin:5px 0 0}
#hx-card .hx-i{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:4px;font-size:.76rem;color:#b9c5d8}
#hx-card .hx-ok{color:#7ff0bd}#hx-card .hx-bad{color:#ff8a8a;font-weight:700}
#hx-card .hx-chk{display:flex;flex-wrap:wrap;gap:3px 12px;margin-top:6px;padding-top:5px;border-top:1px solid rgba(255,255,255,.1);font-size:.76rem}
#hx-card .hx-chk b{width:100%;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:#9fb0c8}
#hx-card .hx-chk.dim{color:#8b97ab}#hx-card .hx-chk .y{color:#7ff0bd}#hx-card .hx-chk .n{color:#ff8a8a}
#hx-card .hx-k{margin-top:6px;font-size:.68rem;color:#8b97ab}#hx-card .hx-k kbd{font-size:.64rem;padding:0 4px}
.hx-db{margin:10px 0;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
#hx-card .hx-r{margin-top:6px;padding-top:5px;border-top:1px solid rgba(255,255,255,.1);display:flex;flex-wrap:wrap;gap:4px 6px;font-size:.74rem}
#hx-card .hx-rh{width:100%;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:#9fb0c8}
#hx-card .hx-rh small{text-transform:none;letter-spacing:0;color:#7d8aa3;margin-left:6px}
#hx-card .hx-u{pointer-events:auto;cursor:pointer;padding:2px 7px;border-radius:5px;background:rgba(79,140,255,.14);border:1px solid rgba(79,140,255,.3)}
#hx-card .hx-u b{display:inline-block;min-width:14px;text-align:center;background:#2f6bff;color:#fff;border-radius:3px;margin-right:3px}
#hx-card .hx-u.sel{outline:2px solid #ffd166}#hx-card .hx-u.ok{border-color:#4f9bff;color:#cfe0ff}#hx-card .hx-u.go{border-color:#3ccb8c}#hx-card .hx-u.bad{border-color:#ff6060;color:#ffb0b0}
#hx-card .hx-js{width:100%;display:flex;flex-wrap:wrap;gap:4px 6px;margin-top:2px}
#hx-card .hx-j{pointer-events:auto;cursor:pointer;padding:2px 7px;border-radius:5px;border:1px solid rgba(255,178,31,.4);background:rgba(255,178,31,.1);color:#ffcb5c}
#hx-card .hx-j.can{border-color:#3ccb8c;color:#9fe3c4}#hx-card .hx-j.no{opacity:.7}#hx-card .hx-j.tk{border-color:#4f9bff;color:#cfe0ff}
#hx-card .hx-q{margin-top:6px;padding-top:5px;border-top:1px solid rgba(255,255,255,.1);display:flex;flex-direction:column;gap:3px;font-size:.76rem}
#hx-card .hx-q.dim{color:#8b97ab;flex-direction:row}
#hx-card .hx-qi{pointer-events:auto;cursor:pointer;padding:3px 8px;border-radius:5px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12)}
#hx-card .hx-qi:hover{background:rgba(79,140,255,.18)}
#hx-card .hx-qi b{display:inline-block;min-width:15px;text-align:center;background:#ffb21f;color:#1a1000;border-radius:3px;margin-right:4px}
#hx-card .hx-qi.p1{border-color:rgba(255,96,96,.55)}#hx-card .hx-qi em{font-style:normal}
#hx-card .hx-qi em.ok{color:#7ff0bd}#hx-card .hx-qi em.warn{color:#ffcb5c}#hx-card .hx-qi em.bad{color:#ff8a8a;font-weight:700}
.hx-db div{display:flex;justify-content:space-between;gap:12px;padding:2px 0;font-size:.88rem}.hx-db .p{color:#3ccb8c}.hx-db .n{color:#ffb21f}
</style>'''
d = re.sub(r'<style id="hx-css">.*?</style>', "", d, flags=re.S)
i = d.find("</head>")
if i < 0 or d.count("</head>") != 1: sys.exit("head")
d = d[:i] + CSS + d[i:]
open(p, "w", encoding="utf8", newline="").write(d)
print("hotovo", len(d))
