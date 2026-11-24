import { useMemo, useState } from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from '../components/Icons';
import { MAX_PORCOES, MIN_PORCOES } from '../components/PortionStepper';
import { UnitModeToggle } from '../components/UnitModeToggle';
import { RECEITAS } from '../data';
import { usePrefs, useShopping } from '../hooks/useAppState';
import { hrefReceita } from '../lib/route';
import { buildShoppingList, rowAmount, shoppingText } from '../lib/shopping';

/** Lista de compras: receitas escolhidas + ingredientes somados, com checklist e botão de copiar. */
export function ListaPage() {
  const shop = useShopping();
  const [prefs, patchPrefs] = usePrefs();
  const [copied, setCopied] = useState<'ok' | 'erro' | null>(null);

  const rows = useMemo(() => buildShoppingList(shop.itens, RECEITAS), [shop.itens]);
  const pendentes = rows.filter((r) => !shop.marcados.includes(r.key)).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shoppingText(rows, shop.marcados, prefs.unitMode));
      setCopied('ok');
    } catch {
      setCopied('erro');
    }
    window.setTimeout(() => setCopied(null), 3000);
  };

  if (shop.itens.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="kicker">Lista de compras</p>
        <h1 className="mt-3 text-4xl">Sua lista está vazia</h1>
        <p className="mt-4 leading-relaxed text-mute">
          Abra uma receita e toque em “Adicionar à lista de compras”. Os ingredientes de várias receitas são somados aqui.
        </p>
        <a href="#/receitas" className="btn btn-lantern mt-8 min-h-[56px] px-8 text-lg">
          Ir para o Diário
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-14 pb-16">
      <header>
        <p className="kicker">Lista de compras</p>
        <h1 className="mt-3 text-5xl leading-tight">O que comprar</h1>
        <p className="mt-3 text-lg text-mute">
          {shop.itens.length} {shop.itens.length === 1 ? 'receita' : 'receitas'} · {pendentes} de {rows.length} itens por comprar
        </p>
      </header>

      <section aria-labelledby="receitas-lista">
        <h2 id="receitas-lista" className="text-2xl">
          Receitas na lista
        </h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {shop.itens.map((it) => {
            const r = RECEITAS.find((x) => x.id === it.id);
            if (!r) return null;
            return (
              <li key={it.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <a href={hrefReceita(r.id)} className="min-w-0 flex-1 font-serif text-lg font-semibold leading-snug hover:underline">
                  {r.titulo_pt.split(' (')[0]}
                </a>
                <div role="group" aria-label={`Porções de ${r.titulo_pt}`} className="flex items-center rounded-full bg-ink/[0.06]">
                  <button
                    type="button"
                    className="btn btn-ghost !px-0"
                    onClick={() => shop.setPorcoes(r.id, Math.max(MIN_PORCOES, it.porcoes - 1))}
                    disabled={it.porcoes <= MIN_PORCOES}
                    aria-label={`Diminuir porções de ${r.titulo_pt}`}
                  >
                    <MinusIcon />
                  </button>
                  <output className="tabular min-w-[5.5rem] text-center font-bold" aria-live="polite">
                    {it.porcoes} {it.porcoes === 1 ? 'porção' : 'porções'}
                  </output>
                  <button
                    type="button"
                    className="btn btn-ghost !px-0"
                    onClick={() => shop.setPorcoes(r.id, Math.min(MAX_PORCOES, it.porcoes + 1))}
                    disabled={it.porcoes >= MAX_PORCOES}
                    aria-label={`Aumentar porções de ${r.titulo_pt}`}
                  >
                    <PlusIcon />
                  </button>
                </div>
                <button type="button" className="btn btn-ghost !px-3 text-mute" onClick={() => shop.remove(r.id)} aria-label={`Remover ${r.titulo_pt} da lista`}>
                  <TrashIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="itens-lista">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="itens-lista" className="text-2xl">
            Ingredientes
          </h2>
          <UnitModeToggle value={prefs.unitMode} onChange={(unitMode) => patchPrefs({ unitMode })} />
        </div>

        <ul className="mt-4 divide-y divide-line border-y border-line">
          {rows.map((row) => {
            const done = shop.marcados.includes(row.key);
            const amount = rowAmount(row, prefs.unitMode);
            const id = `compra-${row.key}`;
            return (
              <li key={row.key}>
                <label
                  htmlFor={id}
                  className={`flex min-h-[56px] cursor-pointer items-start gap-4 py-3 transition-all duration-300 ${done ? 'line-through opacity-40' : ''}`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={done}
                    onChange={() => shop.toggleMarcado(row.key)}
                    className="mt-0.5 h-7 w-7 shrink-0 cursor-pointer accent-[#AD1E2C]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{row.nome}</span>
                    <span className="block text-sm text-mute">{row.usadoEm.join(' · ')}</span>
                  </span>
                  <span className="tabular shrink-0 text-right">
                    <span className="block text-lg font-bold">{amount.primary}</span>
                    <span className="block min-h-[1.25rem] text-sm text-mute">{amount.secondary ?? ' '}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-lantern" onClick={copy}>
            Copiar lista
          </button>
          <button type="button" className="btn" onClick={shop.limparMarcados} disabled={shop.marcados.length === 0}>
            Desmarcar tudo
          </button>
          <button
            type="button"
            className="btn btn-ghost text-mute"
            onClick={() => {
              if (window.confirm('Esvaziar a lista de compras?')) shop.esvaziar();
            }}
          >
            Esvaziar lista
          </button>
          <span role="status" className="text-sm text-mute">
            {copied === 'ok' ? 'Lista copiada.' : copied === 'erro' ? 'Não foi possível copiar neste navegador.' : ''}
          </span>
        </div>
        <p className="mt-4 text-sm text-mute">
          Itens iguais de receitas diferentes são somados. A água não entra, e o óleo de fritura usa o maior volume (é reaproveitado).
        </p>
      </section>
    </div>
  );
}
