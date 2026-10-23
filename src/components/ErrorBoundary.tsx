import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Nome da área protegida, mostrado na mensagem. */
  label?: string;
  /** Quando qualquer valor muda (ex.: rota), o erro é limpo e a árvore tenta renderizar de novo. */
  resetKeys?: unknown[];
  /** Fallback compacto (ex.: dock de timers) em vez do cartão grande. */
  compact?: boolean;
}

interface State {
  error: Error | null;
}

const sameKeys = (a: unknown[] = [], b: unknown[] = []) => a.length === b.length && a.every((v, i) => Object.is(v, b[i]));

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.label ?? 'app'}]`, error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && !sameKeys(prev.resetKeys, this.props.resetKeys)) this.setState({ error: null });
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.compact) {
      return (
        <div role="alert" className="flex items-center justify-between gap-3 border-b border-lantern/50 bg-surface px-4 py-2 text-sm">
          <span>Os timers tiveram um problema.</span>
          <button type="button" className="btn min-h-[48px]" onClick={this.reset}>
            Recarregar
          </button>
        </div>
      );
    }

    return (
      <div role="alert" className="panel mx-auto my-10 max-w-xl p-6 text-center">
        <p className="font-serif text-4xl" aria-hidden="true">
          焦
        </p>
        <h2 className="mt-2 text-2xl font-bold">Algo queimou na cozinha</h2>
        <p className="mt-2 text-mute">
          {this.props.label ? `A área “${this.props.label}” ` : 'Esta área '}encontrou um erro inesperado. Suas anotações e
          favoritos continuam salvos.
        </p>
        <pre className="mt-4 max-h-28 overflow-auto rounded-lg bg-canvas p-3 text-left text-xs text-mute">{error.message}</pre>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-lantern" onClick={this.reset}>
            Tentar de novo
          </button>
          <a className="btn" href="#/" onClick={this.reset}>
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }
}
