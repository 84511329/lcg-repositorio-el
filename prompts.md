# Prompts de construcción

Cópienlos **en orden**, uno a la vez. Esperen a que termine cada uno antes del
siguiente. No los peguen todos juntos.

**Antes de empezar, dos cosas:**

1. **Arranquen Claude en la terminal integrada** (`` Ctrl+` `` o `` Cmd+` ``, luego
   `claude`). Ahí funciona el atajo `!`, que corre comandos sin salir de la
   conversación y le entrega la salida a Claude. En el panel gráfico ese atajo no
   existe.
2. **Modo Plan** (`Shift+Tab` cicla los modos). Claude describe qué va a hacer y
   ustedes aprueban antes de que toque un archivo.

> **Dejen `npm run dev` corriendo en su propia pestaña de terminal.** No lo lancen
> con `!`: es un proceso que no termina y deja la conversación esperando.

---

## 0 · Reconocimiento — arranca el bloque 3

> Modelo: **Opus 5** · Effort: **high** · Modo: **Plan**

```
Lee CLAUDE.md, PRD.md y supabase/schema.sql.

Ese schema.sql es el esquema exacto de mi base de datos en Supabase.

Dame el plan de construcción del tablero, en pasos, sin escribir código todavía.
```

Lean el plan. **Comenten sobre él antes de aprobar** — VS Code lo abre como un
documento editable justo para eso.

---

## 1 · Tipos y conexión

> Modelo: **Sonnet 5** · Effort: **medium** · Modo: **Manual**

```
Genera los tipos de TypeScript a partir del esquema real de Supabase y actualiza
src/types/database.ts si hace falta.

Verifica que src/lib/supabase/client.ts y server.ts estén bien configurados con
@supabase/ssr.
```

---

## 2 · El board

> Modelo: **Sonnet 5** · Effort: **medium**

```
Reemplaza la pantalla de arranque de src/app/page.tsx por el board real.

- Selector de proyecto arriba.
- Cuatro columnas según el enum task_status, con las etiquetas de COLUMNAS.
- Cada tarjeta muestra título, responsable, prioridad y fecha de vencimiento.
- Las tarjetas sin fecha o sin responsable no deben verse rotas.
- Server Component para la carga inicial.
- Estado vacío decente si una columna no tiene nada.
```

---

## 3 · Arrastrar y soltar

> Modelo: **Sonnet 5** · Effort: **high**

```
Agrega drag and drop entre columnas con @dnd-kit.

Al soltar una tarjeta, persiste en Supabase el nuevo status y la nueva position.
Actualiza la interfaz de forma optimista y revierte si la escritura falla.
```

---

## 4 · En vivo

> Modelo: **Sonnet 5** · Effort: **high**

```
Agrega una suscripción realtime a la tabla tasks para que el board se actualice
solo, sin recargar, cuando otra persona mueve o crea una tarjeta.

Limpia la suscripción al desmontar el componente.
```

**Prueben esto abriendo la app en dos ventanas lado a lado.** Es el momento que la
sala recuerda.

---

## 5 · El agente de minutas — arranca el bloque 4

> Modelo: **Sonnet 5** · Effort: **high**

Aquí entra la API key. Primero, desde la conversación:

```
!npm i @anthropic-ai/sdk
```

Agreguen `ANTHROPIC_API_KEY=` a su `.env.local` con la llave que les dio el
facilitador, y **reinicien `npm run dev`** (Next no relee el archivo en caliente).

Luego:

```
Crea un Route Handler en src/app/api/triage/route.ts que reciba el texto de una
minuta y devuelva tareas estructuradas usando la API de Anthropic con el modelo
claude-sonnet-5.

Requisitos innegociables:
- La ANTHROPIC_API_KEY se lee SOLO del entorno, dentro del Route Handler.
- Nunca con prefijo NEXT_PUBLIC_, nunca en código de cliente.
- El modelo debe responder solo con un array JSON, sin markdown.
- Cada tarea: title, description, status, priority, assignee, due_date.
- Instruye al modelo a NO inventar fechas ni responsables: si no están en el
  texto, van en null.
- Pásale la fecha de hoy en el system prompt para que resuelva "el viernes",
  "pasado mañana" y similares.
- Maneja el error de JSON inválido sin tumbar el servidor.

Después crea src/components/PanelMinutas.tsx: un textarea donde se pega la minuta,
un botón que llama al endpoint, y la lista de tareas propuestas con un checkbox
cada una. Solo se insertan en Supabase las que el usuario deje palomeadas.
```

> Si se atoran, en `referencia/agente-minutas/` está la implementación completa.
> Cópienla, pero **lean el system prompt** — ahí está el trabajo de verdad.

---

## 6 · Su diferenciador

> Modelo: **Sonnet 5** · Effort: **high**

Cada equipo elige **uno distinto**. Esto es lo que hace que las seis demos no sean
la misma. Escríbanlo ustedes, en sus palabras:

```
Agrega [lo que definieron en el PRD].
```

Ideas si no se deciden:
- Vista de línea de tiempo por fecha de vencimiento
- Dashboard de carga: cuántas tareas trae cada persona
- Alertas de las tareas vencidas o que vencen esta semana
- Comentarios dentro de la tarjeta, usando la tabla `task_comments`
- Filtros guardados por responsable, área o prioridad
- Botón de resumen ejecutivo: la API lee el board y redacta el update de la junta

---

## 7 · Revisión

> Modelo: **Sonnet 5** · Effort: **medium**

```
Revisa el proyecto antes de desplegar:
- errores en consola
- estados de carga y estados vacíos
- que se vea bien en una pantalla angosta
- que no haya llaves ni secretos escritos en el código
```

Verifiquen que compila y déjenle el resultado a Claude:

```
!npm run build
```

Y luego:

```
/code-review high
```

---

## 8 · Desplegar — bloque 5

Esto **no** va dentro de Claude. Abre una **tercera pestaña de terminal** y escribe:

```
npm i -g vercel
vercel login
vercel link
```

Luego ve a vercel.com, entra a tu proyecto -> `Settings` -> `Environment Variables`
y agrega las tres llaves de tu `.env.local`, marcadas en los tres entornos.

Y hasta entonces:

```
vercel --prod
```

Te devuelve tu URL. Si cambias algo después, el mismo comando la actualiza.

---

## Si algo se rompe

| Antes de | Hagan |
|---|---|
| Empezar de cero | `/rewind` — regresa el código a un punto anterior |
| Repetir el mismo prompt por tercera vez | Cambien a **Opus 5** con effort `xhigh` |
| Seguir en una conversación de dos horas | `/clear` entre un prompt y otro |
| Levantar la mano | Cinco minutos. Ni uno más. |

## El atajo `!`

Corre un comando de terminal sin salir de la conversación, y Claude ve la salida.
Se acabó el copiar y pegar errores.

```
!npm run build          # ¿compila?
```

Solo funciona con Claude corriendo en la terminal, no en el panel gráfico.
