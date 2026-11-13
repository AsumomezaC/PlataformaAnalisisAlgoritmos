function Redireccionar() {
  // Obtener el valor seleccionado en el select
  var selectElement = document.getElementById("algoritmos");
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  // Chequear el ID de la opción seleccionada
  var selectedOptionId = selectedOption.id;

  if (selectedOptionId === "Default") {
      alert("No se ha seleccionado ningún algoritmo.");
  } else {
      // Redirigir a la página correspondiente
      window.location.href = "algoritmos/" + selectedOptionId + ".html";
  }
}
// Navegación con teclado: el anillo de foco de la lista y del campo n solo se
// muestra si se llegó con Tab; un clic o un toque lo vuelve a ocultar.
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Tab") document.documentElement.setAttribute("data-teclado", "");
}, true);
document.addEventListener("pointerdown", () => {
  document.documentElement.removeAttribute("data-teclado");
}, true);
