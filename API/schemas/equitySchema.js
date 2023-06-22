const mongoose = require("mongosoe");

const equitySchema = new mongoose.Schema({
  SecurityID: {
    type: String,
    required: true,
    trim: true,
  },
  Grp_Index: {
    type: String,
    default: "",
  },
  FaceVal: {
    type: Number,
    // might be string based on precision
  },
  SecurityCode: {
    type: Number,
  },
  ISIN: {
    type: String,
  },
  Industry: {
    type: String,
  },
  Group: {
    type: String,
  },
  PaidUpValue: {
    type: String,
    default: "",
  },
  EPS: {
    type: Number,
  },
  CEPS: {
    type: Number,
  },
  PE: {
    type: Number,
  },
  OPM: {
    type: String,
    default: "-",
  },
  NPM: {
    type: String,
    default: "-",
  },
  PB: {
    type: Number,
  },
  ROE: {
    type: Number,
  },
  Sector: {
    type: String,
  },
  IndustryNew: {
    type: String,
  },
  IGroup: {
    type: String,
  },
  ISubGroup: {
    type: String,
  },
  IShow: {
    type: String,
    // needs to be cast into integer
  },
  SetlType: {
    type: String,
  },
});
// myModelObject.updateMany( { enabled : { $exists : false } }, { enabled : false } )
module.exports = mongoose.model("Equity", equitySchema, "equities");
