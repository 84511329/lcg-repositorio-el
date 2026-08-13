# PM Tool — contexto del proyecto

Herramienta interna de gestión de proyectos construida en un taller de un día por
un equipo de liderazgo sin experiencia técnica. Prioriza claridad sobre elegancia:
el código lo va a leer gente que está aprendiendo.

## Stack

- Next.js 16 (App Router) + TypeScript en modo estricto
- Tailwind CSS v4
- Supabase para datos y realtime
- API de Anthropic para el agente de minutas
- Deploy en Vercel

## Reglas de código

- **Server Components por default.** `"use client"` solo cuando haya estado,
  efectos o manejadores de eventos.
- El cliente de Supabase se crea con los helpers de `src/lib/supabase/`. No
  instanciar `createClient` suelto en un componente.
- **El esquema real está en `supabase/schema.sql`.** Léelo antes de escribir queries.
  No inventes nombres de columnas.
- Toda tabla nueva lleva RLS habilitado y al menos una policy.
- Los tipos viven en `src/types/database.ts`. Nada de `any`.
- Español en la interfaz y en los comentarios. Inglés en nombres de tablas,
  columnas y variables.

## Seguridad — innegociable

- `ANTHROPIC_API_KEY` se lee **únicamente** del entorno, dentro de Route Handlers
  o Server Actions. Nunca en código de cliente.
- **Nunca** con prefijo `NEXT_PUBLIC_`: ese prefijo empaqueta la variable en el
  bundle del navegador y expone la llave.
- Nunca escribas una llave, token o secreto directamente en el código, ni siquiera
  como ejemplo o placeholder.
- `.env.local` está en `.gitignore` y ahí se queda.

## Modelo de datos

`projects` → `tasks` → `task_comments`. Ver `supabase/schema.sql`.

- `task_status` es un enum: `backlog`, `in_progress`, `blocked`, `done`
- `task_priority` es un enum: `baja`, `media`, `alta`
- `tasks.assignee` es texto libre, no una llave foránea. El taller no tiene auth.
- `tasks.position` ordena las tarjetas dentro de su columna
- `tasks.source` distingue `manual` de `minuta`
- `tasks` y `task_comments` están en la publicación `supabase_realtime`

## Comandos

```bash
npm run dev      # desarrollo en localhost:3000 (pestaña propia, NO con !)
npm run build    # verificar que compila antes de desplegar
vercel --prod    # desplegar
```

## Contexto del taller

`src/app/page.tsx` es una pantalla de verificación de conexión, no el producto.
Se reemplaza en el paso 2 de `prompts.md`.

En `referencia/agente-minutas/` hay una implementación completa del agente. Es
material de apoyo por si el equipo se atora; no la copies a menos que te lo pidan.
