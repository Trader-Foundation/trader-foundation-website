import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-[#000000]">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-[#D4AF37] mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-4 font-mono text-[#D4AF37]">TERMINAL ERROR</h2>

            <div className="p-4 w-full rounded bg-[#0A0A0A] border border-[#D4AF37]/20 overflow-auto mb-6">
              <pre className="text-sm text-[#888] font-mono whitespace-break-spaces">
                {this.state.error?.stack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono",
                "hover:bg-[#D4AF37]/20 cursor-pointer transition-all"
              )}
            >
              <RotateCcw size={16} />
              Reload Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
