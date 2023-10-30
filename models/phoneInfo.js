const mongoose = require("mongoose");
const ConnectionString = require("./connectionHelper");

const phoneSchema = new mongoose.Schema({
  name: String,
  phone: String,
});
let url = new ConnectionString("phoneApp").getUrl();
const phoneDBDonnection = mongoose.createConnection(url);

module.exports = phoneDBDonnection.model("PhoneInfo", phoneSchema);
