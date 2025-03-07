const Task = require('../models/task.model');
const createError = require('http-errors');

// Crear nueva tarea
module.exports.create = (req, res, next) => {
  const { title, dueDate, columnId, priority } = req.body;

  // Validación manual de campos requeridos
  if (!title) {
    return next(createError(400, "Title is required"));
  }
  if (!columnId) {
    return next(createError(400, "Column ID is required"));
  }
  const parsedDueDate = dueDate ? new Date(dueDate) : new Date();

  // Crear la tarea
  const task = new Task({
    title,
    dueDate: parsedDueDate,
    columnId,
    priority: priority || "low",
  });

  // Guardar la tarea en la base de datos
  task
    .save()
    .then((savedTask) => {
      console.log("Tarea creada:", savedTask); 
      res.status(201).json(savedTask);
    })
    .catch((error) => {
      console.error("Error al crear la tarea:", error); 
      next(createError(500, error.message));
    });
};

// Obtener todas las tareas
module.exports.list = (req, res, next) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((error) => next(createError(500, error.message)));
};

module.exports.update = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedTask) => {
      if (!updatedTask) return next(createError(404, "Task not found"));
      res.json(updatedTask);
    })
    .catch((error) => next(createError(500, error.message)));
};

// Marcar una tarea como completada
module.exports.completeTask = (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true })
    .then((completedTask) => {
      if (!completedTask) return next(createError(404, "Task not found"));
      
      res.json(completedTask);
    })
    .catch((error) => next(createError(500, error.message)));
};

// Eliminar una tarea
module.exports.delete = (req, res, next) => {
  Task.findByIdAndDelete(req.params.id)
    .then((deletedTask) => {
      if (!deletedTask) return next(createError(404, "Task not found"));
      res.status(204).send();
    })
    .catch((error) => next(createError(500, error.message)));
};