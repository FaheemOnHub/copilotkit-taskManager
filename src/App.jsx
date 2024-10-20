import React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CircleCheckBig, Calendar, Bell, BellRing } from "lucide-react";

import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotAction } from "@copilotkit/react-core";
const App = () => {
  const [userName, setuserName] = useState("Faheem");
  const [onProgress, setonProgress] = useState([
    {
      title: "Clean the kitchen",
      description: "Wash dishes and mop the floor",
      progress: 50,
    },
    {
      title: "Wash the car",
      description: "Clean the exterior and vacuum the interior",
      progress: 30,
    },
  ]);
  const [done, setdone] = useState([
    {
      title: "Go to school",
      description: "Finish classes for the day",
      time: "11:25 PM",
    },
    {
      title: "Went shopping",
      description: "Buy groceries and essentials",
      time: "10:30 AM",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSavetask = async () => {
    const data = { title, description };
    try {
    } catch (error) {}
  };
  useCopilotReadable({
    description: "Tasks that are pending on the todo list",
    value: onProgress,
  });
  useCopilotReadable({
    description: "Tasks that are completed on the todo list",
    value: done,
  });
  useCopilotAction({
    name: "addTasks",
    description: "adding tasks in todo list",
    parameters: [
      {
        name: "task",
        type: "object[]",
        description: "the task to add",
        attributes: [
          {
            name: "taskName",
            type: "string",
            description: "name of the task",
          },
          {
            name: "description",
            type: "string",
            description: "description of the task",
          },
          {
            name: "progress",
            type: "number",
            description: "progress of the task so far, initially zero",
          },
        ],
      },
    ],
    handler: ({ task }) => {
      setonProgress(task);
    },
  });
  return (
    <div
      className={`flex flex-col p-4 ${isModalOpen ? "backdrop-blur-sm" : ""}`}
    >
      {/* <h1 className="text-3xl p-2 font-serif">NYO Todo</h1> */}
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-serif">{`Hello, ${userName}`}</h1>
        <div className="flex gap-4">
          <Calendar />
          <Bell />
        </div>
      </header>
      <Card className=" w-full  p-6">
        <CardHeader className="flex flex-col gap-2 ">
          <CardTitle className="text-2xl">On Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {onProgress.map((task, index) => (
            <Card className="p-4 shadow-md" key={index}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={task.progress} className="w-full" />
                <span>{task.progress}%</span>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="w-full p-6 mt-6">
        <CardHeader className="flex flex-col gap-2 ">
          <CardTitle className="text-2xl">Completed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {done.map((task, index) => (
            <Card
              className="p-4 shadow-md flex justify-between items-center"
              key={task + index}
            >
              <CardHeader>
                <CardTitle className="line-through">{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <div className="flex xl:flex-row flex-col items-center gap-2">
                <CircleCheckBig />
                <span>{task.time}</span>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center items-center mt-8 sticky bottom-1  bg-white/30 backdrop-blur-sm p-0 ">
        <Button
          variant="outline"
          className="w-33 h-14 xl:w-52 hover:bg-blue-400 hover:text-white hover:border-blue-600 transition-all duration-700"
          onClick={openModal}
        >
          + Create New
        </Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <Card className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <CardHeader className="text-xl font-semibold mb-4 items-center justify-center">
              New Task ToDo
            </CardHeader>
            <Separator className="my-4" />
            <CardContent>
              <CardHeader className="text-xl font-semibold">
                Title Task
              </CardHeader>
              <Input placeholder="Add Task Name..." />
              <CardHeader className="text-xl font-semibold">
                Category
              </CardHeader>

              <Tabs className=" w-full">
                <TabsList
                  className="flex justify-between 
                "
                >
                  <TabsTrigger value="personal" className="min-w-40">
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="teams" className="min-w-40">
                    Teams
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <CardHeader className="text-xl font-semibold">
                Description
              </CardHeader>
              <Input placeholder="Add Descriptions..." className="min-h-20" />
            </CardContent>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={closeModal}>Create</Button>
            </div>
          </Card>
        </div>
      )}
      <CopilotPopup
        instructions={
          "You are assisting the user as best as you can. Ansewr in the best way possible given the data you have."
        }
        labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
    </div>
  );
};

export default App;
