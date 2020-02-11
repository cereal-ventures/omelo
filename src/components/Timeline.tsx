import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Heading, Box } from "@chakra-ui/core";
import Event from "./Event";

type Event = {
  id: string;
  date: Date;
  title: string;
  completed: boolean;
  isDisabled: boolean;
};

export type Events = Event[];

type TimelineProps = {
  events: Events;
};

const sortByDate = ({ date: d1 }: Event, { date: d2 }: Event) => {
  return d1 > d2 ? 1 : d1 < d2 ? -1 : 0;
};

export default function Timeline({ events }: TimelineProps) {
  const [height, setHeight] = useState<string | number>("100vh");
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
        top="0px"
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
