// alg_general.js
// Inicio variables globales
let numerosAlg = [];
let numerosAlgModificados = [];
let pasoActual = 0;
let pasoSiguiente = 1;

// índices/contadores (nota: i/j en tu lógica original pueden actuar como 1-based)
let i = -1;      // usado por los algoritmos 
let j = -1;      // j en bubble e insertion
let v = -1;      // para Insertion
let mayor = -1;  // mayor para Find

// posiciones visuales (posiciones en el array; -1 = sin puntero)
let iActualPos = -1;
let jActualPos = -1;
let mayorActualPos = -1;

let seguirEjecutando = false;
// Fin variables globales

// Inicio Funciones generales
function ReturnMenu() {
  limpiarVariablesGlobales();
  window.location.href = "../index.html";
}

function limpiarVariablesGlobales() {
  numerosAlg = [];
  pasoActual = 0;
  pasoSiguiente = 1;
  i = -1;
  j = -1;
  v = -1;
  mayor = -1;
  iActualPos = -1;
  jActualPos = -1;
  mayorActualPos = -1;
  seguirEjecutando = false;
  // limpiar UI a nivel de punteros también
  LimpiarIJMaxPos();
}
// Fin Funciones generales

// Inicio Funciones creación y manejo de números del Algoritmo
function addNumberToHTML(number, index, container) {
  const generalDiv = document.createElement("div");
  generalDiv.classList.add("divGeneralNumber");
  generalDiv.id = `divNumber${index}`;

  const positionDiv = document.createElement("div");
  positionDiv.classList.add("positionDiv");
  positionDiv.id = `position${index}`;
  positionDiv.textContent = index + 1;

  const iNDiv = document.createElement("div");
  iNDiv.classList.add("i_Div");
  iNDiv.id = `i_Div${index}`;

  const numberElement = document.createElement("div");
  numberElement.id = `num${index}`;
  numberElement.classList.add("numeroAlg");
  numberElement.classList.add(`color${Math.trunc((number + 99) / 40)}`);
  numberElement.textContent = number;

  const paginaActual = window.location.pathname.split("/").pop();
  let lastDiv;
  if (paginaActual !== "Find.html") {
    lastDiv = document.createElement("div");
    lastDiv.classList.add("j_Div");
    lastDiv.id = `j_Div${index}`;
  } else {
    lastDiv = document.createElement("div");
    lastDiv.classList.add("max_Div");
    lastDiv.id = `max_Div${index}`;
  }

  generalDiv.appendChild(positionDiv);
  generalDiv.appendChild(iNDiv);
  generalDiv.appendChild(numberElement);
  generalDiv.appendChild(lastDiv);

  container.appendChild(generalDiv);
}

function clearNumbersInHTML() {
  const container = document.getElementById("valoresAlg");
  if (container) container.innerHTML = '';
  ResetAlgoritmo();
  limpiarVariablesGlobales();
}

function forEachRandomInt(n, min = -99, max = 100) {
  const container = document.getElementById("valoresAlg");
  for (let idx = 0; idx < n; idx++) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    addNumberToHTML(value, idx, container); // <-- ahora se llama en ReiniciarValoresVisualesAlg para evitar duplicados
    numerosAlg.push(value);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // (tu código de manejar nValue y botones — lo mantuve igual)
  let pressTimer = null;
  let currentInterval = 300;

  const nValue = document.getElementById("nValue");

  nValue.addEventListener('input', () => {
    let value = nValue.value;
    value = value.replace(/\D+/g, '');
    nValue.value = value;
    if (value === '') {
      value = 0;
    } else {
      value = parseInt(value, 10);
    }
    clearNumbersInHTML();
    forEachRandomInt(value);
  });

  const lessBtn = document.querySelector(".lessNBtn");
  const moreBtn = document.querySelector(".moreNBtn");

  function startAction(isIncrement) {
    if (isIncrement) moreN();
    else lessN();
    executeRepeatedly(isIncrement);
  }

  function executeRepeatedly(isIncrement) {
    if (pressTimer) return;
    const execute = () => {
      if (isIncrement) moreN();
      else lessN();
      currentInterval = Math.max(50, currentInterval - 30);
      pressTimer = setTimeout(execute, currentInterval);
    };
    pressTimer = setTimeout(execute, currentInterval);
  }

  function stopAction() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    currentInterval = 300;
  }

  function lessN() {
    let currentValue = parseInt(nValue.value) || 0;
    if (currentValue > 0) {
      nValue.value = currentValue - 1;
      nValue.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      alert("'n' no puede ser menor a 0");
    }
  }

  function moreN() {
    let currentValue = parseInt(nValue.value) || 0;
    nValue.value = currentValue + 1;
    nValue.dispatchEvent(new Event('input', { bubbles: true }));
  }

  lessBtn?.addEventListener('mousedown', () => startAction(false));
  lessBtn?.addEventListener('mouseup', stopAction);
  lessBtn?.addEventListener('mouseleave', stopAction);
  lessBtn?.addEventListener('touchstart', () => startAction(false));
  lessBtn?.addEventListener('touchend', stopAction);

  moreBtn?.addEventListener('mousedown', () => startAction(true));
  moreBtn?.addEventListener('mouseup', stopAction);
  moreBtn?.addEventListener('mouseleave', stopAction);
  moreBtn?.addEventListener('touchstart', () => startAction(true));
  moreBtn?.addEventListener('touchend', stopAction);
});
// Fin Funciones creación y manejo de números del Algoritmo

// Inicio Funciones algoritmos
let funcsExeAlg = []; // arreglo de funciones de ejecución del algoritmo

function SiguientePaso(){
  if (!EliminarSeleccionadoAnterior()){
    return false;
  }

  pasoActual = pasoSiguiente;
  if (!AgregarSeleccionadoActual()){
    return false;
  }

  funcsExeAlg[pasoActual-1]?.();
  return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function EjecutarUnPaso() {
  if(pasoActual === 0){
    ReiniciarValoresVisualesAlg();
    ResetAlgoritmo();
  }
  seguirEjecutando = false;
  SiguientePaso();
}

async function EjecutarTodo() {
  ReiniciarValoresVisualesAlg();
  ResetAlgoritmo();
  let sleepTime = 2000;
  seguirEjecutando = true;
  while (seguirEjecutando && SiguientePaso()) {
    await sleep(sleepTime);
    if (sleepTime <= 200){
      sleepTime = 200;
    } else{
      sleepTime*= .975;
    }
  }
  seguirEjecutando = false;
}

function ResetAlgoritmo() {
  // ReiniciarValoresVisualesAlg();
  EliminarSeleccionadoAnterior();
  LimpiarContadoresInstrucciones();
  LimpiarIJMaxPos();
  LimpiarIJMaxValues();
  pasoActual = 0;
  pasoSiguiente = 1;
  seguirEjecutando = false;
  numerosAlgModificados = [...numerosAlg];
}

// Contadores de instrucciones (se asigna en cada archivo de algoritmo)
let LimpiarContadoresInstrucciones; // función que se asigna en cada algoritmo para limpiar los contadores específicos de ese algoritmo

let RemoveAllCounterInstructions; // función que se asigna en cada algoritmo para limpiar los contadores específicos de ese algoritmo

function addCounterInstruction(instructionNumber, counterValue) {
  const contador = document.getElementById(`counter${instructionNumber}`);
  if (contador) {
    contador.textContent = counterValue;
  }
}

function addCounterArrayInstruction(instructionNumber, counterArray) {
  if(counterArray.length === 0){
    alert("Error:  tú no deberías ver este mensaje. Arreglo vacío. Contacta al desarrollador.");
    return;
  }
  const contador = document.getElementById(`counter${instructionNumber}`);
  if (contador) {
    let counterValue = '';
    let sum = 0;
    for(let i = 0; i < counterArray.length; i++){
      counterValue += counterArray[i];
      sum += counterArray[i];
      if(i < counterArray.length - 1){
        counterValue += ' + ';
      }
    }
    counterValue = counterValue + " = " + sum;
    contador.textContent = counterValue;
  }
}

function ReiniciarValoresVisualesAlg() {
  const container = document.getElementById("valoresAlg");
  container.innerHTML = '';
  for (let idx = 0; idx < numerosAlg.length; idx++) {
    addNumberToHTML(numerosAlg[idx], idx, container);
  }
}

// Inicio I, J, V and Mayor update functions
function UpdateIValue(I){
  const iDiv = document.getElementById(`iValue`);
  if (iDiv) iDiv.textContent = I;
  UpdateIPresence(I - 1);
}

function UpdateMayorValue(Max, MaxPos){
  const maxDiv = document.getElementById(`mayorValue`);
  if (maxDiv) {
    mayor = Max;
    maxDiv.textContent = Max;
  }
  UpdateMayorPresence(MaxPos);
}

function UpdateJValue(J){
  const jDiv = document.getElementById(`jValue`);
  if (jDiv) {
    j = J;
    jDiv.textContent = J;
  }
  UpdateJPresence(J - 1);
}

function UpdateVValue(I){
  const vDiv = document.getElementById(`vValue`);
  if (vDiv) vDiv.textContent = I;
}

function UpdateIPresence(newIPos){
  // limpiar puntero i anterior (si existe)
  if (iActualPos !== -1) {
    const prevIDiv = document.getElementById(`i_Div${iActualPos}`);
    if (prevIDiv) {
      const child = prevIDiv.querySelector('.iPointer');
      if (child) child.remove();
    }
  }

  iActualPos = newIPos;
  if (newIPos === -1 || newIPos === undefined) return;

  const newIDiv = document.getElementById(`i_Div${newIPos}`);
  if (newIDiv) {
    const iPointer = document.createElement("div");
    iPointer.classList.add("iPointer");
    iPointer.textContent = "i";
    newIDiv.appendChild(iPointer);
  }
}

function UpdateJPresence(newJPos){
  // limpiar puntero j anterior (si existe)
  if (jActualPos !== -1) {
    const prevJDiv = document.getElementById(`j_Div${jActualPos}`);
    if (prevJDiv) {
      const child = prevJDiv.querySelector('.jPointer');
      if (child) child.remove();
    }
  }

  jActualPos = newJPos;
  if (newJPos === -1 || newJPos === undefined) return;

  const newJDiv = document.getElementById(`j_Div${newJPos}`);
  if (newJDiv) {
    const jPointer = document.createElement("div");
    jPointer.classList.add("jPointer");
    jPointer.textContent = "j";
    newJDiv.appendChild(jPointer);
  }
}

function UpdateMayorPresence(newMayorPos){
  // limpiar puntero mayor anterior (si existe)
  if (mayorActualPos !== -1) {
    const prevMaxDiv = document.getElementById(`max_Div${mayorActualPos}`);
    if (prevMaxDiv) {
      const child = prevMaxDiv.querySelector('.maxPointer');
      if (child) child.remove();
    }
  }

  mayorActualPos = newMayorPos;
  if (newMayorPos === -1 || newMayorPos === undefined) return;

  const newMaxDiv = document.getElementById(`max_Div${newMayorPos}`);
  if (newMaxDiv) {
    const maxPointer = document.createElement("div");
    maxPointer.classList.add("maxPointer");
    maxPointer.textContent = "max";
    newMaxDiv.appendChild(maxPointer);
  }
}

function LimpiarIJMaxPos() {
  // eliminación robusta de punteros residuales por clase
  document.querySelectorAll('.iPointer').forEach(el => el.remove());
  document.querySelectorAll('.jPointer').forEach(el => el.remove());
  document.querySelectorAll('.maxPointer').forEach(el => el.remove());
  iActualPos = -1;
  jActualPos = -1;
  mayorActualPos = -1;
}

function LimpiarIJMaxValues() {
  const iDiv = document.getElementById(`iValue`);
  if (iDiv) iDiv.textContent = '—';
  const jDiv = document.getElementById(`jValue`);
  if (jDiv) jDiv.textContent = '—';
  const vDiv = document.getElementById(`vValue`);
  if (vDiv) vDiv.textContent = '—';
  const maxDiv = document.getElementById(`mayorValue`);
  if (maxDiv) maxDiv.textContent = '—';
  i = -1;
  j = -1;
  v = -1;
  mayor = -1;
}
// Fin I,J and Mayor update functions
// Fin Funciones algoritmos