const mongoose = require("mongoose");

function mongooseConnection() {
  // look into capped collections for equities database

  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      console.log(err);
      console.log("connected");
    }
  );

  mongoose.connection.on("error", (err) => {
    //   for error after initial connection
    console.log(err);
  });

  mongoose.connection.on("disconnected", (err) => {
    //   for error after initial connection
    console.log(err);
  });
}

module.exports = mongooseConnection;
