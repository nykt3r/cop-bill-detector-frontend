# COP Bill Detector — Frontend

Aplicación web para detectar billetes colombianos falsos mediante IA. El usuario sube una imagen de un billete bajo luz UV y el frontend la envía a un backend de Deep Learning (PyTorch + FastAPI) que devuelve la clasificación: **genuino**, **falso** o **fondo**, junto con la denominación, nivel de confianza y top-3 de predicciones.

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

1. El usuario arrastra o selecciona una imagen en el componente `UploadZone`.
2. `App.tsx` pasa el archivo a `predictImage()` (`src/api.ts`), que lo envía como `FormData` via POST a `{VITE_API_URL}/predict`.
3. Mientras espera la respuesta, se muestra un spinner de carga.
4. Al recibir la respuesta (`PredictionResponse`), se renderiza `PredictionResult` con:
   - Clase predecida y denominación
   - Badge de estado (GENUINO / FALSO / FONDO) con código de colores
   - Barra de confianza animada
   - Top-3 de clases más probables con mini-barras
   - Tiempo de inferencia en milisegundos
5. Si ocurre un error (red, servidor, etc.), se muestra un banner con el mensaje.
6. Las peticiones en curso se cancelan automáticamente si el usuario sube una nueva imagen antes de recibir la respuesta anterior (`AbortController`).

## Estados de la UI

La aplicación funciona como una máquina de estados simple:

```
idle → loading → success
                → error
```

- **idle**: estado inicial, solo se muestra la zona de carga.
- **loading**: spinner "Analizando imagen..." y zona de carga deshabilitada.
- **success**: se muestra `PredictionResult` con los datos.
- **error**: banner con el mensaje de error.

## Componentes

```
src/
├── main.tsx                  # Entry point (React 19, StrictMode)
├── App.tsx                   # Estado global y orquestación
├── api.ts                    # Cliente HTTP (fetch)
├── types.ts                  # Interfaces TypeScript
├── index.css                 # Tailwind v4 + tema personalizado
└── components/
    ├── Header.tsx            # Barra superior con logo y título
    ├── UploadZone.tsx        # Área drag & drop / click para subir imagen
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
  class_name: string       // ej. "50000_fake"
  class_index: number
  confidence: number       // 0.0 – 1.0
  is_fake: boolean
  is_genuine: boolean
  is_background: boolean
  denomination: string | null  // ej. "$50,000 COP"
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
