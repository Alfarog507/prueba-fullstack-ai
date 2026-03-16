# Prueba Técnica — Full Stack Developer (AI-Enabled)

Aplicación full stack que consume datos de una API externa, los procesa mediante un backend propio, integra un modelo de lenguaje (LLM) para análisis de texto y presenta la información en un cliente web moderno.

## Tech Stack

**Backend**
- Node.js + Express (puerto 3001)
- Google Gemini `gemini-2.5-flash` vía `@google/generative-ai`
- Validación de inputs y outputs con Zod
- Tests con Jest + Supertest

**Frontend**
- React 18 + Vite (puerto 5173)
- TailwindCSS
- Componentes funcionales con Hooks

**Infraestructura**
- Docker + Docker Compose

## Estructura del Proyecto

```
prueba-fullstack-ai/
├── backend/
│   ├── src/
│   │   ├── clients/          # Clientes HTTP externos (JSONPlaceholder, Gemini)
│   │   ├── controllers/      # Manejo de requests/responses HTTP
│   │   ├── routes/           # Definición de rutas Express
│   │   ├── schemas/          # Esquemas de validación Zod
│   │   ├── services/         # Lógica de negocio
│   │   └── __tests__/        # Tests unitarios e integración
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Funciones de comunicación con el backend
│   │   ├── components/       # Componentes React reutilizables
│   │   └── App.jsx           # Componente raíz y estado global
│   ├── nginx.conf            # Proxy reverso para producción
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose instalados
- API Key de Google Gemini ([obtener aquí](https://aistudio.google.com/app/apikey))

## Instalación y Ejecución

### Con Docker (recomendado)

```bash
git clone <url-del-repositorio>
cd prueba-fullstack-ai
cp .env.example .env      # completar LLM_API_KEY con tu API key de Gemini
docker compose up --build
```

La app queda disponible en `http://localhost:5173`.

### Sin Docker (desarrollo local)

**Backend:**
```bash
cd backend
cp .env.example .env      # completar LLM_API_KEY
npm install
npm start
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```

El frontend en desarrollo usa el proxy de Vite para redirigir `/posts` y `/ai` al backend en `localhost:3001`, sin necesidad de configurar CORS.

## Variables de Entorno

Copiar `.env.example` a `.env` en la raíz del proyecto:

```env
LLM_API_KEY=your_gemini_api_key_here   # requerido
PORT=3001                               # opcional, default 3001
VITE_API_URL=                           # vacío en dev (usa proxy de Vite)
```

## API Endpoints

### `GET /posts`

Consume `https://jsonplaceholder.typicode.com/comments`, agrupa los comentarios por `name`, cuenta cuántos tiene cada usuario y devuelve el resultado ordenado de mayor a menor.

**Respuesta `200`:**
```json
[
  {
    "name": "Leanne Graham",
    "postCount": 5,
    "bodies": ["comentario 1", "comentario 2", "..."]
  }
]
```

El campo `bodies` contiene los textos reales de los comentarios. El frontend lo usa para alimentar el endpoint de análisis IA.

**Errores:** `500` si falla la API externa.

---

### `POST /ai/analyze-comments`

Recibe una lista de textos, los analiza con Gemini y devuelve un resumen, el sentimiento general y categorías temáticas.

**Body:**
```json
{ "comments": ["comentario 1", "comentario 2"] }
```

**Validaciones:** array de strings, mínimo 1 elemento, máximo 20.

**Respuesta `200`:**
```json
{
  "summary": "Los usuarios comentan principalmente sobre el sistema y la experiencia de uso.",
  "sentiment": "neutral",
  "categories": ["soporte", "experiencia de usuario"]
}
```

- `sentiment`: `positive` | `neutral` | `negative`
- `categories`: entre 1 y 4 etiquetas temáticas generadas por el LLM

**Errores:** `400` si el body es inválido, `500` si falla el LLM.

---

### `POST /ai/analyze-comments/stream`

Mismo contrato de entrada que el endpoint anterior, pero la respuesta se entrega como **Server-Sent Events (SSE)**. Permite mostrar la respuesta del LLM en tiempo real mientras se genera.

**Eventos emitidos:**

```
data: {"type":"chunk","text":"Los usuarios"}
data: {"type":"chunk","text":" comentan..."}
data: {"type":"done","result":{"summary":"...","sentiment":"positive","categories":["soporte"]}}
```

En caso de error durante el stream:
```
data: {"type":"error","message":"Error al analizar los comentarios"}
```

El frontend usa este endpoint para el botón "Analizar comentarios con IA", mostrando el texto mientras se genera y el resultado formateado al completarse.

## Tests

```bash
cd backend
npm test
```

20 tests distribuidos en 4 suites:

| Suite | Cobertura |
|---|---|
| `postsService.test.js` | Agrupación por nombre, ordenamiento descendente, acumulación de bodies, propagación de errores |
| `aiService.test.js` | Parsing del LLM, extracción de JSON, defaults de Zod, streaming con async generator |
| `posts.route.test.js` | Integración del endpoint `GET /posts`: respuestas 200 y 500 |
| `ai.route.test.js` | Integración del endpoint `POST /ai/analyze-comments`: respuestas 200, 400 y 500 |

## Decisiones Técnicas

**Arquitectura en capas:** El backend se separó en cinco capas — rutas, controladores, servicios, clientes y esquemas — para que cada archivo tenga una única responsabilidad. Los controladores solo manejan HTTP; la lógica de negocio vive en los servicios; los clientes encapsulan las llamadas externas. Esta separación es lo que permite mockear dependencias en los tests sin tocar código de producción.

**Validación en dos niveles:** Los inputs del usuario se validan con Zod en el controlador antes de llegar al servicio. La respuesta del LLM también pasa por un schema Zod (`aiResponseSchema`) para garantizar que siempre tenga la forma esperada, independientemente de lo que devuelva Gemini. Si el modelo omite `categories`, Zod aplica `.default([])` en vez de tirar error.

**SSE sobre WebSockets para streaming:** El streaming de respuestas del LLM es unidireccional (servidor → cliente), por lo que WebSockets serían sobredimensionados. SSE funciona sobre HTTP estándar sin librerías adicionales. En el backend se usa un async generator que acumula el texto completo mientras emite chunks, y al terminar parsea el JSON completo — nunca se intenta parsear JSON parcial.

**Multi-stage build en Docker:** El Dockerfile del frontend compila el proyecto con Vite en una primera imagen y copia solo los archivos estáticos a una imagen Nginx final. La imagen de producción no contiene Node.js ni dependencias de desarrollo, lo que la hace considerablemente más liviana.

**Proxy Nginx en producción:** El frontend compilado corre sobre Nginx, que actúa como proxy reverso hacia el backend usando el nombre de servicio del compose (`http://backend:3001`). Esto evita exponer el puerto del backend directamente y elimina problemas de CORS. El patrón replica en producción lo que el proxy de Vite hace en desarrollo.

**Healthcheck en Docker:** El compose espera que el backend responda correctamente (`service_healthy`) antes de arrancar Nginx, evitando que los primeros requests fallen con "connection refused" mientras Express todavía está arrancando.

## Funcionalidades Implementadas

- [x] Agrupación de comentarios por usuario con conteo ordenado
- [x] Tabla con paginación y búsqueda por nombre
- [x] Análisis de comentarios con IA (resumen + sentimiento)
- [x] Clasificación automática de comentarios en categorías temáticas
- [x] Streaming de respuestas del LLM en tiempo real (SSE)
- [x] Estados de loading, error y empty en el frontend
- [x] Tests unitarios e integración en el backend
- [x] Dockerización completa con `docker compose up --build`

## Uso de IA para Desarrollo

Este proyecto fue desarrollado con asistencia de **Claude Code** (CLI de Anthropic).

### Tareas asistidas

- Planificación de la arquitectura y orden de implementación sesión por sesión
- Generación del esqueleto completo del backend (estructura en capas, endpoints, validaciones)
- Escritura de todos los tests con Jest y Supertest
- Configuración del proxy de Vite y Nginx para desarrollo y producción
- Implementación del streaming SSE end-to-end (async generator, SSE headers, ReadableStream en cliente)
- Integración de la clasificación automática en el schema y prompt existentes
- Diagnóstico y ajustes entre sesiones a medida que evolucionó el código

### Prompts utilizados

**Para arrancar el proyecto con contexto claro:**
```
Before writing any code, read every file in the project (backend and frontend),
then create a detailed plan that includes:
1. What's already implemented and can be kept as-is
2. What needs to be created from scratch
3. What needs to be modified to match CLAUDE.md conventions
4. The exact order you'll implement everything, session by session

Do not write any code yet. Only give me the plan and wait for my approval.
```

**Para ejecutar cada sesión de forma controlada:**
```
go ahead with session 1
```

**Para implementar las features opcionales:**
```
Streaming de llm y luego continua con clasificacion de comentarios
```

**Para obtener una evaluación honesta antes de implementar:**
```
¿Cómo ves el implementar algo de estos puntos?
OPCIONALES (NO OBLIGATORIOS)
- Clasificación automática de comentarios
- Búsqueda semántica con embeddings
- Streaming de respuestas del LLM
- Despliegue en algún servicio cloud
```
