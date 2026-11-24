# Izakaya do Kenzō

SPA 100% client-side (React + Vite + TypeScript + Tailwind). Sem backend, sem login, funciona offline (service worker).

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck + build estático em dist/
npm run preview    # servir o build localmente
```

`dist/` é estático (`base: './'`, roteamento por hash): publique em qualquer hospedagem (Netlify, GitHub Pages, S3, Nginx).

## Estrutura
- `src/data/*.json` — receitas, mercado e empórios (validados em runtime por `src/lib/schema.ts`)
- `src/data/conversions.ts` — equivalências g/ml ⇄ medidas caseiras por ingrediente
- `src/lib/units.ts` — motor de conversão e formatação · `audio.ts` — sons via Web Audio · `storage.ts` — LocalStorageManager
- `src/context/TimersContext.tsx` — multi-timers · `src/hooks/useWakeLock.ts` — Screen Wake Lock
- `src/components/` — RecipeCard, KitchenModeView, UnitConverter, IngredientList, InteractiveTimer, TimerDock, EmporiumLocator, NotesLog, ErrorBoundary

Para adicionar uma receita: inclua o objeto em `recipes.json` (mesmo schema) e, se quiser medida caseira, o ingrediente em `conversions.ts`.

## Fotos das receitas
Cada receita aceita um campo opcional `"foto": "fotos/<id>.jpg"` em `src/data/recipes.json`, apontando para um arquivo em `public/fotos/`.
Sem foto, o app mostra uma capa ilustrada da categoria. Veja `public/fotos/LEIA-ME.txt`.

## Offline (PWA)
`vite.config.ts` grava em `dist/sw.js` a lista dos arquivos do build (código, fontes, ícones); o service worker os pré-armazena na primeira visita, e cada deploy gera uma versão nova de cache.
As **fotos** (3,6 MB) não são pré-carregadas: o service worker guarda cada uma quando ela é vista, e o rodapé tem o botão "Salvar todas agora" para baixar as 33 de uma vez. Sem foto em cache e sem internet, a receita mostra a capa ilustrada.
Design system e verificação de acessibilidade: `docs/design-system.md`.

## Lista de compras
`#/lista`: receitas escolhidas (com porções) e ingredientes somados (`src/lib/shopping.ts`). A água não entra na lista e o óleo de fritura usa o maior volume (é reaproveitado). Fica salva no aparelho, com checklist e botão de copiar.

## Textos editáveis
- História do Kenzo (home): `src/data/historia.ts`
- Glossário: `src/data/glossario.ts` · Ingredientes comuns: `src/data/ingredientes.ts` · Fundamentos: `src/data/fundamentos.ts`
