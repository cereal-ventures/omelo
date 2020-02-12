import React from "react";
import { useHistory } from "react-router-dom";
import {
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Checkbox
} from "@chakra-ui/core";
import { formatDate } from "../utils";
import { updateEvent } from "../services/data";

interface Props {
  projectId: string;
  id: string;
  title: string;
  date: Date;
  isOpen: boolean;
  completed: boolean;
}

export default function EventDetailPanel({
  projectId,
  id,
  title,
  date,
  isOpen,
  completed
}: Props) {
  const history = useHistory();

  const handleChange = () => {
    updateEvent({
      projectId,
      eventId: id,
      completed: !completed
    });
  };

  const onClose = () => {
    history.push("/");
  };
  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>
        <DrawerBody>
          <Heading as="h6" size="xs" mb={4}>
            {formatDate(date)}
          </Heading>
          <Checkbox
            value={`${completed}`}
            onChange={handleChange}
            defaultIsChecked={completed}
          >
            Completed
          </Checkbox>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
