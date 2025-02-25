const createError = require("http-errors");
const Task = require("../models/task.model");

// Create new task
module.exports.create = (req, res, next) => {

  const task = new Task(req.body);

  if (!req.body.title) {
    return next(createError(400, "Task is required"));
  }

  task
    .save()
    .then((savedTask) => res.status(201).json(savedTask))
    .catch((error) => next(createError(500, error.message)));
};

// Get all tasks
module.exports.list = (req, res, next) => {
    
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((error) => next(createError(500, error.message)));
};

// Update detail of a task
module.exports.update = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedTask) => {
      if (!updatedTask) return next(createError(404, "Task not found"));

      res.json(updatedTask);
    })
    .catch((error) => next(createError(500, error.message)));
};

// Set a task as completed
module.exports.completeTask = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true })
    .then((completedTask) => {
      if (!completedTask) return next(createError(404, "Task not found"));
      
      res.json(completedTask);
    })
    .catch((error) => next(createError(500, error.message)));
};

// Delete a task
module.exports.delete = (req, res, next) => {
  Task.findByIdAndDelete(req.params.id)
    .then((deletedTask) => {
      if (!deletedTask) return next(createError(404, "Task not found"));
      
      res.status(204).send();
    })
    .catch((error) => next(createError(500, error.message)));
};