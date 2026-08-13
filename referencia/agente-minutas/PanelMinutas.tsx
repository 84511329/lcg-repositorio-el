"use client";

/**
 * PANEL DE MINUTAS — implementación de referencia
 *
 * Va en: src/components/PanelMinutas.tsx
 *
 * Lo importante de este componente no es la interfaz: es que las tareas
 * llegan como PROPUESTAS y no se guardan hasta que alguien las aprueba.
 * Ese paso es el argumento del taller. La IA propone, la persona decide.
 */

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { COLUMNAS, type TareaPropuesta } from "@/types/database";

type Props = {
  projectId: string;
  onGuardado?: () => void;
};

export default function PanelMinutas({ projectId, onGuardado }: Props) {
  const [notas, setNotas] = useState("");
  const [propuestas, setPropuestas] = useState<TareaPropuesta[] | null>(null);
  const [aprobadas, setAprobadas] = useState<Set<number>>(new Set());
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analizar() {
    setCargando(true);
    setError(null);
    setPropuestas(null);

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notas }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }

      setPropuestas(data.tareas);
      // Todas vienen aprobadas por default; se destildan las que no sirvan.
      setAprobadas(new Set(data.tareas.map((_: unknown, i: number) => i)));
    } catch {
      setError("No se pudo contactar al servidor.");
    } finally {
      setCargando(false);
    }
  }

  function alternar(i: number) {
    const nuevo = new Set(aprobadas);
    if (nuevo.has(i)) nuevo.delete(i);
    else nuevo.add(i);
    setAprobadas(nuevo);
  }

  async function guardar() {
    if (!propuestas) return;
    setGuardando(true);

    const supabase = createClient();
    const filas = propuestas
      .filter((_, i) => aprobadas.has(i))
      .map((t) => ({ ...t, project_id: projectId, source: "minuta" }));

    const { error: errorInsert } = await supabase.from("tasks").insert(filas);

    setGuardando(false);

    if (errorInsert) {
      setError(errorInsert.message);
      return;
    }

    setPropuestas(null);
    setNotas("");
    onGuardado?.();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Peguen aquí la minuta
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={10}
          placeholder="El texto crudo de la junta, tal como quedó. No hace falta ordenarlo."
          className="mt-1 w-full rounded-lg border border-neutral-300 p-3 text-sm"
        />
      </div>

      <button
        onClick={analizar}
        disabled={cargando || notas.trim().length < 20}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {cargando ? "Leyendo la minuta…" : "Extraer tareas"}
      </button>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      {propuestas && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold">
              {propuestas.length} tareas propuestas
            </h3>
            <p className="text-xs text-neutral-500">
              Destilden lo que no aplique. Nada se guarda hasta que aprueben.
            </p>
          </div>

          {propuestas.length === 0 && (
            <p className="text-sm text-neutral-600">
              No se encontraron tareas accionables en ese texto.
            </p>
          )}

          {propuestas.map((t, i) => (
            <label
              key={i}
              className={`flex gap-3 rounded-lg border p-3 ${
                aprobadas.has(i)
                  ? "border-neutral-300 bg-white"
                  : "border-neutral-200 bg-neutral-50 opacity-50"
              }`}
            >
              <input
                type="checkbox"
                checked={aprobadas.has(i)}
                onChange={() => alternar(i)}
                className="mt-1"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.title}</p>
                {t.description && (
                  <p className="mt-1 text-sm text-neutral-600">{t.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
                  <span className="rounded bg-neutral-100 px-2 py-0.5">
                    {COLUMNAS.find((c) => c.status === t.status)?.label}
                  </span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5">
                    {t.priority}
                  </span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5">
                    {t.assignee ?? "sin responsable"}
                  </span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5">
                    {t.due_date ?? "sin fecha"}
                  </span>
                </div>
              </div>
            </label>
          ))}

          {propuestas.length > 0 && (
            <button
              onClick={guardar}
              disabled={guardando || aprobadas.size === 0}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {guardando
                ? "Guardando…"
                : `Agregar ${aprobadas.size} al tablero`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
