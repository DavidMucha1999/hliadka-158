#!/bin/sh
# Skopiruje zostavenu hru a zdrojove skripty do priecinka github a nahra ich na GitHub (GitHub Pages).
# Pouzitie: sh zverejni.sh "popis zmeny"
set -e
cd "$(dirname "$0")"
Z="$(pwd)"
cd ../github
cp "../Hliadka 158.html" index.html
# zdroje bez zaloh (zalohy maju 15 MB a su len zakladom pre zostavenie)
rm -rf zdroje
mkdir zdroje
cp "$Z"/README.md "$Z"/*.sh "$Z"/*.py zdroje/
for d in stop drive chase info menu hx; do cp -r "$Z/$d" zdroje/; done
git add -A index.html README.md CHANGELOG.md zdroje
if git diff --cached --quiet; then echo "Bez zmien – nie je co nahrat."; exit 0; fi
git commit -q -m "${1:-Aktualizácia hry}

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>"
git push -q origin main
echo "Nahrane: https://davidmucha1999.github.io/hliadka-158/"
