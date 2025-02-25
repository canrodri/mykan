const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
 },
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true },
  columns: [
    {
      title: String,
      tasks: [{ type: mongoose.Schema.Types.ObjectId,   ref: "Task" }],
    },
  ],
});

module.exports = mongoose.model("Board", boardSchema);
