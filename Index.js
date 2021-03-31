const { program } = require("commander");
const inquirer = require("inquirer");
const dotenv = require("dotenv").config();
const fetch = require("node-fetch");
const chalk = require("chalk");
const preguntas = require("./utilidades/preguntas");

let mensaje;
program
  .option("-c, --color <color>", "introduce un color en hexadecimal")
  .option("-a, --abrev", "Quieres Abreviar?", false);

program.parse(process.argv);

const options = program.opts();
const { color, abrev } = options;

inquirer.prompt(preguntas).then(respuestas => {
  if (respuestas.transporte === "Bus") {
    console.log(chalk.yellow("No hay información disponible sobre autobuses."));
    process.exit(0);
  }
  if (respuestas.errores) {
    mensaje = chalk.red.bold("La línea no existe");
  }
  if (respuestas.linea) {
    fetch(process.env.TMB_API_LINEAS)
      .then(resp => resp.json())
      .then(datos => {
        const linea = datos.features.find(linia => linia.properties.NOM_LINIA === respuestas.linea);
        if (linea) {
          let colorMensaje;
          if (color) {
            colorMensaje = color;
          } else {
            colorMensaje = `#${linea.properties.COLOR_LINIA}`;
          }
          console.log(chalk.hex(colorMensaje)(`Línea ${linea.properties.NOM_LINIA}. ${linea.properties.DESC_LINIA}`));
          fetch(`${`${process.env.TMB_API_PARADAS}${linea.properties.ID_LINIA}`}/estacions?${process.env.TMB_API_KEY}`)
            .then(resp => resp.json())
            .then(datosLinea => {
              if (respuestas.informacion.includes("Fecha")) {
                if (abrev) {
                  // Probé agregando chalk para que fuera del mismo color las paradas pero: queda feo y además se ponen una al lado del otra, es mejor dejarlas así
                  console.log(datosLinea.features
                    .map(linea => `${linea.properties.NOM_ESTACIO.slice(0, 3)}. inauguración: ${linea.properties.DATA_INAUGURACIO.slice(0, -1)}`));
                } else {
                  console.log(datosLinea.features
                    .map(linea => `${linea.properties.NOM_ESTACIO}, inauguración: ${linea.properties.DATA_INAUGURACIO.slice(0, -1)}`));
                }
              } else if (respuestas.informacion.includes("Coordenadas")) {
                if (abrev) {
                  console.log(datosLinea.features
                    .map(linea => `${linea.properties.NOM_ESTACIO.slice(0, 3)}. Coordinadas: ${linea.geometry.coordinates} `));
                } else {
                  console.log(datosLinea.features
                    .map(linea => `${linea.properties.NOM_ESTACIO}, Coordinadas: ${linea.geometry.coordinates} `));
                }
              }
            });
        }
      });
  } else {
    console.log(mensaje);
    process.exit(0);
  }
});
