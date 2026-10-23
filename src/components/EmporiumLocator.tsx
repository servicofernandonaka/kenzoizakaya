import { useId, useMemo, useState } from 'react';
import { EMPORIOS, MERCADO } from '../data';
import { stripQuotes } from '../lib/format';
import type { Emporio, ProdutoMercado, RegiaoEmporio } from '../types';
import { ExternalIcon, PinIcon, SearchIcon } from './Icons';

/* ---------- URLs de busca (nenhum dado sai do app até o usuário clicar) ---------- */

const enc = encodeURIComponent;
const slug = (t: string) =>
  stripQuotes(t)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, '-');

const STORES = [
  { id: 'shopee', nome: 'Shopee', url: (t: string) => `https://shopee.com.br/search?keyword=${enc(stripQuotes(t))}` },
  { id: 'ml', nome: 'Mercado Livre', url: (t: string) => `https://lista.mercadolivre.com.br/${enc(slug(t))}` },
  { id: 'amazon', nome: 'Amazon', url: (t: string) => `https://www.amazon.com.br/s?k=${enc(stripQuotes(t))}` },
] as const;

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${enc(q)}`;

const REGIOES: Array<{ value: RegiaoEmporio | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'liberdade', label: 'Liberdade' },
  { value: 'online', label: 'Online' },
  { value: 'bairros', label: 'Bairros' },
];

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function ProdutoCard({ p }: { p: ProdutoMercado }) {
  return (
    <li className="panel flex flex-col p-5">
      <h3 className="text-xl font-bold">{p.ingrediente}</h3>
      <p className="mt-1 flex-1 text-mute">{p.motivo}</p>
      <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-sm text-mute">
        <span className="sr-only">Termo de busca: </span>“{stripQuotes(p.termo)}”
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {STORES.map((s) => (
          <a
            key={s.id}
            href={s.url(p.termo)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn !min-h-[48px] flex-1 !px-3 text-sm"
          >
            {s.nome}
            <ExternalIcon width={14} height={14} />
            <span className="sr-only">(abre em nova aba) — {p.ingrediente}</span>
          </a>
        ))}
      </div>
    </li>
  );
}

function EmporioCard({ e }: { e: Emporio }) {
  return (
    <li className="panel flex flex-col p-5">
      <p className="kicker">{REGIOES.find((r) => r.value === e.regiao)?.label}</p>
      <h3 className="mt-1 text-xl font-bold">{e.nome}</h3>
      <p className="mt-2 flex-1 text-mute">{e.descricao}</p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Especialidades">
        {e.tags.map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
      </ul>
      {e.mapsQuery && (
        <a className="btn mt-4" href={mapsUrl(e.mapsQuery)} target="_blank" rel="noopener noreferrer">
          <PinIcon width={18} height={18} /> Ver no mapa
          <span className="sr-only">(abre em nova aba) — {e.nome}</span>
        </a>
      )}
    </li>
  );
}

export function EmporiumLocator() {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [regiao, setRegiao] = useState<RegiaoEmporio | 'todos'>('todos');

  const q = norm(query.trim());

  const emporios = useMemo(
    () =>
      EMPORIOS.filter(
        (e) =>
          (regiao === 'todos' || e.regiao === regiao) &&
          (q === '' || norm([e.nome, e.descricao, ...e.tags].join(' ')).includes(q)),
      ),
    [q, regiao],
  );
  const produtos = useMemo(
    () => MERCADO.filter((p) => q === '' || norm(`${p.ingrediente} ${p.termo} ${p.motivo}`).includes(q)),
    [q],
  );

  return (
    <div className="space-y-10">
      <div className="panel space-y-4 p-5">
        <div>
          <label htmlFor={`${uid}-q`} className="mb-1 block text-sm font-semibold text-mute">
            O que você procura?
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input
              id={`${uid}-q`}
              type="search"
              className="field !pl-12"
              placeholder="katsuobushi, mirin, yukihira, moyashi…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div role="radiogroup" aria-label="Filtrar empórios por região" className="flex flex-wrap gap-2">
          {REGIOES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={regiao === r.value}
              onClick={() => setRegiao(r.value)}
              className={`btn !min-h-[48px] ${regiao === r.value ? 'btn-lantern' : ''}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-mute" aria-live="polite">
          {emporios.length} {emporios.length === 1 ? 'empório' : 'empórios'} · {produtos.length}{' '}
          {produtos.length === 1 ? 'insumo' : 'insumos'}
        </p>
      </div>

      <section aria-labelledby={`${uid}-emp`}>
        <h2 id={`${uid}-emp`} className="text-3xl font-bold">
          Empórios orientais de São Paulo
        </h2>
        <p className="mt-1 text-mute">Onde achar o insumo certo, de balcão ou pelo celular.</p>
        {emporios.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emporios.map((e) => (
              <EmporioCard key={e.id} e={e} />
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-line p-6 text-center text-mute">
            Nenhum empório encontrado para esse filtro.
          </p>
        )}
      </section>

      <section aria-labelledby={`${uid}-ins`}>
        <h2 id={`${uid}-ins`} className="text-3xl font-bold">
          Mercado honesto · busca cirúrgica
        </h2>
        <p className="mt-1 text-mute">
          Termos de busca afinados para fugir de rótulo enganoso. Os links abrem a loja em nova aba (precisam de internet).
        </p>
        {produtos.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((p) => (
              <ProdutoCard key={p.ingrediente} p={p} />
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-line p-6 text-center text-mute">
            Nenhum insumo encontrado para “{query}”.
          </p>
        )}
      </section>
    </div>
  );
}
