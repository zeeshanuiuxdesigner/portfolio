"""
Regenerates header.js / footer.js from header.html / footer.html.

header.html and footer.html are the files you edit.
header.js and footer.js are generated copies that let the site work when
pages are opened directly from the file system (file://), where browsers
block fetch(). When served over HTTP the .html files are fetched directly.

Run after editing header.html or footer.html:

    python components/sync-components.py
"""
import io
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

for name in ("header", "footer"):
    src = os.path.join(HERE, name + ".html")
    dst = os.path.join(HERE, name + ".js")
    html = io.open(src, encoding="utf-8").read()
    js = (
        "/* GENERATED FILE - do not edit. Edit " + name + ".html and run: python components/sync-components.py */\n"
        "window.SITE_COMPONENTS = window.SITE_COMPONENTS || {};\n"
        "window.SITE_COMPONENTS." + name + " = " + json.dumps(html, ensure_ascii=False) + ";\n"
    )
    io.open(dst, "w", encoding="utf-8", newline="\n").write(js)
    print("wrote", os.path.relpath(dst, os.getcwd()))
