# COP Bill Detector — Frontend

Aplicación web para detectar billetes colombianos falsos mediante IA. El usuario **sube una imagen** o **captura una foto con la cámara** de un billete bajo luz UV y el frontend la envía a un backend de Deep Learning (PyTorch + FastAPI) que devuelve la clasificación: **genuino**, **falso** o **fondo**, junto con la denominación, nivel de confianza y top-3 de predicciones.

## Stack

| Categoría        | Tecnología                                           |
| ---------------- | ---------------------------------------------------- |
| Lenguaje         | TypeScript ~6.0                                      |
| Framework UI     | React 19                                             |
| Build tool       | Vite 8                                               |
| Estilos          | Tailwind CSS v4                                      |
| HTTP             | Fetch nativo (`multipart/form-data`)                 |
| Linter           | ESLint 10 + `typescript-eslint`                      |
| Paquetes         | npm                                                  |

## ¿Cómo funciona?

1. El usuario elige entre dos modos con un **toggle**: "Subir imagen" (drag & drop / file picker) o "Cámara" (stream de video en vivo).
2. En modo cámara, el componente `CameraCapture` solicita acceso a `getUserMedia`, muestra el video en vivo y permite capturar un frame.
3. `App.tsx` pasa el archivo (desde `UploadZone` o `CameraCapture`) a `predictImage()` (`src/api.ts`), que lo envía como `FormData` via POST a `{VITE_API_URL}/predict`.
4. Mientras espera la respuesta, se muestra un spinner de carga.
5. Al recibir la respuesta (`PredictionResponse`), se renderiza `PredictionResult` con:
   - Clase predecida y denominación
   - Badge de estado (GENUINO / FALSO / FONDO) con código de colores
   - Barra de confianza animada
   - Top-3 de clases más probables con mini-barras
   - Tiempo de inferencia en milisegundos
6. Tras el resultado, el usuario puede presionar "Nuevo análisis" para volver al inicio.
7. Si ocurre un error (red, servidor, etc.), se muestra un banner con el mensaje y un botón "Reintentar".
8. Las peticiones en curso se cancelan automáticamente si el usuario inicia un nuevo análisis antes de recibir la respuesta anterior (`AbortController`).

## Estados de la UI

La aplicación funciona como una máquina de estados:

```
idle → loading → success → idle  ("Nuevo análisis")
                → error   → idle  ("Reintentar")
```

- **idle**: estado inicial. Muestra el toggle (Subir / Cámara) y el componente de entrada activo.
- **loading**: spinner "Analizando imagen..." con entrada deshabilitada.
- **success**: `PredictionResult` + botón "Nuevo análisis" que vuelve a idle.
- **error**: banner con el mensaje + botón "Reintentar" que vuelve a idle.

## Componentes

```
src/
├── main.tsx                  # Entry point (React 19, StrictMode)
├── App.tsx                   # Estado global, orquestación, toggle upload/cámara
├── api.ts                    # Cliente HTTP (fetch)
├── types.ts                  # Interfaces TypeScript
├── index.css                 # Tailwind v4 + tema personalizado
└── components/
    ├── Header.tsx            # Barra superior con logo y título
    ├── UploadZone.tsx        # Drag & drop / click para subir imagen
    ├── CameraCapture.tsx     # Stream de cámara, captura de frame, envío
    ├── PredictionResult.tsx  # Resultados de la predicción
    └── Footer.tsx            # Footer con créditos del stack
```

## API

### `POST {VITE_API_URL}/predict`

Envía una imagen y recibe la predicción.

**Request:** `multipart/form-data` con campo `file`.

**Response (`PredictionResponse`):**

```typescript
interface PredictionResponse {
  class_name: string       // ej. "100kf"
  class_index: number
  confidence: number       // 0.0 – 1.0
  is_fake: boolean
  is_genuine: boolean
  is_background: boolean
  denomination: string | null  // ej. "100k"
  top3: Top3Entry[]        // siempre 3 entradas
  inference_ms: number
}
```

## Variables de entorno

| Variable         | Default                  | Descripción                     |
| ---------------- | ------------------------ | ------------------------------- |
| `VITE_API_URL`   | `http://localhost:7860`  | URL base del backend FastAPI    |

## Uso

```bash
# Clonar el repositorio
git clone <repo>
cd cop-bill-detector-frontend

# Configurar la URL del backend
cp .env.example .env
# Editar .env con la URL deseada

# Instalar dependencias
npm install

# Iniciar en desarrollo (HMR en http://localhost:5173)
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build
npm run preview

# Linter
npm run lint
```
