function input_logger(req, err, res) {
  // store user data in req
  let log_data = [];
  //public ip
  log_data[0] =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1"; //public ip
  //private ip
  log_data[1] = req.ip || "0.0.0.0";
  // user_id
  log_data[2] = req.user_id;
  //req
  log_data[3] = {};
  log_data[3].user_agent = req.headers["user-agent"];
  log_data[3].url = req.url.split("?")[0];
  log_data[3].method = req.method;
  log_data[3].query_parameters = req.query;
  log_data[5] = {};
  // validity
  // false if no validity,
  // true if valid
  if (err) {
    console.log(`input_logging error is ${err}`);
    log_data[4] = false;
    log_data[5].error = err;
  } else {
    log_data[4] = true;
    log_data[5] = res;
  }
  // response

  return log_data;
}

module.exports = { input_logger };
