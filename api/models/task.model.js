const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  dueDate: {
    type: Date,
    default: Date.now()
  },
board: {
  type: String,

  default: "To Do"
},

  isCompleted: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"

  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
}, { timestamps: true }); //createdAt, updatedAt

module.exports = mongoose.model('Task', taskSchema);