import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  FormErrorMessage,
  Input,
  Button,
  FormControl,
  Heading
} from "@chakra-ui/core";
import { addEvent } from "../services/data";

interface Props {
  isOpen: boolean;
  projectId: string;
}

export default function AddEventPanel({ isOpen, projectId }: Props) {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      date: new Date(Date.now()).toISOString().substr(0, 10),
      title: "New Event"
    }
  });
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
          <DrawerHeader>
            <Heading size="md" color="purple.800">
              Add Event
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <FormControl mb={4} isInvalid={Boolean(errors.title)}>
              <Input
                focusBorderColor="purple.800"
                variant="flushed"
                name="title"
                placeholder="Add Event"
                ref={(ref: any) =>
                  register(ref,{
                    required: "Please set a title for your event"
                  })
                }
              />
              <FormErrorMessage>
                {errors.title && "Please add a title to your event"}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isInvalid={Boolean(errors.date)}>
              <Input
                variant="flushed"
                focusBorderColor="purple.800"
                name="date"
                type="date"
                ref={(ref: any) =>
                  register(ref,{
                    required: "Please set a date for your event"
                  })
                }
              />
              <FormErrorMessage>
                {errors.date && "Please add a date to your event"}
              </FormErrorMessage>
            </FormControl>
          </DrawerBody>
          <DrawerFooter justifyContent="start">
            <Button type="submit" backgroundColor="purple.800" color="white">
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
