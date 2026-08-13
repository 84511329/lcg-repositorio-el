/**
 * AGENTE DE MINUTAS — implementación de referencia
 *
 * Va en: src/app/api/triage/route.ts
 *
 * Este archivo corre EN EL SERVIDOR. Es el único lugar donde se lee
 * ANTHROPIC_API_KEY. Nunca la lean desde un componente de cliente y nunca
 * le pongan el prefijo NEXT_PUBLIC_: ese prefijo empaqueta la variable en el
 * JavaScript que se descarga al navegador y la llave queda a la vista de
 * cualquiera que abra las herramientas de desarrollo.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { TareaPropuesta } from "@/types/database";

const anthropic = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno

// El prompt es el producto. Aquí es donde se gana o se pierde la demo.
function construirSistema(hoy: string) {
  return `Conviertes minutas de junta en tareas accionables para un tablero de gestión de proyectos.

La fecha de hoy es ${hoy}. Úsala para resolver cualquier referencia temporal relativa.

Respondes ÚNICAMENTE con un array JSON válido. Sin markdown, sin bloques de código, sin explicación, sin texto antes ni después. Si no encuentras ninguna tarea, responde [].

Cada elemento del array:
{
  "title":       string. Máximo 80 caracteres, en imperativo. "Cerrar contrato", no "Se tiene que cerrar el contrato".
  "description": string o null. El contexto que necesita quien la ejecute: qué la detiene, de qué depende, qué se acordó.
  "status":      "backlog" | "in_progress" | "blocked" | "done"
  "priority":    "baja" | "media" | "alta"
  "assignee":    string o null. Solo el nombre propio.
  "due_date":    string "YYYY-MM-DD" o null
}

REGLAS, en orden de importancia:

1. NO INVENTES NADA. Si la minuta no menciona una fecha, due_date es null. Si nadie tomó la tarea, assignee es null. Una tarea sin dueño registrada como tal es información útil; una tarea con un dueño inventado es un error que alguien va a descubrir en la siguiente junta.

2. Solo tareas accionables. Descarta la logística de la junta, los comentarios sociales, los temas que ya se cerraron y las observaciones sin acción asociada.

3. Fechas relativas al día de hoy. "el viernes" es el próximo viernes. "pasado mañana" son dos días. Si la referencia es vaga ("en dos semanas y media más o menos", "en cuanto se libere"), pon null en vez de adivinar: la vaguedad es información y forzarla a una fecha la borra.

4. El estado se deduce del texto. Si algo está detenido esperando a un tercero, es "blocked" y la razón va en la descripción. Si ya se está trabajando, "in_progress". Si se menciona como terminado, "done". Todo lo demás, "backlog".

5. Prioridad alta solo si la minuta lo justifica: hay una fecha cercana, algo más depende de ello, o alguien lo llamó urgente. No pongas todo en alta.

6. Una tarea por acción. Si en una misma frase hay dos compromisos distintos, sepáralos.`;
}

export async function POST(req: Request) {
  try {
    const { notas } = await req.json();

    if (typeof notas !== "string" || notas.trim().length < 20) {
      return NextResponse.json(
        { error: "Peguen el texto de la minuta." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Falta ANTHROPIC_API_KEY. En local va en .env.local; en Vercel, en las variables de entorno del proyecto (y hay que volver a desplegar).",
        },
        { status: 500 }
      );
    }

    const hoy = new Date().toISOString().slice(0, 10);

    const respuesta = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4000,
      system: construirSistema(hoy),
      messages: [{ role: "user", content: notas }],
    });

    const texto = respuesta.content
      .filter((bloque) => bloque.type === "text")
      .map((bloque) => (bloque as { text: string }).text)
      .join("");

    // Cinturón y tirantes: el modelo tiene instrucción de no usar markdown,
    // pero si algún día lo hace, no queremos que reviente el JSON.parse.
    const limpio = texto
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let tareas: TareaPropuesta[];
    try {
      tareas = JSON.parse(limpio);
    } catch {
      console.error("Respuesta no parseable:", limpio.slice(0, 500));
      return NextResponse.json(
        { error: "El modelo no devolvió JSON válido. Vuelvan a intentar." },
        { status: 502 }
      );
    }

    if (!Array.isArray(tareas)) {
      return NextResponse.json(
        { error: "Formato inesperado." },
        { status: 502 }
      );
    }

    return NextResponse.json({ tareas });
  } catch (e) {
    console.error("Error en /api/triage:", e);
    return NextResponse.json(
      { error: "No se pudo procesar la minuta." },
      { status: 500 }
    );
  }
}
