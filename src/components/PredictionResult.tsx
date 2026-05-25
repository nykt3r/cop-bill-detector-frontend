import type { PredictionResponse } from "../types"

interface Props {
  result: PredictionResponse
}

const confidenceColor = (v: number) => {
  if (v >= 0.95) return "bg-emerald-500"
  if (v >= 0.8) return "bg-cyan-500"
  if (v >= 0.6) return "bg-amber-500"
  return "bg-rose-500"
}

const PredictionResult = ({ result }: Props) => {
  const { class_name, confidence, is_fake, is_genuine, denomination, top3, inference_ms } = result

  const badge = is_genuine
    ? { label: "GENUINO", cls: "bg-genuine-bg text-genuine border-genuine-border" }
    : is_fake
      ? { label: "FALSO", cls: "bg-fake-bg text-fake border-fake-border" }
      : { label: "FONDO", cls: "bg-bgnd-bg text-bgnd border-bgnd-border" }

  return (
    <div className="w-full max-w-md animate-fade-in space-y-5 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-xl backdrop-blur-sm">
      {/* Header: clase + badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Predicción
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {class_name}
          </h2>
          {denomination && (
            <p className="text-sm text-slate-400">
              Denominación: <span className="font-semibold text-slate-200">{denomination}</span>
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Barra de confianza */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-400">Confianza</span>
          <span className="font-mono font-semibold text-white">
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${confidenceColor(confidence)}`}
            style={{ width: `${(confidence * 100).toFixed(1)}%` }}
          />
        </div>
      </div>

      {/* Top-3 */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
          Top 3
        </p>
        <div className="space-y-1.5">
          {top3.map((entry, i) => {
            const pct = (entry.confidence * 100).toFixed(1)
            const isWinner = i === 0
            return (
              <div key={entry.class} className="flex items-center gap-3">
                <span className="w-4 text-right text-xs font-mono text-slate-500">
                  {i + 1}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-sm ${
                    isWinner ? "font-semibold text-white" : "text-slate-300"
                  }`}
                >
                  {entry.class}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner ? "bg-emerald-500" : "bg-slate-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-xs text-slate-400">
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tiempo de inferencia */}
      <div className="flex items-center gap-1.5 border-t border-slate-700/50 pt-3 text-[11px] text-slate-500">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {inference_ms.toFixed(0)} ms
      </div>
    </div>
  )
}

export default PredictionResult
