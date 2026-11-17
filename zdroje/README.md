# Zdroje úprav – Hliadka 158

Úpravy hry sa robia skriptami, ktoré vkladajú bloky kódu do `Hliadka 158.html`.
Hru sa dá kedykoľvek zostaviť znova od zálohy.

## Zostavenie hry

```
sh postav.sh
```

Postup: `zalohy/pred-grafika.html` → `grafika.py` → `stop_f1.py` … `stop_f5.py` → `stop_f7.py` → `stop_f8.py` → `stop_f9.py` → `chase_sipka.py` → `drive_fd.py` → `info_o.py` → `menu_pv.py` → `../Hliadka 158.html`.


## Obsah

| Súbor | Čo robí |
|---|---|
| `grafika.py` | Grafika leteckého režimu (mapa, les, polia, tiene, noc, dedinské lampy) |
| `stop_f1.py` + `stop/f1.*` | Cestná kontrola: otázky, rozpory, trpezlivosť, prehliadka s dôvodom, záznam o priestupku |
| `stop_f2.py` + `stop/f2.*` | Stanovište, ručný radar, postrehy pri meraní, reakcie na výzvu |
| `stop_f3.py` + `stop/f3.*` | Akcie zmeny, spolujazdec, eskalácia a posila, pátranie |
| `stop_f4.py` + `stop/f4.*` | Vyhodnotenie zmeny so známkou a rozborom chýb |
| `stop_f5.py` + `stop/f5.js` | 3D scéna kontroly: príjazd posily, vodič vonku a spútaný, spolujazdec v aute, balíček v priekope |
| `stop_f7.py` + `stop/f7.*` | Prehľadnosť kontroly: 3 stĺpce, skrývateľná scéna, zápisník zistení, dôkazy a návrhy opatrení v zázname |
| `stop_f8.py` + `stop/f8.*` | Pás postupu, tip na ďalší krok, cena trpezlivosti na tlačidlách, úrovne pomoci (nastavenia + 🧭 v kontrole) |
| `stop_f9.py` + `stop/f9.*` | Interaktívna kontrola v 3D: pohľad do auta (V), miesta na preskúmanie, baterka v noci, doklad v ruke (⤢) |
| `chase_sipka.py` + `chase/sipka.js` | Šípka nad unikajúcim vozidlom pri prenasledovaní, na okraji obrazovky keď je mimo záberu |
| `drive_fd.py` + `drive/fd.*` | Nový režim Hliadka za volantom: jazda policajným autom po mape, radar a zastavovanie vozidiel, navigácia s minimapou a mapou (M), výjazdy od vysielačky, naháňačky so zátarasom a vytlačením (kroky 1 – 4) |
| `info_o.py` + `info/o.*` | Obrazovka „O hre“ v hlavnom menu |
| `menu_pv.py` + `menu/pv.*` | Vzhľad hlavnej obrazovky: päť rozložení a pôvodné, voľba v Nastaveniach |
| `nahlad/` | Ukážková kópia hry s prepínačom návrhov menu (pomôcka pri výbere, nie je súčasťou hry) |
| `zverejni.sh` | Skopíruje hru a zdroje do priečinka `github` a nahrá ich na GitHub |
| `zalohy/pred-grafika.html` | Základ pre `postav.sh` (hra pred grafikou leteckého režimu) |
| `zalohy/pred-f1.html` | Hra s grafikou, pred prestavbou kontroly |
| `hlas_zvuk.py`, `hx/` | Staršie úpravy (hlas a zvuky, režim Posádka). Sú už obsiahnuté v zálohách, slúžia len ako referencia |

Skripty sú opakovateľné: každý blok najprv odstráni svoju starú verziu a vloží novú.
