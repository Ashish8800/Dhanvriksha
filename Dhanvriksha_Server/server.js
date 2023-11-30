const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const chalk = require("chalk");
const app = express();
const dotenv = require("dotenv");


// Enable CORS for your API endpoints
app.use((req, res, next) => {
  // Set the CORS headers here
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Add other necessary CORS headers if needed

  // Continue with the request
  next();
});




dotenv.config({ path: "./config.env" });
// parse requests of content-type - application/json
app.use(express.json());
//file acccess
app.use("/uploads", express.static("uploads"));
app.use("/storage", express.static("storage"));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));




const db = require("./app/models");
const Role = db.role;
//database coonection with mongodb
const databaseConnection = () => {
  const MONGO_URI =
    "mongodb+srv://dhanvriksh_db_user:u1rwmhiVcFKIqwQB@cluster0.lmjgnrk.mongodb.net/dhanvriksh_primary_db?retryWrites=true&w=majority";

  db.mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        `${chalk.green("✓")} ${chalk.blue.bgGreen("MongoDB Connected!")}`
      );
      initial();
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit();
    });
};
databaseConnection();
// simple route
app.get("/", (req, res) => {
  res.json({ message: "welcome to Dhanvriksha portal" });
});

// routes
/* Importing the auth.routes file and passing the app object to it. */
require("./app/routes/auth.routes")(app);
/* Importing the Emp.routes file and passing the app object to it. */
require("./app/routes/Emp.routes")(app);
/* Importing the loanRoutes file and passing the app object to it. */
require("./app/routes/loanRoutes")(app);
/* Importing the branch.routes file and passing the app object to it. */
require("./app/routes/branch.routes")(app);
/* Importing the area.routes file and passing the app object to it. */
require("./app/routes/area.routes")(app);
/* Importing the member.routes file and passing the app object to it. */
require("./app/routes/memeber.routes")(app);
/* Importing the fixedDeposit.routes file and passing the app object to it. */
require("./app/routes/fixedDeposit.routes")(app);
/* Importing the rd.routes file and passing the app object to it. */
require("./app/routes/rd.routes")(app);
/* Importing the collection.routes file and passing the app object to it. */
require("./app/routes/collection.routes")(app);
/* Importing the report.routes file and passing the app object to it. */
require("./app/routes/report.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5001;
try {
  app.listen(PORT, () => {
    console.log(
      `${chalk.blue.bgYellow("Server is running on port" + " " + PORT)}`
    );
  });
} catch (e) {
  console.log(e.message);
}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "BM",
      }).save((err) => {
        if (err) {
        }
      });

      new Role({
        name: "ADMIN",
      }).save((err) => {
        if (err) {
        }
      });

      new Role({
        name: "FO",
      }).save((err) => {
        if (err) {
        }
      });
    }
  });
}


