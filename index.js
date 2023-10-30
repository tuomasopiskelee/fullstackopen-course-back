const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");
const PhoneInfo = require("./models/phoneInfo");

app.use(express.static("dist"));
app.use(cors());

app.use(express.json());

app.get("/api/notes", (req, res) => {
  Note.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/persons", (req, res) => {
  PhoneInfo.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  PhoneInfo.findById(req.params.id)
    .then((foundPhone) => {
      if (foundPhone) {
        res.json(foundPhone);
      } else return res.status(400).json({ error: "not found" });
    })
    .catch((error) => next(error));
});

app.post("/api/phones", (req, res) => {
  const body = req.body;
  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "name or phone not found" });
  }

  PhoneInfo.find({ name: body.name }).then((previousPhone) => {
    let phoneInfo = new PhoneInfo({
      name: body.name, // name can not be changed
      phone: body.phone, // phone number comes as parameter
    });

    if (previousPhone) {
      PhoneInfo.updateOne({ name: body.name }, { phone: body.phone }).then(
        (result) => {
          console.log("phone updated");
          res.json(phoneInfo);
        }
      );
    } else {
      phoneInfo.save().then((result) => {
        console.log("phone saved");
        res.json(phoneInfo);
      });
    }
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  PhoneInfo.findByIdAndRemove(req.params.id)
    .then((foundPhone) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/api/info", (req, res) => {
  let date = new Date();
  PhoneInfo.countDocuments({}).then((count) => {
    res.send("<p>Phonebook has info for " + count + " people</p>" + date);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        res.status(400).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  });
  console.log(note);

  Note.find({content: body.content}).then(foundNote => {
    console.log('found: ' + foundNote);
    if(foundNote != ''){
      Note.updateOne({ id: body.id }, { content: body.content }).then(
        () => {
          console.log("note updated");
          response.json(note);
        }
      ); 
    }
    else{

      note.save().then(() => {
        response.json(note);
        console.log("saved note");
      });
    }
  })

});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
