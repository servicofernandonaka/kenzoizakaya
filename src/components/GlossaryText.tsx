import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { GLOSSARIO, type Termo } from '../data/glossario';
import { CloseIcon } from './Icons';

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** variante (minúscula) -> termo; maiores primeiro para "yukihira nabe" ganhar de "yukihira" */
const VARIANTES = GLOSSARIO.flatMap((t) => t.variantes.map((v) => [v.toLowerCase(), t] as const)).sort((a, b) => b[0].length - a[0].length);
const POR_VARIANTE = new Map(VARIANTES);
const REGEX = new RegExp(`(?<![\\p{L}-])(${VARIANTES.map(([v]) => escape(v)).join('|')})(?![\\p{L}-])`, 'giu');

/**
 * Texto de receita com os termos do glossário clicáveis: abre um modal com a definição.
 * Só a primeira ocorrência de cada termo no trecho é marcada, para não poluir a leitura.
 */
export function GlossaryText({ text }: { text: string }) {
  const [aberto, setAberto] = useState<Termo | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const partes = useMemo(() => {
    const out: Array<string | { termo: Termo; texto: string }> = [];
    const vistos = new Set<string>();
    let last = 0;
    for (const m of text.matchAll(REGEX)) {
      const termo = POR_VARIANTE.get(m[0].toLowerCase());
      if (!termo || vistos.has(termo.id) || m.index === undefined) continue;
      vistos.add(termo.id);
      if (m.index > last) out.push(text.slice(last, m.index));
      out.push({ termo, texto: m[0] });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }, [text]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  return (
    <>
      {partes.map((p, i) =>
        typeof p === 'string' ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => setAberto(p.termo)}
            aria-haspopup="dialog"
            className="inline cursor-help rounded-sm font-semibold underline decoration-lantern decoration-dotted decoration-2 underline-offset-4 hover:text-lanternink"
          >
            {p.texto}
          </button>
        ),
      )}

      <dialog
        ref={dialog}
        onClose={() => setAberto(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setAberto(null);
        }}
        aria-labelledby="glossario-modal-titulo"
        className="m-auto w-[min(92vw,28rem)] rounded-3xl border border-line bg-surface p-0 text-ink shadow-card backdrop:bg-black/60"
      >
        {aberto && (
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker">Glossário</p>
                <h3 id="glossario-modal-titulo" className="mt-1 font-serif text-2xl font-bold">
                  {aberto.termo}
                  {aberto.jp && (
                    <span lang="ja" className="ml-2 text-lg font-normal text-mute">
                      ({aberto.jp})
                    </span>
                  )}
                </h3>
              </div>
              <button type="button" className="btn btn-ghost !px-3" onClick={() => setAberto(null)} aria-label="Fechar definição" autoFocus>
                <CloseIcon />
              </button>
            </div>
            <p className="mt-4 leading-relaxed">{aberto.definicao}</p>
            <a href="#/fundamentos" className="mt-5 inline-block text-sm font-semibold text-lanternink underline underline-offset-4" onClick={() => setAberto(null)}>
              Ver o glossário completo (aba Fundamentos)
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
