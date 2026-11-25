/**
 * Motor de fogos de artifício em canvas 2D — sem dependências.
 *  - foguete sobe com rastro e explode em peônia, anel, coração, estrela ou salgueiro
 *  - partículas aditivas (composição "lighter") com rastro por fade
 *  - o laço de animação só roda enquanto há algo para desenhar (ou o show automático está ligado)
 */
export type Shape = 'peony' | 'ring' | 'heart' | 'star' | 'willow' | 'sparkle';

export interface EngineHooks {
  onLaunch?: () => void;
  onExplode?: (shape: Shape, size: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
  sat: number;
  light: number;
  size: number;
  drag: number;
  g: number;
  glitter: boolean;
}

interface Rocket {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  t: number;
  dur: number;
  hue: number;
  shape: Shape;
  size: number;
}

/** ouro, rosa, ciano, vermelho, violeta, verde, laranja */
const HUES = [45, 335, 190, 355, 275, 150, 25];
const SHAPES: Shape[] = ['peony', 'peony', 'ring', 'heart', 'star', 'willow'];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export class FireworksEngine {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private particles: Particle[] = [];
  private rockets: Rocket[] = [];
  private raf = 0;
  private last = 0;
  private visible = true;
  private autoOn = false;
  private autoTimer = 0;
  private timeouts = new Set<number>();
  private destroyed = false;
  private ro: ResizeObserver;
  private maxParticles: number;
  private density: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private hooks: EngineHooks = {},
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponível');
    this.ctx = ctx;
    const small = window.innerWidth < 700 || (navigator.hardwareConcurrency ?? 8) <= 4;
    this.maxParticles = small ? 900 : 1800;
    this.density = small ? 0.6 : 1;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private onVisibility = () => {
    if (document.hidden) this.stopLoop();
    else this.ensureRunning();
  };

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(1, Math.round(rect.width));
    this.h = Math.max(1, Math.round(rect.height));
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Mostra/oculta (ex.: seção fora da tela): pausa o laço para não gastar bateria. */
  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.ensureRunning();
    else this.stopLoop();
  }

  /** Liga/desliga o show automático (fogos aleatórios a cada ~1–2 s). */
  setAuto(on: boolean) {
    this.autoOn = on;
    window.clearTimeout(this.autoTimer);
    if (on) {
      this.scheduleAuto(600);
      this.ensureRunning();
    }
  }

  private scheduleAuto(delay = rand(900, 2100)) {
    this.autoTimer = window.setTimeout(() => {
      if (!this.autoOn || this.destroyed) return;
      if (this.visible && !document.hidden) {
        const n = Math.random() < 0.25 ? 2 : 1;
        for (let i = 0; i < n; i++) this.launch(rand(this.w * 0.1, this.w * 0.9), rand(this.h * 0.1, this.h * 0.45));
      }
      this.scheduleAuto();
    }, delay);
  }

  /** Foguete que sobe do chão até (tx, ty) e explode. */
  launch(tx: number, ty: number, opts: { shape?: Shape; hue?: number; size?: number } = {}) {
    if (this.destroyed) return;
    const sx = tx + rand(-this.w * 0.06, this.w * 0.06);
    const dist = Math.max(80, this.h - ty);
    this.rockets.push({
      sx,
      sy: this.h + 12,
      tx,
      ty,
      t: 0,
      dur: Math.min(1.25, 0.5 + dist / this.h * 0.7),
      hue: opts.hue ?? pick(HUES),
      shape: opts.shape ?? pick(SHAPES),
      size: opts.size ?? rand(0.85, 1.25),
    });
    this.hooks.onLaunch?.();
    this.ensureRunning();
  }

  /** Explosão imediata no ponto (sem foguete). */
  explode(x: number, y: number, shape: Shape = 'peony', hue: number = pick(HUES), size = 1) {
    if (this.destroyed) return;
    const room = this.maxParticles - this.particles.length;
    if (room <= 0) return;
    const d = this.density;
    const add = (n: number, make: (i: number, n: number) => Partial<Particle>) => {
      const count = Math.min(room, Math.round(n * d));
      for (let i = 0; i < count; i++) {
        const o = make(i, count);
        const life = o.max ?? rand(1.1, 1.8);
        this.particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          life,
          max: life,
          hue: hue + rand(-12, 12),
          sat: 100,
          light: rand(58, 72),
          size: rand(1.6, 2.8) * (size > 1 ? 1.1 : 1),
          drag: 0.975,
          g: 55,
          glitter: false,
          ...o,
        });
      }
    };
    const S = Math.max(190, Math.min(this.w, 1400) * 0.24) * size;

    if (shape === 'peony') {
      add(110, () => {
        const a = rand(0, Math.PI * 2);
        const s = S * Math.sqrt(Math.random()) * rand(0.55, 1);
        return { vx: Math.cos(a) * s, vy: Math.sin(a) * s };
      });
    } else if (shape === 'ring') {
      add(80, (i, n) => {
        const a = (i / n) * Math.PI * 2;
        return { vx: Math.cos(a) * S * 0.9, vy: Math.sin(a) * S * 0.9, drag: 0.972 };
      });
      add(40, (i, n) => {
        const a = (i / n) * Math.PI * 2;
        return { vx: Math.cos(a) * S * 0.45, vy: Math.sin(a) * S * 0.45, hue: hue + 40, drag: 0.972 };
      });
    } else if (shape === 'heart') {
      add(100, (i, n) => {
        const t = (i / n) * Math.PI * 2;
        const hx = 16 * Math.sin(t) ** 3;
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const k = S / 17;
        return { vx: hx * k, vy: hy * k, hue: rand(330, 350), drag: 0.968, g: 38, max: rand(1.4, 1.9) };
      });
    } else if (shape === 'star') {
      add(110, (i, n) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const seg = (Math.PI * 2) / 5;
        const m = ((a % seg) + seg) % seg;
        const r = Math.cos(Math.PI / 5) / Math.cos(m - Math.PI / 5);
        return { vx: Math.cos(a) * S * 0.95 * r, vy: Math.sin(a) * S * 0.95 * r, hue: rand(40, 52), drag: 0.968, g: 38, max: rand(1.4, 1.9) };
      });
    } else if (shape === 'willow') {
      add(120, () => {
        const a = rand(0, Math.PI * 2);
        const s = rand(40, S * 0.75);
        return { vx: Math.cos(a) * s, vy: Math.sin(a) * s, hue: rand(38, 50), drag: 0.986, g: 70, max: rand(2.2, 3.2), glitter: true, size: rand(1.4, 2.2) };
      });
    } else {
      // sparkle: estouro curto de feedback de interface
      add(26, () => {
        const a = rand(0, Math.PI * 2);
        const s = rand(60, 230) * size * Math.min(1, Math.max(0.7, this.w / 900));
        return { vx: Math.cos(a) * s, vy: Math.sin(a) * s, max: rand(0.5, 0.95), g: 150, size: rand(1.4, 2.6), glitter: true };
      });
    }
    this.hooks.onExplode?.(shape, size);
    this.ensureRunning();
  }

  /** Grande final: uma sequência de fogos cobrindo o céu em ~4 s. */
  finale() {
    if (this.destroyed) return;
    const shapes: Shape[] = ['heart', 'star', 'ring', 'peony', 'heart', 'star', 'peony', 'ring', 'willow', 'willow'];
    shapes.forEach((shape, i) => {
      const id = window.setTimeout(() => {
        this.timeouts.delete(id);
        const x = this.w * (0.12 + (i / (shapes.length - 1)) * 0.76) + rand(-30, 30);
        this.launch(x, rand(this.h * 0.1, this.h * 0.42), { shape, size: shape === 'willow' ? 1.3 : rand(0.95, 1.35) });
      }, i * 330 + rand(0, 120));
      this.timeouts.add(id);
    });
  }

  private ensureRunning() {
    if (this.raf || this.destroyed || !this.visible || document.hidden) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.destroyed || !this.visible || document.hidden) return;
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    const { ctx } = this;

    // rastro: apaga uma fração do quadro anterior
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt * 11)})`;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';

    // foguetes
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.t += dt / r.dur;
      const e = 1 - (1 - Math.min(1, r.t)) ** 2.4;
      const x = r.sx + (r.tx - r.sx) * e + Math.sin(r.t * 18) * 1.5;
      const y = r.sy + (r.ty - r.sy) * e;
      if (this.particles.length < this.maxParticles) {
        this.particles.push({ x, y, vx: rand(-14, 14), vy: rand(10, 50), life: 0.45, max: 0.45, hue: 42, sat: 100, light: 78, size: 1.5, drag: 0.95, g: 40, glitter: false });
      }
      ctx.fillStyle = 'hsl(45 100% 88%)';
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      if (r.t >= 1) {
        this.rockets.splice(i, 1);
        this.explode(r.tx, r.ty, r.shape, r.hue, r.size);
      }
    }

    // partículas
    const drag = (d: number) => d ** (dt * 60);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
        continue;
      }
      p.vx *= drag(p.drag);
      p.vy = p.vy * drag(p.drag) + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const k = p.life / p.max;
      let a = Math.min(1, k * 1.7);
      if (p.glitter && Math.random() < 0.35) a *= 0.2;
      ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.light + (1 - k) * 8}%,${a})`;
      const s = p.size * (0.55 + 0.45 * k);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }

    if (this.particles.length > 0 || this.rockets.length > 0 || this.autoOn) {
      this.raf = requestAnimationFrame(this.frame);
    } else {
      ctx.clearRect(0, 0, this.w, this.h);
    }
  };

  destroy() {
    this.destroyed = true;
    this.stopLoop();
    window.clearTimeout(this.autoTimer);
    this.timeouts.forEach((id) => window.clearTimeout(id));
    this.timeouts.clear();
    this.ro.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
}
