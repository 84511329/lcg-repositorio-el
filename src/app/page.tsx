import { createClient } from "@/lib/supabase/server";
import { COLUMNAS, type Project, type Task } from "@/types/database";

/**
 * PANTALLA DE ARRANQUE — no es el producto final.
 *
 * Solo comprueba que la conexión a Supabase funciona y que los datos dummy
 * están cargados. A partir de aquí ustedes construyen el board con Claude Code.
 *
 * Si ven las tareas listadas abajo, tienen todo lo que necesitan para empezar.
 */
export default async function Home() {
  const supabase = await createClient();

  const { data: projects, error: errProjects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at");

  const { data: tasks, error: errTasks } = await supabase
    .from("tasks")
    .select("*")
    .order("position");

  const error = errProjects ?? errTasks;

  if (error) {
    return (
      <main className="mx-auto max-w-2xl p-10">
        <h1 className="text-2xl font-bold text-red-700">
          No se pudo conectar a Supabase
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          Revisen, en este orden:
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-neutral-700">
          <li>
            Que exista <code className="rounded bg-neutral-100 px-1">.env.local</code>{" "}
            con las dos variables de{" "}
            <code className="rounded bg-neutral-100 px-1">.env.local.example</code>
          </li>
          <li>Que hayan corrido <code className="rounded bg-neutral-100 px-1">schema.sql</code> en el SQL Editor</li>
          <li>
            Que reiniciaran <code className="rounded bg-neutral-100 px-1">npm run dev</code>{" "}
            después de crear el archivo
          </li>
        </ol>
        <pre className="mt-5 overflow-x-auto rounded bg-neutral-900 p-4 text-xs text-neutral-100">
          {error.message}
        </pre>
      </main>
    );
  }

  const proyectos = (projects ?? []) as Project[];
  const tareas = (tasks ?? []) as Task[];

  return (
    <main className="mx-auto max-w-4xl p-10">
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="font-semibold text-green-900">Conexión correcta</p>
        <p className="mt-1 text-sm text-green-800">
          {proyectos.length} proyectos y {tareas.length} tareas cargadas desde Supabase.
          Ya pueden empezar a construir.
        </p>
      </div>

      <h1 className="mt-10 text-3xl font-bold">Punto de partida</h1>
      <p className="mt-2 text-neutral-600">
        Esta pantalla existe solo para comprobar la conexión. El board lo construyen
        ustedes: abran Claude Code y sigan los prompts de{" "}
        <code className="rounded bg-neutral-100 px-1 text-sm">prompts.md</code>.
      </p>

      <div className="mt-10 space-y-8">
        {proyectos.map((p) => (
          <section key={p.id}>
            <h2 className="text-xl font-semibold">{p.name}</h2>
            {p.area && (
              <p className="text-sm text-neutral-500">{p.area}</p>
            )}
            <ul className="mt-3 space-y-1">
              {tareas
                .filter((t) => t.project_id === p.id)
                .map((t) => (
                  <li
                    key={t.id}
                    className="flex items-baseline justify-between gap-4 border-b border-neutral-100 py-2 text-sm"
                  >
                    <span>{t.title}</span>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {COLUMNAS.find((c) => c.status === t.status)?.label}
                      {t.assignee ? ` · ${t.assignee}` : ""}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
