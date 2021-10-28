const express = require("express");
const db = require("../database/client");
const authorization = require("../middlewares/authorization");
// const logger = require("../middlewares/logger");
const getOneFighter = require("../middlewares/getOneFighter");

const fighterRouter = express.Router();

fighterRouter
  .route("/:id")
  .get(getOneFighter)
  .put([authorization, getOneFighter])
  .delete([authorization, getOneFighter]);

fighterRouter.get("/", (req, res, next) => {
  db.query("SELECT * FROM fighters ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch(next);
});

fighterRouter.get("/:id", (req, res, next) => {
  //  Simulating an error and passing it to the error handling middleware:
  //   const error = new Error("Oh noes, something went wrong!");
  //   return next(error);
  res.json(req.fighter);
});

fighterRouter.post("/", (req, res, next) => {
  // start by destructuring what you need from the body of the request
  const { first_name, last_name, country_id, style } = req.body;

  // create your query and substituted values
  const createOneFighter = {
    text: "INSERT INTO fighters(first_name, last_name, country_id, style) VALUES($1, $2, $3, $4) RETURNING *",
    values: [first_name, last_name, country_id, style],
  };

  // launch your query
  db.query(createOneFighter)
    .then((data) => {
      //   We can simulate an error happening in the then block this way:
      //   throw new Error("Oh noes, something went wrong!");
      res.status(201).json(data.rows);
    })
    // .catch((err) => next(err));
    .catch(next);
});

fighterRouter.put("/:id", (req, res, next) => {
  const { first_name, last_name, country_id, style } = req.body;
  const { id } = req.params;

  const updateOneFighter = {
    text: "UPDATE fighters SET first_name=$1, last_name=$2, country_id=$3, style=$4 WHERE id=$5 RETURNING *",
    values: [first_name, last_name, country_id, style, id],
  };

  db.query(updateOneFighter)
    .then((data) => res.json(data.rows))
    .catch(next);
});

fighterRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  const deleteOneFighter = {
    text: "DELETE FROM fighters WHERE id=$1 RETURNING *",
    values: [id],
  };

  db.query(deleteOneFighter)
    .then((data) => {
      res.json(data.rows);
    })
    .catch(next);
});

module.exports = fighterRouter;
