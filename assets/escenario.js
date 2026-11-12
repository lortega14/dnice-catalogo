/*
  Escenario: muestra una foto del producto o, si existe, su modelo 3D (.glb)
  con <model-viewer>, que permite girarlo, acercarlo y verlo con realidad aumentada.
*/
(function () {
  var MODEL_VIEWER = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var promesa = null;
  function cargarModelViewer() {
    if (window.customElements && customElements.get("model-viewer")) return Promise.resolve();
    if (!promesa) {
      promesa = new Promise(function (ok, falla) {
        var s = document.createElement("script");
        s.type = "module"; s.src = MODEL_VIEWER;
        s.onload = ok; s.onerror = falla;
        document.head.appendChild(s);
      });
    }
    return promesa;
  }

  function Escenario(contenedor) {
    this.c = contenedor;
    this.turno = 0;
  }

  Escenario.prototype.foto = function (src, alt, opciones) {
    opciones = opciones || {};
    this.turno++;
    var c = this.c;
    c.className = c.className.replace(/\s*escenario--(foto|modelo)/g, "") + " escenario--foto";
    // Quita lo que no sea foto (modelo 3D o avisos) y prepara el cruce suave entre fotos
    Array.prototype.slice.call(c.children).forEach(function (h) { if (h.tagName !== "IMG") h.remove(); });
    var anteriores = Array.prototype.slice.call(c.querySelectorAll("img"));
    var img = document.createElement("img");
    img.alt = alt || ""; img.decoding = "async";
    if (opciones.ajuste) img.style.objectFit = opciones.ajuste;
    if (opciones.encuadre) img.style.objectPosition = opciones.encuadre;
    if (anteriores.length && !reducirMovimiento) img.className = "entrando";
    function mostrar() {
      requestAnimationFrame(function () {
        img.classList.remove("entrando");
        setTimeout(function () { anteriores.forEach(function (a) { a.remove(); }); }, reducirMovimiento ? 0 : 650);
      });
    }
    img.addEventListener("load", mostrar, { once: true });
    img.addEventListener("error", mostrar, { once: true });
    img.src = src;
    c.appendChild(img);
  };

  Escenario.prototype.modelo = function (src, poster, alt, opciones) {
    opciones = opciones || {};
    var turno = ++this.turno, self = this, c = this.c;
    c.className = c.className.replace(/\s*escenario--(foto|modelo)/g, "") + " escenario--modelo";
    c.innerHTML = "";
    var aviso = document.createElement("p");
    aviso.className = "escenario__aviso";
    aviso.textContent = "Cargando modelo 3D…";
    c.appendChild(aviso);
    cargarModelViewer().then(function () {
      if (turno !== self.turno) return;
      var mv = document.createElement("model-viewer");
      mv.setAttribute("src", src);
      if (poster) mv.setAttribute("poster", poster);
      mv.setAttribute("alt", alt || "Modelo 3D");
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("touch-action", "pan-y");
      mv.setAttribute("shadow-intensity", "1");
      mv.setAttribute("ar", "");
      mv.setAttribute("ar-modes", "webxr scene-viewer quick-look");
      if (opciones.autoRotar && !reducirMovimiento) mv.setAttribute("auto-rotate", "");
      mv.addEventListener("error", function () {
        aviso.textContent = "No se pudo abrir el modelo 3D.";
        c.innerHTML = ""; c.appendChild(aviso);
      });
      c.innerHTML = ""; c.appendChild(mv);
    }).catch(function () {
      if (turno === self.turno) aviso.textContent = "No se pudo cargar el visor 3D. Revisa tu conexión.";
    });
  };

  Escenario.prototype.vaciar = function () { this.turno++; this.c.innerHTML = ""; };

  window.Escenario = Escenario;
})();
