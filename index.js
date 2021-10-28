require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database/client");
const morgan = require("morgan");
const helmet = require("helmet");
const fighterRouter = require("./routes/fighterRouter");
const path = require("path");

// console.log();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("tiny")); // universal application level middleware ~ no mount path
app.use(helmet());
app.use("/api/fighters", fighterRouter); // with a mount path

app.get("/time", async (req, res) => {
  // Syntax 1: callbacks
  //     db.query("SELECT NOW()", (err, data) => {
  //         if (err) return res.sendStatus(500)
  //         res.send(data.rows[0].now)
  // })

  // Syntax 2: promises with then
  // db
  //     .query("SELECT NOW()")
  //     .then(data => res.send(data.rows[0].now))
  //     .catch(err => res.sendStatus(500))

  // Syntax 3: promises with async/await
  try {
    const { rows } = await db.query("SELECT NOW()");
    res.send(rows[0].now);
  } catch (e) {
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Jungle!");
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("We have logged the error, the admin has been notified");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
