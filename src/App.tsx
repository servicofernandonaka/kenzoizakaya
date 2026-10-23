import { useEffect, useMemo, useRef, useState } from 'react';
import { EmporiumLocator } from './components/EmporiumLocator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Lantern, MoonIcon, SunIcon } from './components/Icons';
import { KitchenModeView } from './components/KitchenModeView';
import { TimerDock } from './components/TimerDock';
import { TimersProvider } from './context/TimersContext';
import { RECEITAS, findReceita } from './data';
import { useFavorites, usePrefs } from './hooks/useAppState';
import { hrefReceita, navigate, parseRoute, useHash } from './lib/route';
import { Home } from './pages/Home';
import { RecipeDetail } from './pages/RecipeDetail';
import { RecipesPage } from './pages/RecipesPage';

const NAV = [
  { href: '#/', label: 'Início', match: (n: string) => n === 'home' },
  { href: '#/receitas', label: 'Receitas', match: (n: string) => n === 'receitas' || n === 'receita' },
  { href: '#/mercado', label: 'Mercado', match: (n: string) => n === 'mercado' },
];

function NotFound() {
  return (
    <div className="panel mx-auto max-w-xl p-8 text-center">
      <p className="font-serif text-5xl text-lanternink" aria-hidden="true">
        迷
      </p>
      <h1 className="mt-3 text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-mute">Esse caminho não existe no caderno.</p>
      <a href="#/" className="btn btn-lantern mt-5">
        Voltar ao início
      </a>
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const route = useMemo(() => parseRoute(hash), [hash]);
  const [prefs, patchPrefs] = usePrefs();
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites();
  const [servingsById, setServingsById] = useState<Record<string, number>>({});
  const mainRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  // Tema
  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', prefs.theme === 'dark' ? '#121212' : '#F4F1EA');
  }, [prefs.theme]);

  // A cada navegação: topo da página + foco no conteúdo (leitores de tela / teclado)
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [hash]);

  const receita = route.name === 'receita' ? findReceita(route.id) : undefined;
  const servings = receita ? (servingsById[receita.id] ?? receita.rendimento_base_porcoes) : 1;
  const setServings = (n: number) => receita && setServingsById((s) => ({ ...s, [receita.id]: n }));
  const inKitchen = route.name === 'receita' && route.kitchen && receita !== undefined;

  // Com o Modo Cozinha aberto, o resto da página fica inerte (sem foco por Tab nem leitura por AT).
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    el.inert = inKitchen;
    return () => {
      el.inert = false;
    };
  }, [inKitchen]);

  let page: React.ReactNode;
  if (route.name === 'home') {
    page = <Home receitas={RECEITAS} favorites={favorites} onToggleFavorite={toggleFavorite} />;
  } else if (route.name === 'receitas') {
    page = <RecipesPage receitas={RECEITAS} favorites={favorites} onToggleFavorite={toggleFavorite} />;
  } else if (route.name === 'mercado') {
    page = (
      <div className="space-y-6">
        <header>
          <p className="kicker">Mercado Honesto</p>
          <h1 className="mt-1 text-4xl font-bold">Onde comprar</h1>
          <p className="mt-2 max-w-2xl text-mute">O caminho direto para encontrar insumos puros, sem cair em armadilhas de rótulo.</p>
        </header>
        <EmporiumLocator />
      </div>
    );
  } else if (route.name === 'receita' && receita) {
    page = (
      <RecipeDetail
        receita={receita}
        servings={servings}
        onServingsChange={setServings}
        unitMode={prefs.unitMode}
        onUnitModeChange={(unitMode) => patchPrefs({ unitMode })}
        favorite={isFavorite(receita.id)}
        onToggleFavorite={toggleFavorite}
      />
    );
  } else if (route.name === 'receita') {
    page = (
      <div className="panel mx-auto max-w-xl p-8 text-center">
        <h1 className="text-3xl font-bold">Receita não encontrada</h1>
        <a href="#/receitas" className="btn btn-lantern mt-5">
          Ver todas as receitas
        </a>
      </div>
    );
  } else {
    page = <NotFound />;
  }

  return (
    <TimersProvider>
      <div ref={shellRef}>
      <a
        href="#conteudo"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only z-[60] rounded-lg bg-lantern px-4 py-3 font-bold text-onlantern focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>

      <div className="sticky top-0 z-30">
        <header className="border-b border-line bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <a href="#/" className="flex items-center gap-3" aria-label="Izakaya do Kenzō — início">
              <Lantern size={26} />
              <span className="hidden font-serif text-xl font-bold sm:inline">Izakaya do Kenzō</span>
            </a>
            <nav aria-label="Principal" className="ml-auto flex items-center gap-1">
              {NAV.map((n) => {
                const active = n.match(route.name);
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    aria-current={active ? 'page' : undefined}
                    className={`btn btn-ghost !px-2.5 sm:!px-4 ${active ? 'text-lanternink underline decoration-2 underline-offset-8' : 'text-mute'}`}
                  >
                    {n.label}
                  </a>
                );
              })}
              <button
                type="button"
                className="btn btn-ghost !px-3"
                onClick={() => patchPrefs({ theme: prefs.theme === 'dark' ? 'washi' : 'dark' })}
                aria-label={prefs.theme === 'dark' ? 'Mudar para tema papel washi (claro)' : 'Mudar para tema madeira queimada (escuro)'}
              >
                {prefs.theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </nav>
          </div>
        </header>
        {!inKitchen && (
          <ErrorBoundary compact label="Timers">
            <TimerDock />
          </ErrorBoundary>
        )}
      </div>

      <main
        id="conteudo"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto max-w-6xl px-4 pb-24 pt-8 outline-none sm:px-6"
      >
        <ErrorBoundary label="Página" resetKeys={[hash]}>
          <div key={hash} className="animate-rise">
            {page}
          </div>
        </ErrorBoundary>
      </main>


      <footer className="border-t border-line py-8 text-center text-sm text-mute">
        <p className="font-serif text-lg text-ink" lang="ja">
          いただきます
        </p>
        <p className="mt-1">Izakaya do Kenzō · caderno 100% offline — suas anotações ficam só neste aparelho.</p>
      </footer>
      </div>

      {inKitchen && receita && (
        <ErrorBoundary
          label="Modo Cozinha"
          resetKeys={[hash]}
        >
          <KitchenModeView
            receita={receita}
            servings={servings}
            factor={servings / receita.rendimento_base_porcoes}
            unitMode={prefs.unitMode}
            onUnitModeChange={(unitMode) => patchPrefs({ unitMode })}
            onExit={() => navigate(hrefReceita(receita.id))}
          />
        </ErrorBoundary>
      )}

    </TimersProvider>
  );
}
