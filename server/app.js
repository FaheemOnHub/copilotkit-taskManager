const {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNodeHttpEndpoint,
} = require("@copilotkit/runtime");
require("dotenv").config();
const Task = require("./models/Task");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const connectDB = require("./db/connect");

const morgan = require("morgan");
const tasks = require("./routes/tasks");
const notFound = require("./middleware/not-found");
//middleware...
app.use(express.static("./public"));
app.use(express.json()); //this express.json is middleware as it stands b/w request and response ..//data from the body is added to the req
const copilotKit = new CopilotRuntime();
const serviceAdapter = new GroqAdapter({
  groq,
  model: "llama3-groq-8b-8192-tool-use-preview",
});

app.use("/copilotkit", (req, res, next) => {
  const runtime = new CopilotRuntime();
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: "/copilotkit",
    runtime,
    serviceAdapter,
  });
  return handler(req, res, next);
});
app.post("/api/updateTasks", async (req, res) => {
  const tasksToUpdate = req.body.tasks;

  try {
    // Update each task in the database
    const updates = tasksToUpdate.map((task) => {
      return Task.findOneAndUpdate(
        { name: task.name }, // Find task by unique ID
        { ...task }, // Update with new data
        { new: true, upsert: true } // Create the task if it doesn't exist
      );
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    res.status(200).json({ message: "Tasks updated successfully." });
  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).json({ error: "An error occurred while updating tasks." });
  }
});
app.use("/api/v1/tasks", tasks);
//404--notFound
app.use(notFound);
//crud-operations routes

const port = 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("😍 DB SUCCESSFULLY CONNECTED\n----------------------------");
    app.listen(port, () => {
      console.log(`🤩 App is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
