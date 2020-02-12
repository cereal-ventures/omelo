import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Grid, Heading, Box, Input } from "@chakra-ui/core";
import Event from "./Event";
import AddButton from "./AddButton";
import { useEvents } from "./useEvents";
import { updateProjectName } from "../services/data";

export type Event = {
  id: string;
  date: Date;
  title: string;
  completed: boolean;
  isDisabled: boolean;
};

export type Events = Event[];

type TimelineProps = {
  projectId: string;
  projectName: string;
};

const sortByDate = ({ date: d1 }: Event, { date: d2 }: Event) => {
  return d1 > d2 ? 1 : d1 < d2 ? -1 : 0;
};

function ProjectName({
  projectName,
  projectId
}: {
  projectName: string;
  projectId: string;
}) {
  const { register, handleSubmit } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  const submit = handleSubmit(({ projectTitle }) => {
    updateProjectName({ projectId, name: projectTitle }).then(() => {
      setIsEditing(false);
    });
  });
  return (
    <Box
      p={8}
      textAlign={["center", "left"]}
      position={"absolute"}
      left="0px"
      top="0px"
    >
      {!isEditing ? (
        <Heading size="sm" onClick={() => setIsEditing(true)}>
          {projectName}
        </Heading>
      ) : (
        <form onBlur={submit} onSubmit={submit}>
          <Input
            ref={register}
            name="projectTitle"
            variant="flushed"
            placeholder={projectName}
          />
        </form>
      )}
    </Box>
  );
}

export default function Timeline({ projectId, projectName }: TimelineProps) {
  const [height, setHeight] = useState<string | number>("100vh");
  const history = useHistory();
  const { events } = useEvents(projectId);

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
      <ProjectName projectId={projectId} projectName={projectName} />
      <svg overflow="visible" width={20} height={height}>
        <rect
          className="timeline"
          onClick={() => history.push(`/${projectId}/add-event`)}
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
                !isDisabled
                  ? () => history.push(`/${projectId}/event/${id}`)
                  : () => {}
              }
            />
          ))}
      </svg>
      <AddButton onClick={() => history.push(`/${projectId}/add-event`)} />
    </Grid>
  );
}