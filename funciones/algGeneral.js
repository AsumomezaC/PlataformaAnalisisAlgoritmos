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

  // Teclado: Enter o Espacio cambian n; mantener la tecla repite (repetición del sistema)
  function teclaBotonN(isIncrement) {
    return (evento) => {
      if (evento.key !== 'Enter' && evento.key !== ' ') return;
      evento.preventDefault();
      if (isIncrement) moreN();
      else lessN();
    };
  }
  lessBtn?.addEventListener('keydown', teclaBotonN(false));
  moreBtn?.addEventListener('keydown', teclaBotonN(true));

  // Región invisible que los lectores de pantalla leen en cada paso
  const cuerpo = document.getElementById('cuerpo');
  if (cuerpo && !document.getElementById('anuncioPaso')) {
    const anuncio = document.createElement('p');
    anuncio.id = 'anuncioPaso';
    anuncio.className = 'solo-lector';
    anuncio.setAttribute('aria-live', 'polite');
    cuerpo.appendChild(anuncio);
  }
});

// Lectores de pantalla: describe la línea ejecutada y el valor de las variables.
// Solo en "Paso a paso"; con "Ejecutar" los pasos son demasiado rápidos.
function AnunciarPaso() {
  const anuncio = document.getElementById('anuncioPaso');
  if (!anuncio || seguirEjecutando) return;
  const codigo = document.querySelector(`#codeLine${pasoActual} pre.code`);
  const textoCodigo = codigo ? codigo.textContent.replace(/\s+/g, ' ').trim() : '';
  const variables = [...document.querySelectorAll('.parValor')]
    .map(el => el.textContent.replace(/\s+/g, ' ').trim())
    .join(', ');
  anuncio.textContent = `Línea ${pasoActual}: ${textoCodigo}. ${variables}.`;
}
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
  AnunciarPaso();
  return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function EjecutarUnPaso() {
  // Ritmo con el que el usuario presiona "Paso a paso" (para la animación de fichas)
  const ahora = performance.now();
  intervaloManual = ultimoPasoManual ? ahora - ultimoPasoManual : 0;
  if (intervaloManual > 2000) intervaloManual = 0; // pausa larga: velocidad normal
  ultimoPasoManual = ahora;

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
  intervaloEjecucion = sleepTime;
  while (seguirEjecutando && SiguientePaso()) {
    await sleep(sleepTime);
    if (sleepTime <= 200){
      sleepTime = 200;
    } else{
      sleepTime*= .975;
    }
    intervaloEjecucion = sleepTime;
  }
  seguirEjecutando = false;
}

// Inicio Animación de fichas
// Cuando un valor cambia de lugar, su círculo se desliza como una ficha desde
// la posición de origen. La duración se adapta al ritmo de los pasos:
//  - "Ejecutar": usa el intervalo actual entre pasos (que se va acelerando).
//  - "Paso a paso": usa el tiempo entre clics; si se presiona rápido, la ficha
//    se mueve más rápido, y un clic nuevo termina al instante la animación anterior.
const DURACION_FICHA_MAX = 650;
const DURACION_FICHA_MIN = 90;
let intervaloEjecucion = 0;
let intervaloManual = 0;
let ultimoPasoManual = 0;
let animacionesFichas = [];

function PrefiereMenosMovimiento() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function DuracionFicha() {
  const intervalo = seguirEjecutando ? intervaloEjecucion : intervaloManual;
  if (!intervalo) return DURACION_FICHA_MAX;
  return Math.min(DURACION_FICHA_MAX, Math.max(DURACION_FICHA_MIN, intervalo * 0.6));
}

let fantasmasFichas = []; // copias temporales de fichas que vuelan hacia/desde una variable

function TerminarAnimacionesFichas() {
  animacionesFichas.forEach(anim => anim.finish());
  animacionesFichas = [];
  fantasmasFichas.forEach(f => f.remove());
  fantasmasFichas = [];
}

function RegistrarAnimacionFicha(el, anim) {
  el.classList.add('fichaEnMovimiento');
  el._animFicha = anim;
  animacionesFichas.push(anim);
  anim.addEventListener('finish', () => {
    if (el._animFicha === anim) el.classList.remove('fichaEnMovimiento');
  });
}

// Mueve la ficha "el" desde donde está "origen" hasta su lugar, en arco.
// arco > 0 pasa por arriba, arco < 0 pasa por abajo.
function MoverFicha(el, origen, arco) {
  if (!el || !origen || !el.animate || PrefiereMenosMovimiento()) return;
  const a = origen.getBoundingClientRect();
  const b = el.getBoundingClientRect();
  const dx = a.left - b.left;
  const dy = a.top - b.top;
  const pasos = 12;
  const frames = [];
  for (let k = 0; k <= pasos; k++) {
    const t = k / pasos;
    const avance = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const alto = arco * 4 * t * (1 - t);
    const elevacion = Math.sin(Math.PI * t);
    frames.push({
      offset: t,
      transform: `translate(${(dx * (1 - avance)).toFixed(1)}px, ${(dy * (1 - avance) - alto).toFixed(1)}px) scale(${(1 + 0.14 * elevacion).toFixed(3)})`,
      filter: `drop-shadow(0 ${(7 * elevacion).toFixed(1)}px ${(6 * elevacion).toFixed(1)}px rgba(0, 0, 0, 0.45))`
    });
  }
  RegistrarAnimacionFicha(el, el.animate(frames, { duration: DuracionFicha() }));
}

// Bubble: dos fichas vecinas cambian de lugar, una por arriba y otra por abajo.
function AnimarIntercambio(index1, index2) {
  TerminarAnimacionesFichas();
  const el1 = document.getElementById(`num${index1}`);
  const el2 = document.getElementById(`num${index2}`);
  if (!el1 || !el2) return;
  const arco = el1.offsetHeight * 0.9;
  MoverFicha(el1, el2, arco);
  MoverFicha(el2, el1, -arco);
}

// Insertion: el valor de la izquierda se recorre una posición a la derecha.
function AnimarDesplazamiento(indexDestino, indexOrigen) {
  TerminarAnimacionesFichas();
  const destino = document.getElementById(`num${indexDestino}`);
  const origen = document.getElementById(`num${indexOrigen}`);
  if (!destino || !origen) return;
  MoverFicha(destino, origen, destino.offsetHeight * 0.6);
}

// Copia visual de una ficha, encima de todo, en la posición de "rect".
function CrearFantasma(modelo, rect) {
  const cs = getComputedStyle(modelo);
  const f = document.createElement('div');
  f.className = 'fichaFantasma';
  f.textContent = modelo.textContent;
  Object.assign(f.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    backgroundColor: cs.backgroundColor,
    color: cs.color,
    borderRadius: cs.borderRadius,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    boxShadow: cs.boxShadow
  });
  document.body.appendChild(f);
  fantasmasFichas.push(f);
  return f;
}

// Vuelo en arco de una ficha fantasma entre dos puntos (desplazamientos
// respecto a su posición), cambiando de escala y de opacidad.
function VolarFantasma(f, desde, hasta, arco, opacidades) {
  const pasos = 12;
  const frames = [];
  for (let k = 0; k <= pasos; k++) {
    const t = k / pasos;
    const avance = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const elevacion = Math.sin(Math.PI * t);
    const x = desde.x + (hasta.x - desde.x) * avance;
    const y = desde.y + (hasta.y - desde.y) * avance - arco * 4 * t * (1 - t);
    const escala = (desde.escala + (hasta.escala - desde.escala) * avance) * (1 + 0.12 * elevacion);
    frames.push({
      offset: t,
      transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${escala.toFixed(3)})`,
      opacity: opacidades(t),
      filter: `drop-shadow(0 ${(7 * elevacion).toFixed(1)}px ${(6 * elevacion).toFixed(1)}px rgba(0, 0, 0, 0.45))`
    });
  }
  const anim = f.animate(frames, { duration: DuracionFicha(), fill: 'forwards' });
  animacionesFichas.push(anim);
  anim.addEventListener('finish', () => f.remove());
  return anim;
}

function CentroDe(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

// Carga: una copia de la ficha del arreglo vuela hasta la variable y "entra" en ella.
// El valor del arreglo sigue ahí (todavía no se sobrescribe).
function AnimarCargaVariable(indexArreglo, idVariable) {
  TerminarAnimacionesFichas();
  const ficha = document.getElementById(`num${indexArreglo}`);
  const variable = document.getElementById(idVariable);
  if (!ficha || !variable || !ficha.animate || PrefiereMenosMovimiento()) return;

  const rFicha = ficha.getBoundingClientRect();
  const rVar = variable.getBoundingClientRect();
  const a = CentroDe(rFicha), b = CentroDe(rVar);
  const escalaFinal = Math.max(0.35, Math.min(1, rVar.height / rFicha.height));

  const f = CrearFantasma(ficha, rFicha);
  VolarFantasma(
    f,
    { x: 0, y: 0, escala: 1 },
    { x: b.x - a.x, y: b.y - a.y, escala: escalaFinal },
    rFicha.height * 0.5,
    t => (t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25)
  );

  // La variable "recibe" el valor cuando llega la ficha
  RegistrarAnimacionFicha(variable, variable.animate([
    { offset: 0,    opacity: 0.25, transform: 'scale(0.85)' },
    { offset: 0.75, opacity: 0.25, transform: 'scale(0.85)' },
    { offset: 0.88, opacity: 1,    transform: 'scale(1.3)', textShadow: '0 0 8px rgba(255, 190, 40, 0.95)' },
    { offset: 1,    opacity: 1,    transform: 'none' }
  ], { duration: DuracionFicha() }));
}

// Descarga: la ficha sale de la variable y vuela hasta su lugar en el arreglo.
// La ficha del arreglo aparece justo cuando aterriza la copia.
function AnimarDescargaVariable(indexArreglo, idVariable) {
  TerminarAnimacionesFichas();
  const ficha = document.getElementById(`num${indexArreglo}`);
  const variable = document.getElementById(idVariable);
  if (!ficha || !variable || !ficha.animate || PrefiereMenosMovimiento()) return;

  const rFicha = ficha.getBoundingClientRect();
  const rVar = variable.getBoundingClientRect();
  const a = CentroDe(rFicha), b = CentroDe(rVar);
  const escalaInicial = Math.max(0.35, Math.min(1, rVar.height / rFicha.height));

  const f = CrearFantasma(ficha, rFicha);
  VolarFantasma(
    f,
    { x: b.x - a.x, y: b.y - a.y, escala: escalaInicial },
    { x: 0, y: 0, escala: 1 },
    rFicha.height * 0.5,
    t => (t < 0.15 ? 0.4 + 4 * t : (t < 0.88 ? 1 : 1 - (t - 0.88) / 0.12))
  );

  // La variable "suelta" el valor
  RegistrarAnimacionFicha(variable, variable.animate([
    { offset: 0,    opacity: 1,   transform: 'scale(1.2)', textShadow: '0 0 8px rgba(255, 190, 40, 0.95)' },
    { offset: 0.3,  opacity: 0.4, transform: 'scale(0.85)' },
    { offset: 1,    opacity: 1,   transform: 'none' }
  ], { duration: DuracionFicha() }));

  // El lugar del arreglo se ve vacío hasta que aterriza la ficha
  RegistrarAnimacionFicha(ficha, ficha.animate([
    { offset: 0,    opacity: 0 },
    { offset: 0.86, opacity: 0, transform: 'scale(1)' },
    { offset: 0.93, opacity: 1, transform: 'scale(0.93)' },
    { offset: 1,    opacity: 1, transform: 'none' }
  ], { duration: DuracionFicha() }));
}
// Fin Animación de fichas

function ResetAlgoritmo() {
  TerminarAnimacionesFichas(); // ninguna ficha queda volando al reiniciar
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
// Navegación con teclado: el anillo de foco de la lista y del campo n solo se
// muestra si se llegó con Tab; un clic o un toque lo vuelve a ocultar.
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Tab") document.documentElement.setAttribute("data-teclado", "");
}, true);
document.addEventListener("pointerdown", () => {
  document.documentElement.removeAttribute("data-teclado");
}, true);
