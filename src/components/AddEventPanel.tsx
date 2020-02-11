import React from "react";
import uuid from "uuid";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  FormErrorMessage,
  Input,
  Button,
  FormControl
} from "@chakra-ui/core";
import { addEvent } from '../services/data';

interface Props {
  isOpen: boolean;
  projectId: string;
}

export default function AddEventPanel({ isOpen, projectId }: Props) {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  const onClose = () => {
    history.push(`/${projectId}`);
  };
  const hasErrors = Boolean(Object.keys(errors).length);
  const onSubmit = ({
    title,
    date,
    completed = false
  }: {
    [x: string]: any;
  }) => {
    if (!hasErrors) {
      addEvent({
        projectId,
        title,
        date,
        completed: completed,
        isDisabled: false
      });
      onClose();
    }
  };

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Event</DrawerHeader>
          <DrawerBody>
            <FormControl mb={4} isInvalid={Boolean(errors.title)}>
              <Input
                variant="flushed"
                name="title"
                placeholder="Add Event"
                ref={register({ required: true })}
              />
              <FormErrorMessage>
                {errors.title && "Please add a title to your event"}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isInvalid={Boolean(errors.date)}>
              <Input
                variant="flushed"
                name="date"
                type="date"
                ref={register({ required: true })}
              />
              <FormErrorMessage>
                {errors.date && "Please add a date to your event"}
              </FormErrorMessage>
            </FormControl>
          </DrawerBody>
          <DrawerFooter justifyContent="start">
            <Button type="submit" color="blue">
              Save
            </Button>
            <Button variant="outline" ml={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
