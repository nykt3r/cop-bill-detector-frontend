import { useEffect, useRef, useState } from "react"

interface CameraCaptureProps {
  onFile: (file: File) => void
  disabled?: boolean
}

const CameraCapture = ({ onFile, disabled }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [captured, setCaptured] = useState<string | null>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setError("No se pudo acceder a la cámara. Verifica los permisos.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      setCapturedBlob(blob)
      setCaptured(canvas.toDataURL("image/jpeg"))
    }, "image/jpeg")
  }

  const handleRetake = () => {
    setCaptured(null)
    setCapturedBlob(null)
  }

  const handleSend = () => {
    if (!capturedBlob) return
    const file = new File([capturedBlob], "capture.jpg", { type: "image/jpeg" })
    onFile(file)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      {error ? (
        <div className="w-full rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-6 text-center text-sm text-rose-400">
          <p className="mb-3">{error}</p>
          <button
            onClick={startCamera}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-600"
          >
            Reintentar
          </button>
        </div>
      ) : captured ? (
        <>
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40">
            <img
              src={captured}
              alt="Captura"
              className="w-full object-contain"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              disabled={disabled}
              className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700/50 disabled:opacity-50"
            >
              Volver a tomar
            </button>
            <button
              onClick={handleSend}
              disabled={disabled}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {disabled ? "Analizando..." : "Analizar imagen"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <button
            onClick={handleCapture}
            disabled={disabled}
            className="flex items-center gap-2 rounded-full border-2 border-emerald-500 px-8 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/10 disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Capturar foto
          </button>
          <p className="text-xs text-slate-500">
            Coloca el billete bajo luz UV frente a la cámara
          </p>
        </>
      )}
    </div>
  )
}

export default CameraCapture
