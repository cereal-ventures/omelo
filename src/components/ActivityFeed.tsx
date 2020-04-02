import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  Link,
  Grid,
  PopoverArrow
} from "@chakra-ui/core";
import { useActivity } from "./hooks/useActivity";
import { removeComment } from "../services/data";
import { activityTypes } from "../constants";

function ContextMenu({
  projectId,
  eventId,
  commentId
}: {
  projectId: string;
  eventId: string;
  commentId: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          position="absolute"
          right="16px"
          top="8px"
          height="auto"
          minWidth="auto"
          variant="unstyled"
        >
          &#8942;
        </Button>
      </PopoverTrigger>
      <PopoverContent zIndex={4} width="200px">
        <PopoverArrow />
        <PopoverHeader>
          <Heading as="h6" size="sm" fontWeight="semibold">
            Comment:
          </Heading>
        </PopoverHeader>

        <PopoverFooter>
          <Link
            as="button"
            color="red.400"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this comment?")
              ) {
                removeComment({ eventId, projectId, commentId });
              }
            }}
          >
            Delete Comment
          </Link>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

function Comment({
  item,
  projectId,
  eventId,
  isViewOnly,
  photoUrl
}: {
  [x: string]: any;
}) {
  return (
    <Flex key={item.id}>
      <Avatar size="xs" name={item.displayName} src={photoUrl} mr={2} mt={1} />
      <Box
        border="1px solid"
        borderColor="gray.100"
        backgroundColor="gray.50"
        p={2}
        pr={4}
        borderRadius={4}
        position="relative"
        width="100%"
      >
        <Flex align="center" mb={2}>
          <Heading as="h6" size="xs" fontSize="12px" mr={1}>
            {item.displayName}
          </Heading>
          <Heading as="h6" size="xs" fontSize="12px" color="#A0A4A8">
            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
          </Heading>
        </Flex>
        {!isViewOnly && (
          <ContextMenu
            projectId={projectId}
            eventId={eventId}
            commentId={item.id}
          />
        )}

        <Text fontSize="12px" fontWeight="semibold">
          {item.comment}
        </Text>
      </Box>
    </Flex>
  );
}

function Update({ displayName, photoUrl, children }: { [x: string]: any }) {
  return (
    <Flex>
      <Avatar size="xs" name={displayName} src={photoUrl} mr={2} mt={1} />
      <Box
        border="1px solid"
        borderColor="gray.50"
        p={2}
        borderRadius={4}
        width="100%"
      >
        {children}
      </Box>
    </Flex>
  );
}

function Callout({ children }: { children: React.ReactText }) {
  return (
    <Box as="span" color="#A5BFC9">
      {children}
    </Box>
  );
}

export default function ActivityFeed({
  isViewOnly,
  eventId,
  projectId
}: {
  isViewOnly: boolean;
  projectId: string;
  eventId: string;
}) {
  const { loading, activity } = useActivity({ projectId, eventId });
  if (loading) {
    return null;
  }
  return (
    <Grid rowGap={4}>
      {activity.map(item => {
        if (item.type === activityTypes.CREATE_EVENT) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as="h6" size="xs" fontSize="12px">
                {item.displayName} <Callout>created</Callout> {item.title}
              </Heading>
            </Update>
          );
        }
        if (item.type === activityTypes.UPDATE_TITLE) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as="h6" size="xs" fontSize="12px">
                {item.displayName} <Callout>edited the title</Callout>
              </Heading>
            </Update>
          );
        }
        if (item.type === activityTypes.COMMENT)
          return (
            <Comment
              key={item.id}
              photoUrl={item.photoURL}
              isViewOnly={isViewOnly}
              item={item}
              eventId={eventId}
              projectId={projectId}
            />
          );
        if (item.type === activityTypes.UPDATE_DATE) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as="h6" size="xs" fontSize="12px">
                {item.displayName} <Callout>updated</Callout> {item.prevDate} to{" "}
                {item.newDate}
              </Heading>
            </Update>
          );
        }

        if (item.type === activityTypes.EVENT_RESET) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as="h6" size="xs" fontSize="12px" whiteSpace="nowrap">
                {item.displayName} <Callout>reopened</Callout> {item.title}
              </Heading>
            </Update>
          );
        }

        if (item.type === activityTypes.EVENT_COMPLETE) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as="h6" size="xs" fontSize="12px" whiteSpace="nowrap">
                {item.displayName} <Callout>completed this event</Callout>
              </Heading>
            </Update>
          );
        }

        return null;
      })}
    </Grid>
  );
}
