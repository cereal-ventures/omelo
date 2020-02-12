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
  Checkbox,
  PopoverBody,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  Link,
  Flex,
  DrawerFooter,
  Icon
} from "@chakra-ui/core";
import { formatDate } from "../utils";
import { updateEvent, removeEvent } from "../services/data";

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
  id: eventId,
  title,
  date,
  isOpen,
  completed
}: Props) {
  const history = useHistory();

  const handleChange = () => {
    updateEvent({
      projectId,
      eventId,
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
        <DrawerHeader display="flex" justifyContent="space-between">
          <Heading color="purple.800" size="md">
            {title}
          </Heading>
          <Popover>
            <PopoverTrigger>
              <Button
                position="relative"
                height="auto"
                minWidth="auto"
              >
                &#8942;
              </Button>
            </PopoverTrigger>
            <PopoverContent fontSize='md' zIndex={4} width="200px">
              <PopoverArrow top="24px" />
              <PopoverHeader>Event Settings</PopoverHeader>
              <PopoverBody>
                <Link
                  as="button"
                  color="red.400"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this project?"
                      )
                    ) {
                      removeEvent({ projectId, eventId })?.then(() => {
                        history.push(`"/${projectId}`);
                      });
                    }
                  }}
                >
                  Delete Event
                </Link>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </DrawerHeader>

        <DrawerBody>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h6" size="sm" color="purple.800">
              <Icon
                position="relative"
                name="calendar"
                marginRight={2}
                top="-1px"
              />
              {formatDate(date)}
            </Heading>
          </Flex>
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
