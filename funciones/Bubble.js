// bubble.js
// Contadores específicos para Bubble
let counter1_b = 0;
let counter2_b = [];
let counter3_b = [];
let counter4_b = [];
let newCounter_b = false;

function ViewInfo() {
  alert("Bubble Sort es un algoritmo simple de ordenamiento ...");
}

function IrExamen() {
  limpiarVariablesGlobales();
  window.location.href = "../algoritmos/examenes/Bubble.html";
}

// Estados de la máquina
funcsExeAlg = [
  funcExeAlg1_b,
  funcExeAlg2_b,
  funcExeAlg3_b,
  funcExeAlg4_b
];

function EliminarSeleccionadoAnterior() {
  if (pasoActual > 0 && pasoActual <= 4) {
    const el = document.getElementById(`codeLine${pasoActual}`);
    if (el) el.classList.remove("selectedLine");
  } else if (pasoActual !== 0) {
    alert(`Error: pasoActual fuera de rango en EliminarSeleccionadoAnterior (${pasoActual})`);
    return false;
  }
  return true;
}

function AgregarSeleccionadoActual() {
  if (pasoActual > 0 && pasoActual <= 4) {
    const el = document.getElementById(`codeLine${pasoActual}`);
    if (el) el.classList.add("selectedLine");
    return true;
  } else if (pasoActual === 0) {
    alert("Algoritmo Terminado");
    return false;
  } else {
    alert(`Error: pasoActual fuera de rango en AgregarSeleccionadoActual (${pasoActual})`);
    return false;
  }
}

LimpiarContadoresInstrucciones = function() {
  counter1_b = 0;
  counter2_b = [];
  counter3_b = [];
  counter4_b = [];
  newCounter_b = false;
  RemoveAllCounterInstructions();
}

RemoveAllCounterInstructions = function() {
  for (let ii = 1; ii <= 4; ii++) {
    const contador = document.getElementById(`counter${ii}`);
    if (contador) contador.textContent = '—';
  }
}

// Inicio funciones ejecución Bubble (ejemplo con las dos primeras instrucciones ya configuradas)
function funcExeAlg1_b() {
  // controla la reducción de i (rango)
  counter1_b++;
  addCounterInstruction(1, counter1_b);

  if (i === -1) {
    // iniciar i como longitud del arreglo (tal como planteaste)
    i = numerosAlgModificados.length;
  } else {
    i--;
  }
  UpdateIValue(i);
  const jDiv = document.getElementById(`jValue`);
  if (jDiv) jDiv.textContent = '—'; // limpia la UI para j

  if (i < 1) {
    pasoSiguiente = 0; // terminado
    return;
  }
  newCounter_b = true; // indica que se debe de agregar un nuevo contador al arreglo
  pasoSiguiente = 2;
}

function funcExeAlg2_b() {
  // Inicializamos contador 2,3 y 4 si es el primer paso del ciclo
  if(newCounter_b) {
    counter2_b.push(0);
    counter3_b.push(0);
    counter4_b.push(0);
    // Agregamos el primer conteo para el contador 3 y 4
    addCounterArrayInstruction(3, counter3_b);
    addCounterArrayInstruction(4, counter4_b);
    newCounter_b = false;
  }
  // Agregamos contador 2
  counter2_b[counter2_b.length - 1]++;
  addCounterArrayInstruction(2, counter2_b);

  // control de j (recorrido interno)
  if (j === -1) {
    // iniciar j en 2 según tu convención (1-based)
    j = 2;
  } else {
    j++;
  }
  UpdateJValue(j);

  // si j > i (fin de pasada) -> volver a reducir i
  if (j > i) {
    pasoSiguiente = 1; // volver a reducir i
    // limpiar puntero j visual y reiniciar variable
    UpdateJPresence(-1); // limpia la UI para j
    j = -1;
    return;
  }
  pasoSiguiente = 3;
}

function funcExeAlg3_b() {
  // Agregamos contador 3
  counter3_b[counter3_b.length - 1]++;
  addCounterArrayInstruction(3, counter3_b);

  // lógica de comparación/intercambio
  if(numerosAlgModificados[(j - 1)-1] > numerosAlgModificados[(j)-1]) {
    pasoSiguiente = 4;
  } else {
    pasoSiguiente = 2; // continuar con el siguiente j
  }
}

function funcExeAlg4_b() {
  counter4_b[counter4_b.length - 1]++;
  addCounterArrayInstruction(4, counter4_b);

  // lógica final de la comparación/intercambio
  Exchange((j-1)-1,(j)-1); // se resta 1 para convertir de 1-based a 0-based
  // siguiente paso
  pasoSiguiente = 2;
}

function Exchange(index1, index2) {
  // Intercambia los elementos en las posiciones index1 e index2 en el arreglo visual y lógico
  const temp = numerosAlgModificados[index1];
  numerosAlgModificados[index1] = numerosAlgModificados[index2];
  numerosAlgModificados[index2] = temp;

  // Actualiza la visualización del arreglo
  const arrayContainer1 = document.getElementById(`num${index1}`);
  const arrayContainer2 = document.getElementById(`num${index2}`);
  if (arrayContainer1 && arrayContainer2) {
    const colornew1 = Math.trunc((numerosAlgModificados[index1] + 99) / 40);
    const colornew2 = Math.trunc((numerosAlgModificados[index2] + 99) / 40);
    // Actualizar texto 1
    arrayContainer1.textContent = numerosAlgModificados[index1];
    arrayContainer1.classList.remove(`color${colornew2}`);
    arrayContainer1.classList.add(`color${colornew1}`);

    // Actualizar texto 2
    arrayContainer2.textContent = numerosAlgModificados[index2];
    arrayContainer2.classList.remove(`color${colornew1}`);
    arrayContainer2.classList.add(`color${colornew2}`);
  }
}