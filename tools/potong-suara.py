#!/usr/bin/env python3
# =====================================================================
#  POTONG SUARA: satu fail MP3 panjang (contoh dari ElevenLabs) -> satu klip
#  bagi setiap ayat dalam skrip, kemudian dimasukkan ke pakej suara aplikasi.
#
#  python3 tools/potong-suara.py SKRIP.txt AUDIO.mp3 [SKRIP2.txt AUDIO2.mp3 ...]
#      --semak   hanya laporan, tidak menulis klip
#  python3 tools/potong-suara.py --auto 01.mp3 02.mp3 ...  (padan ikut nombor dengan rakaman/baki/NN.txt)
#  Jika SKRIP.kunci.txt wujud, setiap barisnya ialah ayat sebenar bagi baris skrip
#  yang sama (untuk skrip yang ditulis dengan ejaan sebutan, cth. huruf).
#
#  Cara padanan: jeda dalam audio dicari, kemudian titik potong dipilih
#  (pengaturcaraan dinamik) supaya tempoh setiap klip sepadan dengan
#  bilangan suku kata ayatnya dan jeda yang dipilih adalah yang paling jelas.
#  Perlu: ffmpeg, numpy.
# =====================================================================
import sys, re, json, hashlib, subprocess, math, os
import numpy as np

DIR = 'audio/ms-MY'
SR = 16000
HOP = 0.01

def clip_key(s):
    return re.sub(r'\s+', ' ', str(s).lower()).strip()

def script_lines(path):
    out = []
    for raw in open(path, encoding='utf-8').read().split('\n'):
        l = raw.strip()
        if not l or re.fullmatch(r'\[[^\]]*pause[^\]]*\]', l, re.I):
            continue
        l = re.sub(r'\[[^\]]+\]\s*', '', l).strip()
        if l:
            out.append(l)
    return out

def syllables(s):
    s = s.lower()
    # nombor & huruf tunggal (contoh "Huruf Q") diberi anggaran sebutan
    s = re.sub(r'\b([a-z])\b', lambda m: 'kiu' if m.group(1) == 'q' else m.group(1) + 'a', s)
    return max(1, len(re.findall(r'[aeiou]+', s)))

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def envelope(x):
    h = int(SR * HOP); n = len(x) // h
    e = np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(e)

def find_gaps(db, thr=-40, min_len=0.05):
    peak = np.percentile(db, 99)
    sil = db < peak + thr
    gaps, i, n = [], 0, len(db)
    first = next((k for k in range(n) if not sil[k]), 0)
    last = next((k for k in range(n - 1, -1, -1) if not sil[k]), n - 1)
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]: j += 1
            if i > first and j <= last and (j - i) * HOP >= min_len:
                gaps.append((i * HOP, j * HOP))
            i = j
        else:
            i += 1
    return gaps, first * HOP, (last + 1) * HOP

def align(lines, gaps, t0, t1, iters=3):
    N = len(lines)
    syl = np.array([syllables(l) for l in lines], float)
    G = len(gaps)
    if G < N - 1:
        raise SystemExit(f'Terlalu sedikit jeda ({G}) untuk {N} ayat')
    starts = [t0] + [g[1] for g in gaps]          # permulaan segmen selepas jeda
    ends = [g[0] for g in gaps] + [t1]            # akhir segmen sebelum jeda
    glen = np.array([g[1] - g[0] for g in gaps])
    rate, base = (t1 - t0 - 0.3 * (N - 1)) / syl.sum(), 0.0
    best = None
    for _ in range(iters):
        INF = 1e18
        # dp[k][j]: ayat 0..k diletakkan, ayat k berakhir pada sempadan j (j = indeks jeda, atau G = hujung)
        dp = np.full((N, G + 1), INF); bk = np.zeros((N, G + 1), int)
        def seg_cost(k, a, b):
            dur = ends[b] - starts[a]
            if dur <= 0.05: return INF
            exp = base + rate * syl[k]
            return (math.log(dur / exp)) ** 2 * 4
        for j in range(G + 1):
            c = seg_cost(0, 0, j)
            if c < INF: dp[0][j] = c - (math.log(glen[j] + 0.02) if j < G else 0)
        for k in range(1, N):
            lo = k; hi = G - (N - 1 - k) if k < N - 1 else G
            for j in range(lo, hi + 1):
                if k == N - 1 and j != G: continue
                bonus = math.log(glen[j] + 0.02) if j < G else 0
                bestv, bi = INF, -1
                for i in range(max(k - 1, j - 25), j):
                    if dp[k - 1][i] >= INF: continue
                    v = dp[k - 1][i] + seg_cost(k, i + 1, j)
                    if v < bestv: bestv, bi = v, i
                if bi >= 0:
                    dp[k][j] = bestv - bonus; bk[k][j] = bi
        cuts = [G]
        for k in range(N - 1, 0, -1): cuts.append(bk[k][cuts[-1]])
        cuts = cuts[::-1]
        segs, prev = [], 0
        for k, j in enumerate(cuts):
            a = 0 if k == 0 else cuts[k - 1] + 1
            segs.append((starts[a], ends[j]))
        durs = np.array([b - a for a, b in segs])
        A = np.vstack([syl, np.ones(N)]).T
        (rate, base), *_ = np.linalg.lstsq(A, durs, rcond=None)
        base = max(0.0, base); rate = max(0.02, rate)
        best = (segs, cuts)
    segs, cuts = best
    chosen = [gaps[j] for j in cuts[:-1]]
    return segs, chosen, rate, base, syl

def islands(db, a, b, thr):
    out, i, i1 = [], int(a / HOP), int(b / HOP)
    while i < i1:
        if db[i] >= thr:
            j = i
            while j < i1 and db[j] >= thr: j += 1
            out.append((i * HOP, j * HOP)); i = j
        else: i += 1
    return out

def fix_tails(segs, db):
    # bunyi pendek di hujung klip selepas jeda (cth. "Ps" ayat berbisik seterusnya) -> pindah ke klip seterusnya
    thr = np.percentile(db, 99) - 40
    segs = list(segs)
    for k in range(len(segs) - 1):
        isl = islands(db, *segs[k], thr)
        if len(isl) >= 2:
            last, prev = isl[-1], isl[-2]
            if last[1] - last[0] < 0.25 and last[0] - prev[1] >= 0.3:
                segs[k] = (segs[k][0], prev[1]); segs[k + 1] = (last[0], segs[k + 1][1])
    return segs

def clip_id(key):
    return hashlib.sha1(key.encode('utf-8')).hexdigest()[:10]

def auto_pairs(files, folder='rakaman/baki'):
    # padankan MP3 dengan bahagian skrip ikut nombor dalam nama fail (cth. "07.mp3", "bahagian 07.mp3")
    import glob
    pairs = []
    for au in files:
        m = re.findall(r'(?<![0-9])([0-9]{2})(?![0-9])', os.path.splitext(os.path.basename(au))[0])
        sc = f'{folder}/{m[-1]}.txt' if m else None
        if sc and os.path.exists(sc):
            pairs.append((sc, au)); print(f'{os.path.basename(au)}  =>  {sc}')
        else:
            print(f'!! {os.path.basename(au)}: namakan fail dengan nombor bahagian (cth. 07.mp3)')
    return pairs

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check = '--semak' in sys.argv
    pairs = auto_pairs(args) if '--auto' in sys.argv else list(zip(args[0::2], args[1::2]))
    cat = {}
    if os.path.exists(f'{DIR}/catalog.json'):
        for it in json.load(open(f'{DIR}/catalog.json', encoding='utf-8'))['items']:
            cat[re.sub(r'[.!?]+$', '', it['key'])] = it['key']
    man_path = f'{DIR}/manifest.json'
    man = json.load(open(man_path, encoding='utf-8')) if os.path.exists(man_path) else {'clips': {}}
    clips = man.get('clips') or {}
    report, total = [], 0
    for script, audio in pairs:
        lines = script_lines(script)
        # ejaan sebutan (cth. "Huruf i.") dipadankan dengan ayat sebenar dalam fail .kunci.txt
        kunci = script[:-4] + '.kunci.txt'
        keys = [l.strip() for l in open(kunci, encoding='utf-8') if l.strip()] if os.path.exists(kunci) else lines
        if len(keys) != len(lines): raise SystemExit(f'{kunci}: {len(keys)} baris, skrip {len(lines)} baris')
        x = load(audio); db = envelope(x)
        gaps, t0, t1 = find_gaps(db)
        segs, chosen, rate, base, syl = align(lines, gaps, t0, t1)
        segs = fix_tails(segs, db)
        durs = [b - a for a, b in segs]
        exp = [base + rate * s for s in syl]
        ratios = [d / e for d, e in zip(durs, exp)]
        gapmin = min((g[1] - g[0]) for g in chosen) if chosen else 0
        corr = float(np.corrcoef(durs, syl)[0, 1]) if len(lines) > 2 else 1.0
        worst = sorted(range(len(lines)), key=lambda k: -abs(math.log(ratios[k])))[:3]
        print(f'\n{os.path.basename(audio)}  ->  {len(lines)} ayat  (korelasi tempoh~suku kata {corr:.2f}, jeda terpendek dipilih {gapmin:.2f}s)')
        for k in worst: print(f'   semak: "{lines[k]}"  {durs[k]:.2f}s vs jangka {exp[k]:.2f}s')
        report.append((audio, corr, gapmin))
        if check: continue
        for k, (line, (a, b)) in enumerate(zip(keys, segs)):
            base_key = re.sub(r'[.!?]+$', '', clip_key(line))
            key = cat.get(base_key, clip_key(line))
            fid = clip_id(key)
            a2, b2 = max(0, a - 0.06), b + 0.12
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{a2:.3f}', '-to', f'{b2:.3f}', '-i', audio, '-ac', '1', '-ar', '24000',
                            '-af', 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse,loudnorm=I=-16:TP=-1.5', '-b:a', '48k', f'{DIR}/{fid}.mp3'], check=True)
            clips[key] = f'{fid}.mp3'; total += 1
    if not check:
        man.update({'voice': 'ElevenLabs', 'provider': 'elevenlabs', 'count': len(clips), 'clips': clips})
        json.dump(man, open(man_path, 'w', encoding='utf-8'), ensure_ascii=False)
        print(f'\n{total} klip ditulis. Manifest: {len(clips)} ayat ada suara.')

if __name__ == '__main__':
    main()
