import { Card, CardBody, Center, Text } from "@chakra-ui/react";
import React from "react";
import { useDrag } from "react-dnd";
import { TaskObject } from "../../TaskType";

interface DropResult {
  addTask: (task: TaskObject) => void;
}

interface TaskProps {
  task: TaskObject;
}

export function Task({ task }: TaskProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult;
      if (dropResult) dropResult.addTask(task);
    },
  }));

  return (
    <Card ref={drag} opacity={isDragging ? 0.5 : 1}>
      <CardBody>
        <Center>
          <Text>{task.label}</Text>
        </Center>
      </CardBody>
    </Card>
  );
}
