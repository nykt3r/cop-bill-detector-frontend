import { type DragEvent, useRef, useState } from "react"

interface UploadZoneProps {
  onFile: (file: File) => void
  disabled?: boolean
}

const UploadZone = ({ onFile, disabled }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleChange = () => {
    const file = inputRef.current?.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          disabled
            ? "cursor-not-allowed border-slate-700 bg-slate-800/30 opacity-60"
            : dragging
              ? "scale-[1.02] border-emerald-400 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
              : "border-slate-600 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/60"
        }`}
      >
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-56 rounded-xl object-contain shadow-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300 shadow transition-colors hover:bg-slate-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700/60">
              <svg
                className="h-7 w-7 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Arrastra una imagen aquí
              </p>
              <p className="mt-1 text-xs text-slate-500">
                o haz clic para seleccionar
              </p>
            </div>
            <span className="rounded-full bg-slate-700/50 px-3 py-1 text-[11px] text-slate-400">
              JPG · PNG · BMP · WebP
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/bmp,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

export default UploadZone
