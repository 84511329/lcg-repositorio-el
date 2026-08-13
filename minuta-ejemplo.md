# Minuta de ejemplo — para la demo en vivo

Copien el bloque de abajo y péguenlo en el agente de minutas.

Está escrito a propósito como se escriben las minutas de verdad: desordenado, con
comentarios que no son tareas, fechas dichas de tres formas distintas, responsables
mencionados a media frase y dos temas que quedaron sin dueño. Si el agente lo
resuelve bien, resuelve las minutas reales de la sala.

---

## Bloque para pegar

```
Junta de seguimiento — comité de dirección
Martes, sala 3. Asistieron Mariana, Ricardo, Sofía, Jorge, Ana y Daniel. Paola se
conectó tarde por videollamada.

Arrancamos con el tema de la sucursal. Mariana comentó que el contrato de
arrendamiento sigue sin firmarse porque el representante legal anduvo de viaje toda
la semana, ya regresó y queda de firmarlo a más tardar el viernes. Lo de la licencia
de uso de suelo sigue atorado, el municipio nos salió con que necesitan un estudio de
impacto vial. Mariana ya pidió dos cotizaciones a peritos externos pero necesitamos
que alguien de finanzas apruebe el gasto extra, quedamos que Jorge lo revisa esta
semana y nos dice si sale del presupuesto de apertura o de dónde.

Ricardo trae el tema de plantilla. Son nueve posiciones y ya tiene los perfiles pero
falta que Finanzas valide el presupuesto. Se comprometió a mandar el desglose el
lunes. También mencionó que va a reutilizar el material de capacitación de Cumbres
para no empezar de cero, eso lo tiene contemplado para dos semanas antes de la
apertura.

Alguien preguntó cómo nos fue con el estudio de mercado, ya se presentó al comité
hace como tres semanas y quedó cerrado, no hay nada pendiente ahí.

Café y galletas estuvieron mejor que la vez pasada.

Pasamos a cobranza. Jorge ya terminó de mapear el proceso completo. Lo que sigue es
segmentar la cartera por antigüedad, dice que el jueves lo tiene. Sofía sigue
detenida con lo de los recordatorios automáticos porque Legal no ha aprobado el
texto, ella se los manda el lunes pero no depende de nosotros que lo aprueben. Sofía
también va a arrancar las negociaciones con los cinco clientes más atrasados, sin
fecha definida todavía, dijo que en cuanto salga lo de la segmentación.

Salió el tema del tablero de seguimiento. Todos estuvimos de acuerdo en que hace
falta pero nadie lo tomó. Lo dejamos apuntado.

Ana cerró con el plan comercial. Las metas por región ya están casi todas menos
Bajío, que se lo pidió al regional y le queda de contestar pasado mañana. Daniel no
puede avanzar con el esquema de comisiones hasta que eso cierre. Ana también dijo,
medio en broma medio en serio, que el material de ventas sigue con los precios del
año pasado y que eso ya es urgente porque los vendedores están cotizando mal.

Última cosa: hay que meter a los tres vendedores nuevos a la capacitación de
producto. Daniel dijo que él la agenda para dentro de dos semanas y media más o
menos.

Siguiente junta en 15 días, misma hora.
```

---

## Qué debe pasar en la demo

El agente debería sacar entre 8 y 12 tareas de ahí. Cuando la salga la lista,
proyéctela y haga notar estas cinco cosas — es donde está el aprendizaje:

**1. Descartó lo que no era tarea.** Las galletas, la sala, la fecha de la próxima
junta y el estudio de mercado que ya cerró no deberían aparecer.

**2. Resolvió fechas relativas.** "a más tardar el viernes", "el lunes", "el jueves"
y "pasado mañana" tienen que salir como fechas reales. "Dos semanas y media más o
menos" es la difícil: vean qué hace.

**3. No inventó lo que no estaba.** Las negociaciones de Sofía y el tablero de
seguimiento no tienen fecha en la minuta. Deben salir con `due_date` nulo. **Si el
agente les puso fecha, el prompt está mal y hay que corregirlo en vivo** — ese es el
mejor momento de enseñanza de todo el taller.

**4. Detectó al responsable aunque estuviera a media frase.** "quedamos que Jorge lo
revisa" tiene que salir con Jorge como responsable.

**5. Encontró la tarea huérfana.** El tablero de seguimiento no lo tomó nadie. Debe
salir sin responsable, no asignado a quien lo mencionó.

## Cómo cerrar la demo

Pregunte a la sala: *"¿cuántas de estas se les habrían perdido?"*

Luego señale el paso de revisión: las tareas están **propuestas**, no guardadas.
Alguien tiene que aprobarlas. Esa es la arquitectura que quieren llevarse a sus
áreas — la IA propone, la persona decide.
