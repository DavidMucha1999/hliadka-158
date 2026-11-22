# Kontrola syntaxe zostavenej hry: vyberie skripty z HTML a preveri ich cez node (ak je k dispozicii).
import re, sys, os, shutil, subprocess, tempfile
s=open(sys.argv[1],encoding="utf8").read()
js="\n;\n".join(re.findall(r"<script(?![^>]*src)[^>]*>(.*?)</script>",s,flags=re.S))
node=shutil.which("node")
if not node: print("syntax: node nie je k dispozicii, preskakujem");sys.exit(0)
f=os.path.join(tempfile.gettempdir(),"h158-syntax.js")
open(f,"w",encoding="utf8").write(js)
r=subprocess.run([node,"--check",f],capture_output=True,text=True)
if r.returncode: print(r.stderr[-600:]);sys.exit(1)
print("syntax: ok")
