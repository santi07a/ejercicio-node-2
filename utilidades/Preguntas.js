const preguntas = [
  {
    type: "list",
    message: "¿Qué tipo de transporte quiere consultar?",
    name: "transporte",
    default: "Metro",
    choices: [
      {
        name: "metro",
        value: "Metro"
      },
      {
        name: "bus",
        value: "Bus"
      }
    ]
  },
  {
    type: "checkbox",
    message: "¿Qué información extra quiere obtener de cada parada?",
    name: "informacion",
    choices: [
      {
        name: "coordenadas",
        value: "Coordenadas"
      },
      {
        name: "fecha-inauguracion",
        value: "Fecha de inauguración"
      }
    ],
    when: respuestas => respuestas.transporte === "Metro"
  },
  {
    type: "confirm",
    message: "¿Quiere que le informemos de los errores?",
    name: "errores"
  },
  {
    type: "input",
    message: " ¿Qué línea quiere consultar?",
    name: "linea"
  }
];

module.exports = preguntas;
