# Priprava na zverejnenie: hlavicka stranky, oprava testovacieho profilu, pravdive udaje o modeloch aut.
import re, sys
p=sys.argv[1]
d=open(p,encoding="utf8",newline="").read()
def patch(name,old,new):
    global d
    if new in d: print(name+": uz");return
    if d.count(old)!=1: print(name+": VZOR (%d)"%d.count(old));sys.exit(1)
    d=d.replace(old,new);print(name+": ok")

IKONA=("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
 "%3Cpath d='M32 3l24 8v18c0 16-10 27-24 32C18 56 8 45 8 29V11z' fill='%23162a52' stroke='%23f2c230' stroke-width='4'/%3E"
 "%3Ctext x='32' y='40' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23f2c230' text-anchor='middle'%3E158%3C/text%3E%3C/svg%3E")
POPIS="Hliadka 158 – hra o službe polície, ktorá beží priamo v prehliadači: cestné kontroly, jazda hliadkovým autom po mape okresu, vrtuľník a ďalšie druhy služby."
patch("hlavicka stranky",
 '<!doctype html><html><head><meta charset=utf8>',
 '<!doctype html><html lang="sk"><head><meta charset=utf8><meta name="description" content="'+POPIS+'">'
 '<meta property="og:title" content="Hliadka 158"><meta property="og:description" content="'+POPIS+'"><meta property="og:type" content="website">'
 '<link rel="icon" href="'+IKONA+'">')

# Testovaci profil: obal funkcie h158Desk bol v inom bloku nez funkcia sama, v prisnom rezime to hadzalo
# ReferenceError a oznam pre noveho navstevnika sa preto nikdy nezobrazil.
n0=len(d)
d,k=re.subn(r'const _deskTest=h158Desk;\s*h158Desk=function\(\)\{.*?\n\};\s*(?=const _stTest=start;)','',d,count=1,flags=re.S)
if k==1: print("testovaci profil: ok",n0-len(d))
elif "const _stTest=start;" in d and "_deskTest" not in d: print("testovaci profil: uz")
else: print("testovaci profil: VZOR");sys.exit(1)

patch("modely aut v nastaveniach",
 '3D modely osobných áut, dodávok a traktorov: Kenney Car Kit (CC0, kenney.nl).',
 'Autá kreslí vlastný generátor karosérií, hra nepoužíva cudzie 3D modely áut.')

open(p,"w",encoding="utf8",newline="").write(d)
