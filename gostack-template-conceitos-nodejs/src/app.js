const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", (req, res, next) => {
  const { id } = req.params
  if (!isUuid(id)) {
    return res.status(400).json({ error: "invalid ID" })
  }
  return next();

})

const repositories = [];



app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const body = request.body;
  const repository = { id: uuid(), title: body.title, url: body.url, techs: body.techs, likes: 0 }
  repositories.push(repository);

  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const body = request.body;
  const index = repositories.findIndex((repository) => repository.id === id);
  if (index < 0) {
    return response.status(400).json("error: not found")
  }
  repositories[index] = { id, title: body.title, url: body.url, techs: body.techs, likes: 0 }

  return response.status(200).json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex((repository) => repository.id === id);
  if (index < 0) {
    return response.status(400)
  }

  repositories.splice(index, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);
  if (index < 0) {
    return response.status(400)
  }

  repositories[index].likes += 1;

  return response.status(200).json(repositories[index]);

});


module.exports = app;
