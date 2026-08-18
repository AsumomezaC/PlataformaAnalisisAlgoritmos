// cuestionario
const bubbleSortQuestions = [
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 1 para n = 10?",
    respuestas: ["11", "10", "12"],
    respuestaCorrecta: "11"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 2 para n = 6?",
    respuestas: ["6+5+4+3+2+1", "5+4+3+2+1+0", "7+6+5+4+3+2"],
    respuestaCorrecta: "6+5+4+3+2+1"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 3 para n = 6?",
    respuestas: ["5+4+3+2+1+0", "6+5+4+3+2+1", "7+6+5+4+3+2"],
    respuestaCorrecta: "6+5+4+3+2+1"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta (en el peor de los casos) la instrucción 4 para n = 6?",
    respuestas: ["5+4+3+2+1+0", "6+5+4+3+2+1", "7+6+5+4+3+2"],
    respuestaCorrecta: "6+5+4+3+2+1"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 1 para cualquier n?",
    respuestas: ["n+1", "n-1", "n"],
    respuestaCorrecta: "n+1"
  },
  {
    pregunta: "¿Cuántas veces se ejecutan las instrucciones 1, 2, 3 y 4 si n = 5 (en el peor caso)?",
    respuestas: ["6, 15, 10, 10", "7, 20, 15, 15", "5, 10, 9, 9"],
    respuestaCorrecta: "6, 15, 10, 10"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta la instrucción 3 para cualquier n?",
    respuestas: ["(n-1)+...+1+0", "n+...+2+1", "(n+1)+...+3+2"],
    respuestaCorrecta: "(n-1)+...+1+0"
  },
  {
    pregunta: "¿Cuántas veces se ejecuta (en el mejor de los casos) la instrucción 4 para cualquier n?",
    respuestas: ["0", "n-2", "n-1"],
    respuestaCorrecta: "0"
  },
  {
    pregunta: "¿Cuál es la complejidad del algoritmo BubbleSort (en el peor de los casos)?",
    respuestas: ["n^2", "n", "n^3"],
    respuestaCorrecta: "n^2"
  }
];

// fin cuestionario

// Inicio PseudoCodigo
function Consejo(){
  alert(
    "BUBBLE SORT – Consejo clave:\n" +
    "No cuentes intercambios, cuenta COMPARACIONES.\n" +
    "Piensa en los dos bucles anidados: uno recorre el arreglo y el otro compara pares.\n" +
    "En el peor, mejor y promedio de los casos: O(n^2).\n" +
    "SIEMPRE es O(n^2)."
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
  bubbleSortQuestions.forEach(mezclarRespuestas);

  while (preguntasSeleccionadas.length < 5) {
      const indiceAleatorio = Math.floor(Math.random() * bubbleSortQuestions.length);
      if (!indicesSeleccionados.has(indiceAleatorio)) {
          indicesSeleccionados.add(indiceAleatorio);
          preguntasSeleccionadas.push(bubbleSortQuestions[indiceAleatorio]);
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
  // alert(`Tu calificación final es ${calificacion}`);
}

function ReturnBack(){
  window.location.href = "../Bubble.html";
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