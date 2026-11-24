import { useCallback, useEffect, useState } from 'react';
import { RECEITAS } from '../data';

const FOTOS = RECEITAS.flatMap((r) => (r.foto ? [r.foto] : []));

/**
 * As fotos são guardadas para uso offline conforme você as vê. Este botão baixa todas de uma vez
 * (útil antes de ir para a cozinha sem sinal). Só aparece quando o app já está sob controle do service worker.
 */
export function OfflinePhotos() {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(0);
  const [busy, setBusy] = useState(false);

  const count = useCallback(async () => {
    if (!('caches' in window)) return 0;
    const hits = await Promise.all(FOTOS.map((f) => caches.match(f, { ignoreVary: true }).catch(() => undefined)));
    return hits.filter(Boolean).length;
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || FOTOS.length === 0) return;
    let alive = true;
    navigator.serviceWorker.ready.then(async () => {
      if (!alive || !navigator.serviceWorker.controller) return;
      setReady(true);
      setSaved(await count());
    });
    return () => {
      alive = false;
    };
  }, [count]);

  if (!ready) return null;

  const download = async () => {
    setBusy(true);
    const queue = [...FOTOS];
    const worker = async () => {
      for (let f = queue.shift(); f; f = queue.shift()) {
        try {
          await fetch(f); // passa pelo service worker, que guarda a resposta
        } catch {
          /* sem rede: segue para a próxima */
        }
        setSaved(await count());
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    setSaved(await count());
    setBusy(false);
  };

  const all = saved >= FOTOS.length;
  return (
    <p className="mt-4 text-sm text-mute" aria-live="polite">
      {all ? `Todas as ${FOTOS.length} fotos estão salvas para uso offline.` : `${saved} de ${FOTOS.length} fotos salvas para uso offline.`}{' '}
      {!all && (
        <button type="button" className="font-semibold text-ink underline underline-offset-4 disabled:opacity-60" onClick={download} disabled={busy}>
          {busy ? 'Baixando…' : 'Salvar todas agora'}
        </button>
      )}
    </p>
  );
}
