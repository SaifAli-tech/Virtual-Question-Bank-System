const fs = require("fs");
const path = require("path");

// Object to store loaded models
const models = {};

// Read all files in the current directory (except index.js)
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    models[model.modelName] = model; // Store model by its name
  });

module.exports = models;
