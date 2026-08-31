import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("Unhandled application error", error, errorInfo);
    }
  }

  public render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
        <section className="max-w-md rounded-xl bg-white p-8 shadow-sm dark:bg-slate-900">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            We could not display this page. Please reload and try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
          >
            Reload page
          </button>
        </section>
      </main>
    );
  }
}
