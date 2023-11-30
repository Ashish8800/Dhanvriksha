const mongoose = require("mongoose");
/* Getting the database name from the .env file. */
const dbname = process.env.DATABASE;
mongoose
  /* Connecting to the database. */
  .connect(dbname, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {})
  .catch((error) => console.log("connection error: ", error));
