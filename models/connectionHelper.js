require("dotenv").config();

class ConnectionString {
  url = null;
  constructor(collection) {
    const password = process.env.DB_PASSWORD;
    this.url = `mongodb+srv://fullstack:${password}@cluster0.azl3hya.mongodb.net/${collection}?retryWrites=true&w=majority`;
  }
  getUrl() {
    return this.url;
  }
}

module.exports = ConnectionString;
