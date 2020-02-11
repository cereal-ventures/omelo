import React, { Dispatch, SetStateAction} from "react";
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
import { Event } from "./Timeline";
import { formatDate } from '../utils'

interface Props {
  id: string;
  title: string;
  date: Date;
  isOpen: boolean;
  completed: boolean;
  updateEvent: (event:Event) => void;
}

export default function EventDetailPanel({
  id,
  title,
  date,
  isOpen,
  completed,
  updateEvent
}: Props) {
  const history = useHistory();

  const handleChange = () => {
    updateEvent({
      id,
      title,
      date,
      completed: !completed,
      isDisabled: false
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
