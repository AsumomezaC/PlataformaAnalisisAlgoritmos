// find_max.js
// Contadores específicos
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let counter4 = 0;

function ViewInfo() {
  alert("Descripción:\nEl algoritmo Find Max ...");
}

function IrExamen() {
  limpiarVariablesGlobales();
  window.location.href = "../algoritmos/examenes/Find.html";
}

// Estados de la máquina
funcsExeAlg = [
  funcExeAlg1,
  funcExeAlg2,
  funcExeAlg3,
  funcExeAlg4
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
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  counter4 = 0;
  RemoveAllCounterInstructions();
}

RemoveAllCounterInstructions = function() {
  for (let ii = 1; ii <= 4; ii++) {
    const contador = document.getElementById(`counter${ii}`);
    if (contador) contador.textContent = '—';
  }
}

// Funciones ejecución del algoritmo (Find Max)
function funcExeAlg1() {
  counter1++;
  addCounterInstruction(1, counter1);

  if (numerosAlgModificados.length === 0) {
    alert("Línea 1 - Excepción: La posición que se quiere alcanzar es inaxesible.");
    pasoSiguiente = 0;
    return;
  }

  // Inicializar mayor con el primer elemento (pos 0)
  UpdateMayorValue(numerosAlgModificados[0], 0);
  pasoSiguiente = 2;
}

function funcExeAlg2() {
  counter2++;
  addCounterInstruction(2, counter2);

  if (i === -1) {
    i = 2; // según tu lógica anterior
  } else {
    i++;
  }
  UpdateIValue(i);

  if (i > numerosAlgModificados.length) {
    pasoSiguiente = 0;
  } else {
    pasoSiguiente = 3;
  }
}

function funcExeAlg3() {
  counter3++;
  addCounterInstruction(3, counter3);

  // comparar el elemento en la posición i-1 con mayor (que está en 'mayor')
  if (numerosAlgModificados[i - 1] > mayor) {
    pasoSiguiente = 4;
  } else {
    pasoSiguiente = 2;
  }
}

function funcExeAlg4() {
  counter4++;
  addCounterInstruction(4, counter4);

  UpdateMayorValue(numerosAlgModificados[i - 1], i - 1);
  pasoSiguiente = 2;
}