
const mongoose = require("mongoose");
 mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
  const authDatabase = mongoose.connection;



const authSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  
  picUrl: {
    type: String,
    default: "https://static.thenounproject.com/png/4851855-200.png",
  },
});

const authModel = mongoose.model("Authentication", authSchema);
module.exports = authModel;