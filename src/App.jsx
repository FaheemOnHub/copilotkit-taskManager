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
import { Progress } from "@/components/ui/progress";

import { CircleCheckBig, Calendar, Bell, BellRing } from "lucide-react";
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

  return (
    <div className="flex flex-col p-4 ">
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
            <Card className="p-4 shadow-md">
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
            <Card className="p-4 shadow-md flex justify-between items-center">
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
        >
          + Create New
        </Button>
      </div>
    </div>
  );
};

export default App;
