const crypto = require("crypto");

const api_keys = require("../schemas/ApiKeySchema");
const user = require("../schemas/userSchema");

async function apiGetRequestAuthentication(req, res, next) {
  // console.log(req.query.iat);
  if (req.cookie && req) {
    // oauth authentication
  } else if (
    req.query.iat &&
    req.headers.authorization &&
    req.query.public_key
  ) {
    // key based authentication (HMAC)
    // iat&publickey
    let hmac_user = req.headers.authorization;
    let iat = req.query.iat;

    if (Date.now() - iat > 1000 * 60 * 150) {
      // console.log(Date.now());
      // console.log(Date.now() - iat);
      //  2 min valid
      return false;
    }

    // console.log("api key recieved is " + req.query.public_key);

    let api_key = await api_keys.findOne({ public_key: req.query.public_key });
    console.log(await api_keys.findOne({}));

    // console.log("api key mongo is " + api_key);

    if (!api_key) {
      return res.send("unauthorized API key");
    }

    let hmac_server = crypto
      .createHmac("sha256", api_key.private_key)
      .update(`${iat}&${api_key.public_key}`)
      .digest("hex");

    if (hmac_user != hmac_server) {
      return res.send("unauthorized");
    }

    let user_output = await user.findOne({ _id: api_key.user }).lean();

    // console.log("user_output is " + user_output);

    if (user_output) {
      req.user_id = user_output._id.toString();
      req.limit ? {} : (req.limit = user_output.current_credits);
      return next();
    } else {
      res.send("unauthorized");
    }
  } else {
    res.status(401).send("Unauthenticated");
  }
}

async function api_key_Authentication(req) {}

function jwt_decode(jwt) {
  // only gets the payload, does not verify the jwt
  let payload = jwt.split(".")[1];
  let buff = Buffer.from(payload, "base64");
  let payload_json = JSON.parse(buff.toString("ascii"));
  return payload_json;
}

async function deduct_credits(mongoDB_user_id, amount) {
  let user_found = await user.findOne({ _id: mongoDB_user_id });
  if (!user_found) {
    return false;
  }

  user_found.current_credits -= amount;
  await user_found.save();
  return true;
}

module.exports = { apiGetRequestAuthentication, deduct_credits };
