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
