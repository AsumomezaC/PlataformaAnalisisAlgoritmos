// cuestionario
const findMaxQuestions = [
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 1 para n = 10?",
    respuestas: ["1", "5", "10"],
    respuestaCorrecta: "1"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 2 para n = 8?",
    respuestas: ["8", "7", "9"],
    respuestaCorrecta: "8"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 3 para n = 9?",
    respuestas: ["8", "9", "10"],
    respuestaCorrecta: "8"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta (en el peor de los casos) la instrucción 4 para n = 9?",
    respuestas: ["8", "7", "9"],
    respuestaCorrecta: "8"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 2 para cualquier n?",
    respuestas: ["n", "n-1", "n+1"],
    respuestaCorrecta: "n"
  },
  {
    pregunta: "¿Cuántas veces se ejecutan (en el peor caso) las instrucciones 1, 2, 3 y 4 si n = 12?",
    respuestas: ["1, 12, 11, 11", "10, 11, 10, 10", "1, 11, 10, 10"],
    respuestaCorrecta: "1, 12, 11, 11"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 3 para cualquier n?",
    respuestas: ["n-1", "n", "n+1"],
    respuestaCorrecta: "n-1"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta (en el mejor de los casos) la instrucción 4 para cualquier n?",
    respuestas: ["0", "n-2", "n-1"],
    respuestaCorrecta: "0"
  },
  {
    pregunta: "¿Cuál es la complejidad del algoritmo Encuentra Mayor?",
    respuestas: ["n", "n^2", "lg n"],
    respuestaCorrecta: "n"
  }
];

// fin cuestionario

// Inicio PseudoCodigo
function Consejo(){
  alert(
    "FIND MAX – Consejo clave:\n" +
    "No te dejes engañar: solo hay UN recorrido.\n" +
    "Comparas cada elemento una vez contra el máximo actual.\n" +
    "No hay bucles anidados.\n" +
    "Siempre es O(n), no importa si el arreglo está ordenado o no."
  );
}
// Fin PseudoCodigo

// funciones
// ejecutar refrescar automaticamente al iniciar una pagina
document.addEventListener('DOMContentLoaded', (event) => {
  Refrescar();
});

let preguntasSeleccionadas = [];

function Refrescar() {
  preguntasSeleccionadas = [];
  const indicesSeleccionados = new Set();
  findMaxQuestions.forEach(mezclarRespuestas);

  while (preguntasSeleccionadas.length < 5) {
      const indiceAleatorio = Math.floor(Math.random() * findMaxQuestions.length);
      if (!indicesSeleccionados.has(indiceAleatorio)) {
          indicesSeleccionados.add(indiceAleatorio);
          preguntasSeleccionadas.push(findMaxQuestions[indiceAleatorio]);
      }
  }

  const contenedorPreguntas = document.getElementById("Preguntas");
  contenedorPreguntas.innerHTML = ""; // Limpiar el contenido previo

  preguntasSeleccionadas.forEach((preguntaObj, i) => {
      const preguntaDiv = document.createElement("div");
      preguntaDiv.id = `pregunta${i + 1}`;
      
      const preguntaTitulo = document.createElement("h2");
      preguntaTitulo.className = "pregunta";
      preguntaTitulo.id = `posicion${i + 1}`;
      preguntaTitulo.innerText = preguntaObj.pregunta;

      preguntaDiv.appendChild(preguntaTitulo);

      preguntaObj.respuestas.forEach((respuesta, j) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";
          input.name = `pregunta${i + 1}`;
          input.value = respuesta;

          label.appendChild(input);
          label.appendChild(document.createTextNode(respuesta));
          preguntaDiv.appendChild(label);
          preguntaDiv.appendChild(document.createElement("br"));
      });

      contenedorPreguntas.appendChild(preguntaDiv);
  });

  ActualizarCalificacion(null, true);
}

function Comprobar() {
  let correctas = 0;

  preguntasSeleccionadas.forEach((preguntaObj, i) => {
      const radios = document.getElementsByName(`pregunta${i + 1}`);
      let seleccionada = null;

      for (const radio of radios) {
          if (radio.checked) {
              seleccionada = radio.value;
              break;
          }
      }

      radios.forEach((radio) => {
          const label = radio.parentElement;
          if (radio.value === preguntaObj.respuestaCorrecta) {
              label.classList.add("correcta");
          } else if (radio.checked && radio.value !== preguntaObj.respuestaCorrecta) {
              label.classList.add("incorrecta");
          }
      });

      if (seleccionada === preguntaObj.respuestaCorrecta) {
          correctas++;
      }
  });

  const calificacion = correctas * 20;
  ActualizarCalificacion(calificacion);
}

function ReturnBack(){
  window.location.href = "../Find.html";
}

function mezclarRespuestas(preguntaObj) {
  // Combinar respuestas y marcar la correcta
  const respuestas = preguntaObj.respuestas.map(respuesta => ({
      texto: respuesta,
      esCorrecta: respuesta === preguntaObj.respuestaCorrecta
  }));

  // Mezclar las respuestas
  for (let i = respuestas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
  }

  // Actualizar el objeto de la pregunta con las respuestas mezcladas
  preguntaObj.respuestas = respuestas.map(respuesta => respuesta.texto);
  preguntaObj.respuestaCorrecta = respuestas.find(respuesta => respuesta.esCorrecta).texto;
}
// fin funciones