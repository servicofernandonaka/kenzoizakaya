/**
 * Síntese de áudio 100% via Web Audio API — zero arquivos de som.
 * - sino de templo (bonshō): parciais inarmônicos com decaimento exponencial
 * - hyōshigi: dois estalos de madeira, curtos e nítidos
 * - alarme: [estalo, estalo, sino] repetido até ser silenciado
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

type AudioCtor = typeof AudioContext;

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor: AudioCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    const comp = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(comp);
    comp.connect(ctx.destination);
  } catch {
    ctx = null;
    master = null;
  }
  return ctx;
}

/** Deve ser chamado dentro de um gesto do usuário (toque/clique) — destrava o áudio no iOS/Android. */
export async function unlockAudio(): Promise<boolean> {
  const c = getContext();
  if (!c || !master) return false;
  try {
    if (c.state === 'suspended') await c.resume();
    // pulso silencioso: garante o destravamento no Safari
    const osc = c.createOscillator();
    const g = c.createGain();
    g.gain.value = 0.0001;
    osc.connect(g).connect(master);
    osc.start();
    osc.stop(c.currentTime + 0.02);
  } catch {
    return false;
  }
  return c.state === 'running';
}

function tone(
  c: AudioContext,
  out: AudioNode,
  { freq, start, peak, decay, type = 'sine' }: { freq: number; start: number; peak: number; decay: number; type?: OscillatorType },
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.linearRampToValueAtTime(peak, start + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, start + decay);
  osc.connect(g).connect(out);
  osc.start(start);
  osc.stop(start + decay + 0.05);
}

/** Sino de templo budista. */
export function playTempleBell(offset = 0) {
  const c = getContext();
  if (!c || !master) return;
  const t0 = c.currentTime + offset;
  const base = 330;
  const partials: Array<[ratio: number, gain: number, decay: number]> = [
    [1, 0.5, 3.4],
    [2.0, 0.28, 2.6],
    [2.74, 0.22, 2.0],
    [3.76, 0.12, 1.4],
    [5.4, 0.07, 0.9],
  ];
  partials.forEach(([ratio, gain, decay]) => tone(c, master!, { freq: base * ratio, start: t0, peak: gain, decay }));
}

/** Hyōshigi — dois blocos de madeira. */
export function playHyoshigi(offset = 0) {
  const c = getContext();
  if (!c || !master) return;
  [0, 0.22].forEach((gap) => {
    const t = c.currentTime + offset + gap;
    tone(c, master!, { freq: 1180, start: t, peak: 0.55, decay: 0.07, type: 'triangle' });
    tone(c, master!, { freq: 2360, start: t, peak: 0.3, decay: 0.05 });
    tone(c, master!, { freq: 3560, start: t, peak: 0.14, decay: 0.035 });
  });
}

let alarmTimer: number | null = null;
let alarmRepeats = 0;
const MAX_REPEATS = 12;
const REPEAT_MS = 5000;

function alarmOnce() {
  playHyoshigi(0);
  playTempleBell(0.55);
  try {
    navigator.vibrate?.([300, 120, 300]);
  } catch {
    /* sem vibração */
  }
}

export const AlarmLoop = {
  start() {
    if (alarmTimer !== null) return;
    void getContext()?.resume();
    alarmRepeats = 0;
    alarmOnce();
    alarmTimer = window.setInterval(() => {
      alarmRepeats += 1;
      if (alarmRepeats >= MAX_REPEATS) {
        AlarmLoop.stop();
        return;
      }
      void getContext()?.resume();
      alarmOnce();
    }, REPEAT_MS);
  },
  stop() {
    if (alarmTimer !== null) {
      window.clearInterval(alarmTimer);
      alarmTimer = null;
    }
  },
  isRunning: () => alarmTimer !== null,
};

/** Reativa o contexto quando a aba volta a ficar visível (alguns navegadores o suspendem em segundo plano). */
export function resumeAudioIfNeeded() {
  if (ctx && ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
}

/* ---------- Som dos fogos (opcional) ---------- */

let noise: AudioBuffer | null = null;
let lastWhistle = 0;
let lastBoom = 0;

function noiseBuffer(c: AudioContext): AudioBuffer {
  if (noise) return noise;
  noise = c.createBuffer(1, Math.floor(c.sampleRate * 0.7), c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

/** Assobio do foguete subindo. */
export function playLaunch() {
  const c = getContext();
  if (!c || !master || c.state !== 'running') return;
  const now = performance.now();
  if (now - lastWhistle < 180) return;
  lastWhistle = now;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(520, t);
  o.frequency.exponentialRampToValueAtTime(1900, t + 0.75);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.035, t + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.85);
}

/** Estouro grave + estalinhos. `size` ~ 0.5 (brilho de interface) a 1.4 (grande). */
export function playBoom(size = 1) {
  const c = getContext();
  if (!c || !master || c.state !== 'running') return;
  const now = performance.now();
  if (now - lastBoom < 90) return;
  lastBoom = now;
  const t = c.currentTime;
  const small = size < 0.7;

  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(small ? 420 : 150, t);
  o.frequency.exponentialRampToValueAtTime(small ? 160 : 38, t + (small ? 0.18 : 0.55));
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime((small ? 0.12 : 0.42) * Math.min(size, 1.3), t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (small ? 0.22 : 0.7));
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.8);

  // crepitar: ruído filtrado com vários picos curtos
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = small ? 3200 : 1800;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  const pops = small ? 3 : 9;
  for (let i = 0; i < pops; i++) {
    const at = t + 0.02 + i * (small ? 0.05 : 0.07) + Math.random() * 0.04;
    ng.gain.setValueAtTime(0.0001, at);
    ng.gain.linearRampToValueAtTime((small ? 0.05 : 0.09) * Math.random() + 0.02, at + 0.004);
    ng.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
  }
  n.connect(f).connect(ng).connect(master);
  n.start(t);
  n.stop(t + 0.8);
}
