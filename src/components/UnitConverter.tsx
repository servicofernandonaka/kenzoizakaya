import { useId, useMemo, useState } from 'react';
import { CONVERSIONS } from '../data/conversions';
import {
  HOUSEHOLD_LABELS,
  formatInputNumber,
  householdToMetric,
  metricToHousehold,
  parseDecimal,
  type Conversion,
} from '../lib/units';
import type { Ingrediente } from '../types';

/**
 * Conversor bidirecional: digite em gramas/ml e veja a medida caseira — ou o contrário.
 * Os dois campos têm tamanho fixo, então nada "pula" na tela enquanto se digita.
 */
export function UnitConverter({ ingredientes }: { ingredientes: Ingrediente[] }) {
  const options = useMemo(
    () => ingredientes.filter((i) => i.nome in CONVERSIONS).map((i) => ({ nome: i.nome, conv: CONVERSIONS[i.nome] as Conversion })),
    [ingredientes],
  );

  const uid = useId();
  const [selected, setSelected] = useState(options[0]?.nome ?? '');
  const [metricText, setMetricText] = useState('');
  const [houseText, setHouseText] = useState('');

  if (options.length === 0) return null;

  const current = options.find((o) => o.nome === selected) ?? options[0];
  const conv = current.conv;
  const [houseOne, houseMany] = HOUSEHOLD_LABELS[conv.unit];

  const onMetric = (text: string) => {
    setMetricText(text);
    const n = parseDecimal(text);
    setHouseText(n === null ? '' : formatInputNumber(metricToHousehold(conv, n)));
  };
  const onHousehold = (text: string) => {
    setHouseText(text);
    const n = parseDecimal(text);
    setMetricText(n === null ? '' : formatInputNumber(householdToMetric(conv, n)));
  };
  const onSelect = (nome: string) => {
    setSelected(nome);
    setMetricText('');
    setHouseText('');
  };

  const invalid = (t: string) => t.trim() !== '' && parseDecimal(t) === null;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${uid}-ing`} className="mb-1 block text-sm font-semibold text-mute">
          Ingrediente
        </label>
        <select id={`${uid}-ing`} className="field" value={current.nome} onChange={(e) => onSelect(e.target.value)}>
          {options.map((o) => (
            <option key={o.nome} value={o.nome}>
              {o.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <label htmlFor={`${uid}-m`} className="mb-1 block text-sm font-semibold text-mute">
            Na balança ({conv.metric})
          </label>
          <input
            id={`${uid}-m`}
            className="field tabular"
            inputMode="decimal"
            autoComplete="off"
            placeholder={`0 ${conv.metric}`}
            value={metricText}
            aria-invalid={invalid(metricText)}
            onChange={(e) => onMetric(e.target.value)}
          />
        </div>
        <span className="pb-3 text-2xl text-lanternink" aria-hidden="true">
          ⇄
        </span>
        <div>
          <label htmlFor={`${uid}-h`} className="mb-1 block text-sm font-semibold text-mute">
            {houseMany.charAt(0).toUpperCase() + houseMany.slice(1)}
            {conv.qualifier ? ` (${conv.qualifier[1]})` : ''}
          </label>
          <input
            id={`${uid}-h`}
            className="field tabular"
            inputMode="decimal"
            autoComplete="off"
            placeholder={`0 ${houseOne}`}
            value={houseText}
            aria-invalid={invalid(houseText)}
            onChange={(e) => onHousehold(e.target.value)}
          />
        </div>
      </div>

      <p className="min-h-[1.5rem] text-sm text-mute" aria-live="polite">
        1 {houseOne}
        {conv.qualifier ? ` ${conv.qualifier[0]}` : ''} ≈ {formatInputNumber(conv.perUnit)} {conv.metric}
        {invalid(metricText) || invalid(houseText) ? ' · digite apenas números (ex.: 1,5)' : ''}
      </p>
    </div>
  );
}
