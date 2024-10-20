const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Task must have a name"],
    trim: true,
    maxlength: [20, "Length should not be greater than 20 char"],
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  progress: {
    type: Number,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

//Model
const Model = mongoose.model("Task", TaskSchema);
module.exports = Model;
