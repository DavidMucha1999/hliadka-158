/* Obrazovka "O hre": tlacidlo v hlavnom menu a karta s popisom projektu */
const OH_REPO="https://github.com/DavidMucha1999/hliadka-158";
function ohOpen(){const nC=new Set(LOCS.map(x=>x.ct)).size,st=[[MODES.length,"druhov služby"],[LOCS.length,"úsekov v "+nC+" krajinách"],[COPS.length,"služobných vozidiel"],[RANKS.length,"hodností"],["6 × 6 km","mapa okresu"],["1 súbor","bez inštalácie"]];
 openModal(`<div class="oh"><div class="ev"><div class="ev-ic">${badgeSVG()}</div><div><p class="eyebrow">O hre</p><h3 class="ev-t">Hliadka 158</h3></div></div>
 <p>Hra o službe polície, ktorá beží priamo v prehliadači. Hráč meria rýchlosť, zastavuje vozidlá, kontroluje vodičov, jazdí na výjazdy, naháňa utekajúcich a postupuje v policajnej kariére.</p>
 <div class="oh-st">${st.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("")}</div>
 <h4>Čo v hre je</h4>
 <ul><li><b>Cestná kontrola</b> – radar, doklady, otázky vodičovi, lustrácia, dychová skúška, prehliadka vozidla a záznam o priestupku.</li><li><b>Interaktívna 3D scéna</b> – pohľad do auta s miestami na preskúmanie, v noci s baterkou.</li><li><b>Hliadka za volantom</b> – jazda po mape, navigácia po cestách, výjazdy od vysielačky, naháňačky so zátarasom.</li><li><b>Letecký útvar</b> – vrtuľník s misiami nad tou istou mapou.</li><li><b>Kariéra</b> – hodnosti, špecializácie, kolega v aute, hodnotenie zmeny so známkou a rozborom chýb.</li></ul>
 <h4>Ako vznikla</h4>
 <p>Osobný projekt. Autor: <b>David Mucha</b> – návrh hry, herné mechaniky a testovanie. Kód vznikal s pomocou AI nástrojov.</p>
 <h4>Technické údaje</h4>
 <p>Celá hra je jeden HTML súbor: čistý JavaScript, vlastné 3D vykresľovanie cez WebGL, zvuky generované v prehliadači. Nepoužíva server ani externé knižnice a postup ukladá len v prehliadači hráča. 3D modely áut: Kenney Car Kit (CC0).</p>
 <div class="oh-b"><a class="btn" href="${OH_REPO}" target="_blank" rel="noopener">Zdrojový kód na GitHube ↗</a><button class="btn primary" id="oh-x">Zavrieť</button></div></div>`);
 const x=$("#oh-x");if(x){x.onclick=closeModal;x.focus()}}
function ohBtn(){const b=document.querySelector("#scr-menu .mm-brand");if(!b||b.querySelector("#oh-o"))return;b.insertAdjacentHTML("beforeend",`<button class="btn ghost oh-o" id="oh-o" title="Čo je to za hru, čo obsahuje a ako vznikla">ℹ O hre</button>`);$("#oh-o").onclick=()=>{try{SFX.play("click")}catch(e){}ohOpen()}}
{const rm0=renderMenu;renderMenu=function(){const r=rm0.apply(this,arguments);try{ohBtn()}catch(e){console.warn("oh",e)}return r}}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.querySelector("#mbox .oh")){e.stopPropagation();closeModal()}},true);
