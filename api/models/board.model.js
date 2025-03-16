const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  columns: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      title: { type: String, required: true },
      tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
      order: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Board", boardSchema);
