import { useId, useState, type FormEvent } from 'react';
import { useNotes } from '../hooks/useAppState';
import { formatNoteDate } from '../lib/format';
import { LocalStorageManager } from '../lib/storage';
import { TrashIcon } from './Icons';

/** Log de notas do cozinheiro: "Como ficou hoje?" — salvo com carimbo de data/hora no navegador. */
export function NotesLog({ recipeId }: { recipeId: string }) {
  const { notes, add, remove } = useNotes(recipeId);
  const [text, setText] = useState('');
  const uid = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    add(text);
    setText('');
  };

  return (
    <div>
      <form onSubmit={submit} className="space-y-3">
        <label htmlFor={uid} className="block text-lg font-semibold">
          Como ficou hoje?
        </label>
        <textarea
          id={uid}
          className="field min-h-[110px] resize-y"
          placeholder="Ex.: coloquei 18 g de katsuobushi e a patroa aprovou o sal!"
          value={text}
          maxLength={2000}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="submit" className="btn btn-lantern" disabled={!text.trim()}>
            Salvar anotação
          </button>
          {!LocalStorageManager.isPersistent() && (
            <p role="status" className="text-sm text-mute">
              Armazenamento bloqueado: as notas só duram até fechar a aba.
            </p>
          )}
        </div>
      </form>

      {notes.length > 0 ? (
        <ol className="mt-6 space-y-3" aria-label="Anotações salvas">
          {notes.map((n) => (
            <li key={n.id} className="animate-rise flex items-start gap-3 rounded-xl border border-line bg-canvas/60 p-4">
              <div className="min-w-0 flex-1">
                <time dateTime={n.criadoEm} className="text-sm font-semibold text-lanternink">
                  {formatNoteDate(n.criadoEm)}
                </time>
                <p className="mt-1 whitespace-pre-wrap">{n.texto}</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost !px-3 text-mute"
                onClick={() => remove(n.id)}
                aria-label={`Apagar anotação de ${formatNoteDate(n.criadoEm)}`}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 text-mute">Nenhuma anotação ainda. A primeira vez nunca é a última.</p>
      )}
    </div>
  );
}
