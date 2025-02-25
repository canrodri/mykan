const createError = require("http-errors");
const Board = require("../models/board.model");

module.exports.create = (req, res, next) => {
  const { title } = req.body;
  const userId = req.session.userId; 

  if (!title) {
    return next(createError(400, "Title is required"));
  }

  const newBoard = new Board({
    title,
    owner: userId,
    columns: [],
  });

  newBoard
    .save()
    .then((board) => res.status(201).json(board))
    .catch(next);
};
