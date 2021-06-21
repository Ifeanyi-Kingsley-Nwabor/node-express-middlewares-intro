require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database/client");

app.use(express.json());

app.get("/time", (req, res) => {
  db.query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch((err) => res.sendStatus(500));
});

app.get("/api/fighters", (req, res) => {
  db.query("SELECT * FROM fighters ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch((err) => res.status(500).send(err.message));
});

app.get("/api/fighters/:id", (req, res) => {
  const { id } = req.params;

  const getOneFighter = {
    text: "SELECT * FROM fighters WHERE id=$1",
    values: [id],
  };

  db.query(getOneFighter)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

app.post("/api/fighters", (req, res) => {
  // start by destructuring what you need from the body of the request
  const { first_name, last_name, country_id, style } = req.body;

  // create your query and substituted values
  const createOneFighter = {
    text: "INSERT INTO fighters(first_name, last_name, country_id, style) VALUES($1, $2, $3, $4) RETURNING *",
    values: [first_name, last_name, country_id, style],
  };

  // launch your query
  db.query(createOneFighter)
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

app.put("/api/fighters/:id", (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;
  const { id } = req.params;

  const updateOneFighter = {
    text: "UPDATE fighters SET first_name=$1, last_name=$2, country_id=$3, style=$4 WHERE id=$5 RETURNING *",
    values: [first_name, last_name, country_id, style, id],
  };

  db.query(updateOneFighter)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

app.delete("/api/fighters/:id", (req, res) => {
  const { id } = req.params;

  const deleteOneFighter = {
    text: "DELETE FROM fighters WHERE id=$1 RETURNING *",
    values: [id],
  };

  db.query(deleteOneFighter)
    .then((data) => {
      if (!data.rows.length) {
        return res.status(404).send("No such fighter");
      }
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
});

app.get("/", (req, res) => {
  res.send("Welcome to the Jungle!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
