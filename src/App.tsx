import { useCallback, useRef, useState } from "react"
import CameraCapture from "./components/CameraCapture"
import Header from "./components/Header"
import UploadZone from "./components/UploadZone"
import PredictionResult from "./components/PredictionResult"
import Footer from "./components/Footer"
import { predictImage } from "./api"
import type { PredictionResponse, PredictionStatus } from "./types"

type InputMode = "upload" | "camera"

function App() {
  const [status, setStatus] = useState<PredictionStatus>("idle")
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<InputMode>("upload")
  const abortRef = useRef<AbortController | null>(null)

  const handleFile = useCallback(async (file: File) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus("loading")
    setResult(null)
    setError(null)

    try {
      const data = await predictImage(file, controller.signal)
      setResult(data)
      setStatus("success")
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return
      setError(e instanceof Error ? e.message : "Error inesperado")
      setStatus("error")
    }
  }, [])

  const handleRetry = useCallback(() => {
    setStatus("idle")
    setResult(null)
    setError(null)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-12">
        {/* Hero */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-emerald-400"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Detector de Billetes Falsos COP
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sube o captura una imagen de un billete colombiano bajo luz UV para clasificarlo
          </p>
        </div>

        {/* Mode toggle */}
        {status === "idle" && (
          <div className="mb-6 flex rounded-xl border border-slate-700/50 bg-slate-800/40 p-1">
            <button
              onClick={() => setMode("upload")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "upload"
                  ? "bg-emerald-600/20 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Subir imagen
            </button>
            <button
              onClick={() => setMode("camera")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "camera"
                  ? "bg-emerald-600/20 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              Cámara
            </button>
          </div>
        )}

        {/* Input: Upload or Camera */}
        {status === "idle" && mode === "upload" && (
          <UploadZone onFile={handleFile} disabled={false} />
        )}
        {status === "idle" && mode === "camera" && (
          <CameraCapture onFile={handleFile} disabled={false} />
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
            <svg
              className="h-5 w-5 animate-spin text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analizando imagen...
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="mt-8 w-full max-w-md rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-4 text-center text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Result */}
        {status === "success" && result && (
          <div className="mt-8 flex w-full max-w-md flex-col items-center gap-4">
            <PredictionResult result={result} />
            <button
              onClick={handleRetry}
              className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700/50"
            >
              Nuevo análisis
            </button>
          </div>
        )}

        {/* Error retry */}
        {status === "error" && (
          <button
            onClick={handleRetry}
            className="mt-6 rounded-xl border border-slate-600 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700/50"
          >
            Reintentar
          </button>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
