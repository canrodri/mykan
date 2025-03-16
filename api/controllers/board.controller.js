const Board = require('../models/board.model');
const createError = require('http-errors');
const Task = require('../models/task.model')
const mongoose = require('mongoose'); 

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
module.exports.createColumn = async (req, res, next) => {
  const { title } = req.body;

  // Validación del título
  if (!title || !title.trim()) {
    return next(createError(400, 'Column title is required and cannot be empty'));
  }

  try {
    // Buscar el tablero del usuario o crear uno nuevo si no existe
    let board = await Board.findOne({ owner: req.user._id });
    let newColumn;

    if (!board) {
      console.log("No se encontró un tablero, creando uno nuevo...");
      // Si no existe un tablero, crea uno nuevo
      board = new Board({
        owner: req.user._id,
        columns: [{ title, tasks: [], order: 1 }]  // Inicializa una columna con el título
      });
    } else {
      console.log("Tablero encontrado:", board);
      // Verificar si ya existe una columna con el mismo título
      const columnExists = board.columns.some((col) => col.title === title);
      if (columnExists) {
        console.log("Columna con el mismo título ya existe:", title);
        return next(createError(400, 'A column with this title already exists'));
      }

      // Crear la nueva columna
      const newColumn = {
        _id: new mongoose.Types.ObjectId(), // Genera un _id único para la columna
        title,
        tasks: [],
        order: board.columns.length + 1, // Asigna el siguiente orden
      };
      console.log("Nueva columna creada:", newColumn);
      // Agregar la columna al tablero
      board.columns.push(newColumn);
    }

    // Guardar el tablero
    await board.save();

    // Devolver solo la columna creada
    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error al crear la columna:", error);
    if (error.name === 'ValidationError') {
      return next(createError(400, error.message));
    }
    next(createError(500, 'An error occurred while creating the column'));
  }
};

// Crear una nueva tarjeta en una columna específica
module.exports.createCard = async (req, res, next) => {
  const { title, dueDate, priority, columnId } = req.body;

  if (!title || !columnId) {
    return next(createError(400, 'Task title and columnId are required'));
  }

  try {
    // Crear la tarea en la colección Task
    const newTask = new Task({
      title,
      dueDate: dueDate ? new Date(dueDate) : new Date(), 
      board: req.user.board, 
      columnId,
      priority: priority || "low",
      userId: req.user._id, 
    });
    const savedTask = await newTask.save();

    // Agregar el ObjectId de la tarea a la columna correspondiente en el Board
    const updatedBoard = await Board.findOneAndUpdate(
      { owner: req.user._id, 'columns._id': columnId },
      { $push: { 'columns.$.tasks': savedTask._id } }, // Agregar el ObjectId de la tarea
      { new: true }
    );

    if (!updatedBoard) {
      return next(createError(404, 'Board or column not found'));
    }

    res.json(savedTask);
  } catch (error) {
    next(createError(500, error.message));
  }
};
// Actualizar el nombre u orden de una columna
module.exports.updateColumn = async (req, res, next) => {
  const columnId = req.params.id;
  const { title, order } = req.body;

  if (!title && order === undefined) {
    return next(createError(400, 'Must provide either a new title or order'));
  }

  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { owner: req.user._id, 'columns._id': columnId },
      { $set: { 'columns.$.title': title, 'columns.$.order': order } },
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

  // Eliminamos la columna del tablero
  module.exports.deleteColumn = async (req, res, next) => {
    const columnId = req.params.id;
  
    try {
      // Encuentra el tablero y la columna
      const board = await Board.findOne({ owner: req.user._id, 'columns._id': columnId });
  
      if (!board) {
        return next(createError(404, 'Board or column not found'));
      }
  
      // Elimina las tareas asociadas a la columna
      const column = board.columns.find(col => col._id.toString() === columnId);
      if (column && column.tasks.length > 0) {
        await Task.deleteMany({ _id: { $in: column.tasks } });
      }
  
      // Elimina la columna del tablero
      const updatedBoard = await Board.findOneAndUpdate(
        { owner: req.user._id },
        { $pull: { columns: { _id: columnId } } },
        { new: true }
      );
  
      res.json({ columns: updatedBoard.columns });
    } catch (error) {
      next(createError(500, error.message));
    }
  }
