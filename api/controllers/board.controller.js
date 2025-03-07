const Board = require('../models/board.model');
const createError = require('http-errors');
const Task = require('../models/task.model')

// Obtener el estado actual del tablero
module.exports.getBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({ owner: req.user.id }) // Obtiene el board del usuario
      .populate("columns.tasks")
      .exec();

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva columna en el tablero
module.exports.createColumn = (req, res, next) => {
  const { name } = req.body;  // Esperamos que 'name' sea enviado desde el frontend.

  if (!name) {
    return next(createError(400, 'Column name is required'));
  }

  // Actualizamos el tablero del usuario agregando una nueva columna
  Board.findOneAndUpdate(
    { owner: req.user._id }, // Usamos el ID del usuario autenticado
    { 
      $push: { 
        columns: { 
          title: name, // Cambié el campo 'name' por 'title' según la estructura del modelo
          order: Date.now()  // Aseguramos que cada columna tenga un 'order' único
        }
      }
    },
    { upsert: true, new: true } // Si no existe un tablero, lo crea. Si existe, lo actualiza.
  )
    .then((updatedBoard) => {
      res.json({ columns: updatedBoard.columns }); // Devolvemos solo las columnas actualizadas
    })
    .catch((error) => next(createError(500, error.message)));
};

// Crear una nueva tarjeta en una columna específica
module.exports.createCard = async (req, res, next) => {
  const { title, dueDate, priority } = req.body;
  const columnName = req.params.columnName;

  if (!title) {
    return next(createError(400, 'Task title is required'));
  }

  try {
    // Crear la tarea en la colección Task
    const newTask = new Task({
      title,
      dueDate: dueDate ? new Date(dueDate) : new Date(), // Usar la fecha proporcionada o la fecha actual
      board: columnName, // Usar el nombre de la columna como el valor de "board"
      priority: priority || "low", // Usar la prioridad proporcionada o "low" por defecto
      userId: req.user._id, // Asignar el ID del usuario autenticado
    });
    const savedTask = await newTask.save();

    // Agregar el ObjectId de la tarea a la columna correspondiente en el Board
    const updatedBoard = await Board.findOneAndUpdate(
      { owner: req.user._id, 'columns.title': columnName },
      { $push: { 'columns.$.tasks': savedTask._id } }, // Agregar el ObjectId de la tarea
      { new: true }
    );

    if (!updatedBoard) {
      return next(createError(404, 'Board or column not found'));
    }

    res.json({ columns: updatedBoard.columns });
  } catch (error) {
    next(createError(500, error.message));
  }
};
// Actualizar el nombre u orden de una columna
module.exports.updateColumn = (req, res, next) => {
  const columnId = req.params.id;
  const { title, order } = req.body;

  if (!title && order === undefined) {
    return next(createError(400, 'Must provide either a new name or order'));
  }

  Board.findOneAndUpdate(
    { owner: req.user._id, 'columns._id': columnId },
    { $set: { 'columns.$.title': title, 'columns.$.order': order } },
    { new: true }
  )
    .then((updatedBoard) => {
      if (!updatedBoard || !updatedBoard.columns.some(col => col._id.toString() === columnId)) {
        return next(createError(404, 'Column not found'));
      }
      res.json({ columns: updatedBoard.columns });
    })
    .catch((error) => next(createError(500, error.message)));
};
// Eliminar una columna del tablero
module.exports.deleteColumn = (req, res, next) => {
  const columnId = req.params.id;

  // Eliminamos la columna del tablero
  Board.findOneAndUpdate(
    { owner: req.user._id },
    { $pull: { columns: { _id: columnId } } },
    { new: true }
  )
    .then((updatedBoard) => {
      if (!updatedBoard) {
        return next(createError(404, 'Board or column not found'));
      }
      res.json({ columns: updatedBoard.columns });
    })
    .catch((error) => next(createError(500, error.message)));
};
