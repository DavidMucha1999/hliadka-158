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

# ---------- 1) poradie plochych vrstiev: jemny posun hlbky podla materialu (proti blikaniu) ----------
patch("vs bias", 'vC=aC;vU=aU;gl_Position=uVP*w;}`',
 'vC=aC;vU=aU;gl_Position=uVP*w;float mb=floor(aC.a+.5);float zb=mb==37.?.5:mb==31.?1.:mb==36.?1.5:mb==34.?2.:mb==27.?2.5:mb==10.?3.:mb==35.?4.:0.;gl_Position.z-=zb*1.6e-6*gl_Position.w;}`')
patch("fs mat", 'if(m==28.)m=0.;vec3 base=vC.rgb;', 'if(m==28.||m==34.||m==35.||m==36.)m=0.;vec3 base=vC.rgb;')
# velkost pixela na povrchu (na vyhladenie jemnych vzorov v dialke)
patch("fs fpx", 'refK=0.;vec2 uv=vU+uUoff;', 'refK=0.;vec2 uv=vU+uUoff;float fpx=length(vW-uCam)*.0016/max(abs(dot(n,V)),.05);')

patch("fs aaP", 'float lineM(float x,float c,float w){', 'float aaP(float P,float f){return 1.-smoothstep(.2*P,.5*P,f);}float lineM(float x,float c,float w){')
# zem (m30): jemne pruhy a zrno len tam, kde ich pixel unesie
patch("m30 riadky", 'crop*=mix(1.,.8+.32*rw,(hc<.7?1.:.3)*df);', 'crop*=mix(1.,.8+.32*rw,(hc<.7?1.:.3)*df*aaP(hc<.3?7.:12.6,fpx));')
patch("m30 zrno", 'float d1=nz(q*.7)*.5+nz(q*2.8)*.3+hash(floor(q*4.))*.2;',
 'float d1=mix(.5,nz(q*.7),aaP(1.4,fpx))*.5+mix(.5,nz(q*2.8),aaP(.36,fpx))*.3+mix(.5,hash(floor(q*4.)),aaP(.5,fpx))*.2;')
patch("m30 skvrny", 'smoothstep(.5,.82,nz(q*1.4+7.))*df*.45', 'smoothstep(.5,.82,nz(q*1.4+7.))*df*.45*aaP(.7,fpx)')
patch("m30 okraje", 'crop=mix(meadow*.9,crop,smoothstep(2.5,6.,ed));', 'crop=mix(meadow*.9,crop,smoothstep(2.5-fpx*.5,6.+fpx,ed));')
# polia (m31): pasy a riadky bez trblietania
patch("m31 pasy", 'float band=step(.5,fract(q.x/(52.+fh*36.)));',
 'float bP=52.+fh*36.,bw=clamp(fpx/bP,.004,.5);float band=smoothstep(.5-bw,.5+bw,abs(fract(q.x/bP)-.5)*2.);')
patch("m31 riadky", 'b2*=mix(1.,.7+.42*row,df);', 'b2*=mix(1.,.7+.42*row,df*aaP(16.5,fpx));')
# bezne povrchy: zrno 2,5 cm trblietalo v dialke
patch("m0 zrno", 'base*=(m==1.?.96:.88)+(m==1.?.08:.24)*tn;', 'tn=mix(.5,tn,aaP(.35,fpx));base*=(m==1.?.96:.88)+(m==1.?.08:.24)*tn;')
# koruny lesa (m33)
CAN = ('else if(m==33.){vec2 q=vW.xz/5.;vec2 ci=floor(q),cf=fract(q);float best=-1.;vec2 mo=vec2(0.);float mh=.5;'
 'vec2 wq=vec2(nz(vW.xz*.35),nz(vW.xz*.35+5.))-.5;'
 'for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=vec2(hash(ci+g),hash(ci+g+vec2(19.3,7.1)));vec2 r=g+.1+o*.8-cf+wq*.12;float sz=.55+.42*hash(ci+g+vec2(5.3,2.9));float rr=sz*.82;float dd=dot(r,r)/(rr*rr);float h=sz*(1.-dd);if(h>best){best=h;mo=r/rr;mh=hash(ci+g+vec2(3.7,11.9));}}'
 'float aa=1.-smoothstep(1.5,4.5,fpx);float gap=smoothstep(-.04,.1,best);float dz=sqrt(max(0.,1.-dot(mo,mo)));'
 'vec3 cn=normalize(vec3(-mo.x,dz*1.1+.2,-mo.y));n=normalize(mix(n,mix(vec3(0.,1.,0.),cn,gap),.85*aa*smoothstep(.3,.7,n.y)));'
 'float grp=nz(vW.xz*.009+vec2(3.,9.)),sel=mh*.42+grp*.78;'
 'vec3 tint=sel<.4?vec3(.55,.8,.55):sel<.58?vec3(1.12,1.04,.64):sel<.72?vec3(1.16,.76,.62):sel<.86?vec3(.9,.97,.82):vec3(1.05,1.,.9);'
 'base=vC.rgb*mix(vec3(.95),tint*(.84+.3*mh),aa);if(sel<.4)base=mix(base,vec3(.045,.085,.04)*(.85+.4*mh),.55*aa*(1.-uSnow*.5));'
 'base*=mix(.9,mix(.3,.62+.38*dz,gap),aa);base*=mix(1.,.76+.48*nz(vW.xz*1.7+mh*31.),aaP(1.2,fpx)*aa*gap);base*=.88+.24*nz(vW.xz*.025);'
 'if(uSnow>.01)base=mix(base,vec3(.85,.88,.91),min(1.,uSnow)*.55*mix(.6,dz*gap,aa));spec=.025;shin=8.;}')
patch("m33 koruny", 'else if(m==32.){fogK=.5;', CAN + 'else if(m==32.){fogK=.5;')

# ---------- 2) vyska vrstiev a materialy v hBuild3D ----------
patch("pole vyska", 'return[x,T(x,z)+.12,z]', 'return[x,T(x,z)+.03,z]')
patch("pole lo", 'GL(f[0],f[1]).quad(Pp(0,0),Pp(f[2],0),Pp(f[2],f[3]),Pp(0,f[3]),c,0);', 'GL(f[0],f[1]).quad(Pp(0,0),Pp(f[2],0),Pp(f[2],f[3]),Pp(0,f[3]),c,31,[[0,0],[f[2],0],[f[2],f[3]],[0,f[3]]]);')
patch("poln cesta", 'strip(g2,sP,H2.w,.07,L2(W3.mtn?"#7a6a52":"#8f7a55"),0,sE)', 'strip(g2,sP,H2.w,.07,L2(W3.mtn?"#7a6a52":"#8f7a55"),34,sE)')
patch("krajnica", 'strip(g2,sP,H2.w+1.6,.07,L2(e.type==="city"?"#a8aaa6":"#8a8478"),0,sE)', 'strip(g2,sP,H2.w+1.6,.07,L2(e.type==="city"?"#a8aaa6":"#8a8478"),34,sE)')
patch("chodnik", 'strip(g2,sP,H2.w+5.5,.06,L2("#b7b6b0"),0,sE)', 'strip(g2,sP,H2.w+5.5,.06,L2("#b7b6b0"),36,sE)')
patch("cesta lo", 'H2.w+2,.08,L2(e.type==="dirt"?"#8f7a55":"#4a4e55"),0,[EL[i],EL[i+1]])', 'H2.w+2,.08,L2(e.type==="dirt"?"#8f7a55":"#4a4e55"),34,[EL[i],EL[i+1]])')
patch("ciary", 'L2("#e8e6df"),0)}}}}', 'L2("#e8e6df"),35)}}}}')
patch("stredovy pas", 'L2("#5a7a3a"),0);for(const sd', 'L2("#5a7a3a"),35);for(const sd')
# horske mapy: cesta vzorkovana hustejsie, aby ju teren medzi bodmi neprekryl
patch("cesta hustota", 's+=Math.max(2,Math.min(30,e.len/2))', 's+=Math.max(2,Math.min(W3.mtn?8:30,e.len/2))')
# vyska terenu presne podla trojuholnikov siete (bilinearna vyska sa lisila az o metre)
patch("teren trojuholniky",
 'return(H2(i,j)*(1-u)+H2(i+1,j)*u)*(1-v)+(H2(i,j+1)*(1-u)+H2(i+1,j+1)*u)*v}',
 'return u>=v?H2(i,j)+u*(H2(i+1,j)-H2(i,j))+v*(H2(i+1,j+1)-H2(i+1,j)):H2(i,j)+v*(H2(i,j+1)-H2(i,j))+u*(H2(i+1,j+1)-H2(i,j+1))}')
# les: stromy hlavne na okraji (vnutro pokryje plocha korun)
patch("les stromy",
 'const n=Math.floor(f[2]*(W3.mtn?.5:.6)),acc=[0,0,0];let na=0;for(let k=0;k<n;k++){const an=R()*6.28,rr=Math.sqrt(R())*f[2]',
 'const n=Math.floor(f[2]*(W3.mtn?.42:.5)),acc=[0,0,0];let na=0;for(let k=0;k<n;k++){const an=R()*6.28,rr=(k%5===0?Math.sqrt(R()):.8+.22*R())*f[2]')
# les: sestuholnikove "kolace" -> suvisla plocha korun s priechodom pre cesty
i = d.find('const mc=na?[acc[0]/na*.8,acc[1]/na*.8,acc[2]/na*.8]:cf[0],st=f[2]>160?46:36;')
if i >= 0:
    end = 'cc.map(v=>v*1.08),0)}}'
    j = d.find(end, i)
    assert j > i and j - i < 1500
    d = d[:i] + 'const mc=na?[acc[0]/na*.9,acc[1]/na*.9,acc[2]/na*.9]:cf[0];window.__hCanopy(W3,f,win&&W3.mtn?g3Mix(mc,snC,.35):mc,G,GL,T);' + d[j + len(end):]
    print("les koruny: ok")
else:
    print("les koruny: uz" if 'window.__hCanopy(W3,f,' in d else "les koruny: VZOR");
# ---------- 3) zem mimo mapy: ram okolo, nie doska pod celou mapou (blikala na horizonte) ----------
patch("zem mimo mapy",
 'G.quad([-E,-.5,-E],[HW+E,-.5,-E],[HW+E,-.5,HW+E],[-E,-.5,HW+E],sh.W.mtn?[.8,.86,.8]:[1,1,1],11,[[-E,-E],[HW+E,-E],[HW+E,HW+E],[-E,HW+E]])',
 '{const oc=sh.W.mtn?[.8,.86,.8]:[1,1,1],om=sh.W.mtn?11:30,oq=(x0,z0,x1,z1)=>G.quad([x0,-.05,z0],[x1,-.05,z0],[x1,-.05,z1],[x0,-.05,z1],oc,om,[[x0,z0],[x1,z0],[x1,z1],[x0,z1]]);oq(-E,-E,0,HW+E);oq(HW,-E,HW+E,HW+E);oq(0,-E,HW,0);oq(0,HW,HW,HW+E)}')
# ---------- 4) presnost hlbky: kamera za vrtulnikom a zoom nepotrebuju blizku rovinu 0,3 m ----------
patch("near", 'near:C.mode==="chase"?1.2:.3', 'near:C.mode==="chase"?2:C.mode==="belly"?2.5:.3')

# vo vrtulniku a vodnej policii je vzdy pekne – bez hlasenia o snehovej kalamite
patch("kalamita hlasenie", 'toast("❄️ Snehová kalamita: opatrne, +20 % skúseností za službu.")}else if(ev&&SEASONS[ev])setTimeout(', 'toast("❄️ Snehová kalamita: opatrne, +20 % skúseností za službu.")}else if(ev&&SEASONS[ev]&&!(ev==="snow"&&["heli","water"].includes(S.save.mode)))setTimeout(')
# farebne doladenie leteckeho rezimu (viac zivosti, jemna S-krivka)
patch("grade uniform", 'uniform float uFogD,uWet,uNight,uSnow,uMedG,uExp,', 'uniform float uGrade;uniform float uFogD,uWet,uNight,uSnow,uMedG,uExp,')
patch("grade fs", 'gl_FragColor=vec4(pow(aces(col*uExp),vec3(1./2.2)),alpha);}`;', 'vec3 dc=pow(aces(col*uExp),vec3(1./2.2));if(uGrade>0.){float lu=dot(dc,vec3(.2126,.7152,.0722));dc=clamp(mix(vec3(lu),dc,1.+.15*uGrade-.38*uGrade*smoothstep(.2,.8,uNight)),0.,1.);dc=mix(dc,dc*dc*(3.-2.*dc),.3*uGrade);}gl_FragColor=vec4(dc,alpha);}`;')
patch("grade set", 'gl.uniform1f(U2.uExp,R.studio?1:G3.exp);', 'gl.uniform1f(U2.uExp,R.studio?1:G3.exp);if(U2.uGrade)gl.uniform1f(U2.uGrade,R.grade||0);')
patch("grade heli", 'S0:0,bend:false,zmax:400,lights:L2,vehicles:list,persons,extra,glows:ga,dt:.016,pv:0,pcen:[hp.x,C.hpos[1],hp.y],far:', 'S0:0,bend:false,grade:1,zmax:400,lights:L2,vehicles:list,persons,extra,glows:ga,dt:.016,pv:0,pcen:[hp.x,C.hpos[1],hp.y],far:')
# ---------- voda: tmavsia, bez trblietania (len letecky rezim, uGrade) ----------
patch("voda vlny", 'vec2 g=vec2(.6,.8)*cos(dot(q,vec2(.6,.8))*.9+tt*2.2)*.09+vec2(-.7,.3)*cos(dot(q,vec2(-.7,.3))*1.7+tt*3.1)*.05+vec2(.2,-.9)*cos(dot(q,vec2(.2,-.9))*3.3+tt*4.)*.03+(vec2(nz(q*.7+tt*.5),nz(q*.7-tt*.4+5.))-.5)*.16;',
 'float wa1=1.,wa2=1.,wa3=1.,wa4=1.;if(uGrade>0.){wa1=aaP(7.,fpx);wa2=aaP(3.7,fpx);wa3=aaP(1.9,fpx);wa4=aaP(2.4,fpx)*.6;}vec2 g=vec2(.6,.8)*cos(dot(q,vec2(.6,.8))*.9+tt*2.2)*.09*wa1+vec2(-.7,.3)*cos(dot(q,vec2(-.7,.3))*1.7+tt*3.1)*.05*wa2+vec2(.2,-.9)*cos(dot(q,vec2(.2,-.9))*3.3+tt*4.)*.03*wa3+(vec2(nz(q*.7+tt*.5),nz(q*.7-tt*.4+5.))-.5)*.16*wa4;')
patch("voda farba", 'base=vC.rgb*(.75+.3*nz(q*.04+tt*.03));spec=1.6;shin=200.;env=.9;refK=.8;}',
 'base=vC.rgb*(.75+.3*nz(q*.04+tt*.03));spec=1.6;shin=200.;env=.9;refK=.8;if(uGrade>0.){base=vec3(.014,.05,.068)*(.8+.4*nz(q*.012+tt*.01));spec=.8*(1.-uNight*.5);shin=160.;env=.16*(1.-uNight*.75);refK=.22*(1.-uNight*.7);}}')
patch("breh rieky", 'W3.rivW+10,.02,L2(W3.mtn?"#6a6a5a":"#6a6448"),0)', 'W3.rivW+10,.02,L2(W3.mtn?"#6a6a5a":"#6a6448"),34)')
patch("breh jazera", 'l[2]+8,y+.02,40,L2("#c8b98a"),0)', 'l[2]+8,y+.02,40,L2("#8a7a52"),34)')
# ---------- obce: vlastny podklad (travniky, spevnene plochy) namiesto vzoru poli ----------
patch("obce volanie", 'const Wt=new Geo;if(W3.river.length)', 'try{window.__hUrban&&window.__hUrban(W3,G,GL,T)}catch(e){console.warn("urban",e)}const Wt=new Geo;if(W3.river.length)')
URB = ('else if(m==37.){vec2 q=vW.xz;float n1=nz(q*.02),n2=nz(q*.09);vec3 lawn=mix(mix(uG1,uG2,.3+.4*n1),vec3(.05,.11,.03),.5)*.8;'
 'lawn=mix(vec3(dot(lawn,vec3(.2126,.7152,.0722))),lawn,.8)*.94;lawn*=mix(1.,.93+.11*smoothstep(.3,.75,n2),min(1.,aaP(8.,fpx)+.4));vec2 c=floor(q/34.),f=fract(q/34.);float hp=hash(c+41.);'
 'float ew=min(min(f.x,1.-f.x),min(f.y,1.-f.y))*34.;float pv=step(.86,hp)*step(.75,vC.r)*smoothstep(5.-fpx,6.5+fpx,ew);'
 'vec3 pave=vec3(.2,.2,.195)*(.85+.3*mix(.5,nz(q*.3),aaP(3.,fpx)));base=mix(lawn,pave,pv);'
 'base*=.92+.16*mix(.5,nz(q*1.3),aaP(1.5,fpx));if(uSnow>.01)base=mix(base,vec3(.86,.89,.92),min(1.,uSnow)*.8*(1.-pv*.5));spec=.04+uWet*.1;}')
patch("m37 obce", 'else if(m==32.){fogK=.5;', URB + 'else if(m==32.){fogK=.5;')
# hladina nad zemou aj v dolinach vln (vlny hybu vrcholmi +-0,36 m, inak presvitala zem v klinoch)
patch("rieka hladina", 'strip(Wt,[rp[i],rp[i+1]],W3.rivW,.03,L2("#1d4a6a"),27)', 'strip(Wt,[rp[i],rp[i+1]],W3.rivW,.42,L2("#1d4a6a"),27)')
patch("jazero hladina", 'g3Disc(Wt,l[0],l[1],l[2],y+.03,40,L2("#1d4a6a"),27)', 'g3Disc(Wt,l[0],l[1],l[2],y+.42,40,L2("#1d4a6a"),27)')
patch("slama na vode", 'const u=8+R()*(f[2]-16),v=8+R()*(f[3]-16),x=f[0]+u*ca-v*sa,z=f[1]+u*sa+v*ca,y=T(x,z),g2=G(x,z);if(sq)', 'const u=8+R()*(f[2]-16),v=8+R()*(f[3]-16),x=f[0]+u*ca-v*sa,z=f[1]+u*sa+v*ca,y=T(x,z),g2=G(x,z);if(hIsWaterW(W3,x,z)||hRoadNear(W3,x,z,3))continue;if(sq)')
# ---------- vzdusny opar: pri peknom pocasi slabsi a modrastejsi, obloha s rovnakou farbou na horizonte ----------
patch("opar", 'env:Object.assign({},G3,{fogD:(G3.fogD||.002)*(sh.wx==="fog"?.45:sh.wx==="rain"||sh.wx==="storm"?.2:.3)*haze*(sh._fogK||1)*((sh._inStorm||0)>0?1.2:1),sunC:G3.sunC.map(v=>v*.8)})',
 'env:Object.assign({},G3,{fogD:(G3.fogD||.002)*(sh.wx==="fog"?.45:sh.wx==="rain"||sh.wx==="storm"?.2:.3)*haze*(sh._fogK||1)*((sh._inStorm||0)>0?1.2:1)*(sh.wx==="clear"?.62:1),sunC:G3.sunC.map(v=>v*.8),fog:(()=>{const k=.38*(1-Math.min(1,(G3.N||0)*1.6)),A=[.6,.72,.9];return G3.fog.map((v,i)=>v*(1-k)+A[i]*Math.max(.35,Math.min(1,(v+.2)))*k)})()})')
patch("obloha opar", 'gl.uniform3fv(PS2.u.uFogC,G3.fog)', 'gl.uniform3fv(PS2.u.uFogC,(R.env&&R.env.fog)||G3.fog)')
# luky: menej neonove, velke jemne odtiene
patch("luky", 'vec3 meadow=mix(uG1,uG2,clamp(n1*.6+n2*.35+.15,0.,1.))*.82;', 'vec3 meadow=mix(uG1,uG2,clamp(n1*.6+n2*.35+.15,0.,1.))*.82;if(uGrade>0.){float ml=dot(meadow,vec3(.2126,.7152,.0722));meadow=mix(vec3(ml),meadow,.78)*vec3(.9,.94,.86)*(.78+.32*nz(q*.0042+vec2(7.,1.))+.1*nz(q*.017));}')
# polia: brazdy a kolaje od traktora zblizka
patch("polia brazdy", 'b2*=mix(1.,.7+.42*row,df*aaP(16.5,fpx));', 'b2*=mix(1.,.7+.42*row,df*aaP(16.5,fpx));if(uGrade>0.){float fz=.5+.5*sin(q.x*2.4+fh*9.);b2*=mix(1.,.84+.24*fz,aaP(2.6,fpx));float tl=1.-smoothstep(.25,.75,abs(mod(q.x+fh*10.,24.)-12.));b2*=1.-.22*tl*aaP(2.,fpx)*(1.-uSnow);}')
# ---------- noc: svetlo poulicnych lamp na zemi (mapa svetla z polohy lamp) ----------
patch("lit uniform", 'uniform float uGrade;', 'uniform float uGrade;uniform sampler2D uLit;uniform float uLitOn,uLitW;')
patch("lit fs", ' col+=base*emis*2.2;', ' col+=base*emis*2.2;if(uLitOn>.5&&uNight>.05){float mo=floor(vC.a+.5);if(n.y>.55&&(mo==10.||mo==30.||mo==31.||mo==34.||mo==36.||mo==37.||mo==35.)){vec3 lt=texture2D(uLit,vW.xz/uLitW).rgb;col+=lt*uNight*(base*3.4+.03)*(mo==10.||mo==34.||mo==36.||mo==35.?1.:.5);}}')
patch("lit bind", 'gl.uniform1f(U2.uExp,R.studio?1:G3.exp);if(U2.uGrade)gl.uniform1f(U2.uGrade,R.grade||0);', 'gl.uniform1f(U2.uExp,R.studio?1:G3.exp);if(U2.uGrade)gl.uniform1f(U2.uGrade,R.grade||0);if(U2.uLitOn){gl.uniform1f(U2.uLitOn,R.litT?1:0);if(R.litT){gl.activeTexture(gl.TEXTURE7);gl.bindTexture(gl.TEXTURE_2D,R.litT);gl.uniform1i(U2.uLit,7);gl.uniform1f(U2.uLitW,R.litW||6e3);gl.activeTexture(gl.TEXTURE0)}}')
patch("lit heli", 'S0:0,bend:false,grade:1,', 'S0:0,bend:false,grade:1,litT:(G3.N||0)>.05&&!sh.thermal&&window.__hLitTex?__hLitTex(sh.W):null,litW:HW,')
# ---------- kopce na obzore: jemna siet, plynule tienovanie, lesy a luky ----------
import re as _re
_m=_re.search(r'const hHills=sh=>\{const g=sh\.g3w;if\(!g\)return null;if\(g\._hills\)return g\._hills;const G=new Geo,c0=HW/2,N=120.*?return g\._hills=g3Up\(G\)\};', d, _re.S)
HILLS = r"""const hHills=sh=>{const g=sh.g3w;if(!g)return null;if(g._hills)return g._hills;const c0=HW/2,N=360,R0=4500,R1=8800,NR=14,Rr=seeded(4242),ph=[];for(let k=0;k<8;k++)ph.push(Rr()*6.283);
const H=(a,r)=>{const t=(r-R0)/(R1-R0),e=Math.min(1,t/.22)*(1-.25*t),n=.5+.22*Math.sin(a*3+ph[0])+.14*Math.sin(a*7+ph[1]+t*2)+.08*Math.sin(a*17+ph[2]+t*5)+.05*Math.sin(a*31+ph[3]-t*7)+.04*Math.sin(t*9+a*5+ph[4]);return Math.max(0,e*(40+380*n*n))-3};
const P=(a,r)=>[c0+Math.cos(a)*r,H(a,r),c0+Math.sin(a)*r];
const Nm=(a,r)=>{const p=P(a,r),pa=P(a+6/r,r),pr=P(a,r+6),ux=pa[0]-p[0],uy=pa[1]-p[1],uz=pa[2]-p[2],vx=pr[0]-p[0],vy=pr[1]-p[1],vz=pr[2]-p[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;if(ny<0){nx=-nx;ny=-ny;nz=-nz}const l=Math.hypot(nx,ny,nz)||1;return[nx/l,ny/l,nz/l]};
const col=(a,r)=>{const h=H(a,r),f=.5+.5*Math.sin(a*11+ph[5]+r*.0011)*Math.sin(a*4+ph[6]-r*.0007);return g3Mix(g3L("#56603a"),g3L("#22381f"),Math.min(1,Math.max(0,f*1.3-.15+h/700)))};
const A=[],V=(a,r)=>{const p=P(a,r),n=Nm(a,r),c=col(a,r);A.push(p[0],p[1],p[2],n[0],n[1],n[2],c[0],c[1],c[2],32,0,0)},rr=i=>R0+(R1-R0)*Math.pow(i/NR,1.3);
for(let j=0;j<N;j++){const a0=j/N*6.2832,a1=(j+1)/N*6.2832;for(let i=0;i<NR;i++){const r0=rr(i),r1=rr(i+1);V(a0,r0);V(a1,r0);V(a1,r1);V(a0,r0);V(a1,r1);V(a0,r1)}}
return g._hills=g3Up({a:A})};"""
if _m: d=d[:_m.start()]+HILLS+d[_m.end():]; print("kopce: ok")
else: print("kopce: uz" if "N=360,R0=4500" in d else "kopce: VZOR")
# ---------- ploche strechy: strojovne vytahov, vetracie komíny, rozne krytiny ----------
patch("strechy", 'gg.box(X0+.3,X1-.3,Y+b.h,Y+b.h+.6,Z0+.3,Z1-.3,h8Roof(L2("#5d646c")),0);if(b.h>12&&R()<.5)gg.box(ox-2,ox+2,Y+b.h,Y+b.h+2.5,oz-2,oz+2,L2("#8d9399"),9)',
 'const RQ=self.__hRQ||(self.__hRQ=seeded(515)),rfc=["#5d646c","#4a4e54","#6e6a62","#3e4248","#7a7468"][Math.floor(RQ()*5)];gg.box(X0+.3,X1-.3,Y+b.h,Y+b.h+.6,Z0+.3,Z1-.3,h8Roof(L2(rfc)),0);if(b.h>8){const lx=X1-X0>Z1-Z0,L=lx?X1-X0:Z1-Z0,ne=Math.max(1,Math.floor(L/22)),yt=Y+b.h+.6;for(let k=0;k<ne;k++){const t=(k+.5)/ne,ex=lx?X0+(X1-X0)*t:ox,ez=lx?oz:Z0+(Z1-Z0)*t;gg.box(ex-1.6,ex+1.6,yt,yt+2.6,ez-2,ez+2,L2("#8a8c90"),9);gg.box(ex-1.8,ex+1.8,yt+2.6,yt+2.8,ez-2.2,ez+2.2,L2("#55595e"),9)}const nv=2+Math.floor(RQ()*4);for(let k=0;k<nv;k++){const vx=X0+1.5+RQ()*(X1-X0-3),vz=Z0+1.5+RQ()*(Z1-Z0-3);gg.box(vx-.45,vx+.45,yt,yt+.9+RQ()*.8,vz-.45,vz+.45,L2("#9a9ea2"),9)}}')
# ---------- zeleznica: sirsi nasyp a lozko, vrstvy bez bitia ----------
patch("zeleznica lozko", 'g3Strip(g2,[p0,p1],4.6,.085,L2("#6e6458"),0);', 'g3Strip(g2,[p0,p1],7.4,.05,L2("#4e483e"),36);g3Strip(g2,[p0,p1],4.4,.085,L2("#7d7568"),34);')
patch("zeleznica podvaly", '[cx2-nx*1.3+ux*.13,.13,cz2-nz*1.3+uz*.13],L2("#4a3a2e"),0)}', '[cx2-nx*1.3+ux*.13,.13,cz2-nz*1.3+uz*.13],L2("#4a3a2e"),35)}')
# ---------- prud vzduchu z rotora: bez listia na heliporte, mensie listy, menej mimo lesa ----------
patch("wash pad", 'road=hRoadNear(W3,hp.x,hp.y,6);g2.save();if(!inF&&!road&&!snow){', 'road=hRoadNear(W3,hp.x,hp.y,6),pad=Math.hypot(hp.x-HBASE.x,hp.y-HBASE.y)<75;g2.save();if(!inF&&!road&&!snow&&!pad){')
patch("wash pocet", 'P.length<(inF||aut||fd?60:22)', 'P.length<(pad?0:inF?60:fd?36:aut?24:16)')
patch("wash velkost", 'const s=Math.max(1.2,p.sc*.12);g2.save();g2.translate(p.x,p.y);', 'const s=Math.min(4.5,Math.max(1.2,p.sc*.12));g2.save();g2.translate(p.x,p.y);')
# rano len jemny opar (bola 1,7-nasobna hmla, pri peknom pocasi pusobila mliecne)
patch("ranny opar", 'haze=hr0>5&&hr0<9.5&&(sh.wx==="clear"||sh.wx==="cloudy")?1.7-Math.abs(hr0-7)*.28:1', 'haze=hr0>5&&hr0<9.5&&(sh.wx==="clear"||sh.wx==="cloudy")?Math.max(1,1.22-Math.abs(hr0-7)*.1):1')
# hlbka ostrosti: rozmazany pas cez horizont bol prilis silny (35-80 %) a krajina posobila mliecne
patch("dof sila", 'g2.globalAlpha=clamp(.35+C.alt/700,.35,.8);g2.drawImage(o,0,0,w,h);', 'g2.globalAlpha=clamp(.12+C.alt/2500,.12,.28);g2.drawImage(o,0,0,w,h);')
patch("dof pas", 'gr=q.createLinearGradient(0,(hy-h*.28)*k,0,(hy+h*.2)*k);', 'gr=q.createLinearGradient(0,(hy-h*.14)*k,0,(hy+h*.1)*k);')
# ---------- namestie: dlazba a stromoradie ----------
patch("namestie dlazba", 'g2.quad([s.x0,.1,s.z0],[s.x1,.1,s.z0],[s.x1,.1,s.z1],[s.x0,.1,s.z1],L2("#b9ad98"),0);for(let k=0;k<6;k++)g2.quad([s.x0+k*20,.105,s.z0],[s.x0+k*20+1,.105,s.z0],[s.x0+k*20+1,.105,s.z1],[s.x0+k*20,.105,s.z1],L2("#a89c88"),0)',
 'g2.quad([s.x0,.1,s.z0],[s.x1,.1,s.z0],[s.x1,.1,s.z1],[s.x0,.1,s.z1],L2("#b9ad98"),38);for(let k=0;k<6;k++)g2.quad([s.x0+k*20,.105,s.z0],[s.x0+k*20+1,.105,s.z0],[s.x0+k*20+1,.105,s.z1],[s.x0+k*20,.105,s.z1],L2("#8a7e6c"),35)')
PAV = ('else if(m==38.){vec2 q=vW.xz;vec2 t=q/vec2(1.4,.9);t.x+=step(1.,mod(floor(t.y),2.))*.5;vec2 ti=floor(t),tf=fract(t);float th=hash(ti);'
 'float mt=min(min(tf.x,1.-tf.x)*1.4,min(tf.y,1.-tf.y)*.9);float a=aaP(.9,fpx);float mo=mix(1.,smoothstep(.02,.07,mt),a);'
 'vec3 st=vC.rgb*(.86+.22*mix(.5,th,a));float bd=step(10.,mod(q.x+q.y*.0,12.))*0.;'
 'vec2 b=abs(fract(q/12.)-.5);float band=1.-smoothstep(.44,.47,max(b.x,b.y));base=mix(st*.82,st,band)*mix(.72,1.,mo);base*=.92+.16*nz(q*.08);spec=.06+uWet*.3;shin=24.;}')
patch("m38 dlazba", 'else if(m==32.){fogK=.5;', PAV + 'else if(m==32.){fogK=.5;')
# hory: plynule farby terenu namiesto sachovnice, teplejsie skaly
patch("hory farby", 'const c=ym>snowY+nn*40?L2("#e8eef4"):ym>snowY*.7||sl>.85?g3Mix(L2("#6f757a"),L2("#8a8f93"),Rn()):ym>45?g3Mix(L2("#3d5a34"),L2("#4a6338"),Rn()):g3Mix(L2("#56743c"),L2("#6a8446"),Rn());',
 'const sv=Math.min(1,Math.max(0,.5+.22*Math.sin(i*.41+j*.27)+.18*Math.cos(j*.33-i*.19)+.1*Math.sin((i+j)*.9)));const c=ym>snowY+nn*40?L2("#e8eef4"):ym>snowY*.7||sl>.85?g3Mix(L2("#77716a"),L2("#958e84"),sv):ym>45?g3Mix(L2("#3a5632"),L2("#4d6639"),sv):g3Mix(L2("#55713b"),L2("#6a8446"),sv);')
# svetlo oblohy: menej modre na zvislych plochach (skaly, steny)
patch("hemi", 'vec3 hemi=mix(uGnd,uSky,n.y*.5+.5);', 'vec3 hemi=mix(uGnd,uSky,n.y*.5+.5);if(uGrade>0.)hemi=mix(vec3(dot(hemi,vec3(.3,.5,.2))),hemi,.55);')
# tiene: oblast tienovej mapy tam, kam sa kamera pozera, a vacsia s vyskou (predtym len 90 m pod vrtulnikom)
patch("tiene oblast", 'shc:[hp.x,T(hp.x,hp.y),hp.y],shr:90,', 'shc:(()=>{const fx=C.tgt[0]-C.eye[0],fz=C.tgt[2]-C.eye[2],fl2=Math.hypot(fx,fz)||1,ad=C.mode==="belly"?0:Math.min(260,C.alt*.9+30),x=hp.x+fx/fl2*ad,z=hp.y+fz/fl2*ad;return[x,T(x,z),z]})(),shr:C.mode==="belly"?Math.max(60,Math.min(200,C.alt*.6)):Math.max(90,Math.min(300,C.alt*1.1+70)),')
patch("tiene svetlo", 'const eye=[fc[0]+L2[0]*130,fc[1]+L2[1]*130,fc[2]+L2[2]*130],LV=M4.look(eye,fc,Math.abs(L2[1])>.97?[0,0,-1]:[0,1,0]),LVP=M4.mul(M4.ortho(-hr,hr,-hr,hr,1,280),LV);',
 'const ED=130+Math.max(0,hr-90)*.9,eye=[fc[0]+L2[0]*ED,fc[1]+L2[1]*ED,fc[2]+L2[2]*ED],LV=M4.look(eye,fc,Math.abs(L2[1])>.97?[0,0,-1]:[0,1,0]),LVP=M4.mul(M4.ortho(-hr,hr,-hr,hr,1,280+Math.max(0,hr-90)*2),LV);')
patch("dedinske lampy", 'if(!urb)return;if(e.type==="city"||e.type==="main")H8.cityE.push(ei);const H2=HROAD[e.type],off=H2.w/2+(e.type==="city"?3.2:1.8),step=e.type==="city"?30:40;let sd=1;for(let s=8;s<e.len-8;s+=step){const p=hPtAt(e.pts,e.cum,s),nx=-Math.sin(p.a),nz=Math.cos(p.a);sd=-sd;', 'const VL=!urb&&e.type!=="hwy"&&e.type!=="dirt"?(W3.places||[]).filter(v=>v.k==="vil"&&Math.hypot(v.x-e.pts[0][0],v.y-e.pts[0][1])<e.len+300):[];if(!urb&&!VL.length)return;if(urb&&(e.type==="city"||e.type==="main"))H8.cityE.push(ei);const H2=HROAD[e.type],off=H2.w/2+(e.type==="city"?3.2:1.8),step=e.type==="city"?30:urb?40:34;let sd=1;for(let s=8;s<e.len-8;s+=step){const p=hPtAt(e.pts,e.cum,s),nx=-Math.sin(p.a),nz=Math.cos(p.a);if(!urb&&!VL.some(v=>Math.hypot(p.x-v.x,p.y-v.y)<240))continue;sd=-sd;')
CANOPY = r'''
window.__hCanopy=(W3,f,mc,G,GL,T)=>{try{
 const R=seeded((Math.floor(f[0]*7+f[1]*13)|0)+101),p0=R()*6.28,p1=R()*6.28,p2=R()*6.28;
 const rEdge=a=>f[2]*(.9+.06*Math.sin(3*a+p0)+.04*Math.sin(5*a+p1)+.025*Math.sin(9*a+p2));
 const nzz=(x,z)=>.5+.25*Math.sin(x*.045+p0)*Math.cos(z*.05+p1)+.25*Math.sin((x+z)*.021+p2);
 const build=(get,cell,road)=>{const x0=f[0]-f[2],z0=f[1]-f[2],nn=Math.ceil(2*f[2]/cell)+2,H=new Float32Array(nn*nn);
  for(let j=0;j<nn;j++)for(let i=0;i<nn;i++){const x=x0+i*cell,z=z0+j*cell,dx=x-f[0],dz=z-f[1],dd=Math.hypot(dx,dz),re=rEdge(Math.atan2(dz,dx));let h=-1;
   if(dd<re&&!hIsWaterW(W3,x,z)){const k=Math.min(1,(re-dd)/(cell*1.2+6));
    /* priechod pre cestu: na ceste nic, vedla nej nizsi okraj */
    const rn=hRoadNear(W3,x,z,road)?0:hRoadNear(W3,x,z,road+cell*.8)?.55:1;
    if(rn>0)h=(8.5+4*nzz(x,z))*(.45+.55*k)*rn*(W3.mtn?1.15:1)}
   H[j*nn+i]=h}
  for(let j=0;j<nn-1;j++)for(let i=0;i<nn-1;i++){const a=H[j*nn+i],b=H[j*nn+i+1],c=H[(j+1)*nn+i+1],e=H[(j+1)*nn+i];if(a<0&&b<0&&c<0&&e<0)continue;
   const P=(ii,jj,h)=>{const x=x0+ii*cell,z=z0+jj*cell;return[x,T(x,z)+(h<0?-.8:h),z]};
   const xm=x0+(i+.5)*cell,zm=z0+(j+.5)*cell,hm=(Math.max(a,0)+Math.max(b,0)+Math.max(c,0)+Math.max(e,0))/4,v=.86+.26*nzz(xm*2.3,zm*2.3);
   const col=[mc[0]*v*(.8+.02*hm),mc[1]*v*(.8+.02*hm),mc[2]*v*(.8+.02*hm)];
   get(xm,zm).quad(P(i,j,a),P(i,j+1,e),P(i+1,j+1,c),P(i+1,j,b),col,33)}};
 if(!hLo())build(G,12,4);build(GL,36,6)}catch(e){console.warn("canopy",e)}};
'''
LIT = r'''
window.__hLitTex=W3=>{if(W3._litT!==undefined)return W3._litT;W3._litT=null;try{const L=W3.h8&&W3.h8.lamps;if(!L||!L.length)return null;const gl=__h158G().G3.gl,N=2048,HWm=6e3,k=N/HWm,cv=document.createElement("canvas");cv.width=cv.height=N;const g=cv.getContext("2d");g.fillStyle="#000";g.fillRect(0,0,N,N);g.globalCompositeOperation="lighter";
 for(const l of L){const x=l[0]*k,y=l[2]*k,r=12*k,rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,"rgba(255,176,90,.85)");rg.addColorStop(.45,"rgba(230,140,60,.42)");rg.addColorStop(1,"rgba(200,110,40,0)");g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
 const t=gl.createTexture();gl.activeTexture(gl.TEXTURE7);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,cv);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.activeTexture(gl.TEXTURE0);W3._litT=t}catch(e){console.warn("lit",e)}return W3._litT};
'''
block("hgl-les", CANOPY)
block("hgl-noc", LIT)
URBAN = r'''
window.__hUrban=(W3,G,GL,T)=>{const B=W3.bld||[];for(const p of W3.places||[]){if(p.k!=="city"&&p.k!=="vil")continue;
 const ds=B.map(b=>Math.hypot((b.x0+b.x1)/2-p.x,(b.z0+b.z1)/2-p.y)).filter(v=>v<(p.k==="city"?(W3.city&&W3.city.r||700)+200:420)).sort((a,b)=>a-b);
 if(ds.length<4)continue;const r0=ds[Math.floor(ds.length*.9)]+(p.k==="city"?50:38),R=seeded((p.x*3+p.y*7)|0),ph=[R()*6.28,R()*6.28,R()*6.28];
 const rad=a=>r0*(1+.07*Math.sin(3*a+ph[0])+.05*Math.sin(5*a+ph[1])+.03*Math.sin(8*a+ph[2])),ns=Math.max(36,Math.round(r0/14)),nr=Math.max(3,Math.round(r0/45));
 for(let k=0;k<ns;k++){const a0=k/ns*6.2832,a1=(k+1)/ns*6.2832,e0=rad(a0),e1=rad(a1);
  for(let j=0;j<nr;j++){const t0=j/nr,t1=(j+1)/nr,P=(a,e,t)=>{const x=p.x+Math.cos(a)*e*t,z=p.y+Math.sin(a)*e*t;return[x,T(x,z)+.01,z]};
   const A=P(a0,e0,t0),Bq=P(a1,e1,t0),C=P(a1,e1,t1),D=P(a0,e0,t1),cx=(A[0]+C[0])/2,cz=(A[2]+C[2])/2,col=p.k==="city"?[1,1,1]:[.5,.5,.5];
   G(cx,cz).quad(A,D,C,Bq,col,37);GL(cx,cz).quad(A,D,C,Bq,col,37)}}}
 /* zahrady a ovocne stromy pri rodinnych domoch */
 if(!hLo()){const R=seeded(4242),SE=SEASON,tc=SE==="autumn"?["#8a6a24","#a8842c","#6a5a22","#4a6a2c"]:SE==="winter"?["#6a5e52","#5e544a"]:SE==="spring"?["#e8d8e0","#5a8a3a","#f0e6ea"]:["#3f6a2e","#4f7a34","#355a2a"],tr=g3L("#4a3a2a");
  for(const b of B){if(b.k!=="res"||b.h>12||b.nodraw)continue;const fw=b.x1-b.x0,fd=b.z1-b.z0;if(fw>24||fd>24)continue;
   const cx0=(b.x0+b.x1)/2,cz0=(b.z0+b.z1)/2,hw=fw/2,hd=fd/2,ry=b.ang!=null?Math.atan2(-Math.cos(b.ang),-Math.sin(b.ang)):0,c=Math.cos(ry),s=Math.sin(ry),Wp=(x,z)=>[cx0+c*x+s*z,cz0-s*x+c*z];
   const dep=7+R()*7,s0=Math.floor(R()*4);let L=null;
   for(let t=0;t<4&&!L;t++){const sd=(s0+t)%4;let lx0=-hw-1,lx1=hw+1,lz0=-hd-1,lz1=hd+1;if(sd===0)lx1=hw+dep;else if(sd===1)lx0=-hw-dep;else if(sd===2)lz1=hd+dep;else lz0=-hd-dep;
    const m=Wp((lx0+lx1)/2+(sd===0?dep/2:sd===1?-dep/2:0),(lz0+lz1)/2+(sd===2?dep/2:sd===3?-dep/2:0));if(!hRoadNear(W3,m[0],m[1],3)&&!hIsWaterW(W3,m[0],m[1]))L=[lx0,lx1,lz0,lz1,sd]}
   if(!L)continue;const[lx0,lx1,lz0,lz1,sd]=L,y=T(cx0,cz0)+.02,beds=R()<.35,col=beds?g3L(R()<.5?"#4a3626":"#5a4630"):g3L(R()<.5?"#3e5a26":"#4a6a2c");
   const P=(x,z)=>{const w=Wp(x,z);return[w[0],y,w[1]]};G(cx0,cz0).quad(P(lx0,lz0),P(lx0,lz1),P(lx1,lz1),P(lx1,lz0),col,34);
   const nt=R()<.75?1+Math.floor(R()*2):0;for(let k=0;k<nt;k++){const lx=sd===0?hw+2+R()*(dep-3):sd===1?-hw-2-R()*(dep-3):lx0+1.5+R()*(lx1-lx0-3),lz=sd===2?hd+2+R()*(dep-3):sd===3?-hd-2-R()*(dep-3):lz0+1.5+R()*(lz1-lz0-3),w=Wp(lx,lz),tx=w[0],tz=w[1];
    if(hRoadNear(W3,tx,tz,2.5))continue;const ty=T(tx,tz),s2=2+R()*1.6,g=G(tx,tz);g.cyl(tx,tz,ty,ty+s2*.7,.16,.12,4,tr,0);g.blob(tx,ty+s2*1.15,tz,s2*.75,s2*.62,s2*.75,g3L(tc[Math.floor(R()*tc.length)]),28,k)}}
 /* stromy vo vnutroblokoch a parkoch mesta */
 const C=W3.city;if(C){const R2=seeded(777),SE=SEASON,tc2=SE==="autumn"?["#9a6a22","#b8862a","#7a4a1a","#4a6a2c","#c9a032"]:SE==="winter"?["#6a5e52","#5e544a"]:["#3f6a2e","#4f7a34","#355a2a","#5e8a3a"],tr2=g3L("#4a3a2a");
  const sp=W3.spec||{},st=sp.stadium,sq=sp.square,free=(x,z,r)=>!(st&&Math.abs(x-st.x)<92&&Math.abs(z-st.y)<76)&&!(sq&&x>sq.x0-6&&x<sq.x1+6&&z>sq.z0-6&&z<sq.z1+6)&&!hRoadNear(W3,x,z,r)&&!hIsWaterW(W3,x,z)&&!hBldAt(x,z)&&!hBldAt(x+r,z)&&!hBldAt(x-r,z)&&!hBldAt(x,z+r)&&!hBldAt(x,z-r);
  if(sq){const tr3=g3L("#4a3a2a");for(const[x0,z0,x1,z1]of[[sq.x0+4,sq.z0+4,sq.x1-4,sq.z0+4],[sq.x0+4,sq.z1-4,sq.x1-4,sq.z1-4],[sq.x0+4,sq.z0+4,sq.x0+4,sq.z1-4],[sq.x1-4,sq.z0+4,sq.x1-4,sq.z1-4]]){const L=Math.hypot(x1-x0,z1-z0),n=Math.floor(L/9);for(let k=0;k<=n;k++){const x=x0+(x1-x0)*k/Math.max(1,n),z=z0+(z1-z0)*k/Math.max(1,n);if(hBldAt(x,z)||hRoadNear(W3,x,z,2))continue;const y=T(x,z),s2=2.8+R2()*.8,g=G(x,z);g.cyl(x,z,y,y+s2*.9,.18,.14,4,tr3,0);g.blob(x,y+s2*1.35,z,s2*.7,s2*.72,s2*.7,g3L(tc2[Math.floor(R2()*tc2.length)]),28,k)}}}
  const nc=Math.round(C.r*C.r/1500);for(let i=0;i<nc;i++){const a=R2()*6.2832,d=Math.sqrt(R2())*C.r*1.05,cx=C.x+Math.cos(a)*d,cz=C.y+Math.sin(a)*d;if(!free(cx,cz,6))continue;const nt=4+Math.floor(R2()*6);
   for(let k=0;k<nt;k++){const x=cx+(R2()-.5)*26,z=cz+(R2()-.5)*26;if(!free(x,z,3.5))continue;const y=T(x,z),s2=2.6+R2()*2.4,g=G(x,z);g.cyl(x,z,y,y+s2*.75,.2,.15,4,tr2,0);g.blob(x,y+s2*1.25,z,s2*.8,s2*.7,s2*.8,g3L(tc2[Math.floor(R2()*tc2.length)]),28,k)}}}}};
'''
block("hgl-obce", URBAN)
open(p, "w", encoding="utf8", newline="").write(d)
print("hotovo", len(d))
