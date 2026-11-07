// true cuando el cuestionario ya se calificó: las respuestas quedan bloqueadas
let cuestionarioCalificado = false;

function ActualizarCalificacion(calificacion=0, refrescar = false) {
  // evitar problemas con valores no definidos
  calificacion ??= 0;
  refrescar ??= false;

  // Refrescar = cuestionario nuevo (se desbloquea); calificar = se bloquea
  cuestionarioCalificado = !refrescar;

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
}

function MessageFeedback(calificacion) {
  if (calificacion >= 80) {
    return "¡Excelente trabajo! :))";
  } else if (calificacion >= 60) {
    return "Buen trabajo :)";
  } else {
    return "Necesitas mejorar :(";
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
