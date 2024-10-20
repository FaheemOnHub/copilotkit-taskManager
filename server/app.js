const {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNodeHttpEndpoint,
} = require("@copilotkit/runtime");
require("dotenv").config();

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const express = require("express");
const app = express();

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
