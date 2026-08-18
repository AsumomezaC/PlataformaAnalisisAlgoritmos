let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let counter4 = [];
let counter5 = [];
let counter6 = [];
let counter7 = 0;

function ViewInfo() {
  alert(
    "Descripción:\nEste método toma cada elemento del arreglo para ser ordenado y lo compara con los que se encuentran en posiciones anteriores a la de él dentro del arreglo, si resulta que el elemento con el que se está comparando es mayor que el elemento a ordenar se recorre hacia la siguiente posición superior.\nSi, por el contrario, resulta que el elemento con el que se está comparando es menor que el elemento a ordenar, se detiene el proceso de comparación pues se encontró que el elemento ya está ordenado y se coloca en su posición (que es la siguiente a la del último número con el que se comparó)."
  );
}

function IrExamen() {
  limpiarVariablesGlobales();
  window.location.href = "../algoritmos/examenes/Insertion.html";
}

/*Inicio Funciones creación y manejo de números del Algoritmo*/
funcsExeAlg = [
  // Estados de la máquina
  funcExeAlg1,
  funcExeAlg2,
  funcExeAlg3,
  funcExeAlg4,
  funcExeAlg5,
  funcExeAlg6,
  funcExeAlg7,
];

function EliminarSeleccionadoAnterior() {
  if (pasoActual > 0 && pasoActual <= 7) {
    const el = document.getElementById(`codeLine${pasoActual}`);
    if (el) {
      el.classList.remove("selectedLine");
    }
  } else if (pasoActual !== 0) {
    alert(
      `Error: pasoActual fuera de rango en EliminarSeleccionadoAnterior (${pasoActual})`
    );
    return false;
  }
  return true; // sin errores
}

function AgregarSeleccionadoActual() {
  if (pasoActual > 0 && pasoActual <= 7) {
    const el = document.getElementById(`codeLine${pasoActual}`);
    if (el) {
      el.classList.add("selectedLine");
    }
    return true; // hay más pasos que ejecutar
  } else if (pasoActual === 0) {
    alert("Algoritmo Terminado");
    return false; // no hay más pasos que ejecutar
  } else {
    alert(
      `Error: pasoActual fuera de rango en AgregarSeleccionadoActual (${pasoActual})`
    );
    return false;
  }
}

LimpiarContadoresInstrucciones = function () {
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  counter4 = [];
  counter5 = [];
  counter6 = [];
  counter7 = 0;
  RemoveAllCounterInstructions();
};

RemoveAllCounterInstructions = function() {
  for (let idx = 1; idx <= 7; idx++) {
    const contador = document.getElementById(`counter${idx}`);
    if (contador) {
      contador.textContent = "—";
    }
  }
}

// Inicio Funciones execución del Algoritmo
function funcExeAlg1() {
  // Actualizar contador de instrucciones
  counter1++;
  addCounterInstruction(1, counter1);

  // Lógica del paso
  if (i === -1) {
    i = 2;
  } else {
    i++;
  }
  UpdateIValue(i);
  const jDiv = document.getElementById(`jValue`);
  if (jDiv) jDiv.textContent = '—'; // limpia la UI para j

  if (i > numerosAlgModificados.length) {
    pasoSiguiente = 0; // terminado
    return;
  }
  newCounter_b = true; // indica que se debe de agregar un nuevo contador al arreglo
  pasoSiguiente = 2;
}

function funcExeAlg2() {
  // Actualizar contador de instrucciones
  counter2++;
  addCounterInstruction(2, counter2);

  // Lógica del paso
  v = numerosAlgModificados[i - 1];
  UpdateVValue(v);
  pasoSiguiente = 3;
}

function funcExeAlg3() {
  // Actualizar contador de instrucciones
  counter3++;
  addCounterInstruction(3, counter3);

  // Lógica del paso
  j = i - 1;
  UpdateJValue(j);
  pasoSiguiente = 4;
}

function funcExeAlg4() {
  // Inicializamos contador 4,5 y 6 si es el primer paso del ciclo
  if(newCounter_b) {
    counter4.push(0);
    counter5.push(0);
    counter6.push(0);
    // Agregamos el primer conteo para el contador 5 y 6
    addCounterArrayInstruction(5, counter5);
    addCounterArrayInstruction(6, counter6);
    newCounter_b = false;
  }
  // Actualizar contador de instrucciones
  counter4[counter4.length - 1]++;
  addCounterArrayInstruction(4, counter4);

  // Lógica del paso
  if(j > 0 && numerosAlgModificados[j - 1] > v) {
    pasoSiguiente = 5;
    return;
  }
  pasoSiguiente = 7;
}

function funcExeAlg5() {
  // Actualizar contador de instrucciones
  counter5[counter5.length - 1]++;
  addCounterArrayInstruction(5, counter5);

  // Lógica del paso
  const actualColor = Math.trunc((numerosAlgModificados[j] + 99) / 40);
  numerosAlgModificados[j] = numerosAlgModificados[j - 1];
  UpdateArrayValue(j, numerosAlgModificados[j], actualColor);

  pasoSiguiente = 6;
}

function funcExeAlg6() {
  // Actualizar contador de instrucciones
  counter6[counter6.length - 1]++;
  addCounterArrayInstruction(6, counter6);

  // Lógica del paso
  j--;
  UpdateJValue(j);

  pasoSiguiente = 4;
}

function funcExeAlg7() {
  // Actualizar contador de instrucciones
  counter7++;
  addCounterInstruction(7, counter7);

  // Lógica del paso
  const actualColor = Math.trunc((numerosAlgModificados[j] + 99) / 40);
  numerosAlgModificados[j] = v;
  UpdateArrayValue(j, numerosAlgModificados[j], actualColor);

  pasoSiguiente = 1;
}
// Fin Funciones execución del Algoritmo

function UpdateArrayValue(index, value, lastColor){
  const arrayContainer = document.getElementById(`num${index}`);
  if (arrayContainer) {
    const colornew = Math.trunc((numerosAlgModificados[index] + 99) / 40);
    arrayContainer.textContent = value;
    arrayContainer.classList.remove(`color${lastColor}`);
    arrayContainer.classList.add(`color${colornew}`);
  }
}
/*Fin Funciones creación y manejo de números del Algoritmo*/