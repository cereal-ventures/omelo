import React, { useState, useEffect, useCallback } from "react";
import uuid from "uuid";
import { Route, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { logo } from "./icons";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  PopoverContent,
  Grid,
  Icon,
  Heading,
  Box,
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
  FormControl,
  Checkbox
} from "@chakra-ui/core";
import { signOut } from "../services";

const formatDate = date => {
  if (!date) return "";
  const today = new Date().toLocaleDateString("en-US", { dateStyle: "medium" });
  const dateString = date.toLocaleDateString("en-US", { dateStyle: "medium" });

  return dateString === today ? "Today" : dateString;
};

const sortByDate = ({ date: d1 }, { date: d2 }) => {
  return d1 > d2 ? 1 : d1 < d2 ? -1 : 0;
};

function EventDetailPanel({
  id,
  title,
  date,
  isOpen,
  completed,
  updateEvents
}) {
  const history = useHistory();

  const handleChange = () => {
    updateEvents(prev => {
      const item = prev.find(({ id: prevId }) => id === prevId);
      item.completed = !completed;
      return prev;
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
            value={completed}
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

function AddEventPanel({ isOpen, addEvent }) {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  const onClose = () => {
    history.push("/");
  };
  const hasErrors = Boolean(Object.keys(errors).length);
  const onSubmit = ({ title, date, completed = false }) => {
    if (!hasErrors) {
      addEvent(events =>
        events.concat({
          id: uuid(),
          title,
          date: new Date(date),
          completed: completed
        })
      );
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
                ref={register({
                  required: true,
                  message: "Please add a title to your event"
                })}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isInvalid={Boolean(errors.date)}>
              <Input
                variant="flushed"
                name="date"
                type="date"
                ref={register({
                  required: true,
                  message: "Please add a date to your event"
                })}
              />
              <FormErrorMessage>
                {errors.date && errors.date.message}
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

function Event({
  y = 20,
  date,
  title,
  isOverdue,
  handleClick = () => alert("this worked")
}) {
  const fillColor = isOverdue ? "#F14965" : "#D3D5E0";
  const textColor = isOverdue ? "#F14965" : "black";
  return (
    <g className="event-wrapper" onClick={handleClick}>
      <text
        textAnchor="end"
        x="-8"
        y={y + 2}
        alignmentBaseline="middle"
        className="event-date"
        fill={textColor}
      >
        {formatDate(date)}
      </text>
      <circle fill={fillColor} r={7} cx={10} cy={y} />
      <text
        x="28"
        y={y + 2}
        className="event-label"
        alignmentBaseline="middle"
        fill={textColor}
      >
        {title}
      </text>
    </g>
  );
}

function Timeline({ events }) {
  const [height, setHeight] = useState("100vh");
  const history = useHistory();

  const lastCompletedIndex = events
    .map(({ completed }) => completed)
    .lastIndexOf(true);

  const fillHeight =
    lastCompletedIndex >= 0 ? 20 + 100 * lastCompletedIndex : 0;

  const { length } = events;

  const handleResize = useCallback(() => {
    if (length * 100 > window.innerHeight) {
      setHeight(length * 100 + 40);
    }
  }, [length]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <Grid
      cursor="pointer"
      position="relative"
      width="100%"
      justifyItems="center"
    >
      <Box
        p={8}
        textAlign={["center", "left"]}
        position={"absolute"}
        left="0px"
        top='0px'
      >
        <Heading size="sm">Websites Project</Heading>
      </Box>
      <svg overflow="visible" width={20} height={height}>
        <rect
          className="timeline"
          onClick={() => history.push("/add-event")}
          fill="#F5F6FC"
          width="100%"
          rx="10"
          height={height}
        />
        <rect rx="10" y={190} fill="#9CBD3B" width="100%" height={fillHeight} />
        {events
          .sort(sortByDate)
          .map(({ date, title, id, completed, isDisabled }, i) => (
            <Event
              key={id}
              y={200 + 100 * i}
              date={date}
              title={title}
              isOverdue={lastCompletedIndex > i && !completed && !isDisabled}
              handleClick={
                !isDisabled ? () => history.push(`/event/${id}`) : () => {}
              }
            />
          ))}
      </svg>
    </Grid>
  );
}

function AddButton() {
  const history = useHistory();
  return (
    <Box position="absolute" bottom="40px" right="40px">
      <Button
        variantColor="purple"
        backgroundColor="#394AB6"
        width="40px"
        height="40px"
        borderRadius={100}
        onClick={() => history.push("/add-event")}
      >
        <Icon name="add" />
      </Button>
    </Box>
  );
}

function ProjectsPanel({ user }) {
  return (
    <Box
      width="275px"
      padding={8}
      borderRight="1px solid lightgrey"
      height="100vh"
      position='relative'
    >
      <Popover>
        <PopoverTrigger>
          <Button variant="unstyled" display='inline-flex' height='auto'>
            <Box
              as="span"
              display='inline-block'
              fontSize="md"
              overflow="hidden"
              maxWidth='200px'
              textOverflow="ellipsis"
            >
              {user && (user.displayName || user.email)}
            </Box>
            <Icon name="chevron-down" />
          </Button>
        </PopoverTrigger>
        <PopoverContent zIndex={4} width="240px">
          <PopoverArrow />
          <PopoverBody>
            <Button onClick={() => signOut()}>Log out</Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Box position="absolute" bottom={8} left='50%' transform='translateX(-50%)'>
        {logo}
      </Box>
    </Box>
  );
}

export default function Main({ user }) {
  const [events, updateEvents] = useState([
    { id: uuid(), date: new Date(), isDisabled: true }
  ]);

  return (
    <Grid
      justifyItems="center"
      alignItems="center"
      gridTemplateColumns="auto 1fr"
    >
      <ProjectsPanel user={user} />
      <Timeline events={events} />
      <Route path="/add-event">
        {({ match }) => {
          return (
            <AddEventPanel isOpen={Boolean(match)} addEvent={updateEvents} />
          );
        }}
      </Route>
      <Route path="/event/:id">
        {({ match }) => {
          if (!match) return null;
          const event = events.find(({ id }) => id === match.params.id);
          return event ? (
            <EventDetailPanel
              updateEvents={updateEvents}
              isOpen={Boolean(match)}
              {...event}
            />
          ) : null;
        }}
      </Route>
      <AddButton />
    </Grid>
  );
}
