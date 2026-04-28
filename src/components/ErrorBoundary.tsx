import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Noblr] ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-bg-base text-text-main flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-[20px] pointer-events-none border border-accent-20 z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-20 opacity-20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-lg text-center relative z-10">
          <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase mb-6">
            System Interruption
          </div>
          <h1 className="font-display text-5xl font-light leading-[1.05] tracking-tight mb-6">
            Unexpected <span className="italic font-serif text-text-dim">disruption.</span>
          </h1>
          <p className="font-serif italic text-text-dim text-[15px] leading-[1.8] mb-10">
            Dossier хүргэгдэх үед алдаа гарлаа. Хуудсыг дахин ачаалснаар сэргээгдэнэ. Хэрэв дахин давтагдвал хэсэг хугацаанд хүлээгээрэй.
          </p>
          {this.state.error?.message && (
            <div className="font-mono text-[11px] text-text-dim/50 border-t border-accent-20 pt-6 mb-10 break-all">
              {this.state.error.message}
            </div>
          )}
          <button
            onClick={this.handleReload}
            className="bg-accent text-bg-base px-10 py-4 text-[11px] font-caps tracking-[0.2em] uppercase hover:bg-accent-deep transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
