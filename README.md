# PM Tool — repo semilla del taller

Tu punto de partida. Tú le pones encima el producto.

---

## Arranque

### 1. Abre la carpeta en VS Code
`File` -> `Open Folder` -> esta carpeta.
Cuando pregunte si confías en los autores: **sí**.

### 2. Crea tu proyecto en Supabase
supabase.com -> **New project** -> nómbralo `taller-tunombre`.
**Guarda la contraseña.**

### 3. Carga el esquema
Supabase -> **SQL Editor** -> pega **todo** `supabase/schema.sql` -> **Run**

Debe devolver un conteo con tus proyectos y tareas.
**Si no ves datos, no avances.**

### 4. Conecta tu app
Supabase -> `Settings` -> `API` -> copia **Project URL** y **anon public key**.

En VS Code, abre el archivo **`.env.local`** (ya está en la carpeta) y pega los dos
valores. Guarda con `Ctrl+S`.

### 5. Arranca

Terminal de VS Code (`Ctrl` + tecla de acento grave):

```
npm install
npm run dev
```

Abre `localhost:3000`. Debes ver **"Conexión correcta"** en verde.

**Deja esa pestaña corriendo todo el día. No escribas nada más ahí.**

### 6. Abre Claude

Segunda pestaña de terminal (`Ctrl` + `Shift` + acento grave):

```
claude
```

Ya estás listo. Abre `prompts.md` y sigue los pasos en orden.

---

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `prompts.md` | **Los prompts de construcción, en orden.** Tu guion del día |
| `CLAUDE.md` | El contexto que lee Claude Code |
| `.env.local` | Tus llaves. Ya está creado, solo llénalo |
| `supabase/schema.sql` | El esquema con datos de ejemplo |
| `supabase/minuta-ejemplo.md` | Minuta de prueba para el agente del bloque 4 |
| `referencia/agente-minutas/` | El agente ya resuelto, por si te atoras |
| `src/app/page.tsx` | Pantalla de verificación. **Se reemplaza en el bloque 3** |

---

## Si algo falla

| Sale esto | Qué pasó |
|---|---|
| `next` no se reconoce | Falta `npm install`. Y es `npm run dev`, no `next dev` |
| `claude` no se reconoce | Cierra VS Code completo y vuelve a abrirlo |
| Pantalla roja de conexión | Falta llenar `.env.local`, o no reiniciaste `npm run dev` |
| La conversación se colgó | Lanzaste `npm run dev` con `!`. Presiona `Ctrl` + `C` |
| Rompiste tu app | `/rewind` **antes** de empezar de cero |

**Regla del día: nadie se atora solo más de cinco minutos.**
