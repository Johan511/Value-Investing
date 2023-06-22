const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  username_salt: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  given_name: {
    type: String,
    required: true,
  },
  family_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default:
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  profile: {
    type: String,
    default: "",
  },
  password_hash: {
    type: String,
  },
  password_salt: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  api_keys: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApiKey",
      },
    ],
    validate: [
      (val) => {
        return val.length <= 5;
      },
      "{PATH} must be an array of atmost 5 items",
    ],
  },
  current_credits: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema, "users");
