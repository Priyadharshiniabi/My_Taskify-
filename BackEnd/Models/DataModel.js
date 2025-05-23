
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
   const dataDatabase = mongoose.connection;
   
   
const todoSchema = new mongoose.Schema(
  {
    todoId: { type: String },
    title: { type: String },
    status: { type: Boolean },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },
    noteText: { type: String },
    date: { type: String },
    time: { type: String },
  },
  { _id: false }
);

const currTaskSchema = new mongoose.Schema(
  {
    id: { type: String },
    task: {
      taskName: { type: String },
      priority: { type: String },
      deadline: { type: String },
    },
    done: { type: Boolean },
  },
  { _id: false }
);

const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  todos: {
    type: [todoSchema],
  },
  notes: {
    type: [noteSchema],
  },
  tasks: {
    type: [currTaskSchema],
  },
});

module.exports = dataDatabase.model("UserData", schema);


