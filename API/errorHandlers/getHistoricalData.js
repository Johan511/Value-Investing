function pg_error_42P01(err, resJSON) {
  // table not found

  resJSON.responsecode = 400;
  resJSON.error
    ? resJSON.error.push("Invalid security code")
    : (resJSON.error = ["Invalid security code"]);
}

function pg_error_22008(err, res) {
  // invalid date format
  res.status(400).send({
    responsecode: 400,
    error: ["Invalid date format"],
  });
}

function validate_SecurityCode(securityCode) {
  // checks if securityCode is valid
  securityCode_validation_regx = /^BSE_5\d{5}$/;
  if (securityCode_validation_regx.test(securityCode)) {
    return true;
  }
  return false;
}

function validate_date(date) {
  // checks if date is valid

  // change to check out of bound dates (14th month, 50th day)
  // validate with date(year, month,day) === date.getYear()- ....
  // month starts from 0
  let dateArray = date.split("-");
  date_time = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  // we get invalid date object if we have wrong chars
  if (
    date_time.getFullYear() == dateArray[0] &&
    date_time.getMonth() + 1 == dateArray[1] &&
    date_time.getDate() == dateArray[2]
  ) {
    return true;
  }
  return false;
}

module.exports = {
  pg_error_42P01,
  validate_SecurityCode,
  validate_date,
  pg_error_22008,
};
