const { program } = require("commander");
const inquirer = require("inquirer");
const dotenv = require("dotenv").config();
const fetch = require("node-fetch");
const chalk = require("chalk");
const preguntas = require("./utilidades/Preguntas");

const datos = fetch(process.env.TMB_API_LINEAS)
  .then(resp => resp.json())
  .then(datos => datos);

let mensaje;

inquirer.prompt(preguntas).then(respuestas => {
  if (respuestas.transporte === "Bus") {
    console.log(chalk.yellow("No hay información disponible sobre autobuses."));
    process.exit(0);
  }
  if (respuestas.errores === true) {
    mensaje = chalk.red.bold("La línea no existe");
  }

  if (respuestas.linea === datos.features.properties.NOM_LINIA) {
    if (color) {
      console.log(chalk.hex(color)(`Línea ${respuestas.linea}.`));
    }
  }
});

program
  .option("-c, --color <color>", "introduce un color en hexadecimal")
  .option("-a, --abrev", "Quieres Abreviar?", false);

program.parse(process.argv);

const options = program.opts();
const { color, abrev } = options;
