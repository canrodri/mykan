const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const createError = require("http-errors");
const users = require("../controllers/users.controller");
const tasks = require("../controllers/tasks.controller");
const boards = require("../controllers/board.controller");
const sessions = require("../controllers/sessions.controller");
const auth = require("../middlewares/session.middleware")



// tasks
router.get('/tasks',auth.isAuthenticated, tasks.listTasks); 
router.post('/tasks', auth.isAuthenticated, tasks.createTask); 
router.put('/tasks/:id', auth.isAuthenticated, tasks.updateTask);
router.put("/tasks/:id/move", auth.isAuthenticated, tasks.moveTask); 
router.put('/tasks/:id/complete', auth.isAuthenticated, tasks.completeTask ); 
router.delete('/tasks/:id',auth.isAuthenticated, tasks.deleteTask);
router.get("/tasks/stats", auth.isAuthenticated, tasks.getTaskStats);

// users
router.post("/users", users.create);
router.patch("/users/me", auth.isAuthenticated, users.update);
router.get("/users/me", auth.isAuthenticated, users.profile);
router.get("/users/:id/validate",auth.isAuthenticated, auth.isAdmin, users.validate)

//sessions
router.post("/sessions", sessions.create)
router.delete("/sessions", auth.isAuthenticated, sessions.destroy);

//boards
router.post('/columns', auth.isAuthenticated, boards.createColumn); 
router.post('/columns/:columnId/cards', auth.isAuthenticated, boards.createCard); 
router.get('/board', auth.isAuthenticated, boards.getBoard); 
router.put('/columns/:id', auth.isAuthenticated, boards.updateColumn); 
router.delete('/columns/:id', auth.isAuthenticated, boards.deleteColumn); 


// 404
router.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Error handler
router.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.CastError && error.message.includes("_id")) {
    error = createError(404, "Resource not found");
  } else if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error);
  } else if (!error.status) {
    error = createError(500, error.message);
  }
  console.error(error);

  const data = {
    message: error.message,
  };
  if (error.errors) {
    data.errors = Object.keys(error.errors).reduce((errors, errorKey) => {
      errors[errorKey] = error.errors[errorKey]?.message || error.errors[errorKey];
      return errors;
    }, {});
  }
  res.status(error.status).json(data);
});

module.exports = router;
