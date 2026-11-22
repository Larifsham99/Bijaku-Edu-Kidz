// =====================================================================
//  CILIK RACING — enjin simulasi (tiada DOM; boleh diuji dalam Node)
//  Kereta bergerak sendiri. Pemain menukar lorong, mengutip, menjawab.
//  Tiada "mati": langgar = perlahan sebentar; salah = cuba lagi di depan.
// =====================================================================
export const SEGL = 200;
export const ROAD_W = 2000; // separuh lebar jalan (unit dunia)
export const laneX = (lane, L) => -ROAD_W + (lane + 0.5) * ((2 * ROAD_W) / L);

const ROW_GAP = { 1: 17, 2: 15, 3: 14, 4: 13, 5: 13, 6: 13 };
const DODGE_GAP = { 1: 18, 2: 15, 3: 13, 4: 12, 5: 11, 6: 11 };

export function createRace(level, { autopilot = false, assist = false, driver = null } = {}) {
  const L = level.lanes;
  const base = level.speed * SEGL;
  const r = {
    level, L, base,
    pos: 0, speed: 0, t: 0,
    lane: Math.floor((L - 1) / 2), laneF: Math.floor((L - 1) / 2),
    state: 'ready', // ready | run | pit | done
    objs: [], events: [], seq: 0,
    taskIdx: -1, task: null, nextTaskAt: 6 * SEGL, finishZ: null,
    boostT: 0, bumpT: 0, memT: 0, charges: 1,
    mistakes: 0, bumps: 0, correct: 0, collected: 0, stars: 0,
    autopilot, assist, driver,
    progress: { got: 0, need: 0, k: 0 },
  };
  const ev = (e) => r.events.push(e);
  const add = (o) => { o.id = ++r.seq; r.objs.push(o); return o; };

  r.go = () => { if (r.state === 'ready') { r.state = 'run'; ev({ t: 'go' }); } };
  r.steer = (d) => { if (r.state === 'done') return; const n = Math.max(0, Math.min(L - 1, r.lane + d)); if (n !== r.lane) { r.lane = n; ev({ t: 'steer', d }); } };
  r.setLane = (n) => { r.lane = Math.max(0, Math.min(L - 1, n)); };
  r.boost = () => {
    if (r.state !== 'run' || r.charges <= 0 || r.boostT > 0.3) return false;
    r.charges--; r.boostT = 2.2; ev({ t: 'boost', manual: true }); return true;
  };
  r.pitDone = (mist = 0) => {
    if (r.state !== 'pit') return;
    r.mistakes += mist;
    r.state = 'run'; r.boostT = 1.8; r.charges = Math.min(3, r.charges + 1); r.correct++;
    ev({ t: 'boost', manual: false });
    complete();
  };

  // ---------- tugasan ----------
  function activate() {
    r.taskIdx++;
    const task = level.tasks[r.taskIdx];
    if (!task) { r.finishZ = r.pos + base * (level.special ? 4.2 : 3.2); add({ type: 'finish', z: r.finishZ, lane: -1 }); ev({ t: 'finishSpawn' }); return; }
    r.task = task;
    r.progress = { got: 0, need: task.need || (task.seq ? task.seq.length : task.rows ? task.rows.length : 1), k: 0, attempt: 0 };
    if (level.special && r.taskIdx === level.tasks.length - 1) ev({ t: 'finalLap' });
    ev({ t: 'task', task, idx: r.taskIdx });
    const lead = base * 4.4;
    if (task.kind === 'gate') spawnGate(task, r.pos + lead, 0);
    else if (task.kind === 'collect') spawnRows(task, r.pos + lead * 0.75, 0);
    else if (task.kind === 'order') { r.memT = 3.8; ev({ t: 'memory', task }); }
    else if (task.kind === 'dodge') {
      const gap = DODGE_GAP[level.tier] * SEGL;
      task.rows.forEach((blocked, i) => blocked.forEach((lane) => add({ type: 'obs', z: r.pos + lead * 0.6 + i * gap, lane, task, row: i, last: i === task.rows.length - 1 })));
      add({ type: 'mark', z: r.pos + lead * 0.6 + task.rows.length * gap, lane: -1, task });
    } else if (task.kind === 'pit') add({ type: 'pit', z: r.pos + lead * 0.95, lane: -1, task });
  }
  function complete() {
    const task = r.task;
    ev({ t: 'done', task, idx: r.taskIdx });
    r.objs.forEach((o) => { if (o.task === task && !o.done) { o.done = true; o.gone = true; } });
    r.task = null;
    r.nextTaskAt = r.pos + (task.gap || 18) * SEGL;
  }
  function spawnGate(task, z, attempt) {
    for (let lane = 0; lane < L; lane++) add({ type: 'gate', z, lane, task, opt: task.opts[lane], good: lane === task.ans, hint: attempt >= 1, attempt });
    if (task.host && attempt === 0) add({ type: 'host', z: z - base * 0.9, lane: -1, task, side: r.seq % 2 ? 1 : -1 });
    if (task.paint) add({ type: 'paint', z0: z - base * 1.6, z, lane: -1, task });
  }
  function spawnRows(task, z, from) {
    const gap = ROW_GAP[level.tier] * SEGL;
    const rows = task.kind === 'collect' ? task.rows : task.rows;
    if (task.kind === 'order') {
      const row = rows[from];
      row.forEach((it) => add({ type: 'item', z, lane: it.lane, task, good: it.good, spec: it.good ? task.seq[it.k] : it.spec, row: from, hint: r.progress.attempt > 0 }));
      return;
    }
    let i = 0;
    for (const row of rows) {
      const rz = z + i * gap;
      row.forEach((it) => add({ type: 'item', z: rz, lane: it.lane, task, good: it.good, spec: it.good ? task.target : task.distract[it.d], row: from + i }));
      i++;
    }
    add({ type: 'mark', z: z + rows.length * gap - gap * 0.5, lane: -1, task, refill: true });
  }

  // ---------- autopandu (ujian / bantuan) ----------
  function autoSteer() {
    const ahead = r.objs.filter((o) => !o.done && o.z > r.pos && o.z < r.pos + base * 3.2).sort((a, b) => a.z - b.z);
    if (r.autopilot) {
      const want = ahead.find((o) => (o.type === 'gate' || o.type === 'item') && o.good);
      if (want) { r.lane = want.lane; return; }
    }
    if (r.autopilot || r.assist) {
      const obs = ahead.filter((o) => o.type === 'obs' && o.z < r.pos + base * 1.4);
      if (obs.length) {
        const z0 = obs[0].z;
        const blocked = new Set(obs.filter((o) => Math.abs(o.z - z0) < SEGL * 2).map((o) => o.lane));
        if (blocked.has(r.lane)) {
          let best = null;
          for (let d = 1; d < L && best === null; d++) for (const s of [-1, 1]) { const n = r.lane + s * d; if (n >= 0 && n < L && !blocked.has(n)) { best = n; break; } }
          if (best !== null) r.lane = best;
        }
      }
    }
  }

  // ---------- langkah ----------
  r.step = (dt) => {
    if (r.state === 'done') return;
    r.t += dt;
    if (r.state === 'ready') return;
    if (r.driver) r.driver(r, dt);
    if (r.autopilot || r.assist) autoSteer();
    // pergerakan lorong yang lembut
    const dl = r.lane - r.laneF;
    r.laneF += Math.sign(dl) * Math.min(Math.abs(dl), dt * 6.5);
    // kelajuan
    r.boostT = Math.max(0, r.boostT - dt); r.bumpT = Math.max(0, r.bumpT - dt);
    if (r.memT > 0) { r.memT -= dt; if (r.memT <= 0) { r.memT = 0; spawnRows(r.task, r.pos + base * 2.6, 0); ev({ t: 'memoryHide', task: r.task }); } }
    let target = base * (r.boostT > 0 ? 1.55 : 1) * (r.bumpT > 0 ? 0.5 : 1) * (r.memT > 0 ? 0.65 : 1);
    const pit = r.objs.find((o) => o.type === 'pit' && !o.done);
    if (pit) { const d = pit.z - r.pos; if (d < base * 1.2) target = Math.max(base * 0.05, Math.min(target, base * (d / (base * 1.2)))); }
    if (r.state === 'pit') target = 0;
    r.speed += (target - r.speed) * Math.min(1, dt * (target < r.speed ? 4 : 1.6));
    if (r.state === 'run') r.pos += r.speed * dt;
    if (r.state === 'run' && !r.task && r.finishZ === null && r.pos >= r.nextTaskAt) activate();
    resolve();
    r.objs = r.objs.filter((o) => !(o.done && o.z < r.pos - SEGL * 12));
    // pengaman: jangan sekali-kali tersekat
    if (r.t > 1200 && r.state !== 'done') { r.state = 'done'; ev({ t: 'finish', forced: true }); }
  };

  function laneHit(lane, tol = 0.5) { return Math.abs(r.laneF - lane) < tol; }
  function nearestLane() { return Math.max(0, Math.min(L - 1, Math.round(r.laneF))); }

  function resolve() {
    const passed = r.objs.filter((o) => !o.done && o.z <= r.pos);
    if (!passed.length) return;
    passed.sort((a, b) => a.z - b.z);
    for (const o of passed) {
      if (o.done) continue;
      if (o.type === 'gate') {
        const group = r.objs.filter((x) => x.type === 'gate' && x.z === o.z && !x.done);
        group.forEach((x) => { x.done = true; });
        const lane = nearestLane();
        const hit = group.find((x) => x.lane === lane);
        if (hit && hit.good) {
          hit.burst = r.t; r.correct++; r.charges = Math.min(3, r.charges + 1); r.boostT = Math.max(r.boostT, 1.3);
          ev({ t: 'correct', obj: hit, task: o.task }); ev({ t: 'boost', manual: false });
          complete();
        } else {
          r.mistakes++; r.progress.attempt++;
          if (hit) hit.wrong = r.t;
          ev({ t: 'wrong', obj: hit, task: o.task, attempt: r.progress.attempt });
          spawnGate(o.task, r.pos + base * 3.6, r.progress.attempt);
        }
      } else if (o.type === 'item') {
        const row = r.objs.filter((x) => x.type === 'item' && x.task === o.task && x.row === o.row && x.z === o.z && !x.done);
        row.forEach((x) => { x.done = true; });
        const hit = row.find((x) => laneHit(x.lane, 0.55));
        const task = o.task;
        if (task.kind === 'order') {
          if (hit && hit.good) {
            hit.taken = r.t; r.progress.k++; r.progress.got++; r.collected++;
            ev({ t: 'collect', obj: hit, good: true, task });
            if (r.progress.k >= task.seq.length) { r.correct++; r.charges = Math.min(3, r.charges + 1); ev({ t: 'correct', task }); complete(); }
            else spawnRows(task, r.pos + base * 2.2, r.progress.k);
          } else {
            r.mistakes++; r.progress.attempt++;
            if (hit) hit.wrong = r.t;
            ev({ t: 'wrong', obj: hit, task, attempt: r.progress.attempt });
            spawnRows(task, r.pos + base * 2.6, r.progress.k);
          }
        } else if (hit) {
          hit.taken = r.t;
          if (hit.good) {
            r.progress.got++; r.collected++;
            ev({ t: 'collect', obj: hit, good: true, task });
            if (r.progress.got >= task.need) { r.correct++; r.charges = Math.min(3, r.charges + 1); ev({ t: 'correct', task }); complete(); }
          } else { r.mistakes++; ev({ t: 'collect', obj: hit, good: false, task }); }
        }
      } else if (o.type === 'mark') {
        o.done = true;
        if (o.refill && r.task === o.task && r.progress.got < o.task.need) { ev({ t: 'refill', task: o.task }); spawnRows(o.task, r.pos + base * 1.6, 100 + r.seq); }
        else if (o.task.kind === 'dodge' && r.task === o.task) { r.correct++; complete(); }
      } else if (o.type === 'obs') {
        o.done = true;
        if (laneHit(o.lane, 0.55)) { o.hitAt = r.t; r.bumps++; r.bumpT = 0.9; r.boostT = 0; ev({ t: 'bump', obj: o }); }
      } else if (o.type === 'pit') {
        o.done = true; r.state = 'pit'; r.speed = 0; ev({ t: 'pit', task: o.task });
      } else if (o.type === 'finish') {
        o.done = true; r.state = 'done';
        r.stars = r.mistakes <= 1 ? 3 : r.mistakes <= 3 ? 2 : 1;
        ev({ t: 'finish' });
      } else o.done = true;
    }
  }
  return r;
}

// Pemandu rawak untuk ujian: memastikan level tetap boleh diselesaikan walaupun banyak salah
export function randomDriver(seed = 1) {
  let s = seed, cd = 0;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  return (r, dt) => {
    cd -= dt;
    if (cd <= 0) { cd = 0.3 + rnd() * 0.9; r.setLane(Math.floor(rnd() * r.L)); }
    if (r.state === 'pit') r.pitDone(1);
  };
}
