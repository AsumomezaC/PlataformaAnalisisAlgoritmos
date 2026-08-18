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