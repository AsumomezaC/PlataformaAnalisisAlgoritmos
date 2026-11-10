// true cuando el cuestionario ya se calificó: las respuestas quedan bloqueadas
let cuestionarioCalificado = false;

function ActualizarCalificacion(calificacion=0, refrescar = false) {
  // evitar problemas con valores no definidos
  calificacion ??= 0;
  refrescar ??= false;

  // Refrescar = cuestionario nuevo (se desbloquea); calificar = se bloquea
  const yaEstabaCalificado = cuestionarioCalificado;
  cuestionarioCalificado = !refrescar;

  if (refrescar) {
    // Cuestionario nuevo: el cronómetro arranca y se descarta el comprobante anterior
    comprobanteActual = null;
    IniciarCronometro();
    MostrarBotonComprobante(false);
  } else if (!yaEstabaCalificado || !comprobanteActual) {
    // Primera calificación: se detiene el cronómetro y se genera el comprobante
    DetenerCronometro();
    comprobanteActual = CrearDatosComprobante(calificacion);
  }

  const calificacionElement = document.getElementById("calificacion");
  const feedbackElement = document.getElementById("feedback");
  
  if (calificacionElement) {
    // si se pide refrescar, no actualizar la calificación
    if(refrescar){
      calificacionElement.innerText = 'NA';
      if (feedbackElement) {
        feedbackElement.innerText = '';
      }
    } else {
      // actualizar la calificación
      calificacionElement.innerText = calificacion;
      if (feedbackElement) {
        feedbackElement.innerText = MessageFeedback(calificacion);
      }
    }
  }

  if (!refrescar && comprobanteActual) {
    MostrarBotonComprobante(true);
    MostrarModalComprobante();
  }
}

function MessageFeedback(calificacion) {
  if (calificacion >= 80) {
    return "¡Excelente trabajo! :))";
  } else if (calificacion >= 60) {
    return "Buen trabajo :)";
  } else {
    return "Necesitas repasar :(";
  }
}

// Inicio Bloqueo de respuestas después de calificar
// Una vez calificado, ya no se pueden cambiar las respuestas (antes se podía
// marcar otra opción y volver a calificar, mezclando colores de correcto e
// incorrecto). Si se intenta, se pregunta si se quiere volver a responder.
function IntentoCambiarRespuesta(evento) {
  if (!cuestionarioCalificado) return;
  const preguntas = document.getElementById("Preguntas");
  if (!preguntas || !preguntas.contains(evento.target)) return;
  if (!evento.target.closest("label, input")) return;

  evento.preventDefault();   // la opción marcada no cambia
  evento.stopPropagation();
  MostrarModalReintentar();
}

// En fase de captura para adelantarse al cambio de la opción
document.addEventListener("click", IntentoCambiarRespuesta, true);

// Teclado: flechas y espacio también cambian la opción de un radio
document.addEventListener("keydown", (evento) => {
  const teclas = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
  if (!teclas.includes(evento.key)) return;
  if (evento.target.matches && evento.target.matches('#Preguntas input[type="radio"]')) {
    IntentoCambiarRespuesta(evento);
  }
}, true);

let elementoConFocoAntesDelModal = null;

function CrearModalReintentar() {
  const fondo = document.createElement("div");
  fondo.id = "modalReintentar";
  fondo.className = "modal-reintentar";
  fondo.hidden = true;
  fondo.innerHTML = `
    <div class="modal-reintentar__caja" role="dialog" aria-modal="true"
         aria-labelledby="modalReintentarTitulo" aria-describedby="modalReintentarTexto">
      <h2 id="modalReintentarTitulo" class="modal-reintentar__titulo">Este cuestionario ya fue calificado</h2>
      <p id="modalReintentarTexto" class="modal-reintentar__texto">
        ¿Quieres volver a responderlo? Se generará un cuestionario nuevo y se borrará tu calificación actual.
      </p>
      <div class="modal-reintentar__botones">
        <button type="button" class="modal-reintentar__boton modal-reintentar__boton--no">No, ver mis resultados</button>
        <button type="button" class="modal-reintentar__boton modal-reintentar__boton--si">Sí, volver a responder</button>
      </div>
    </div>`;

  // Clic fuera de la caja: cerrar
  fondo.addEventListener("click", (evento) => {
    if (evento.target === fondo) CerrarModalReintentar();
  });
  fondo.querySelector(".modal-reintentar__boton--no").addEventListener("click", CerrarModalReintentar);
  fondo.querySelector(".modal-reintentar__boton--si").addEventListener("click", () => {
    CerrarModalReintentar(false);
    if (typeof Refrescar === "function") Refrescar(); // misma acción que el botón de cuestionario nuevo
    const preguntas = document.getElementById("Preguntas");
    if (preguntas) preguntas.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Escape cierra; Tab se mantiene dentro del modal
  fondo.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      evento.preventDefault();
      CerrarModalReintentar();
    } else if (evento.key === "Tab") {
      const botones = [...fondo.querySelectorAll("button")];
      const primero = botones[0], ultimo = botones[botones.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }
  });

  document.body.appendChild(fondo);
  return fondo;
}

function MostrarModalReintentar() {
  const modal = document.getElementById("modalReintentar") || CrearModalReintentar();
  if (!modal.hidden) return;
  elementoConFocoAntesDelModal = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-abierto");
  modal.querySelector(".modal-reintentar__boton--si").focus();
}

function CerrarModalReintentar(devolverFoco = true) {
  const modal = document.getElementById("modalReintentar");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-abierto");
  if (devolverFoco && elementoConFocoAntesDelModal && elementoConFocoAntesDelModal.focus) {
    elementoConFocoAntesDelModal.focus();
  }
  elementoConFocoAntesDelModal = null;
}
// Fin Bloqueo de respuestas después de calificar


// Inicio Cronómetro
// Mide el tiempo desde que se genera el cuestionario hasta que se califica.
// performance.now() es un reloj monotónico de alta resolución (fracciones de
// milisegundo; el navegador lo redondea por seguridad a entre 0.005 y 1 ms) y,
// a diferencia de Date, no le afectan los cambios de hora del sistema.
let inicioCuestionario = 0;     // performance.now() al iniciar
let duracionCuestionario = 0;   // ms con decimales, fijado al calificar
let intervaloCronometro = null;

function IniciarCronometro() {
  inicioCuestionario = performance.now();
  duracionCuestionario = 0;
  clearInterval(intervaloCronometro);
  intervaloCronometro = setInterval(ActualizarCronometroVisible, 100);
  ActualizarCronometroVisible();
}

function DetenerCronometro() {
  if (!inicioCuestionario) return;
  duracionCuestionario = performance.now() - inicioCuestionario;
  clearInterval(intervaloCronometro);
  intervaloCronometro = null;
  ActualizarCronometroVisible();
}

function ActualizarCronometroVisible() {
  const el = ObtenerCronometroVisible();
  if (!el) return;
  const ms = intervaloCronometro ? performance.now() - inicioCuestionario : duracionCuestionario;
  el.textContent = `Tiempo: ${FormatearDuracion(ms, 1)}`;
}

function ObtenerCronometroVisible() {
  let el = document.getElementById("cronometro");
  if (!el) {
    const panel = document.querySelector(".calificacion");
    if (!panel) return null;
    el = document.createElement("span");
    el.id = "cronometro";
    el.className = "cronometro";
    panel.appendChild(el);
  }
  return el;
}

// 205347.215 -> "03:25.347" (con horas si hace falta)
function FormatearDuracion(ms, decimales = 3) {
  const totalSeg = ms / 1000;
  const horas = Math.floor(totalSeg / 3600);
  const minutos = Math.floor((totalSeg % 3600) / 60);
  const segundos = totalSeg % 60;
  const factor = Math.pow(10, decimales);
  const seg = (Math.floor(segundos * factor) / factor).toFixed(decimales).padStart(decimales ? 3 + decimales : 2, "0");
  const mm = String(minutos).padStart(2, "0");
  return horas ? `${horas}:${mm}:${seg}` : `${mm}:${seg}`;
}
// Fin Cronómetro


// Inicio Comprobante
let comprobanteActual = null;

// Identificador aleatorio estándar (UUID v4) generado por el navegador
function GenerarUUID() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Folio legible basado en el instante exacto de la calificación:
// microsegundos desde 1970 (reloj de alta resolución) en base 36 + 4 caracteres aleatorios.
function GenerarFolio(prefijo, epochMs) {
  const micro = Math.round(epochMs * 1000);
  const tiempo = micro.toString(36).toUpperCase();
  const r = new Uint8Array(2);
  crypto.getRandomValues(r);
  const azar = [...r].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${prefijo}-${tiempo}-${azar}`;
}

function NombreAlgoritmo() {
  const h = document.querySelector("header.Name");
  return h ? h.textContent.trim() : document.title.replace(/^Examen\s+/i, "");
}

function PrefijoAlgoritmo(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("bubble")) return "BUB";
  if (n.includes("insertion")) return "INS";
  if (n.includes("find")) return "FMX";
  return "EVA";
}

function CrearDatosComprobante(calificacion) {
  // Instante de la calificación con resolución de fracciones de milisegundo
  const epochMs = performance.timeOrigin + performance.now();
  const fecha = new Date(epochMs);
  const algoritmo = NombreAlgoritmo();

  const lista = typeof preguntasSeleccionadas !== "undefined" ? preguntasSeleccionadas : [];
  const preguntas = lista.map((p, i) => {
    const marcada = document.querySelector(`input[name="pregunta${i + 1}"]:checked`);
    const respuesta = marcada ? marcada.value : null;
    return {
      pregunta: p.pregunta,
      respuesta,
      correcta: p.respuestaCorrecta,
      acierto: respuesta === p.respuestaCorrecta
    };
  });
  const aciertos = preguntas.filter(p => p.acierto).length;

  const zona = -fecha.getTimezoneOffset();
  const signo = zona >= 0 ? "+" : "-";
  const zonaTexto = `GMT${signo}${String(Math.floor(Math.abs(zona) / 60)).padStart(2, "0")}:${String(Math.abs(zona) % 60).padStart(2, "0")}`;
  const msDelSegundo = String(fecha.getMilliseconds()).padStart(3, "0");
  const fechaTexto = fecha.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  const horaTexto = fecha.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  return {
    algoritmo,
    calificacion,
    aciertos,
    total: preguntas.length,
    mensaje: MessageFeedback(calificacion),
    duracionMs: duracionCuestionario,
    duracionTexto: FormatearDuracion(duracionCuestionario, 3),
    fechaTexto: `${fechaTexto}, ${horaTexto}.${msDelSegundo} (${zonaTexto})`,
    fechaISO: fecha.toISOString(),
    folio: GenerarFolio(PrefijoAlgoritmo(algoritmo), epochMs),
    uuid: GenerarUUID(),
    preguntas
  };
}

function EscaparHTML(texto) {
  const d = document.createElement("div");
  d.textContent = texto == null ? "" : String(texto);
  return d.innerHTML;
}

function MostrarBotonComprobante(visible) {
  let boton = document.getElementById("verComprobante");
  if (!boton && visible) {
    const panel = document.querySelector(".calificacion");
    if (!panel) return;
    boton = document.createElement("button");
    boton.id = "verComprobante";
    boton.type = "button";
    boton.className = "ver-comprobante";
    boton.textContent = "Ver comprobante";
    boton.addEventListener("click", MostrarModalComprobante);
    panel.appendChild(boton);
  }
  if (boton) boton.hidden = !visible;
}

function CrearModalComprobante() {
  const fondo = document.createElement("div");
  fondo.id = "modalComprobante";
  fondo.className = "modal-reintentar";
  fondo.hidden = true;
  fondo.innerHTML = `
    <div class="modal-reintentar__caja comprobante" role="dialog" aria-modal="true" aria-labelledby="comprobanteTitulo">
      <p class="comprobante__marca">Visualizador de Algoritmos · UAZ · COZCyT</p>
      <h2 id="comprobanteTitulo" class="modal-reintentar__titulo">Comprobante de evaluación</h2>
      <div class="comprobante__contenido"></div>
      <p class="comprobante__estado" role="status" aria-live="polite"></p>
      <div class="modal-reintentar__botones">
        <button type="button" class="modal-reintentar__boton modal-reintentar__boton--no comprobante__cerrar">Cerrar</button>
        <button type="button" class="modal-reintentar__boton modal-reintentar__boton--si comprobante__descargar">Descargar PDF</button>
      </div>
    </div>`;

  fondo.addEventListener("click", (e) => { if (e.target === fondo) CerrarModalComprobante(); });
  fondo.querySelector(".comprobante__cerrar").addEventListener("click", () => CerrarModalComprobante());
  fondo.querySelector(".comprobante__descargar").addEventListener("click", DescargarComprobantePDF);
  fondo.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      CerrarModalComprobante();
    } else if (e.key === "Tab") {
      const enfocables = [...fondo.querySelectorAll("a[href], button:not([disabled])")];
      const primero = enfocables[0], ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  document.body.appendChild(fondo);
  return fondo;
}

function MostrarModalComprobante() {
  const c = comprobanteActual;
  if (!c) return;
  const modal = document.getElementById("modalComprobante") || CrearModalComprobante();

  const filas = c.preguntas.map((p, i) => `
    <li class="comprobante__pregunta ${p.acierto ? "es-correcta" : "es-incorrecta"}">
      <span class="comprobante__resultado">${p.acierto ? "✓ Correcta" : "✗ Incorrecta"}</span>
      <span class="comprobante__texto">${i + 1}. ${EscaparHTML(p.pregunta)}</span>
      <span class="comprobante__respuesta">Tu respuesta: <strong>${p.respuesta ? EscaparHTML(p.respuesta) : "Sin responder"}</strong>${p.acierto ? "" : ` · Correcta: <strong>${EscaparHTML(p.correcta)}</strong>`}</span>
    </li>`).join("");

  modal.querySelector(".comprobante__contenido").innerHTML = `
    <div class="comprobante__nota">
      <span class="comprobante__nota-valor">${c.calificacion}</span><span class="comprobante__nota-total">/ 100</span>
      <span class="comprobante__nota-detalle">${c.aciertos} de ${c.total} correctas · ${EscaparHTML(c.mensaje)}</span>
    </div>
    <dl class="comprobante__datos">
      <dt>Algoritmo</dt><dd>${EscaparHTML(c.algoritmo)}</dd>
      <dt>Tiempo de resolución</dt><dd>${c.duracionTexto} <span class="comprobante__sub">(${c.duracionMs.toFixed(3)} ms)</span></dd>
      <dt>Fecha y hora</dt><dd>${EscaparHTML(c.fechaTexto)}</dd>
      <dt>Folio</dt><dd class="comprobante__codigo">${c.folio}</dd>
      <dt>ID único</dt><dd class="comprobante__codigo">${c.uuid}</dd>
    </dl>
    <ol class="comprobante__preguntas">${filas}</ol>
    <p class="comprobante__aviso">
      <strong>Constancia informativa:</strong> no es un documento oficial de la UAZ, del COZCyT ni de ninguna otra institución.
      Se genera en tu navegador y la plataforma no guarda tus respuestas, por lo que no puede verificarse contra un registro.
      Consulta los <a href="/terminos.html" target="_blank" rel="noopener">Términos de uso</a>.
    </p>`;
  modal.querySelector(".comprobante__estado").textContent = "";

  if (modal.hidden) {
    modal._focoPrevio = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-abierto");
  }
  modal.querySelector(".modal-reintentar__caja").scrollTop = 0;
  modal.querySelector(".comprobante__descargar").focus({ preventScroll: true });
}

function CerrarModalComprobante() {
  const modal = document.getElementById("modalComprobante");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-abierto");
  const previo = modal._focoPrevio;
  modal._focoPrevio = null;
  const boton = document.getElementById("verComprobante");
  const destino = boton && !boton.hidden ? boton : previo;
  if (destino && destino.focus) destino.focus();
}
// Fin Comprobante


// Inicio PDF del comprobante
// jsPDF (alojado en el propio sitio) se carga solo cuando se pide el PDF, para no hacer más pesada la página.
const URL_JSPDF = "/vendor/jspdf-2.5.1/jspdf.umd.min.js"; // alojado en el propio sitio
let cargaJsPDF = null;

function CargarJsPDF() {
  if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (!cargaJsPDF) {
    cargaJsPDF = new Promise((resolver, rechazar) => {
      const s = document.createElement("script");
      s.src = URL_JSPDF;
      s.onload = () => (window.jspdf && window.jspdf.jsPDF) ? resolver(window.jspdf.jsPDF) : rechazar(new Error("jsPDF no disponible"));
      s.onerror = () => { cargaJsPDF = null; s.remove(); rechazar(new Error("No se pudo descargar jsPDF")); };
      document.head.appendChild(s);
    });
  }
  return cargaJsPDF;
}

async function DescargarComprobantePDF() {
  const c = comprobanteActual;
  const modal = document.getElementById("modalComprobante");
  if (!c || !modal) return;
  const boton = modal.querySelector(".comprobante__descargar");
  const estado = modal.querySelector(".comprobante__estado");
  boton.disabled = true;
  estado.textContent = "Generando PDF…";
  try {
    const jsPDF = await CargarJsPDF();
    const doc = ConstruirPDFComprobante(jsPDF, c);
    const nombre = `comprobante-${c.algoritmo.toLowerCase().replace(/\s+/g, "-")}-${c.folio}.pdf`;
    doc.save(nombre);
    estado.textContent = `PDF descargado: ${nombre}`;
  } catch (error) {
    estado.textContent = "No se pudo generar el PDF. Revisa tu conexión a internet e inténtalo de nuevo.";
  } finally {
    boton.disabled = false;
    boton.focus();
  }
}

function ConstruirPDFComprobante(jsPDF, c) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const margen = 18;
  const util = ancho - margen * 2;
  let y;

  doc.setProperties({
    title: `Comprobante de evaluación - ${c.algoritmo}`,
    subject: `Folio ${c.folio}`,
    author: "Visualizador de Algoritmos (UAZ - COZCyT)",
    creator: "Visualizador de Algoritmos"
  });

  // Encabezado
  doc.setFillColor(42, 23, 71);
  doc.rect(0, 0, ancho, 34, "F");
  doc.setTextColor(240, 190, 240);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("VISUALIZADOR DE ALGORITMOS  -  UAZ  -  COZCyT", margen, 13);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Comprobante de evaluación", margen, 25);
  y = 46;

  // Calificación destacada
  doc.setDrawColor(221, 117, 221);
  doc.setLineWidth(0.6);
  doc.roundedRect(margen, y - 8, util, 24, 3, 3, "S");
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(String(c.calificacion), margen + 8, y + 8);
  const anchoNota = doc.getTextWidth(String(c.calificacion));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  doc.text("/ 100", margen + 10 + anchoNota, y + 8);
  doc.setFontSize(11);
  doc.text(`${c.aciertos} de ${c.total} respuestas correctas`, margen + 62, y + 2);
  doc.text(c.mensaje, margen + 62, y + 9);
  y += 28;

  // Datos
  const datos = [
    ["Algoritmo", c.algoritmo],
    ["Tiempo de resolución", `${c.duracionTexto}   (${c.duracionMs.toFixed(3)} ms)`],
    ["Fecha y hora", c.fechaTexto],
    ["Fecha UTC (ISO 8601)", c.fechaISO],
    ["Folio", c.folio],
    ["ID único", c.uuid]
  ];
  doc.setFontSize(10.5);
  datos.forEach(([etiqueta, valor]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 70, 70);
    doc.text(etiqueta, margen, y);
    doc.setFont(etiqueta === "Folio" || etiqueta === "ID único" ? "courier" : "helvetica", "normal");
    doc.setTextColor(25, 25, 25);
    doc.text(String(valor), margen + 50, y);
    y += 7;
  });

  // Respuestas
  y += 3;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(margen, y, ancho - margen, y);
  y += 9;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(42, 23, 71);
  doc.text("Respuestas", margen, y);
  y += 8;

  c.preguntas.forEach((p, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const lineasPregunta = doc.splitTextToSize(`${i + 1}. ${p.pregunta}`, util - 30);
    const detalle = `Tu respuesta: ${p.respuesta == null ? "Sin responder" : p.respuesta}` + (p.acierto ? "" : `     Correcta: ${p.correcta}`);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lineasDetalle = doc.splitTextToSize(detalle, util - 30);
    const altoBloque = (lineasPregunta.length + lineasDetalle.length) * 5 + 5;
    if (y + altoBloque > alto - 31) { doc.addPage(); y = margen + 4; }

    // Etiqueta de resultado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    if (p.acierto) { doc.setFillColor(214, 240, 214); doc.setTextColor(20, 100, 20); }
    else { doc.setFillColor(250, 218, 218); doc.setTextColor(150, 20, 20); }
    doc.roundedRect(margen, y - 4, 25, 6, 1.5, 1.5, "F");
    doc.text(p.acierto ? "Correcta" : "Incorrecta", margen + 12.5, y, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(lineasPregunta, margen + 30, y);
    y += lineasPregunta.length * 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(lineasDetalle, margen + 30, y);
    y += lineasDetalle.length * 5 + 5;
  });

  // Pie en cada página
  const paginas = doc.getNumberOfPages();
  for (let n = 1; n <= paginas; n++) {
    doc.setPage(n);
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.3);
    doc.line(margen, alto - 25, ancho - margen, alto - 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text("Constancia informativa. No es un documento oficial de la UAZ, del COZCyT ni de ninguna otra institución.", margen, alto - 19.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Generada en el navegador del estudiante; la plataforma no guarda registros, por lo que no puede verificarse contra uno.", margen, alto - 14.5);
    doc.text(`Folio ${c.folio}   -   ID ${c.uuid}`, margen, alto - 9);
    doc.text(`Página ${n} de ${paginas}`, ancho - margen, alto - 9, { align: "right" });
  }
  return doc;
}
// Fin PDF del comprobante
