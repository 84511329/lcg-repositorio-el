-- ============================================================
--  PM TOOL — Esquema base del taller
--  Pegar completo en el SQL Editor de Supabase y correr una vez.
--  Idempotente: se puede volver a correr sin romper nada.
-- ============================================================

-- Limpieza (por si se corre dos veces)
drop table if exists task_comments cascade;
drop table if exists tasks cascade;
drop table if exists projects cascade;
drop type if exists task_status cascade;
drop type if exists task_priority cascade;

-- ------------------------------------------------------------
-- Tipos
-- ------------------------------------------------------------
create type task_status as enum ('backlog', 'in_progress', 'blocked', 'done');
create type task_priority as enum ('baja', 'media', 'alta');

-- ------------------------------------------------------------
-- Tablas
-- ------------------------------------------------------------
create table projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  area        text,                         -- Comercial, Operaciones, Finanzas...
  created_at  timestamptz not null default now()
);

create table tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  title       text not null,
  description text,
  status      task_status   not null default 'backlog',
  priority    task_priority not null default 'media',
  assignee    text,                         -- nombre libre; sin auth para el taller
  due_date    date,
  position    int not null default 0,       -- orden dentro de su columna
  source      text,                         -- 'manual' | 'minuta' — de dónde salió
  created_at  timestamptz not null default now()
);

create table task_comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references tasks(id) on delete cascade,
  author     text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

create index tasks_project_status_idx on tasks (project_id, status, position);
create index comments_task_idx on task_comments (task_id);

-- ------------------------------------------------------------
-- RLS
--  ADVERTENCIA: políticas abiertas, diseñadas para un taller de
--  4 horas sin autenticación. NO usar así en producción.
-- ------------------------------------------------------------
alter table projects      enable row level security;
alter table tasks         enable row level security;
alter table task_comments enable row level security;

create policy "taller: lectura abierta projects"  on projects      for select using (true);
create policy "taller: escritura abierta projects" on projects     for all    using (true) with check (true);
create policy "taller: lectura abierta tasks"     on tasks         for select using (true);
create policy "taller: escritura abierta tasks"   on tasks         for all    using (true) with check (true);
create policy "taller: lectura abierta comments"  on task_comments for select using (true);
create policy "taller: escritura abierta comments" on task_comments for all   using (true) with check (true);

-- ------------------------------------------------------------
-- Realtime — esto es lo que hace la herramienta "en vivo"
-- ------------------------------------------------------------
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table task_comments;

-- ============================================================
--  DATOS DUMMY
--  Un board vacío no demuestra nada. Esto arranca con contenido.
-- ============================================================

insert into projects (id, name, description, area) values
  ('11111111-1111-1111-1111-111111111111',
   'Apertura sucursal Valle Oriente',
   'Todo lo necesario para abrir la sucursal en el primer trimestre.',
   'Operaciones'),
  ('22222222-2222-2222-2222-222222222222',
   'Rediseño del proceso de cobranza',
   'Reducir los días de cartera vencida de 62 a 45.',
   'Finanzas'),
  ('33333333-3333-3333-3333-333333333333',
   'Plan comercial H2',
   'Estrategia y ejecución del segundo semestre.',
   'Comercial');

insert into tasks (project_id, title, description, status, priority, assignee, due_date, position, source) values
  -- Apertura sucursal
  ('11111111-1111-1111-1111-111111111111', 'Cerrar contrato de arrendamiento',
   'Falta la firma del representante legal. Ya está revisado por jurídico.',
   'in_progress', 'alta', 'Mariana Lozano', current_date + 5,  0, 'manual'),
  ('11111111-1111-1111-1111-111111111111', 'Definir plantilla de personal',
   'Nueve posiciones. Falta validar el presupuesto con Finanzas.',
   'in_progress', 'alta', 'Ricardo Sáenz', current_date + 12, 1, 'manual'),
  ('11111111-1111-1111-1111-111111111111', 'Licencia de uso de suelo',
   'Detenido: el municipio pide un estudio de impacto vial que no teníamos contemplado.',
   'blocked', 'alta', 'Mariana Lozano', current_date - 3, 0, 'manual'),
  ('11111111-1111-1111-1111-111111111111', 'Cotizar mobiliario',
   'Tres proveedores. Comparar contra el estándar de las otras sucursales.',
   'backlog', 'media', 'Paola Rentería', current_date + 20, 0, 'manual'),
  ('11111111-1111-1111-1111-111111111111', 'Plan de capacitación de apertura',
   'Dos semanas antes de abrir. Reutilizar el material de Cumbres.',
   'backlog', 'media', 'Ricardo Sáenz', current_date + 30, 1, 'manual'),
  ('11111111-1111-1111-1111-111111111111', 'Estudio de mercado de la zona',
   'Entregado y presentado al comité.',
   'done', 'media', 'Paola Rentería', current_date - 18, 0, 'manual'),

  -- Cobranza
  ('22222222-2222-2222-2222-222222222222', 'Mapear el proceso actual punto por punto',
   'Desde la emisión de la factura hasta la aplicación del pago.',
   'done', 'alta', 'Jorge Villarreal', current_date - 10, 0, 'manual'),
  ('22222222-2222-2222-2222-222222222222', 'Segmentar cartera por antigüedad',
   'Tres cortes: 0-30, 31-60, 61+. Identificar los 20 clientes que concentran el problema.',
   'in_progress', 'alta', 'Jorge Villarreal', current_date + 4, 0, 'manual'),
  ('22222222-2222-2222-2222-222222222222', 'Definir política de recordatorios automáticos',
   'Necesita aprobación de Legal antes de mandar cualquier comunicación.',
   'blocked', 'media', 'Sofía Cantú', current_date + 8, 0, 'manual'),
  ('22222222-2222-2222-2222-222222222222', 'Negociar convenios con los 5 clientes más atrasados',
   NULL,
   'backlog', 'alta', 'Sofía Cantú', current_date + 15, 0, 'manual'),
  ('22222222-2222-2222-2222-222222222222', 'Tablero de seguimiento semanal',
   'Que lo pueda ver el comité sin pedirle nada a Sistemas.',
   'backlog', 'media', NULL, NULL, 1, 'manual'),

  -- Plan comercial
  ('33333333-3333-3333-3333-333333333333', 'Revisar cumplimiento de metas del H1',
   'Por región y por vendedor. Identificar qué explicó la diferencia.',
   'done', 'alta', 'Ana Gutiérrez', current_date - 22, 0, 'manual'),
  ('33333333-3333-3333-3333-333333333333', 'Definir metas por región para H2',
   'Pendiente el número de Bajío. El resto ya está cerrado.',
   'in_progress', 'alta', 'Ana Gutiérrez', current_date + 2, 0, 'manual'),
  ('33333333-3333-3333-3333-333333333333', 'Rediseñar el esquema de comisiones',
   'Detenido hasta que se cierren las metas.',
   'blocked', 'media', 'Daniel Ochoa', current_date + 10, 0, 'manual'),
  ('33333333-3333-3333-3333-333333333333', 'Plan de contenidos para el lanzamiento',
   NULL,
   'backlog', 'baja', 'Daniel Ochoa', current_date + 25, 0, 'manual'),
  ('33333333-3333-3333-3333-333333333333', 'Capacitación de producto para el equipo',
   'Media jornada. Incluir a los tres vendedores nuevos.',
   'backlog', 'media', NULL, current_date + 18, 1, 'manual'),
  ('33333333-3333-3333-3333-333333333333', 'Actualizar el material de ventas',
   'Las láminas siguen con precios del año pasado.',
   'backlog', 'baja', 'Ana Gutiérrez', NULL, 2, 'manual');

insert into task_comments (task_id, author, body)
select id, 'Mariana Lozano',
       'El municipio confirmó que el estudio lo puede hacer un perito externo. Ya pedí dos cotizaciones.'
from tasks where title = 'Licencia de uso de suelo';

insert into task_comments (task_id, author, body)
select id, 'Sofía Cantú',
       'Legal pidió revisar el texto de los recordatorios antes de aprobar. Se los mando el lunes.'
from tasks where title = 'Definir política de recordatorios automáticos';

-- ============================================================
--  Verificación: deben salir 3 proyectos y 17 tareas
-- ============================================================
select
  (select count(*) from projects)      as proyectos,
  (select count(*) from tasks)         as tareas,
  (select count(*) from task_comments) as comentarios;
