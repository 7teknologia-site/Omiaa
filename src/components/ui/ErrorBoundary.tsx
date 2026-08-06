import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in OMIAÁ Alquimia Ancestral:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#14281D] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E2D9C8] shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#14281D]">
                Harmonizando os Elixires
              </h2>
              <p className="text-xs text-[#5A6B5D] leading-relaxed">
                Ocorreu uma oscilação na energia da aplicação. Atualize a página para restaurar o equilíbrio do ritual.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full btn-luxury-primary py-3 rounded-2xl flex items-center justify-center gap-2 font-serif text-sm tracking-wider uppercase cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recarregar Experiência</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
