const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const validateId = (request, response, next) => {
  const { id } = request.params; //route params

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID" });
  }

  return next();
}

app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = repositories.find(i => i.id === id);

  if (!repo) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repo.title = title ? title : repo.title;
  repo.url = url ? url : repo.url;
  repo.techs = techs ? techs : repo.techs;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(i => i.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(i => i.id === id);

  if (!repo) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repo.likes++;

  return response.json({ likes: repo.likes });
});

module.exports = app;
