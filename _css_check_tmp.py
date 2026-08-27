# -*- coding: utf-8 -*-
import sys

def check(path):
    with open(path, 'r', encoding='utf-8') as f:
        s = f.read()
    pairs = {')': '(', ']': '[', '}': '{'}
    opens = set('([{')
    stack = []
    i = 0
    n = len(s)
    in_s = None  # '"' or "'"
    while i < n:
        c = s[i]
        if in_s:
            if c == '\\':
                i += 2
                continue
            if c == in_s:
                in_s = None
            i += 1
            continue
        if c == '/' and i + 1 < n and s[i+1] == '/':
            while i < n and s[i] != '\n':
                i += 1
            continue
        if c == '/' and i + 1 < n and s[i+1] == '*':
            i = s.find('*/', i + 2)
            if i == -1:
                break
            i += 2
            continue
        if c in ('"', "'"):
            in_s = c
            i += 1
            continue
        if c in opens:
            stack.append((c, i))
        elif c in pairs:
            if not stack or stack[-1][0] != pairs[c]:
                print(f'{path}: UNMATCHED {c!r} at offset {i}')
                return 1
            stack.pop()
        i += 1
    if stack:
        for c, off in stack[-5:]:
            print(f'{path}: unclosed {c!r} at offset {off}')
        return 1
    print(f'{path}: OK')
    return 0

rc = 0
for p in sys.argv[1:]:
    rc |= check(p)
sys.exit(rc)
