# SocialShare

Aplicación social para compartir imágenes (tipo Pinterest) construida con **React + Vite**, **TailwindCSS** y **Sanity**.

## Stack

- Frontend: React, Vite, TailwindCSS, React Router
- Auth: Google OAuth (`@react-oauth/google`)
- Backend (CMS): Sanity Studio (schemas en `backend/schemas/`)

## Requisitos

- Node.js (recomendado: LTS)
- npm
- Cuenta en Sanity y proyecto configurado

## Estructura del repo

- `frontend/`: app React (Vite)
- `backend/`: Sanity Studio (schemas, plugins, configuración)

## Instalación

### 1) Instalar dependencias

Backend (Sanity Studio):

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2) Variables de entorno (Frontend)

Crea el archivo `frontend/.env` con estas claves (Vite solo expone variables que empiezan por `VITE_`):

```bash
VITE_SANITY_PROJECT_ID=TU_PROJECT_ID
VITE_SANITY_PROJECT_API_TOKEN=TU_SANITY_TOKEN
VITE_GOOGLE_API_TOKEN=TU_GOOGLE_OAUTH_CLIENT_ID
```

Notas importantes:

- El dataset está fijado a `production` en el cliente de Sanity del frontend (`frontend/src/client.js`).
- `VITE_SANITY_PROJECT_API_TOKEN` debe tener permisos de escritura (se usan mutaciones como `createIfNotExists`, `create`, `delete`).

### 3) CORS en Sanity

En el proyecto de Sanity, habilita CORS para el origen del frontend:

- `http://localhost:5173` (desarrollo)
- tu dominio de producción (si deployas)

Si tu implementación requiere credenciales, habilita “Allow credentials”.

### 4) Google OAuth

En Google Cloud Console, crea un **OAuth Client ID** (Web) y configura los *Authorized JavaScript origins*:

- `http://localhost:5173`
- tu dominio de producción

Luego pega el Client ID en `VITE_GOOGLE_API_TOKEN`.

## Ejecutar en desarrollo

### Backend (Sanity Studio)

```bash
cd backend
npm run dev
```

### Frontend (Vite)

```bash
cd frontend
npm run dev
```

Por defecto Vite levanta en `http://localhost:5173`.

## Builds y despliegue

### Sanity Studio

```bash
cd backend
npm run build
npm run deploy
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

El frontend incluye `frontend/vercel.json`, pensado para desplegar en Vercel (SPA rewrite).

## Personalización rápida

Este repo trae el Studio configurado con:

- `projectId`: `1ze5usx7`
- `dataset`: `production`

Si quieres usar tu propio proyecto de Sanity, actualiza esos valores en:

- `backend/sanity.config.ts`
- `backend/sanity.cli.ts`

y ajusta `VITE_SANITY_PROJECT_ID` en `frontend/.env`.