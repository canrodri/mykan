const Task = require('../models/task.model');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Board = require('../models/board.model');


//crear nueva tarea
module.exports.createTask = async (req, res, next) => {
  console.log("Cuerpo de la solicitud:", req.body);
  const { title, dueDate, priority, columnId } = req.body;

  // Validación de campos requeridos
  if (!title || !columnId) {
    console.log("Faltan campos requeridos:", { title, columnId });
    return next(createError(400, 'Task title and columnId are required'));
  }

  try {
    // Obtener el board asociado a la columna
    const board = await Board.findOne({ 'columns._id': columnId });
    if (!board) {
      console.log("Tablero no encontrado para la columna:", columnId);
      return next(createError(404, 'Board not found for the specified column'));
    }

    // Crear la tarea en la colección Task
    const newTask = new Task({
      title,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      columnId,
      board: board._id,
      priority: priority || "low",
      userId: req.user._id,
    });
    console.log("Usuario autenticado:", req.user);

    const savedTask = await newTask.save();
    console.log("Tarea creada:", savedTask);

    // Agregar el ObjectId de la tarea a la columna correspondiente en el Board
    const updatedBoard = await Board.findOneAndUpdate(
      { 
        owner: req.user._id,         
        'columns._id': columnId      
      },
      { 
        $push: { 'columns.$.tasks': savedTask._id } 
      },
      { new: true }
    );

    if (!updatedBoard) {
      console.log("Tablero o columna no encontrada");
      return next(createError(404, 'Board or column not found'));
    }

    res.json(savedTask);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    next(createError(500, error.message));
  }
};
// Obtener todas las tareas
module.exports.listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });

    // Formatea dueDate a YYYY-MM-DD antes de enviar la respuesta
    const formattedTasks = tasks.map((task) => ({
      ...task._doc,
      dueDate: task.dueDate.toISOString().split("T")[0], // Formatea la fecha
    }));

    res.json(formattedTasks); // Envía las tareas formateadas
  } catch (error) {
    next(createError(500, error.message));
  }
};


module.exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, 
      req.body,
      { new: true }
    );

    if (!task) {
      return next(createError(404, "Task not found"));
    }

    res.json(task);
  } catch (error) {
    next(createError(500, error.message));
  }
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
module.exports.deleteTask = (req, res, next) => {
  Task.findByIdAndDelete(req.params.id)
    .then((deletedTask) => {
      if (!deletedTask) return next(createError(404, "Task not found"));
      res.status(204).send();
    })
    .catch((error) => next(createError(500, error.message)));
};
// mover una tarea de columna
module.exports.moveTask = async (req, res, next) => {
  const taskId = req.params.id; // ID of the task
  const { columnId } = req.body; // New column ID

  // Validate required fields
  if (!taskId) {
    return next(createError(400, "Task ID is required"));
  }
  if (!columnId) {
    return next(createError(400, "Column ID is required"));
  }

  try {
    // Find the task by its ID
    const task = await Task.findById(taskId);

    if (!task) {
      return next(createError(404, "Task not found"));
    }

    // Update the columnId of the task
    task.columnId = columnId;
    await task.save();

    // Return the updated task
    res.status(200).json(task);
  } catch (error) {
    console.error("Error moving task:", error.message);
    next(createError(500, "Internal Server Error"));
  }
};

//Obtener las estadisticas de las tareas
module.exports.getTaskStats = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });

    // Obtener los IDs de las columnas desde la base de datos
    const board = await Board.findOne({ owner: req.user._id });
    if (!board) {
      return next(createError(404, "Board not found"));
    }

    const todoColumnId = board.columns.find((col) => col.title === "To Do")?._id;
    const inProgressColumnId = board.columns.find((col) => col.title === "In Progress")?._id;
    const completedColumnId = board.columns.find((col) => col.title === "Completed")?._id;

    if (!todoColumnId || !inProgressColumnId || !completedColumnId) {
      return next(createError(404, "Columns not found"));
    }

    const todo = tasks.filter((task) => task.columnId.toString() === todoColumnId.toString()).length;
    const inProgress = tasks.filter((task) => task.columnId.toString() === inProgressColumnId.toString()).length;
    const completed = tasks.filter((task) => task.columnId.toString() === completedColumnId.toString()).length;

    res.json({ completed, inProgress, todo });
  } catch (error) {
    next(createError(500, error.message));
  }
};
