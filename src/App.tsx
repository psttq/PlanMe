import React, { useCallback, useState } from "react";
import "./App.css";
import { Flex, IconButton, SimpleGrid, Spacer, VStack } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  Heading,
  Box,
  Text,
  CardBody,
  ChakraProvider,
} from "@chakra-ui/react";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Task } from "./Components/Task/Task";
import { useDrop } from "react-dnd";
import { TaskObject } from "./TaskType";

function App() {
  const [tasks, setTasks] = useState<TaskObject[]>([
    { id: 0, label: "Press kochat" },
    { id: 1, label: "Press kochat silno" },
    { id: 2, label: "Podtyagivanie" },
  ]);

  const [todayTasks, setTodayTasks] = useState<TaskObject[]>([]);

  const addTodayTask = (task: TaskObject) => {
    setTodayTasks((prevTask: TaskObject[]) => {
      let ct = prevTask.find((t: TaskObject) => t.id === task.id);
      if (ct) return prevTask;
      let newTasks = [...prevTask];
      newTasks.push(task);
      return newTasks;
    });
  };

  const removeTodayTask = (task: TaskObject) => {
    setTodayTasks((prevTask: TaskObject[]) => {
      let newTasks = [...prevTask].filter(
        (ct: TaskObject) => ct.id !== task.id,
      );
      console.log(newTasks, task);
      return newTasks;
    });
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "task",
    drop: () => ({
      addTask: (task: TaskObject) => {
        addTodayTask(task);
      },
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isOverBank, canDropBank }, dropBank] = useDrop(() => ({
    accept: "task",
    drop: () => ({
      addTask: (task: TaskObject) => {
        removeTodayTask(task);
      },
    }),
    collect: (monitor) => ({
      isOverBank: monitor.isOver(),
      canDropBank: monitor.canDrop(),
    }),
  }));

  const selectBg = (
    isOver: boolean,
    canDrop: boolean,
    isBank: boolean = false,
  ) => {
    if (isOver) return isBank ? "#503030" : "#305030";
    if (canDrop) return "#303030";
    return "#202020";
  };

  return (
    <ChakraProvider>
      <Box p="20px" className="App">
        <SimpleGrid columns={2} spacing={10} h="100%">
          <Card bg="#202020" color="white">
            <CardHeader bg="#405050">
              <Flex alignItems="center">
                <Heading size="md">What should I do</Heading>
                <Spacer />
                <IconButton
                  variant="outline"
                  colorScheme="teal"
                  aria-label="Send email"
                  size="sm"
                  icon={<AddIcon />}
                />
              </Flex>
            </CardHeader>
            <CardBody
              bg={selectBg(isOverBank, canDropBank, true)}
              ref={dropBank}
              transition="background-color 150ms linear;"
            >
              <Wrap justify="center">
                {tasks.map((task: TaskObject) => (
                  <>
                    <WrapItem key={task.id}>
                      <Task task={task} />
                    </WrapItem>
                  </>
                ))}
              </Wrap>
            </CardBody>
          </Card>
          <Card bg="#202020" color="white">
            <CardHeader bg="#504050">
              <Heading size="md">What should I do today</Heading>
            </CardHeader>
            <CardBody
              bg={selectBg(isOver, canDrop)}
              ref={drop}
              transition="background-color 150ms linear;"
            >
              <VStack>
                {todayTasks.map((task: TaskObject) => (
                  <Box w="100%" key={task.id}>
                    <Task task={task} />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
