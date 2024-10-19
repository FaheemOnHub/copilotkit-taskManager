// import OpenAI from "openai";
// import {
//   CopilotRuntime,
//   OpenAIAdapter,
//   copilotRuntimeNodeHttpEndpoint,
// } from "@copilotkit/runtime";
// const OpenAI = require("openai");
// const CopilotRuntime = require("@copilotkit/runtime");
// const OpenAIAdapter = require("@copilotkit/runtime");
// const copilotRuntimeNodeHttpEndpoint = require("@copilotkit/runtime");
const OpenAI = require("openai");
const {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
} = require("@copilotkit/runtime");
require("dotenv").config();
const token = process.env.github_token;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
const express = require("express");
const app = express();

const openai = new OpenAI({ baseURL: endpoint, apiKey: token });
const serviceAdapter = new OpenAIAdapter({ openai });
const connectDB = require("./db/connect");

const morgan = require("morgan");
const tasks = require("./routes/tasks");
const notFound = require("./middleware/not-found");
//middleware...
app.use(express.static("./public"));
app.use(express.json()); //this express.json is middleware as it stands b/w request and response ..//data from the body is added to the req
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
