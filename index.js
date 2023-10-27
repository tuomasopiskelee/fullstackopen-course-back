const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

app.use(cors());

app.use(express.json());

app.use(express.static("dist"));

morgan.token("req-headers", function (req, res) {
  return JSON.stringify(req.headers);
});
//app.use(morgan(":method :url :status :req-headers"));

function getConnectionString(collection) {
  const password = process.env.DB_PASSWORD;
  let url = `mongodb+srv://fullstack:${password}@cluster0.azl3hya.mongodb.net/${collection}?retryWrites=true&w=majority`;
  console.log(url);
  return url;
}

const notesSchema = new mongoose.Schema({
  content: String,
  boolean: Boolean,
});
const notesDBConnection = mongoose.createConnection(getConnectionString("noteApp"));
const Notes = notesDBConnection.model("Notes", notesSchema);

const phoneSchema = new mongoose.Schema({
  name: String,
  phone: String,
});
const phoneDBDonnection = mongoose.createConnection(getConnectionString("phoneApp"));
const PhoneInfo = phoneDBDonnection.model("PhoneInfo", phoneSchema);

app.get("/", (req, res) => {
  res.send("<h1>Hello World again and again!</h1>");
});

app.get("/api/notes", (req, res) => {
  Notes.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/persons", (req, res) => {
  PhoneInfo.find({}).then((result) => {
    res.json(result);
    mongoose.connection.close();
  });
});

app.get("/api/persons/:id", (req, res) => {
  let foundPhone = phoneInfos.find((item) => item.id === req.params.id);
  if (foundPhone) res.json(foundPhone);
  else return res.status(400).json({ error: "not found" });
});

app.post("/api/phones", (req, res) => {
  const body = req.body;
  const phoneInfo = {
    name: body.name,
    phone: body.phone,
  };
  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "name or phone not found" });
  }
  if (phoneInfos.find((item) => item.phone === body.phone)) {
    return res.status(400).json({ error: "duplicate phone number" });
  }
  phones = phoneInfos.concat(phoneInfo);
  res.json(phoneInfo);
});

app.delete("/api/persons/:id", (req, res) => {
  let foundPhone = phoneInfos.find((item) => item.id === req.params.id);
  if (foundPhone) {
    console.log("found");
    res.json({ message: "deleting item" });
  } else {
    console.log("not found");
    return res.status(400).json({ error: "not found" });
  }
});

app.get("/api/info", (req, res) => {
  let date = new Date();
  res.send(
    "<p>Phonebook has info for " + phoneInfos.length + " people</p>" + date
  );
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  response.json(note);
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
