# Prueba Técnica — Full Stack Developer (AI-Enabled)

Aplicación full stack que consume datos de una API externa, los procesa mediante un backend propio, integra un modelo de lenguaje (LLM) para análisis de texto y presenta la información en un cliente web moderno.

## Tech Stack

**Backend**
- Node.js + Express (puerto 3001)
- Google Gemini `gemini-2.5-flash` vía `@google/generative-ai`
- Validación de inputs con Zod

**Frontend**
- React 18 + Vite (puerto 5173)
- TailwindCSS
- Programación funcional con Hooks

**Infraestructura**
- Docker + Docker Compose

## Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose instalados
- API Key de Google Gemini

## Instalación y Ejecución

### Con Docker (recomendado)

```bash
git clone <url-del-repositorio>
cd prueba-fullstack-ai
cp .env.example .env      # completar con tu API key
docker compose up --build
```

La app queda disponible en `http://localhost:5173`.

### Sin Docker

**Backend:**
```bash
cd backend
cp .env.example .env      # completar con tu API key
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Variables de Entorno

Crear un archivo `.env` en la raíz (para Docker) o en `/backend` (sin Docker):

```env
LLM_API_KEY=your_gemini_api_key_here
PORT=3001                  # opcional, default 3001
```

## API Endpoints

### `GET /posts`

Consume `https://jsonplaceholder.typicode.com/comments`, agrupa por `name` y devuelve el resultado ordenado de mayor a menor.

**Respuesta:**
```json
[
  { "name": "Leanne Graham", "postCount": 5 },
  { "name": "Ervin Howell", "postCount": 3 }
]
```

**Errores:** `500` si falla la API externa.

---

### `POST /ai/analyze-comments`

Recibe una lista de textos, los analiza con Gemini y devuelve un resumen y sentimiento general.

**Body:**
```json
{ "comments": ["comentario 1", "comentario 2"] }
```

**Respuesta:**
```json
{
  "summary": "Los usuarios comentan principalmente sobre el sistema.",
  "sentiment": "neutral"
}
```

Valores válidos para `sentiment`: `positive`, `neutral`, `negative`.

**Errores:** `400` si el body es inválido, `500` si falla el LLM.

## Tests

```bash
cd backend
npm test
```

17 tests distribuidos en 4 suites: servicios (`postsService`, `aiService`) y rutas (`GET /posts`, `POST /ai/analyze-comments`).

## Funcionalidades Opcionales

- [ ] Clasificación automática de comentarios
- [ ] Búsqueda semántica con embeddings
- [ ] Streaming de respuestas del LLM
- [ ] Despliegue en servicio cloud

## Uso de IA para Desarrollo

### Herramientas utilizadas

- Claude Code (CLI de Anthropic)

### Tareas en las que ayudaron

- Generación del esqueleto completo del proyecto (backend, frontend, Docker)
- Escritura de tests con Jest y Supertest
- Configuración de Vite proxy y Nginx para producción
- Debugging y ajustes de integración entre capas

### Ejemplos de prompts utilizados

```
"Before writing any code, read every file in the project (backend and frontend),
then create a detailed plan that includes what's already implemented, what needs
to be created from scratch, what needs to be modified, and the exact order to
implement everything, session by session."
```

```
"go ahead with session 1"
```
