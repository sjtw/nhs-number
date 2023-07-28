const { program } = require("commander");
const { is_valid, generate, standardise_format } = require("./nhs_number");

program
  .command("validate")
  .description("Validate an NHS number")
  .argument("<number>", "NHS Number")
  // todo: create map for region string -> region class lookup
  // .option('--region', 'Specify region')
  .action((nhsNumber, options) => {
    // const isValid = options.region ? is_valid(nhsNumber, options.region) : is_valid(nhsNumber)
    const isValid = is_valid(nhsNumber);
    console.log(isValid);
  });

program
  .command("generate")
  .description("Generate NHS Number(s)")
  .option("--quantity <number>", "No. of NHS Numbers to generate")
  .option(
    "--valid <boolean>",
    "Wether generated NHS Number should be valid or not"
  )
  .option("--region <string>", "Region to generate NHS Number for")
  .action(({ valid, region, quantity }) => {
    console.log(valid, region, quantity);
    const numbers = generate({valid, for_region: region, quantity});
    console.log(numbers.length);
    numbers.forEach((number) => {
      console.log(number);
    });
  });

program
  .command('standardise')
  .description('Output a given NHS number in a standardised format')
  .argument('<number>', 'NHS Number')
  .action(nhsNumber => {
    const number = standardise_format(nhsNumber)
    console.log(number);
  })

  program.parse();