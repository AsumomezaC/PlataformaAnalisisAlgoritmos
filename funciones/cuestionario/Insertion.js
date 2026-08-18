// cuestionario
const insertionSortQuestions = [
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 1 para n = 10?",
    respuestas: ["10", "9", "11"],
    respuestaCorrecta: "10"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 2 para n = 8?",
    respuestas: ["7", "8", "9"],
    respuestaCorrecta: "7"
  },
  {
    pregunta: "¿Cuántas veces se ejecutan las instrucciones 2, 3 y 7 para n = 9?",
    respuestas: ["8", "9", "10"],
    respuestaCorrecta: "8"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta (en el peor de los casos) la instrucción 4 para n = 5?",
    respuestas: ["2+3+4+5=14", "1+2+3+4=10", "1+1+1+1+1=5"],
    respuestaCorrecta: "2+3+4+5=14"
  },
  {
    pregunta: "¿Cuántas veces se ejecutan las instrucciones 5 y 6 (en el peor de los casos) para cualquier n?",
    respuestas: ["1+2+3+...+(n-1)", "2+3+4+...+n", "2+3+...+(n+1)"],
    respuestaCorrecta: "1+2+3+...+(n-1)"
  },
  {
    pregunta: "¿Cuántas veces se ejecutan las instrucciones 1, 2, 3, 4, 5, 6 y 7 si n = 6?",
    respuestas: ["6, 5, 5, 20, 15, 15, 5", "5, 4, 4, 15, 9, 9, 4", "6, 5, 5, 10, 8, 8, 5"],
    respuestaCorrecta: "6, 5, 5, 20, 15, 15, 5"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 3 para cualquier n?",
    respuestas: ["n-1", "n", "n+1"],
    respuestaCorrecta: "n-1"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta (en el mejor de los casos) la instrucción 5 para cualquier n?",
    respuestas: ["0", "n-2", "n-1"],
    respuestaCorrecta: "0"
  },
  {
    pregunta: "¿Cuál es la complejidad del algoritmo InsertionSort (en el peor de los casos)?",
    respuestas: ["n^2", "n", "lg n"],
    respuestaCorrecta: "n^2"
  }
];

// fin cuestionario

// Inicio PseudoCodigo
function Consejo(){
  alert(
    "INSERTION SORT – Consejo clave:\n" +
    "Distingue bien los casos.\n" +
    "Mejor caso (arreglo ordenado): el while interno casi no corre → O(n).\n" +
    "Peor y promedio: el while se ejecuta muchas veces → O(n^2).\n" +
    "La clave está en cuántos desplazamientos hace el while interno."
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
  insertionSortQuestions.forEach(mezclarRespuestas);

  while (preguntasSeleccionadas.length < 5) {
      const indiceAleatorio = Math.floor(Math.random() * insertionSortQuestions.length);
      if (!indicesSeleccionados.has(indiceAleatorio)) {
          indicesSeleccionados.add(indiceAleatorio);
          preguntasSeleccionadas.push(insertionSortQuestions[indiceAleatorio]);
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
  window.location.href = "../Insertion.html";
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