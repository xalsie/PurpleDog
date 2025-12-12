import { ReactNode } from "react";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  children?: ReactNode;
}

export function LoadingOverlay({ show, message = "Chargement...", children }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/95 px-6 py-5 shadow-2xl border border-purple-100">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border-4 border-purple-200" />
          <span className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#0b071a] text-center">{message}</p>
        {children}
      </div>
    </div>
  );
}
