# -*- coding: utf-8 -*-
import os, zipfile

root = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(root, 'netlify-deploy.zip')
skip = {'.git', '.git-tools', 'netlify-deploy.zip', '_repack_tmp.py', '_css_check_tmp.py', '__pycache__'}

if os.path.exists(out):
    os.remove(out)

count = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        rel = os.path.relpath(dirpath, root)
        if rel == '.':
            dirnames[:] = [d for d in dirnames if d not in skip]
            continue
        # skip hidden/dangerous dirs anywhere
        dirnames[:] = [d for d in dirnames if d not in skip and not d.startswith('.')]
        for fn in filenames:
            if fn in skip or fn.startswith('.'):
                continue
            fp = os.path.join(dirpath, fn)
            arc = os.path.relpath(fp, root).replace('\\', '/')
            z.write(fp, arc)
            count += 1

print('OK, files=%d' % count)
