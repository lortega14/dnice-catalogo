/*
  CATÁLOGO DE D'NICE
  ------------------
  Este es el único archivo que hay que editar para cambiar productos o datos de la tienda.

  Cada producto lleva:
    fotos:     lista de fotos. La primera es la que se ve en el catálogo; la segunda aparece
               al pasar el mouse por la tarjeta. Ej.:
                 fotos: [
                   "img/productos/sala-gris.webp",          ← de frente (principal)
                   "img/productos/sala-gris-2.webp",        ← de lado, tres cuartos
                   "img/productos/sala-gris-3.webp"         ← detalle de tela o patas
                 ]
    medidas:   en centímetros. Se llenan las que apliquen; las vacías no aparecen.
                 medidas: { frente: 280, fondo: 160, alto: 85 }
               Para piezas redondas u otras se puede escribir texto libre:
                 medidas: "120 cm de diámetro"
    encuadre:  (opcional) qué parte de la primera foto se ve en la tarjeta cuadrada.
               "center" por defecto. Ej.: "center 70%" baja el encuadre, "30% center" lo mueve a la izquierda.
    encuadrePortada: (opcional) lo mismo, pero para la foto grande de la portada (que es vertical).
    modelo3d:  (opcional) archivo .glb para girar el mueble en 3D. Ej.: "modelos/sillon-crema.glb"
    destacado: (opcional) true para mostrarlo en la portada. Si hay varios, la portada los va rotando.

  Deja un dato en "" para que no aparezca.
*/

window.CATALOGO = {
  tienda: {
    nombre: "D’Nice Muebles y Decoración",
    // WhatsApp con lada de país (52) y sin espacios
    whatsapp: "524446706813",
    whatsappVisible: "444 670 6813",
    // Vacío a propósito: las llamadas entran al mismo número de WhatsApp.
    telefono: "",
    correo: "denisse.gm@hotmail.com",
    // Dirección y mapa vacíos a propósito: la tienda prefiere no publicar la dirección.
    direccion: "",
    // \n hace un salto de renglón
    horario: "Lunes a viernes: 11 a.m. a 1 p.m. y 4:30 a 6 p.m.\nSábados: 10 a.m. a 1 p.m.",
    mapa: "",
    facebook: "https://www.facebook.com/dnicemuebles",
    instagram: "https://www.instagram.com/dnice.muebles/"
  },

  // Razones para comprar en D'Nice (sección "Nosotros").
  // icono: fabrica, tela, tienda, entrega, pago o garantia. Borra el bloque que no aplique.
  razones: [
    { icono: "fabrica", titulo: "Fábrica propia", texto: "Hacemos nuestros muebles aquí en San Luis Potosí y te los vendemos directo, sin intermediarios." },
    { icono: "tienda", titulo: "Pruébalo antes", texto: "Ven a la tienda, siéntate en la sala y revisa los acabados con calma antes de decidir." },
    // CONFIRMAR con la tienda los cuatro siguientes antes de publicar:
    { icono: "tela", titulo: "Tela, color y medida", texto: "Muchas piezas se pueden hacer en otra tela, color o medida para que queden en tu espacio." },
    { icono: "entrega", titulo: "Entrega a domicilio", texto: "Llevamos tu mueble hasta tu casa. Pregúntanos el costo a tu colonia." },
    { icono: "pago", titulo: "Formas de pago", texto: "Efectivo, transferencia y tarjeta. Pregunta por apartado con anticipo." },
    { icono: "garantia", titulo: "Garantía", texto: "Respaldamos la estructura y el tapizado de cada mueble que fabricamos." }
  ],

  // icono: sala, recamara, comedor, sillon o cuadro (los dibujos están al inicio de index.html)
  categorias: [
    { id: "salas", nombre: "Salas", icono: "sala" },
    { id: "recamaras", nombre: "Recámaras", icono: "recamara" },
    { id: "comedores", nombre: "Comedores", icono: "comedor" },
    { id: "sillones", nombre: "Sillones", icono: "sillon" },
    { id: "decoracion", nombre: "Decoración", icono: "cuadro" }
  ],

  productos: [
    {
      id: "sala-velmonte-escuadra",
      nombre: "Sala Velmonte en escuadra",
      categoria: "salas",
      descripcion: "Sala en escuadra con brazos anchos y rectos, asientos amplios y cojines de respaldo sueltos. Tapizada en tela color hueso, con patas oscuras.",
      medidas: "300 × 300 cm en escuadra",
      precio: "",
      fotos: ["img/productos/sala-velmonte-escuadra.webp"],
      encuadre: "center",
      modelo3d: ""
    },
    {
      id: "sala-esquinera-gris",
      nombre: "Sala esquinera gris perla",
      categoria: "salas",
      descripcion: "Sala en L con chaise amplia, tapizado gris perla y base de madera con patas metálicas.",
      medidas: { frente: "", fondo: "", alto: "" },
      precio: "",
      fotos: ["img/productos/sala-esquinera-gris.webp"],
      encuadre: "center",
      modelo3d: ""
    },
    {
      id: "sillon-individual-crema",
      nombre: "Sillón ocasional crema",
      categoria: "sillones",
      descripcion: "Respaldo envolvente tapizado en tela texturizada color crema, con estructura y patas de metal negro.",
      medidas: { frente: "", fondo: "", alto: "" },
      precio: "",
      destacado: true,
      fotos: ["img/productos/sillon-individual-crema.webp"],
      encuadre: "center",
      modelo3d: ""
    },
    {
      id: "sillon-mecedor-gris",
      nombre: "Sillón mecedor gris",
      categoria: "sillones",
      descripcion: "Sillón mecedor tapizado en tela aterciopelada gris, con brazos redondeados y balancines de madera clara.",
      medidas: { frente: "", fondo: "", alto: "" },
      precio: "",
      destacado: true,
      fotos: ["img/productos/sillon-mecedor-gris.webp"],
      encuadre: "center",
      modelo3d: ""
    },
    {
      id: "sala-esquinera-chocolate",
      nombre: "Sala esquinera chocolate",
      categoria: "salas",
      descripcion: "Sala en L con chaise, tapizada en color chocolate. Incluye cojines decorativos.",
      medidas: { frente: "", fondo: "", alto: "" },
      precio: "",
      fotos: ["img/productos/sala-esquinera-chocolate.webp"],
      encuadre: "center",
      modelo3d: ""
    },
    {
      id: "comedor-ovalado",
      nombre: "Comedor ovalado",
      categoria: "comedores",
      descripcion: "Mesa ovalada en madera tono nogal con sillas de respaldo curvo tapizadas en crema.",
      medidas: { frente: "", fondo: "", alto: "" },
      precio: "",
      fotos: ["img/productos/comedor-ovalado.webp"],
      encuadre: "center",
      modelo3d: ""
    },
    {
      id: "cuadro-abstracto-dorado",
      nombre: "Cuadro abstracto dorado",
      categoria: "decoracion",
      descripcion: "Cuadro con textura en tonos dorado, blanco y café, con marco negro y filo dorado.",
      medidas: { frente: "", alto: "" },
      precio: "",
      fotos: ["img/productos/cuadro-abstracto-dorado.webp"],
      encuadre: "center",
      modelo3d: ""
    }
  ]
};
