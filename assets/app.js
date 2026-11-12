(function () {
  var datos = window.CATALOGO;
  var tienda = datos.tienda;
  var productos = datos.productos;
  var categorias = datos.categorias;
  var razones = datos.razones || [];
  var raiz = document.documentElement;
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, base) { return (base || document).querySelector(sel); }
  function $$(sel, base) { return Array.prototype.slice.call((base || document).querySelectorAll(sel)); }
  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  }
  function icono(nombre, clase) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icono" + (clase ? " " + clase : ""));
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + nombre);
    svg.appendChild(use);
    return svg;
  }
  function externo(a, url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  function nombreCategoria(id) {
    for (var i = 0; i < categorias.length; i++) if (categorias[i].id === id) return categorias[i].nombre;
    return "";
  }
  function porId(id) { return productos.filter(function (x) { return x.id === id; })[0]; }
  function fotos(p) { return (p.fotos || []).filter(Boolean); }

  /* Enlace directo a un producto (solo si la página está publicada, no abierta como archivo) */
  function enlaceProducto(p) {
    if (!/^https?:$/.test(location.protocol)) return "";
    return location.origin + location.pathname + "#" + p.id;
  }
  function enlaceWhatsApp(mensaje) {
    return "https://wa.me/" + String(tienda.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(mensaje);
  }
  function mensajeProducto(p) {
    var url = enlaceProducto(p);
    return "Hola, vi en su catálogo: " + p.nombre + (url ? " (" + url + ")" : "") + ". ¿Me pueden dar precio, medidas y disponibilidad?";
  }

  /* Medidas: { frente, fondo, alto } en cm, o texto libre */
  function medidas(p) {
    var m = p.medidas;
    if (!m) return { larga: "", corta: "" };
    if (typeof m === "string") return { larga: m, corta: m };
    var partes = [["Frente", m.frente], ["Fondo", m.fondo], ["Alto", m.alto]].filter(function (x) {
      return x[1] !== "" && x[1] != null;
    });
    if (!partes.length) return { larga: "", corta: "" };
    return {
      larga: partes.map(function (x) { return x[0] + " " + x[1] + " cm"; }).join(" · "),
      corta: partes.length === 1 ? partes[0][0] + " " + partes[0][1] + " cm" : partes.map(function (x) { return x[1]; }).join(" × ") + " cm"
    };
  }

  /* Aviso breve en pantalla ("Enlace copiado", etc.) */
  var aviso = $("#aviso"), avisoTiempo = null;
  function avisar(texto) {
    aviso.textContent = texto;
    aviso.classList.add("aviso--visible");
    clearTimeout(avisoTiempo);
    avisoTiempo = setTimeout(function () { aviso.classList.remove("aviso--visible"); }, 2400);
  }

  /* ---------- Entrada de la portada ---------- */
  function arrancar() { raiz.classList.add("cargado"); }
  if (reducirMovimiento) arrancar();
  else if (document.fonts && document.fonts.ready) {
    // Espera a que carguen las fuentes (máximo medio segundo) para que el título no cambie a media animación
    Promise.race([document.fonts.ready, new Promise(function (ok) { setTimeout(ok, 500); })]).then(function () {
      requestAnimationFrame(arrancar);
    });
  } else arrancar();

  /* ---------- Revelado al hacer scroll ---------- */
  var observador = null;
  if ("IntersectionObserver" in window && !reducirMovimiento) {
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }
  function revelar(nodo) {
    if (observador) observador.observe(nodo); else nodo.classList.add("visible");
  }
  $$(".revelar").forEach(revelar);

  /* ---------- Datos de la tienda ---------- */
  $$("[data-whatsapp]").forEach(function (a) { externo(a, enlaceWhatsApp("Hola, vi su catálogo en línea y quiero información.")); });
  $$("[data-red]").forEach(function (a) {
    var url = tienda[a.getAttribute("data-red")];
    if (url) externo(a, url); else a.hidden = true;
  });
  $$("[data-fila]").forEach(function (fila) { if (!tienda[fila.getAttribute("data-fila")]) fila.hidden = true; });
  $$("[data-dato]").forEach(function (dd) { dd.textContent = tienda[dd.getAttribute("data-dato")] || ""; });
  $$("[data-correo]").forEach(function (a) { a.href = "mailto:" + tienda.correo; a.textContent = tienda.correo; });
  $$("[data-llamar]").forEach(function (a) { a.href = "tel:+" + tienda.whatsapp; a.textContent = tienda.whatsappVisible; });
  $("#anio").textContent = new Date().getFullYear();

  /* Categorías de la portada: solo las que tienen productos */
  var conProductos = categorias.filter(function (c) {
    return productos.some(function (p) { return p.categoria === c.id; });
  });
  if (conProductos.length) {
    var nombres = conProductos.map(function (c, i) { return i ? c.nombre.toLowerCase() : c.nombre; });
    $("#portada-categorias").textContent = nombres.length > 1
      ? nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1]
      : nombres[0];
  }

  /* ---------- Encabezado: se compacta al bajar y menú en celular ---------- */
  var encabezado = $("#encabezado");
  var botonMenu = $("#boton-menu");
  var menu = $("#menu-principal");
  function alHacerScroll() { encabezado.classList.toggle("encabezado--compacto", window.scrollY > 12); }
  window.addEventListener("scroll", alHacerScroll, { passive: true });
  alHacerScroll();

  function abrirMenu(abrir) {
    botonMenu.setAttribute("aria-expanded", String(abrir));
    menu.classList.toggle("encabezado__nav--abierto", abrir);
  }
  botonMenu.addEventListener("click", function () { abrirMenu(botonMenu.getAttribute("aria-expanded") !== "true"); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { abrirMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && botonMenu.getAttribute("aria-expanded") === "true") { abrirMenu(false); botonMenu.focus(); }
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", function (m) { if (m.matches) abrirMenu(false); });

  /* ---------- WhatsApp flotante: aparece al pasar la portada ---------- */
  var flotante = $("#wa-flotante");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      flotante.classList.toggle("wa-flotante--visible", !e[0].isIntersecting);
    }).observe($(".portada"));
    new IntersectionObserver(function (e) {
      // se oculta al llegar a la sección de contacto, que ya tiene sus botones
      if (e[0].isIntersecting) flotante.classList.remove("wa-flotante--visible");
    }, { threshold: 0.2 }).observe($("#visitanos"));
  } else flotante.classList.add("wa-flotante--visible");

  /* ---------- Portada: rota entre las piezas destacadas ---------- */
  var destacados = productos.filter(function (p) { return p.destacado; });
  if (!destacados.length && productos.length) destacados = [productos[0]];
  if (destacados.length) {
    var portada = new window.Escenario($("#escena-portada"));
    var escenaPortada = $(".portada__escena");
    var nombreBtn = $("#portada-nombre");
    var puntos = $("#portada-puntos");
    var actualPortada = 0, rotacion = null, pausada = false, detenida = false;

    var mostrarDestacado = function (i) {
      actualPortada = i;
      var p = destacados[i];
      if (p.modelo3d) portada.modelo(p.modelo3d, fotos(p)[0], p.nombre, { autoRotar: true });
      else portada.foto(fotos(p)[0], p.nombre, { ajuste: "cover", encuadre: p.encuadrePortada || p.encuadre });
      $("#portada-pista").hidden = !p.modelo3d;
      nombreBtn.textContent = p.nombre;
      nombreBtn.setAttribute("aria-label", "Ver detalles de " + p.nombre);
      $$("button", puntos).forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); });
    };
    nombreBtn.addEventListener("click", function () { abrir(destacados[actualPortada]); });

    if (destacados.length > 1) {
      puntos.hidden = false;
      destacados.forEach(function (p, i) {
        var b = el("button", "portada__punto");
        b.type = "button";
        b.setAttribute("aria-label", "Ver " + p.nombre);
        b.addEventListener("click", function () {
          detenida = true; clearInterval(rotacion);   // si la persona elige, ya no rota sola
          mostrarDestacado(i);
        });
        puntos.appendChild(b);
        // precarga para que el cambio sea inmediato
        var pre = new Image(); pre.src = fotos(p)[0] || "";
      });
      if (!reducirMovimiento) {
        rotacion = setInterval(function () {
          if (pausada || detenida || document.hidden) return;
          mostrarDestacado((actualPortada + 1) % destacados.length);
        }, 6000);
        ["mouseenter", "focusin", "pointerdown"].forEach(function (ev) { escenaPortada.addEventListener(ev, function () { pausada = true; }); });
        ["mouseleave", "focusout"].forEach(function (ev) { escenaPortada.addEventListener(ev, function () { pausada = false; }); });
      }
    }
    mostrarDestacado(0);
  }

  /* ---------- Razones ---------- */
  var listaRazones = $("#razones");
  razones.forEach(function (r, i) {
    var li = el("li", "razon revelar");
    li.style.setProperty("--i", String(i % 3));
    var ic = el("span", "razon__icono");
    ic.appendChild(icono(r.icono || "fabrica"));
    li.appendChild(ic);
    li.appendChild(el("h3", null, r.titulo));
    li.appendChild(el("p", null, r.texto));
    listaRazones.appendChild(li);
    revelar(li);
  });
  if (!razones.length) $("#nosotros").hidden = true;

  /* ---------- Mi lista (se guarda en este navegador) ---------- */
  var CLAVE = "dnice-lista";
  var lista = [];
  try { lista = JSON.parse(localStorage.getItem(CLAVE) || "[]").filter(porId); } catch (e) { lista = []; }
  function guardarLista() { try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (e) { /* sin almacenamiento: la lista dura mientras la página esté abierta */ } }
  function enLista(id) { return lista.indexOf(id) !== -1; }
  function alternarLista(p) {
    var estaba = enLista(p.id);
    if (estaba) lista.splice(lista.indexOf(p.id), 1); else lista.push(p.id);
    guardarLista();
    actualizarLista();
    avisar(estaba ? "Quitado de tu lista" : "Guardado en tu lista");
  }

  /* ---------- Filtros ---------- */
  var filtroActual = "todo";
  var filtros = $("#filtros");
  [{ id: "todo", nombre: "Todo", icono: "rejilla" }].concat(conProductos).forEach(function (c) {
    var b = el("button");
    b.type = "button";
    if (c.icono) b.appendChild(icono(c.icono));
    b.appendChild(document.createTextNode(c.nombre));
    b.setAttribute("aria-pressed", String(c.id === filtroActual));
    b.addEventListener("click", function () {
      if (filtroActual === c.id) return;
      filtroActual = c.id;
      $$("button", filtros).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      // Las tarjetas se reacomodan deslizándose donde el navegador lo permite
      if (document.startViewTransition && !reducirMovimiento) document.startViewTransition(function () { pintar(true); });
      else pintar(true);
    });
    filtros.appendChild(b);
  });

  /* ---------- Rejilla ---------- */
  var rejilla = $("#rejilla");
  function imagenTarjeta(src, clase, encuadre, cargaInmediata) {
    var img = el("img", clase);
    img.alt = ""; img.decoding = "async"; img.loading = cargaInmediata ? "eager" : "lazy";
    if (encuadre) img.style.objectPosition = encuadre;
    img.addEventListener("load", function () { img.classList.add("cargada"); }, { once: true });
    img.src = src || "";
    if (img.complete && img.naturalWidth) img.classList.add("cargada");
    return img;
  }
  function botonGuardar(p, clase) {
    var b = el("button", clase);
    b.type = "button";
    b.setAttribute("data-guardar", p.id);
    b.appendChild(icono("corazon"));
    b.addEventListener("click", function () { alternarLista(p); });
    return b;
  }

  function pintar(cambioDeFiltro) {
    rejilla.innerHTML = "";
    var listaFiltrada = productos.filter(function (p) { return filtroActual === "todo" || p.categoria === filtroActual; });
    $("#conteo").textContent = listaFiltrada.length + (listaFiltrada.length === 1 ? " pieza" : " piezas");
    listaFiltrada.forEach(function (p, i) {
      var li = el("li", "tarjeta");
      li.style.setProperty("--i", String(i % 3));
      li.style.viewTransitionName = "tarjeta-" + p.id;
      var fs = fotos(p);

      var abrirBtn = el("button", "tarjeta__abrir");
      abrirBtn.type = "button";
      abrirBtn.setAttribute("aria-label", "Ver detalles de " + p.nombre);
      var foto = el("div", "tarjeta__foto");
      foto.appendChild(imagenTarjeta(fs[0], "", p.encuadre, i < 3));
      // Si hay segunda foto, aparece al pasar el mouse
      if (fs[1]) {
        foto.classList.add("tarjeta__foto--doble");
        foto.appendChild(imagenTarjeta(fs[1], "tarjeta__foto-alterna", "", false));
      }

      var sellos = el("span", "tarjeta__sellos");
      if (p.modelo3d) {
        var s3d = el("span", "tarjeta__sello tarjeta__sello--oscuro");
        s3d.appendChild(icono("cubo")); s3d.appendChild(document.createTextNode("3D"));
        sellos.appendChild(s3d);
      }
      if (fs.length > 1) {
        var sf = el("span", "tarjeta__sello");
        sf.appendChild(icono("fotos")); sf.appendChild(document.createTextNode(fs.length + " fotos"));
        sellos.appendChild(sf);
      }
      if (sellos.childNodes.length) foto.appendChild(sellos);

      var ver = el("span", "tarjeta__ver");
      ver.appendChild(icono(p.modelo3d ? "cubo" : "ojo"));
      ver.appendChild(document.createTextNode(p.modelo3d ? "Ver en 3D" : "Ver detalles"));
      foto.appendChild(ver);

      var meta = el("span", "tarjeta__meta");
      meta.appendChild(el("span", null, nombreCategoria(p.categoria)));
      var m = medidas(p);
      if (m.corta) {
        var med = el("span", "tarjeta__medidas");
        med.appendChild(icono("regla"));
        med.appendChild(document.createTextNode(m.corta));
        meta.appendChild(med);
      }
      abrirBtn.appendChild(foto);
      abrirBtn.appendChild(el("span", "tarjeta__nombre", p.nombre));
      abrirBtn.appendChild(meta);
      abrirBtn.addEventListener("click", function () { abrir(p); });

      var acciones = el("div", "tarjeta__acciones");
      var wa = el("a", "tarjeta__wa");
      wa.appendChild(icono("whatsapp"));
      wa.appendChild(el("span", "enlace enlace--visible", "Preguntar por WhatsApp"));
      externo(wa, enlaceWhatsApp(mensajeProducto(p)));
      acciones.appendChild(wa);

      li.appendChild(abrirBtn);
      li.appendChild(botonGuardar(p, "tarjeta__guardar"));
      li.appendChild(acciones);
      rejilla.appendChild(li);
      if (cambioDeFiltro) li.classList.add("visible"); else revelar(li);
    });
    actualizarLista();
  }

  /* ---------- Bloqueo de scroll cuando hay una ventana abierta ---------- */
  var visor = $("#visor");
  var listaDlg = $("#lista");
  function bloquearScroll() { document.body.style.overflow = (visor.open || listaDlg.open) ? "hidden" : ""; }
  function abrirDialogo(d) {
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    bloquearScroll();
  }

  /* ---------- Visor de producto ---------- */
  var escenaVisorNodo = $("#visor-escena");
  var escenaVisor = new window.Escenario(escenaVisorNodo);
  var miniaturas = $("#visor-miniaturas");
  var flechaAnterior = $("#visor-anterior");
  var flechaSiguiente = $("#visor-siguiente");
  var botonGuardarVisor = $("#visor-guardar");
  var ultimoFoco = null;
  var actual = null;   // { p, vistas, indice }

  function mostrarVista(i) {
    var p = actual.p, v = actual.vistas[i];
    actual.indice = i;
    $$("button", miniaturas).forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); });
    if (v === "3d") {
      escenaVisor.modelo(p.modelo3d, fotos(p)[0], p.nombre);
      $("#visor-pista").textContent = "Arrastra para girarlo y pellizca o usa la rueda del mouse para acercar. En el celular, el botón de realidad aumentada lo pone en tu casa.";
    } else {
      var n = fotos(p).indexOf(v) + 1, total = fotos(p).length;
      escenaVisor.foto(v, p.nombre + (total > 1 ? ", foto " + n + " de " + total : ""), { ajuste: "contain" });
      $("#visor-pista").textContent = "";
    }
  }
  function moverVista(paso) {
    if (!actual || actual.vistas.length < 2) return;
    var n = actual.vistas.length;
    mostrarVista((actual.indice + paso + n) % n);
  }
  flechaAnterior.addEventListener("click", function () { moverVista(-1); });
  flechaSiguiente.addEventListener("click", function () { moverVista(1); });
  visor.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("model-viewer")) return;
    if (e.key === "ArrowLeft") moverVista(-1);
    else if (e.key === "ArrowRight") moverVista(1);
  });
  // Deslizar con el dedo sobre la foto
  var inicioToque = null;
  escenaVisorNodo.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || !actual || actual.vistas[actual.indice] === "3d") { inicioToque = null; return; }
    inicioToque = { x: e.clientX, y: e.clientY };
  });
  escenaVisorNodo.addEventListener("pointerup", function (e) {
    if (!inicioToque) return;
    var dx = e.clientX - inicioToque.x, dy = e.clientY - inicioToque.y;
    inicioToque = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) moverVista(dx < 0 ? 1 : -1);
  });

  function actualizarBotonVisor() {
    if (!actual) return;
    var dentro = enLista(actual.p.id);
    botonGuardarVisor.setAttribute("aria-pressed", String(dentro));
  }
  botonGuardarVisor.addEventListener("click", function () { if (actual) alternarLista(actual.p); });

  $("#visor-compartir").addEventListener("click", function () {
    if (!actual) return;
    var p = actual.p;
    var url = location.href.split("#")[0] + "#" + p.id;
    if (navigator.share) {
      navigator.share({ title: p.nombre + " — " + tienda.nombre, text: p.nombre, url: url }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { avisar("Enlace copiado"); }, function () { avisar(url); });
    } else avisar(url);
  });

  function abrir(p) {
    if (!visor.open) ultimoFoco = document.activeElement;
    $("#visor-categoria").textContent = nombreCategoria(p.categoria);
    $("#visor-nombre").textContent = p.nombre;
    $("#visor-descripcion").textContent = p.descripcion || "";
    // Cada medida va completa en su renglón si no cabe ("Alto 76 cm" no se parte)
    var dd = $("#visor-medidas"), larga = medidas(p).larga;
    dd.innerHTML = "";
    (larga ? larga.split(" · ") : ["Pregunta por medidas"]).forEach(function (t, i) {
      if (i) dd.appendChild(document.createTextNode(" · "));
      dd.appendChild(el("span", "medida", t));
    });
    $("#visor-precio").textContent = p.precio || "Pregunta por precio";
    externo($("#visor-whatsapp"), enlaceWhatsApp(mensajeProducto(p)));

    var vistas = (p.modelo3d ? ["3d"] : []).concat(fotos(p));
    actual = { p: p, vistas: vistas, indice: 0 };
    miniaturas.innerHTML = "";
    if (vistas.length > 1) {
      vistas.forEach(function (v, i) {
        var b = el("button", "visor__mini");
        b.type = "button";
        if (v === "3d") {
          b.appendChild(icono("cubo", "icono--grande"));
          b.setAttribute("aria-label", "Ver en 3D");
        } else {
          var im = el("img"); im.src = v; im.alt = "";
          b.appendChild(im);
          b.setAttribute("aria-label", "Foto " + (p.modelo3d ? i : i + 1));
        }
        b.addEventListener("click", function () { mostrarVista(i); });
        miniaturas.appendChild(b);
      });
    }
    miniaturas.hidden = vistas.length < 2;
    flechaAnterior.hidden = flechaSiguiente.hidden = vistas.length < 2;
    actualizarBotonVisor();

    // En el celular el marco toma la proporción de la primera foto, para que no queden franjas grandes
    escenaVisorNodo.style.removeProperty("--proporcion");
    if (fotos(p)[0]) {
      var medir = new Image();
      medir.onload = function () {
        var r = Math.min(1.5, Math.max(0.8, medir.naturalWidth / medir.naturalHeight));
        if (actual && actual.p === p) escenaVisorNodo.style.setProperty("--proporcion", String(r));
      };
      medir.src = fotos(p)[0];
    }

    escenaVisor.vaciar();
    mostrarVista(0);
    if (!visor.open) abrirDialogo(visor);
    visor.scrollTop = 0;
    history.replaceState(null, "", "#" + p.id);
  }
  function cerrar() { if (visor.open) visor.close(); }
  visor.addEventListener("close", function () {
    bloquearScroll();
    // espera a que termine la animación de salida antes de vaciar el visor
    setTimeout(function () { if (!visor.open) escenaVisor.vaciar(); }, reducirMovimiento ? 0 : 600);
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    if (!listaDlg.open && ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  });
  $(".visor__cerrar").addEventListener("click", cerrar);
  visor.addEventListener("click", function (e) { if (e.target === visor) cerrar(); });

  /* ---------- Ventana "Mi lista" ---------- */
  var barra = $("#lista-barra");
  var piezas = $("#lista-piezas");
  var focoAntesLista = null;
  barra.hidden = false;

  function mensajeLista() {
    var lineas = lista.map(porId).filter(Boolean).map(function (p) {
      var url = enlaceProducto(p);
      return "• " + p.nombre + (url ? " — " + url : "");
    });
    return "Hola, vi su catálogo en línea y me interesan estas piezas:\n\n" + lineas.join("\n") + "\n\n¿Me pueden dar precio, medidas y disponibilidad?";
  }

  function pintarLista() {
    piezas.innerHTML = "";
    lista.map(porId).filter(Boolean).forEach(function (p) {
      var li = el("li", "lista__pieza");
      var img = el("img"); img.src = fotos(p)[0] || ""; img.alt = "";
      if (p.encuadre) img.style.objectPosition = p.encuadre;
      var texto = el("div", "lista__texto");
      var nombre = el("button", "lista__nombre enlace", p.nombre);
      nombre.type = "button";
      nombre.addEventListener("click", function () { listaDlg.close(); abrir(p); });
      texto.appendChild(nombre);
      texto.appendChild(el("span", "lista__detalle", [nombreCategoria(p.categoria), medidas(p).corta].filter(Boolean).join(" · ")));
      var quitar = el("button", "lista__quitar");
      quitar.type = "button";
      quitar.setAttribute("aria-label", "Quitar " + p.nombre + " de la lista");
      quitar.appendChild(icono("cerrar"));
      quitar.addEventListener("click", function () {
        alternarLista(p);
        var siguiente = $(".lista__quitar", piezas) || $(".lista__cerrar");
        if (siguiente) siguiente.focus();
      });
      li.appendChild(img); li.appendChild(texto); li.appendChild(quitar);
      piezas.appendChild(li);
    });
    var vacia = lista.length === 0;
    $("#lista-vacia").hidden = !vacia;
    $("#lista-pie").hidden = vacia;
    if (!vacia) externo($("#lista-enviar"), enlaceWhatsApp(mensajeLista()));
  }

  function actualizarLista() {
    $$("[data-guardar]").forEach(function (b) {
      var p = porId(b.getAttribute("data-guardar"));
      var dentro = enLista(p.id);
      b.setAttribute("aria-pressed", String(dentro));
      b.setAttribute("aria-label", "Guardar " + p.nombre + " en mi lista");
    });
    $("#lista-barra-conteo").textContent = lista.length;
    var hay = lista.length > 0;
    barra.classList.toggle("lista-barra--visible", hay);
    barra.inert = !hay;
    barra.setAttribute("aria-label", "Mi lista, " + lista.length + (lista.length === 1 ? " pieza" : " piezas"));
    actualizarBotonVisor();
    if (listaDlg.open) pintarLista();
  }

  barra.addEventListener("click", function () {
    focoAntesLista = document.activeElement;
    pintarLista();
    abrirDialogo(listaDlg);
  });
  $(".lista__cerrar").addEventListener("click", function () { listaDlg.close(); });
  listaDlg.addEventListener("click", function (e) { if (e.target === listaDlg) listaDlg.close(); });
  listaDlg.addEventListener("close", function () {
    bloquearScroll();
    if (!visor.open && focoAntesLista && focoAntesLista.focus && document.contains(focoAntesLista)) focoAntesLista.focus({ preventScroll: true });
  });
  $("#lista-vaciar").addEventListener("click", function () {
    if (!window.confirm("¿Quitar todas las piezas de tu lista?")) return;
    lista = [];
    guardarLista();
    actualizarLista();
    listaDlg.close();
  });

  pintar(false);

  /* Enlace directo a un producto: .../#comedor-ovalado */
  function abrirDesdeHash() {
    var p = porId(decodeURIComponent(location.hash.slice(1)));
    if (p) abrir(p);
  }
  abrirDesdeHash();
  window.addEventListener("hashchange", abrirDesdeHash);
})();
