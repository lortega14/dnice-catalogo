# D’Nice Muebles y Decoración — Catálogo web

Sitio estático (HTML, CSS y JavaScript sin dependencias) para mostrar el catálogo de la mueblería. No vende en línea: cada producto lleva a WhatsApp con un mensaje ya escrito.

## Estructura

```
index.html             Página
assets/estilos.css     Estilos
assets/escenario.js    Muestra la foto del producto o su modelo 3D
assets/app.js          Catálogo, filtros y ventana de producto
data/productos.js      ← Datos de la tienda y productos. Lo único que se edita día a día.
img/productos/         Fotos de productos (.webp o .jpg)
img/marca/             Logo, versión sin lema para el encabezado (logo-dnice-encabezado.png) e ícono
FOTOS.md               Cómo tomar y mejorar las fotos (prompts para ChatGPT)
img/compartir.jpg      Imagen que muestran WhatsApp y Facebook al compartir el enlace (1200 × 630)
modelos/               (crear cuando haya) modelos 3D .glb
404.html               Página para enlaces que no existen
robots.txt, sitemap.xml  Para Google
wrangler.jsonc         Configuración de Cloudflare Workers
.assetsignore          Archivos del repositorio que Cloudflare no publica
```

## Probar en tu computadora

Abre `index.html` en el navegador. Para probar modelos 3D, mejor levanta un servidor local:

```
python -m http.server 8000
```

y abre http://localhost:8000

## Publicar (Cloudflare Workers + dominio dnice.com.mx)

El sitio vive en el repositorio `lortega14/dnice-catalogo` de GitHub y Cloudflare lo publica solo cada vez que se sube un cambio a la rama `main`.

Configuración inicial, una sola vez, en el panel de Cloudflare:

1. **Workers & Pages › Create › Workers › Import a repository** y elige `dnice-catalogo`.
2. Deja el nombre `dnice-catalogo`, sin comando de build ni carpeta de salida (el sitio es estático y `wrangler.jsonc` ya indica que se publica la raíz). Guarda y despliega.
3. En el Worker: **Settings › Domains & Routes › Add › Custom domain**, agrega `dnice.com.mx` y `www.dnice.com.mx`. Si el dominio ya está en Cloudflare, los registros DNS y el certificado se crean solos.
4. (Opcional) En **Rules › Redirect Rules**, redirige `www.dnice.com.mx` a `dnice.com.mx` para que todo use una sola dirección.

Para publicar cambios después:

```
git add .
git commit -m "Describe el cambio"
git push
```

En uno o dos minutos el sitio se actualiza. Si se cambia el dominio, actualiza las direcciones `https://dnice.com.mx/` en `index.html` (canonical, og:url, og:image), `robots.txt` y `sitemap.xml`.

## Datos de la tienda

En `data/productos.js`, dentro de `tienda`. Cualquier dato que se deje en `""` (por ejemplo el horario) no aparece en la página.

## Agregar un producto

1. Guarda sus fotos en `img/productos/` con nombres cortos, sin espacios ni acentos: `sala-gris.webp`, `sala-gris-2.webp`, `sala-gris-3.webp`. Antes de subirlas, redúcelas a unos 1600 px de lado para que la página cargue rápido (Squoosh.app lo hace gratis y las convierte a .webp). Cómo tomarlas y mejorarlas: ver `FOTOS.md`.
2. Agrega un bloque en `productos`:
   ```js
   {
     id: "sala-gris",
     nombre: "Sala gris",
     categoria: "salas",
     descripcion: "Sala de tres plazas tapizada en gris.",
     medidas: { frente: 220, fondo: 90, alto: 85 },   // en cm; o texto: "120 cm de diámetro"
     precio: "",                 // vacío muestra "Pregunta por precio"
     fotos: [
       "img/productos/sala-gris.webp",     // principal: la que se ve en el catálogo
       "img/productos/sala-gris-2.webp",   // aparece al pasar el mouse por la tarjeta
       "img/productos/sala-gris-3.webp"
     ],
     encuadre: "center",         // qué parte de la primera foto se ve en la tarjeta
     modelo3d: ""
   },
   ```
3. Sube los cambios: `git add . && git commit -m "Nuevo producto" && git push`.

Con más de una foto, la tarjeta muestra “3 fotos” y la ficha trae miniaturas, flechas, se puede deslizar con el dedo y usar las flechas del teclado.

Las medidas salen en la tarjeta (`220 × 90 × 85 cm`) y en la ficha (`Frente 220 cm · Fondo 90 cm · Alto 85 cm`). Las que se dejen vacías no aparecen.

`destacado: true` lo pone en la portada; si hay varios, la portada los va rotando cada 6 segundos (se detiene si la persona pasa el mouse o elige uno con los puntos). Como el marco de la portada es vertical, `encuadrePortada: "40% 70%"` ajusta qué parte de la foto se ve ahí. Cada producto tiene enlace directo para compartir: `.../#sala-gris`.

## Razones ("Nosotros")

En `data/productos.js`, dentro de `razones`. Cada una lleva `icono` (fabrica, tela, tienda, entrega, pago o garantia), `titulo` y `texto`. Borra la que no aplique.

## Mi lista

Cada mueble tiene un corazón para guardarlo. La lista se guarda en el navegador de la persona y desde la barra “Mi lista” se manda completa por WhatsApp, con el enlace a cada pieza (cuando la página ya está publicada).

## Modelos 3D

Si un producto tiene `modelo3d`, en su ventana aparece primero el modelo, que se puede girar en cualquier dirección y acercar; en el celular trae un botón para verlo en la casa con realidad aumentada. En el catálogo su tarjeta muestra un sello “3D”, y si es el destacado, gira solo en la portada.

Cómo conseguir el `.glb`:

- **Generarlo con IA desde una foto** (Meshy, Tripo, Rodin u otras): se sube la foto, se descarga en formato GLB. Rápido; la parte de atrás la inventa la IA, así que hay que revisarlo antes de publicarlo. Funciona mejor con una foto del mueble completo, de lado en tres cuartos y sin otros muebles encimados.
- **Escanearlo con el celular** (Polycam, KIRI Engine): se graba rodeando el mueble. Más fiel, toma unos minutos por pieza.

Guarda el archivo en `modelos/` y ponlo en el producto: `modelo3d: "modelos/sillon-crema.glb"`. Conviene que cada modelo pese menos de 10 MB (GitHub limita a 100 MB por archivo y 1 GB por sitio).

## Diseño y animaciones

- Paleta tomada del logo: crema `#F4ECE1` y negro. El blanco se usa para la sección del catálogo y el topo `#6B5843` solo para detalles pequeños (números de pasos, categoría en la ficha). Todo está en las variables al inicio de `assets/estilos.css`.
- Íconos: dibujos de trazo en un solo archivo, al inicio de `index.html` (etiqueta `<svg>` con `<symbol>`). Para usar uno: `<svg class="icono"><use href="#i-whatsapp"/></svg>`.
- Tipografías: Bodoni Moda (títulos, mismo estilo de contraste que el logo) y Jost (texto).
- En la ficha, las fotos se muestran completas sobre un paspartú crema (en escritorio); en celular el marco toma la proporción de la primera foto.
- Animaciones: entrada de la portada palabra por palabra, secciones y tarjetas que aparecen al hacer scroll, tarjetas que se reacomodan al filtrar, ficha de producto que se abre con transición (en celular sube desde abajo), cruce suave entre fotos, encabezado que se compacta y botón flotante de WhatsApp en celular.
- Si la persona tiene activado “reducir movimiento” en su teléfono o computadora, la página se muestra sin animaciones.
