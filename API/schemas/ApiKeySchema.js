const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema({
  public_key: {
    type: String,
    trim: true,
  },
  private_key: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  routes: {
    type: [{ type: String }],
  },
});

module.exports = mongoose.model("ApiKey", ApiKeySchema, "api_keys");
