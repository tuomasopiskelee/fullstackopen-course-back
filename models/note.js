const mongoose = require("mongoose");
const ConnectionString = require("./connectionHelper");

const notesSchema = new mongoose.Schema({
  content: String,
  boolean: Boolean,
});
let url = new ConnectionString("noteApp").getUrl();
const notesDBConnection = mongoose.createConnection(url);

module.exports = notesDBConnection.model("Note", notesSchema);
