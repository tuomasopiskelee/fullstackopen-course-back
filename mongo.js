const mongoose = require("mongoose");

let connectionString = "";


const phoneSchema = new mongoose.Schema({
  name: String,
  phone: String,
});
const PhoneInfo = mongoose.model("PhoneInfo", phoneSchema);
let password = null;

if (process.argv.length < 3) {
  console.log("give password as argument");
} else {
  if (process.argv.length === 3) {
    password = process.argv[2];
    connectionString = `mongodb+srv://fullstack:${password}@cluster0.azl3hya.mongodb.net/phoneApp?retryWrites=true&w=majority`;
    mongoose.set("strictQuery", false);
    mongoose.connect(connectionString);

    const filter = {};
    PhoneInfo.find(filter).then((result) => {
      result.map((item) => {
        console.log("   " + item.name + " : " + item.phone);
      });
      mongoose.connection.close();
      process.exit(1);
    });
  } else if (process.argv.length < 4) {
    console.log("give name as argument");
    process.exit(1);
  } else {
    if (process.argv.length < 5) {
      console.log("give phone number as argument");
    } else {
      const name = process.argv[3];
      const phone = process.argv[4];

      const note = new PhoneInfo({
        name: name,
        phone: phone,
      });

      note.save().then((result) => {
        console.log("phone info saved!");
        mongoose.connection.close();
      });
    }
  }
}
