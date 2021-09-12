const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const { json } = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  return response.status(201).send();
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  });

  return response.json(user.todos).status(201);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const id = request.params.id;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.json({ error: "Todo not found!" }).status(400);
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(user.todos).status(200);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const id = request.params.id;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.json({ error: "Todo not found!" }).status(400);
  }

  todo.done = !todo.done;

  return response.json(user.todos).status(200);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
