export interface Top3Entry {
  class: string
  confidence: number
}

export interface PredictionResponse {
  class_name: string
  class_index: number
  confidence: number
  is_fake: boolean
  is_genuine: boolean
  is_background: boolean
  denomination: string | null
  top3: Top3Entry[]
  inference_ms: number
}

export type PredictionStatus = "idle" | "loading" | "success" | "error"
  