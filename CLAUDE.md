# CLAUDE.md

## Proyecto
Prueba técnica Full Stack AI-enabled.
El objetivo es construir una aplicación full stack pequeña pero profesional que demuestre:
- Integración frontend + backend
- Consumo de API externa
- Uso práctico de un LLM
- Código limpio y modular
- Manejo de errores
- Dockerización completa

## Stack
- Backend: Node.js + Express en `/backend` (puerto 3001)
- Frontend: React 18 + Vite + TailwindCSS en `/frontend` (puerto 5173)
- Validación backend: Zod
- LLM: Google Gemini vía `@google/generative-ai`
- Infra: Docker + Docker Compose

## LLM
- Modelo: `gemini-1.5-flash`
- Max tokens: no aplica (Gemini no requiere límite explícito)

## Estructura esperada
- `/backend` → API Express
- `/frontend` → cliente React
- `/docker-compose.yml` → orquestación local
- `/.env.example` → variables documentadas
- `/README.md` → instrucciones y decisiones técnicas

## API externa
- Fuente: `https://jsonplaceholder.typicode.com/comments`
- Los comentarios se agrupan por `name`
- Se cuenta cuántos comentarios tiene cada `name`
- La respuesta del endpoint `GET /posts` debe venir ordenada de mayor a menor

## Endpoints del backend

### GET /posts
Devuelve un arreglo con esta forma:
```json
[
  { "name": "Leanne Graham", "postCount": 3 }
]
```

### POST /ai/analyze-comments
Body esperado:
```json
{ "comments": ["comentario 1", "comentario 2"] }
```
Respuesta esperada:
```json
{
  "summary": "Resumen breve de los comentarios",
  "sentiment": "positive"
}
```
Valores válidos para `sentiment`: `positive`, `neutral`, `negative`

## Variables de entorno

**Backend:**
- `LLM_API_KEY` → API key de Google Gemini
- `PORT` → puerto backend, default 3001

**Frontend:**
- `VITE_API_URL` → URL base del backend (vacía en dev, usa proxy de Vite)

## Convenciones
- Frontend funcional, sin clases
- Backend modular: rutas, controladores, servicios, clientes y esquemas separados
- Validar inputs con Zod
- Manejo de errores consistente en todos los endpoints
- No exponer secretos ni stack traces en respuestas al cliente

## Restricciones
- No agregar base de datos
- No agregar autenticación
- No agregar librerías innecesarias
- No usar sobrearquitectura
- Priorizar simplicidad, legibilidad y entrega rápida

## Archivos sensibles
Una vez que estén correctos, no los toques sin una razón explícita:
- `docker-compose.yml`
- `.env.example`
- `CLAUDE.md`

## Calidad esperada
- Código limpio con nombres claros
- Separación de responsabilidades
- Estados de loading / error / empty en el frontend
- Tests básicos en backend (rutas y servicios)
- Docker funcional con `docker compose up`

## Comandos frecuentes
- `cd backend && npm test` → correr tests del backend
- `docker compose up` → levantar todo
- `docker compose up --build` → rebuild completo

## Cómo ayudar
Cuando hagas cambios:
1. Prioriza la solución más simple y correcta
2. Evita sobreingeniería
3. Respeta la estructura del proyecto
4. Explica decisiones importantes si cambian la arquitectura
5. Genera código limpio y listo para una prueba técnica profesional

## Estilo de implementación
- Funciones pequeñas con una sola responsabilidad
- Archivos cortos — si un archivo crece demasiado, es señal de que hay que separarlo
- La lógica de negocio vive en los servicios, no en las rutas ni en los controladores
- Respuestas JSON consistentes en todos los endpoints:
  - Éxito: el dato directamente o `{ data: ... }`
  - Error: siempre `{ error: "mensaje legible" }`