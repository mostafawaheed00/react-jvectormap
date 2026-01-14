const { program } = require("commander");
const fs = require("fs");
const { execSync } = require("child_process");

program.option("-e --entity <entity>", "entity name").parse(process.argv);

const { entity } = program.opts();

const projections = ["mill", "merc", "aea", "lcc"];

const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, function (m, w) {
    return w.toUpperCase();
  });

const jQuery = {
  fn: {
    vectorMap: (action, name, content) => {
      const mapName = toCamelCase(name);
      const chunks = name.split("_");
      const camelCase = toCamelCase(
        chunks.slice(0, chunks.length - 1).join("_"),
      );
      const entityName = camelCase
        .charAt(0)
        .toUpperCase()
        .concat(camelCase.slice(1));
      const folderPath = `../../packages/maps/src/${entityName}`;

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(
        `${folderPath}/${mapName}.json`,
        JSON.stringify({
          name,
          content,
        }),
      );

      // Moved cleanup out of here to ensure it runs even if this callback fails
    },
  },
};

projections.forEach((projection) => {
  const tempFile = "temp.js";
  try {
    // 1. Download
    execSync(
      `wget https://jvectormap.com/js/jquery-jvectormap-${entity}-${projection}.js --no-check-certificate -O ${tempFile}`,
      { stdio: 'ignore' } // Optional: hides wget output from console
    );

    // 2. Read the file content
    const fileContent = fs.readFileSync(tempFile, "utf8");

    // 3. THE REFACTOR: Create a safe function
    // We tell the function: "I will pass you a variable named 'jQuery'"
    const runScript = new Function("jQuery", fileContent);

    // 4. Execute it, injecting your specific mock object
    runScript(jQuery);

    // 5. Cleanup (moved here for better logic flow)
    if (fs.existsSync(tempFile)) {
      fs.rmSync(tempFile);
    }

    console.log(`Successfully processed ${projection}`);

  } catch (err) {
    console.log(`Could not download or process map for ${projection}`);
    // Ensure cleanup happens even on error
    if (fs.existsSync(tempFile)) {
      fs.rmSync(tempFile);
    }
  }
});