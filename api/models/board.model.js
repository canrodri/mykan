const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
  },
  columns: [
    {
      title: { type: String, required: true },   
      tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
      order: { type: Number, required: true }, 
    }
  ],
});

module.exports = mongoose.model("Board", boardSchema);
