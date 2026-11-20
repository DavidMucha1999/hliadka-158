#!/bin/sh
# Zostavi "Hliadka 158.html" od zakladnej zalohy:
#   zalohy/pred-grafika.html  ->  grafika.py  ->  stop_f1.py .. stop_f5.py  ->  stop_f7.py  ->  stop_f8.py  ->  stop_f9.py  ->  chase_sipka.py  ->  drive_fd.py  ->  info_o.py  ->  menu_pv.py  ->  auta_av.py
cd "$(dirname "$0")"
G="../Hliadka 158.html"
cp "zalohy/pred-grafika.html" "$G"
PYTHONIOENCODING=utf8 python grafika.py "$G" >/dev/null || { echo "grafika.py zlyhal"; exit 1; }
for n in 1 2 3 4 5; do PYTHONIOENCODING=utf8 python "stop_f$n.py" "$G" >/dev/null || { echo "stop_f$n.py zlyhal"; exit 1; }; done
PYTHONIOENCODING=utf8 python stop_f7.py "$G" >/dev/null || { echo "stop_f7.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python stop_f8.py "$G" >/dev/null || { echo "stop_f8.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python stop_f9.py "$G" >/dev/null || { echo "stop_f9.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python chase_sipka.py "$G" >/dev/null || { echo "chase_sipka.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python drive_fd.py "$G" >/dev/null || { echo "drive_fd.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python info_o.py "$G" >/dev/null || { echo "info_o.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python menu_pv.py "$G" >/dev/null || { echo "menu_pv.py zlyhal"; exit 1; }
PYTHONIOENCODING=utf8 python auta_av.py "$G" >/dev/null || { echo "auta_av.py zlyhal"; exit 1; }
echo "Hotovo: $G"
