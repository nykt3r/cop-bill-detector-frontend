import type { PredictionResponse } from "./types"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:7860"

export async function predictImage(
  file: File,
  signal?: AbortSignal
): Promise<PredictionResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
    signal,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Error ${res.status}: ${res.statusText}`)
  }

  return res.json()
}

export async function healthCheck(signal?: AbortSignal) {
  const res = await fetch(`${API_URL}/health`, { signal })
  if (!res.ok) return null
  return res.json()
}
