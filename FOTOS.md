# Fotos del catálogo

La regla de oro: **ChatGPT solo arregla el entorno, nunca el mueble.** Es un producto que la gente va a ir a ver a la tienda; si la foto lo “mejora”, se va a sentir engañada. Además, lo que delata a una foto hecha con IA casi siempre está en el mueble: tela demasiado lisa, costuras que desaparecen, patas raras, estampados de cojines deformados.

Usa **el mismo prompt para todas las fotos principales**, para que el catálogo se vea parejo.

---

## Prompt A: foto principal (fondo de estudio crema)

Sube la foto a ChatGPT y pega esto:

```
Edita esta foto de un mueble real para el catálogo de una mueblería. Es un producto que se vende, así que el mueble tiene que quedar EXACTAMENTE igual: misma forma, proporciones, tela, textura, color, costuras, arrugas naturales del tapiz, cojines y sus estampados, patas y acabados. No lo redibujes, no lo "mejores", no lo hagas más simétrico ni más nuevo.

Cambia solo el entorno:
- Reemplaza la pared y el piso por un fondo de estudio fotográfico continuo color crema cálido (aprox. #EFE6DA), liso, sin objetos.
- Conserva el mismo ángulo de cámara y la misma perspectiva de la foto original.
- Luz suave de ventana grande desde la izquierda, como en una sesión de catálogo real. Sombra de contacto suave y natural bajo las patas y la base, coherente con esa luz. Sin halos ni bordes claros alrededor del mueble.
- Corrige el balance de blancos para que los colores de la tela se vean como en persona, sin saturarlos.
- Conserva el grano y la nitidez de una foto de cámara real: no suavices la tela, no le des aspecto de render 3D, no agregues desenfoque artificial ni reflejos en el piso.
- No agregues objetos, plantas, texto, marcas de agua ni logos.
- Formato horizontal 3:2. El mueble completo, centrado, ocupando cerca del 75% del ancho, con aire alrededor.
```

> Sillones individuales, sillas y cuadros: cambia la última línea por `Formato vertical 2:3` o `cuadrado 1:1`.

## Prompt B: foto de ambiente (la misma sala, ordenada)

Para la segunda foto de cada mueble, la que aparece al pasar el mouse. Da contexto sin inventar una casa que no existe:

```
Edita esta foto real de un mueble para el catálogo de una mueblería. El mueble tiene que quedar EXACTAMENTE igual: forma, proporciones, tela, textura, color, costuras, cojines, patas y acabados. No lo redibujes ni lo mejores.

Solo ordena y corrige la escena:
- Quita lo que distrae: refrigeradores, cables, cajas, objetos personales, puertas abiertas y otros muebles cortados en el borde de la foto.
- Endereza las líneas verticales de paredes y puertas.
- Corrige la exposición para que se vea luminosa y natural, con balance de blancos neutro cálido.
- Mantén la pared, el piso y la luz originales; no agregues decoración nueva.
- Debe verse como una foto tomada con buena cámara en un lugar real, no como un render. Conserva el grano natural.
- Formato horizontal 3:2, sin texto ni logos.
```

---

## Cuando ChatGPT cambia el mueble

Pasa seguido: la herramienta vuelve a dibujar toda la imagen. Si el mueble sale distinto:

1. Usa la herramienta de **seleccionar área** (el pincel en la imagen generada), pinta **solo el fondo** y escribe: `Cambia únicamente el área seleccionada por fondo de estudio crema liso, sin tocar el mueble.`
2. O pídele: `Repite la edición, pero el mueble debe quedar idéntico píxel por píxel a la foto original; solo cambia el fondo.`

## Antes de usar una foto, revisa

Compárala lado a lado con la original o con el mueble real:

- [ ] La tela tiene la misma textura (no se ve lisa como plástico).
- [ ] Las costuras, botones y pliegues están donde estaban.
- [ ] Las patas son las mismas en número, forma y color, y tocan el piso con su sombra.
- [ ] Los estampados de los cojines no se deformaron.
- [ ] El color es el real (no más brillante, no más gris).
- [ ] No hay halo claro alrededor del mueble ni letras raras en el fondo.

Si falla cualquiera, no la uses: repite la edición o usa la herramienta de seleccionar área.

---

## Qué fotos tomar (para tener más de una por mueble)

**No le pidas a ChatGPT ángulos que no fotografiaste.** Inventaría la parte de atrás o los costados y el cliente vería algo que no existe. Las fotos extra se toman en la tienda; luego cada una pasa por el Prompt A o B.

Por cada mueble, en este orden:

1. **Principal:** de frente, girado unos 30° (tres cuartos), el mueble completo.
2. **Lado:** de perfil, para que se vea el fondo y la altura.
3. **Tela de cerca:** a un palmo, con luz de lado, para que se vea la textura.
4. **Patas o base:** el acabado de madera o metal.
5. Según el mueble:
   - **Salas:** desde arriba en diagonal, para que se vea la chaise o la forma de la L.
   - **Comedores:** la mesa sola y una silla sola.
   - **Recámaras:** la cabecera de frente.
   - **Cuadros:** colgado completo en una pared lisa, más un acercamiento a la textura. La foto del cuadro dorado de hoy es solo un acercamiento y en el catálogo no se entiende que es un cuadro.

**Cómo tomarlas con el celular:**

- Cámara en **1x**. No uses el gran angular (0.5x): deforma los muebles.
- Celular en **horizontal**, a la altura de la cintura (unos 90 cm del piso), no desde arriba.
- Luz de día, sin flash. Si hay ventana, que quede a un lado del mueble, no detrás.
- Quita lo que estorbe alrededor antes de tomar la foto: así ChatGPT tiene que inventar menos.
- Toma todos los muebles en el mismo rincón de la tienda, siempre que se pueda.

## Guardar y subir

1. Descarga la imagen de ChatGPT.
2. Pásala por [Squoosh.app](https://squoosh.app): formato **WebP**, calidad **80**, lado mayor **1600 px**.
3. Nómbrala sin espacios ni acentos: `sala-gris.webp`, `sala-gris-2.webp`, `sala-gris-3.webp`.
4. Guárdala en `img/productos/` y agrégala a la lista `fotos` del mueble en `data/productos.js`. La primera de la lista es la principal.
