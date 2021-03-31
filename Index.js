const { program } = require("commander");
const inquirer = require("inquirer");
const fetch = require("node-fetch");
const chalk = require("chalk");
const preguntas = require("./utilidades/Preguntas");

let mensaje;

inquirer.prompt(preguntas).then(respuestas => {
  if (respuestas.transporte === "Bus") {
    console.log(chalk.yellow("No hay información disponible sobre autobuses."));
    process.exit(0);
  }
  if (respuestas.errores === true) {
    mensaje = chalk.red.bold("La línea no existe");
  }
});

program
  .option("-c, --color <color>", "introduce un color en hexadecimal")
  .option("-a, --abrev", "Quieres Abreviar?", false);

program.parse(process.argv);

const options = program.opts();
const { color, abrev } = options;
