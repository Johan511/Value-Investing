const apiRouter = require("express").Router();
const {
  pg_error_42P01,
  validate_SecurityCode,
  validate_date,
} = require("../errorHandlers/getHistoricalData");
const postgresPool = require("../connections/postgres");
const { input_logger } = require("../utilities/input_logging");

const {
  apiGetRequestAuthentication,
  deduct_credits,
} = require("../authentication/apiAuthentication");

apiRouter.get(
  "/historicaldata",
  apiGetRequestAuthentication,
  async (req, res) => {
    // json format : { responsecode : "http response code", data : [] , error: []}
    const { securityCode, fromDate, toDate } = req.query;
    if (req.limit === 0) {
      res.status(403).send("You have reached your limit");
      return;
    }
    const pg_query = `select * from ${securityCode} where date between '${fromDate}' and '${toDate}' order by date desc limit ${
      (parseInt(req.query.limit) == NaN ? false : parseInt(req.query.limit)) ||
      req.limit ||
      "ALL"
    };`;

    let resJSON = {};
    if (!validate_SecurityCode(securityCode)) {
      resJSON.responsecode = 400;
      resJSON.error
        ? resJSON.error.push("Invalid security code")
        : (resJSON.error = ["Invalid security code"]);
    }
    if (!validate_date(fromDate)) {
      resJSON.responsecode = 400;
      resJSON.error
        ? resJSON.error.push("Invalid start date")
        : (resJSON.error = ["Invalid start date"]);
    }
    if (!validate_date(toDate)) {
      resJSON.responsecode = 400;
      resJSON.error
        ? resJSON.error.push("Invalid end date")
        : (resJSON.error = ["Invalid end date"]);
    }

    // console.log(securityCode, fromDate, toDate);
    // make sure date is of form 'YYYY-MM-DD'
    // prevent injection by priciple of minimum permissions or search for keywords like delete, drop, update or have strict regx
    if (resJSON.responsecode) {
      let log = input_logger(req, resJSON.error, { rows_returned: 0 });
      postgresPool.query(
        `EXECUTE LOGGING('${log[0]}', '${log[1]}', '${
          log[2]
        }' ,'${JSON.stringify(log[3])}', ${log[4]}, '${JSON.stringify(
          log[5]
        )}');`
      );
      res.status(resJSON.responsecode).send(resJSON);
      return;
    }

    result = await postgresPool.query(pg_query).catch((err) => {
      // console.log(err);
      err.securityCode = securityCode;
      console.log(err);
      // postgres error codes
      // 42P01 => non existent table (relation not defined)
      // 22008 => invalid date time format
      if (err.code == "42P01") {
        pg_error_42P01(err, resJSON);
      }
      if (err.code == "22008") {
        pg_error_22008(err, resJSON);
      }
      if (!res.headersSent) {
        res.status(400).send(resJSON);
      }
    });
    //   posssible errors => date out of bounds, security code does not exist, check for paging and use cursors if required
    //   console.log(result);
    if (!res.headersSent) {
      resJSON.responsecode = 200;
      resJSON.data = result.rows;
      let log = input_logger(
        req,
        resJSON.error,
        { rows_returned: result.rows.length },
        pg_query
      );
      // console.log(log);
      let log_query =
        "INSERT INTO INPUT_LOGGING(public_ip, private_ip, user_id ,timestamp, req, validity, response) VALUES ($1,$2,$3,now(), $4, $5, $6);";

      postgresPool.query(log_query, log).catch((err) => {
        console.log(err);
      });

      deduct_credits(req.user_id, result.rows.length);
      res.send(resJSON);
    }
  }
);
module.exports = apiRouter;
