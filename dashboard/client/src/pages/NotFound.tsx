import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="text-[80px] font-mono font-bold text-[#D4AF37]/20">404</div>
        <h1 className="text-2xl font-mono font-bold text-[#D4AF37]">ACCESS DENIED</h1>
        <p className="text-sm font-mono text-[#666] max-w-md">
          This terminal page does not exist. Return to the main screener.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="px-6 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-sm font-mono text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
        >
          RETURN TO TERMINAL
        </button>
      </div>
    </div>
  );
}
