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
              for (const parada of datosLinea.features) {
                let datosParada = abrev ? parada.properties.NOM_ESTACIO.slice(0, 3) : parada.properties.NOM_ESTACIO;
                datosParada = respuestas.informacion
                  .includes("Fecha de inauguración") ? (`inauguración: ${parada.properties.DATA_INAUGURACIO.slice(0, -1)}`) : "";
                datosParada = respuestas.informacion
                  .includes("Coordenadas") ? (`coordenadas: ${parada.geometry.coordinates}`) : "";
                console.log(datosParada);
              }
            });
        }
      });
  } else {
    console.log(mensaje);
    process.exit(0);
  }
});
