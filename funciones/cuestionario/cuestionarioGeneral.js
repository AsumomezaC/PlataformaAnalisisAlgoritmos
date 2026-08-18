function ActualizarCalificacion(calificacion=0, refrescar = false) {
  // evitar problemas con valores no definidos
  calificacion ??= 0;
  refrescar ??= false;

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