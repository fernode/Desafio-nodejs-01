const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    response.status(404).json({ error: "User not found" });
  }

  request.user = user;
  return next();
}

function checkExistingTodo(id, user) {
  const newTodo = user.todos.find((todo) => todo.id === id);

  if (!newTodo) {
    return false;
  }

  return newTodo;
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "user already exists" });
  }
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);
  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = checkExistingTodo(id, user);

  if (!todo) {
    return response.status(404).json({ error: "todo doesn't exists" });
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(202).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = checkExistingTodo(id, user);

  if (!todo) {
    return response.status(404).json({ error: "todo doesn't exists" });
  }

  todo.done = true;
  return response.status(202).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = checkExistingTodo(id, user);

  if (!todo) {
    return response.status(404).json({ error: "todo doesn't exists" });
  }

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);
  console.log(todoIndex);
  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;
