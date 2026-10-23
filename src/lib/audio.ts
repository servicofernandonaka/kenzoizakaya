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
