import re, sys
p = sys.argv[1]
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

# ---------------- HLAS ----------------
VOICE = r'''{
const HVR=v=>(/natural|neural|online/i.test(v.name)?100:0)+(/google/i.test(v.name)?40:0)+(/^sk/i.test(v.lang)?20:/^cs/i.test(v.lang)?8:0)+(v.localService?0:3);
const HVF=/vikt|vlasta|zuzan|laura|hana|eva|petra|lenka|jana|female/i,HVM=/luk|filip|anton|jakub|peter|male/i;
const HVnat=v=>!!v&&HVR(v)>=100;
const HVlist=()=>{try{return speechSynthesis.getVoices().filter(v=>/^(sk|cs)/i.test(v.lang)).sort((a,b)=>HVR(b)-HVR(a))}catch(e){return[]}};
/* najprirodzenejsi hlas pre muza / zenu; radsej prirodzeny hlas inej skupiny nez roboticky */
const HVget=sex=>{const L=HVlist();if(!L.length)return null;const nm=S.save&&S.save.voiceName;
  if(nm&&nm!=="auto"){const f=L.find(v=>v.name===nm);if(f)return f}
  const want=sex==="f"?HVF:HVM,other=sex==="f"?HVM:HVF;
  const sk=L.filter(v=>/^sk/i.test(v.lang)),pool=sk.some(HVnat)?sk:L;
  return pool.find(v=>HVnat(v)&&want.test(v.name))||pool.find(v=>HVnat(v)&&!other.test(v.name))||pool.find(HVnat)||pool.find(v=>want.test(v.name))||pool[0]};
/* text pre citanie nahlas: skratky a znaky ako slova */
const HVtxt=t=>{let s=String(t==null?"":t);
  s=s.replace(/<[^>]+>/g,"").replace(/[„“”"…*_~]/g,"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu,"");
  s=s.replace(/\s*[·•→|]\s*/g,", ").replace(/\s+[–—]\s+/g,", ");
  s=s.replace(/\b([A-Z]{2})[ -]?(\d{3})[ -]?([A-Z]{2})\b/g,(m,a,b,c)=>a.split("").join(" ")+", "+b.split("").join(" ")+", "+c.split("").join(" "));
  s=s.replace(/(\d)\.(\d+)(?=\s*(?:km|m|s)\b|\s*[%‰])/g,"$1,$2");
  s=s.replace(/(\d)\s*km\/h/g,"$1 kilometrov za hodinu").replace(/km\/h/g,"kilometrov za hodinu").replace(/(\d)\s*km\b/g,"$1 kilometrov").replace(/(\d)\s*m\b/g,"$1 metrov");
  s=s.replace(/(\d)\s*%/g,"$1 percent").replace(/(\d)\s*‰/g,"$1 promile").replace(/(\d)\s*€/g,"$1 eur").replace(/€\s*(\d[\d\s]*)/g,"$1 eur");
  s=s.replace(/EČV/g,"evidenčné číslo").replace(/(^|\s)č\.\s*/g,"$1číslo ").replace(/\bul\.\s*/g,"ulica ").replace(/(\d)\s*min\b/g,"$1 minút");
  return s.replace(/\s{2,}/g," ").replace(/,\s*,/g,",").trim()};
const HVspeak=(text,sex,o)=>{o=o||{};const v=HVget(sex);if(!v)return false;const u=new SpeechSynthesisUtterance(HVtxt(text));u.voice=v;u.lang=v.lang;
  u.rate=o.rate||(HVnat(v)?1.03:1);u.pitch=o.pitch||1;u.volume=o.vol||.95;if(o.cancel!==false)speechSynthesis.cancel();speechSynthesis.speak(u);return true};
window.__hvGet=HVget;window.__hvTxt=HVtxt;
SFX.say=function(text,sex){try{if(!this.on||S.save.voice===false||!window.speechSynthesis)return;HVspeak(text,sex)}catch(e){}};
try{VOX.pick=function(){const v=HVget("m");this.v=v;this.ok=!!v;return v}}catch(e){}
/* nastavenia: vyber hlasu a skuska */
window.__hvOpts=()=>{const L=HVlist(),cur=(S.save&&S.save.voiceName)||"auto";
  return'<option value="auto"'+(cur==="auto"?" selected":"")+'>Automaticky – najprirodzenejší</option>'+L.map(v=>'<option value="'+esc(v.name)+'"'+(v.name===cur?" selected":"")+'>'+esc(v.name.replace(/^Microsoft\s+/,"").replace(/\s*-\s*(Slovak|Czech).*$/,""))+(HVnat(v)?" ★":"")+'</option>').join("")};
window.__hvTip=()=>{const L=HVlist();if(!L.length)return"Prehliadač zatiaľ neponúka slovenský hlas.";
  if(L.some(HVnat))return"★ = prirodzený (neurónový) hlas. Ženy hovoria hlasom "+((HVget("f")||{}).name||"").replace(/^Microsoft\s+/,"").replace(/\s*-.*$/,"")+", muži hlasom "+((HVget("m")||{}).name||"").replace(/^Microsoft\s+/,"").replace(/\s*-.*$/,"")+".";
  return"Tento prehliadač má len robotický hlas. Prirodzené hlasy Viktória a Lukáš (Natural) má Microsoft Edge pri pripojení na internet."};
window.__hvTest=()=>{try{const s=S.save;const on=SFX.on&&s.voice!==false;if(!on){toast("Hlasy sú vypnuté (tlačidlo hlasu hore).");return}
  HVspeak("Dobrý deň, policajná kontrola. Predložte mi, prosím, vodičský preukaz a doklady od vozidla.","m");
  const v2=HVget("f");if(v2)setTimeout(()=>HVspeak("Hliadka 158, tu operačné stredisko. Na diaľnici D1 pri Senci je nehoda, rýchlosť 130 km/h.","f",{cancel:false}),200)}catch(e){}};
try{speechSynthesis.addEventListener("voiceschanged",()=>{const el=document.getElementById("hv-pick");if(el){el.innerHTML=window.__hvOpts();const t=document.getElementById("hv-tip");if(t)t.textContent=window.__hvTip()}})}catch(e){}
}'''
block("hgl-voice", VOICE)
patch("hlas operacneho",
 'u.voice=vv;u.lang=vv.lang;u.rate=v==="robot"?1.25:1.08;u.pitch=v==="f"?1.3:v==="robot"?.4:.8;u.volume=.8;',
 'const v2=(window.__hvGet&&__hvGet(v==="f"?"f":"m"))||vv;u.voice=v2;u.lang=v2.lang;if(window.__hvTxt)u.text=__hvTxt(u.text);u.rate=v==="robot"?1.15:1.02;u.pitch=v==="robot"?.75:1;u.volume=.85;')
patch("nastavenia hlas",
 '<div class="rrow"><span>Volací znak</span>',
 '<div class="rrow"><span>Hlas postáv</span><select id="hv-pick">${window.__hvOpts?__hvOpts():""}</select><button class="btn ghost" id="hv-test" type="button" title="Vyskúšať hlas">▶ Vyskúšať</button></div><p class="se-d" id="hv-tip">${window.__hvTip?__hvTip():""}</p>\n    <div class="rrow"><span>Volací znak</span>')
patch("nastavenia hlas obsluha",
 'const ov=$("#op-v");if(ov)ov.onchange=()=>{s.opVoice=ov.value;persist()};',
 'const ov=$("#op-v");if(ov)ov.onchange=()=>{s.opVoice=ov.value;persist()};const hvp=$("#hv-pick");if(hvp)hvp.onchange=()=>{s.voiceName=hvp.value;persist();const t=$("#hv-tip");if(t&&window.__hvTip)t.textContent=__hvTip();if(window.__hvTest)__hvTest()};const hvt=$("#hv-test");if(hvt)hvt.onclick=()=>{if(window.__hvTest)__hvTest()};')

# ---------------- ZVUK VRTULNIKA ----------------
patch("stary rotor", 'set(N.rg.gain,rv*.5);set(N.lg.gain,rv*.5);', 'set(N.rg.gain,0);set(N.lg.gain,0);')
patch("stara turbina", 'set(N.tg.gain,(ck?.012:.008)*rp);', 'set(N.tg.gain,0);')
patch("stary vietor", 'set(N.wg.gain,Math.min(.05,sp/HF.VMAX*.05)*(ck?.5:1));', 'set(N.wg.gain,0);')
patch("stary podklad",
 'else if(kind==="heli"){const g2=filt(nb(),"lowpass",260,.8,.16);lfo(g2.gain,7.5,.12,.14);const o=a.createOscillator();o.type="sawtooth";o.frequency.value=48;const g22=a.createGain();g22.gain.value=.012;o.connect(g22);g22.connect(out);o.start();nodes.push(o,g22)}',
 'else if(kind==="heli"){}')
SND = r'''{
const HR={on:false,n:{}};
/* rotor: slucka udov listov (4 listy, ~22 Hz pri plnych otackach) – nizke "vump" + kratke plesknutie */
const hrRotorBuf=a=>{const sr=a.sampleRate,fB=22,P=Math.round(sr/fB),K=16,len=P*K,b=a.createBuffer(1,len,sr),o=b.getChannelData(0);let lp=0,rum=0;
  for(let k=0;k<K;k++){const s0=k*P+Math.round((Math.random()-.5)*P*.04),bl=k%4,amp=[1,.86,.95,.8][bl]*(.92+Math.random()*.16),ph=Math.random()*6.28;
    for(let i=0;i<P*1.6&&s0+i<len;i++){if(s0+i<0)continue;const t=i/sr;
      const thump=Math.exp(-t/.034)*Math.sin(6.2832*58*t+ph*.1)*.9,crack=(Math.random()*2-1)*Math.exp(-t/.0065)*.55;
      o[s0+i]+=amp*(thump+crack)}}
  for(let i=0;i<len;i++){rum=rum*.985+(Math.random()*2-1)*.015;lp=lp*.6+o[i]*.4;o[i]=lp+rum*1.4}
  let m=0;for(let i=0;i<len;i++)m=Math.max(m,Math.abs(o[i]));for(let i=0;i<len;i++)o[i]/=m||1;return b};
const hrInit=()=>{const a=SFX.ac&&SFX.ac();if(!a||HR.on)return;try{const N=HR.n,sr=a.sampleRate;
  const nb=a.createBuffer(1,sr*2,sr),c=nb.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=Math.random()*2-1;
  const noise=()=>{const s=a.createBufferSource();s.buffer=nb;s.loop=true;s.start();return s};
  N.out=a.createGain();N.out.gain.value=0;N.comp=a.createDynamicsCompressor();N.comp.threshold.value=-18;N.comp.ratio.value=3;N.out.connect(N.comp);N.comp.connect(a.destination);
  /* rotor */
  N.rs=a.createBufferSource();N.rs.buffer=hrRotorBuf(a);N.rs.loop=true;N.rs.playbackRate.value=.3;N.rs.start();
  N.rlp=a.createBiquadFilter();N.rlp.type="lowpass";N.rlp.frequency.value=1800;N.rlp.Q.value=.5;N.rg=a.createGain();N.rg.gain.value=0;
  N.rs.connect(N.rlp);N.rlp.connect(N.rg);N.rg.connect(N.out);
  /* plesknutie listov pri klesani (BVI) – vyssie pasmo toho isteho rotora */
  N.bf=a.createBiquadFilter();N.bf.type="bandpass";N.bf.frequency.value=1400;N.bf.Q.value=.9;N.bg=a.createGain();N.bg.gain.value=0;N.rs.connect(N.bf);N.bf.connect(N.bg);N.bg.connect(N.out);
  /* turbina: sum s pasmom podla otacok + jemne pisknutie */
  N.ts=noise();N.tf=a.createBiquadFilter();N.tf.type="bandpass";N.tf.frequency.value=900;N.tf.Q.value=4;N.tg=a.createGain();N.tg.gain.value=0;N.ts.connect(N.tf);N.tf.connect(N.tg);N.tg.connect(N.out);
  N.wo=a.createOscillator();N.wo.type="sine";N.wo.frequency.value=800;N.wog=a.createGain();N.wog.gain.value=0;N.wo.connect(N.wog);N.wog.connect(N.out);N.wo.start();
  /* prevodovka: nizky hukot */
  N.go=a.createOscillator();N.go.type="triangle";N.go.frequency.value=40;N.gog=a.createGain();N.gog.gain.value=0;N.go.connect(N.gog);N.gog.connect(N.out);N.go.start();
  /* prudenie vzduchu */
  N.as=noise();N.af=a.createBiquadFilter();N.af.type="bandpass";N.af.frequency.value=600;N.af.Q.value=.6;N.ag=a.createGain();N.ag.gain.value=0;N.as.connect(N.af);N.af.connect(N.ag);N.ag.connect(N.out);
  HR.on=true}catch(e){console.warn("hr",e)}};
HR.mute=()=>{if(!HR.on)return;const a=SFX.ctx;try{HR.n.out.gain.setTargetAtTime(0,a.currentTime,.15)}catch(e){}};
HR.tick=sh=>{if(!HR.on)hrInit();if(!HR.on)return;const N=HR.n,a=SFX.ctx,t=a.currentTime,fl=sh.fl,hp=sh.hp,sp=Math.hypot(hp.vx,hp.vy),ck=fl.cam==="cockpit",rp=fl.rpm||0,pw=fl.pwr||0,
  set=(p,v,k)=>{if(isFinite(v))p.setTargetAtTime(v,t,k||.1)};
  set(N.out.gain,.9,.2);
  const vmax=HF.VMAX||70,vs=Math.min(1,sp/vmax),desc=fl.gnd?0:clamp((-(fl.vz||0)-1.5)/4,0,1)*clamp(1-Math.abs(vs-.35)*2.2,0,1);
  /* rotor: otacky = rychlost slucky, vykon a klesanie = hlasitost a ostrost */
  set(N.rs.playbackRate,Math.max(.05,.18+.82*rp)*(1+pw*.03),.25);
  set(N.rlp.frequency,ck?520+pw*180:1300+pw*900+desc*900);
  set(N.rg.gain,rp*rp*(ck?.33:.5)*(.72+pw*.38));
  set(N.bg.gain,desc*rp*(ck?.08:.22));
  /* turbina */
  set(N.tf.frequency,500+rp*1500+pw*300);set(N.tg.gain,(ck?.05:.03)*Math.min(1,rp*1.4));
  set(N.wo.frequency,900+rp*1900+pw*120);set(N.wog.gain,(ck?.0042:.0022)*rp);
  /* prevodovka */
  set(N.go.frequency,22+rp*58);set(N.gog.gain,(ck?.06:.035)*rp);
  /* vzduch */
  set(N.af.frequency,350+vs*1100);set(N.ag.gain,Math.pow(vs,1.4)*(ck?.05:.11))};
{const t0=h7SndTick;h7SndTick=function(sh){t0(sh);try{const on=SFX.on&&S.screen==="heli"&&sh&&sh.fl&&!modalOpen();if(on)HR.tick(sh);else HR.mute()}catch(e){}}}
setInterval(()=>{if(!HR.on)return;const sh=S.shift;if(!(SFX.on&&S.screen==="heli"&&sh&&sh.heli&&sh.fl&&!modalOpen()))HR.mute()},300);
window.__hr=HR;
}'''
block("hgl-snd", SND)
open(p, "w", encoding="utf8", newline="").write(d)
print("hotovo", len(d))
