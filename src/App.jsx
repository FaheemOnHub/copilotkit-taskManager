import React, { useEffect } from "react";
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
import { CircleCheckBig, Calendar, Bell } from "lucide-react";

import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotAction } from "@copilotkit/react-core";

const App = () => {
  const [count, setCount] = useState(0);
  const [fetchedData, setfetchedData] = useState([]);
  const [userName, setuserName] = useState("Anon");
  const [onProgress, setonProgress] = useState([]);
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

  // Edit Task Action
  useCopilotAction({
    name: "editTasks",
    description: "Edit an existing task in the todo list",
    parameters: [
      {
        name: "updatedtask",
        type: "object",
        description: "The task to be edited",
        attributes: [
          { name: "name", type: "string", description: "Name of the task" },
          {
            name: "description",
            type: "string",
            description: "Description of the task",
          },
          {
            name: "progress",
            type: "number",
            description: "Progress of the task",
          },
        ],
      },
    ],
    handler: ({ updatedtask }) => {
      setonProgress((prevTasks) =>
        prevTasks.map((task) =>
          task.name === updatedtask.name ? { ...task, ...updatedtask } : task
        )
      );
      console.log("Task updated:", updatedtask);
    },
  });

  // Update Task Action
  useCopilotAction({
    name: "updateTasks",
    description: "Update tasks in the database",
    parameters: [
      {
        name: "tasksToUpdate",
        type: "object[]",
        description: "Tasks that need to be updated in the database",
        attributes: [
          { name: "name", type: "string", description: "Task name" },
          {
            name: "description",
            type: "string",
            description: "Task description",
          },
          { name: "progress", type: "number", description: "Task progress" },
        ],
      },
    ],
    handler: async ({ tasksToUpdate }) => {
      try {
        const response = await fetch(
          "https://copilotkit-taskmanager.onrender.com/api/updateTasks",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks: tasksToUpdate }),
          }
        );
        const result = await response.json();
        console.log("Tasks updated in the DB:", result);
      } catch (error) {
        console.error("Failed to update tasks:", error);
      }
    },
  });

  // Delete Task Action
  useCopilotAction({
    name: "deleteTask",
    description: "Delete a task from the todo list",
    parameters: [
      {
        name: "taskName",
        type: "string",
        description: "Name of the task to delete",
      },
    ],
    handler: ({ taskName }) => {
      setonProgress((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.name !== taskName);
        console.log("Task deleted:", taskName);
        return updatedTasks;
      });
    },
  });

  // Complete Task Action
  useCopilotAction({
    name: "completeTask",
    description: "Mark a task as completed",
    parameters: [
      {
        name: "taskName",
        type: "string",
        description: "Name of the task to mark as completed",
      },
    ],
    handler: ({ taskName }) => {
      setonProgress((prevTasks) => {
        const taskToComplete = prevTasks.find((task) => task.name === taskName);
        if (taskToComplete) {
          setdone((prevDone) => [...prevDone, taskToComplete]);
          return prevTasks.filter((task) => task.name !== taskName);
        }
        return prevTasks;
      });
      console.log("Task completed:", taskName);
    },
  });

  const updateDB = async () => {
    try {
      setCount(2);
      const tasktoUpdate = onProgress.filter(
        (onProgressTask) =>
          !fetchedData.some(
            (fetchedData) =>
              fetchedData.name === onProgressTask.name &&
              fetchedData.progress === onProgressTask.progress
          )
      );
      if (tasktoUpdate.length === 0) {
        console.log("No changes detected, skipping DB update.");
        return;
      }
      console.log("Tasks to update:", tasktoUpdate);
      const response = await fetch(
        "https://copilotkit-taskmanager.onrender.com/api/updateTasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tasks: tasktoUpdate }),
        }
      );

      const result = await response.json();
      console.log("DB updated successfully:", result);
    } catch (error) {}
  };

  const fetchAllTasks = async () => {
    try {
      const tasks = await fetch(
        "https://copilotkit-taskmanager.onrender.com/api/v1/tasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await tasks.json();
      setonProgress((prevTasks) => [...prevTasks, ...data]);
      setfetchedData((prevTasks) => [...prevTasks, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
    setCount(1);
  }, []);

  useEffect(() => {
    if (count !== 0) {
      updateDB();
    }
  }, [onProgress]);

  return (
    <div
      className={`flex flex-col p-4 ${isModalOpen ? "backdrop-blur-sm" : ""}`}
    >
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-serif">{`Hello, ${userName}`}</h1>
        <div className="flex gap-4">
          <Calendar />
          <Bell />
        </div>
      </header>

      <Card className="w-full p-6">
        <CardHeader className="flex flex-col gap-2 ">
          <CardTitle className="text-2xl">On Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {onProgress.map((task, index) => (
            <Card className="p-4 shadow-md" key={index}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
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
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <CopilotPopup />
    </div>
  );
};

export default App;
