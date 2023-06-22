const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const env = require("./config/prod_config.js");
console.log(process.env);
const morgan = require("morgan");
require("./connections/postgres");
require("./connections/mongodb")();

const app = express();

app.use("/authentication", require("./routes/authenticationRouter"));
app.use("/api", require("./routes/apiRouter"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${process.env.PORT || 3000}`);
});

http.createServer(app).listen(80);

module.exports = app;
